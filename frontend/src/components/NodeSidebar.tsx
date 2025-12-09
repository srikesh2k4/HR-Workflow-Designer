import React from "react";
import { NodeKind } from "../types/workflow";

const nodeTypes: { label: string; type: NodeKind }[] = [
  { label: "Start", type: "start" },
  { label: "Task", type: "task" },
  { label: "Approval", type: "approval" },
  { label: "Automated", type: "automated" },
  { label: "End", type: "end" },
];

const NodeSidebar: React.FC = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: NodeKind
  ) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside
      style={{
        width: 200,
        borderRight: "1px solid #ddd",
        padding: "0.75rem",
        fontSize: "14px",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Nodes</h3>
      <p style={{ fontSize: 12, color: "#6b7280" }}>
        Drag a node type onto the canvas to add it to the workflow.
      </p>
      {nodeTypes.map((n) => (
        <div
          key={n.type}
          onDragStart={(e) => onDragStart(e, n.type)}
          draggable
          style={{
            padding: "0.4rem 0.5rem",
            borderRadius: 4,
            border: "1px solid #ccc",
            marginBottom: 6,
            cursor: "grab",
            background: "#fafafa",
          }}
        >
          {n.label}
        </div>
      ))}
    </aside>
  );
};

export default NodeSidebar;
