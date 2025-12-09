const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const automations = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient"],
  },
  {
    id: "notify_slack",
    label: "Notify Slack Channel",
    params: ["channel", "message"],
  },
];

app.get("/api/automations", (req, res) => {
  res.json(automations);
});

app.post("/api/simulate", (req, res) => {
  const payload = req.body;
  const nodes = payload.nodes || [];
  const edges = payload.edges || [];

  const errors = [];

  const startNodes = nodes.filter((n) => n.type === "start");
  if (startNodes.length !== 1) {
    errors.push("Workflow must contain exactly one Start node.");
  }

  const endNodes = nodes.filter((n) => n.type === "end");
  if (endNodes.length === 0) {
    errors.push("Workflow must contain at least one End node.");
  }

  const nodeIds = new Set(nodes.map((n) => n.id));
  const incomingByTarget = new Map();
  edges.forEach((e) => {
    if (!incomingByTarget.has(e.target)) incomingByTarget.set(e.target, []);
    incomingByTarget.get(e.target).push(e.source);
  });

  // No incoming edges to Start, no outgoing from End
  edges.forEach((e) => {
    const sourceNode = nodes.find((n) => n.id === e.source);
    const targetNode = nodes.find((n) => n.id === e.target);
    if (targetNode && targetNode.type === "start") {
      errors.push(`Start node "${targetNode.data?.label || targetNode.id}" cannot have incoming connections.`);
    }
    if (sourceNode && sourceNode.type === "end") {
      errors.push(`End node "${sourceNode.data?.label || sourceNode.id}" cannot have outgoing connections.`);
    }
  });

  nodes.forEach((n) => {
    if (n.type !== "start" && !(incomingByTarget.get(n.id) || []).length) {
      const label = n.data?.label || n.id;
      errors.push(`Node "${label}" has no incoming connection.`);
    }
  });

  const hasCycle = edges.length > nodeIds.size;
  if (hasCycle) {
    errors.push("Potential cycle detected (edges > nodes).");
  }

  const log = nodes.map((n, idx) => ({
    stepIndex: idx + 1,
    nodeId: n.id,
    nodeLabel: n.data?.label || n.id,
    message: `Executing ${String(n.type || "").toUpperCase()} step "${n.data?.label || n.id}".`,
  }));

  res.json({
    valid: errors.length === 0,
    errors,
    log,
  });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
