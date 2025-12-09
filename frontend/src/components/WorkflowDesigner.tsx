import React, { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeMouseHandler,
  OnConnect,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import NodeSidebar from "./NodeSidebar";
import NodeDetailsPanel from "./NodeDetailsPanel";
import TestSandboxPanel from "./TestSandboxPanel";
import { NodeKind } from "../types/workflow";
import {
  createDefaultConfig,
  useWorkflowStore,
} from "../store/useWorkflowStore";

const nodeStyles: Record<NodeKind, React.CSSProperties> = {
  start: { border: "1px solid #0d9488", background: "#ecfdf5" },
  task: { border: "1px solid #6366f1", background: "#eef2ff" },
  approval: { border: "1px solid #f97316", background: "#fff7ed" },
  automated: { border: "1px solid #0ea5e9", background: "#f0f9ff" },
  end: { border: "1px solid #ef4444", background: "#fef2f2" },
};

const defaultNodeTypes = {};

const InnerDesigner: React.FC = () => {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);
  const setSelectedNode = useWorkflowStore((s) => s.setSelectedNode);
  const upsertConfig = useWorkflowStore((s) => s.upsertNodeConfig);
  const deleteConfig = useWorkflowStore((s) => s.deleteNodeConfig);
  const nodeConfigs = useWorkflowStore((s) => s.nodeConfigs);

  const onConnect: OnConnect = useCallback(
    (connection: Edge | Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: false }, eds));
    },
    [setEdges]
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      setSelectedNode(node.id);
    },
    [setSelectedNode]
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      deleted.forEach((n) => deleteConfig(n.id));
      if (selectedNodeId && deleted.some((n) => n.id === selectedNodeId)) {
        setSelectedNode(null);
      }
    },
    [deleteConfig, selectedNodeId, setSelectedNode]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData(
        "application/reactflow"
      ) as NodeKind;
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const id = `${type}-${Date.now()}`;
      const newNode: Node = {
        id,
        type,
        position,
        data: { label: type.toUpperCase() + " Node" },
        style: {
          padding: "4px 8px",
          borderRadius: 6,
          fontSize: 11,
          ...nodeStyles[type],
        },
      };

      setNodes((nds) => nds.concat(newNode));
      upsertConfig(createDefaultConfig(id, type));
    },
    [reactFlowInstance, setNodes, upsertConfig]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const handleLabelChange = (id: string, newLabel: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: newLabel } } : n
      )
    );
  };

  const handleExport = () => {
    const payload = {
      nodes,
      edges,
      nodeConfigs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workflow.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport: React.ChangeEventHandler<HTMLInputElement> = async (
    evt
  ) => {
    const file = evt.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (parsed.nodes && parsed.edges && parsed.nodeConfigs) {
        setNodes(parsed.nodes);
        setEdges(parsed.edges);
        // hydrate store
        Object.values(parsed.nodeConfigs as any).forEach(
          (cfg: any) => upsertConfig(cfg)
        );
      } else {
        alert("Invalid workflow file");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to parse workflow JSON");
    } finally {
      evt.target.value = "";
    }
  };

  return (
    <div style={{ flex: 1, display: "flex", height: "100%" }}>
      <NodeSidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: "4px 8px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            fontSize: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => reactFlowInstance?.fitView()}>
              Fit View
            </button>
            <button onClick={handleExport}>Export JSON</button>
            <label
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 4,
                padding: "2px 6px",
                cursor: "pointer",
              }}
            >
              Import JSON
              <input
                type="file"
                accept="application/json"
                onChange={handleImport}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <span style={{ color: "#6b7280" }}>
            Tip: Connect nodes from Start to End before running Simulation.
          </span>
        </div>

        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodesDelete={onNodesDelete}
            fitView
            nodeTypes={defaultNodeTypes}
          >
            <Background gap={16} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>

        <TestSandboxPanel />
      </div>

      <NodeDetailsPanel
        nodeId={selectedNode?.id ?? null}
        onLabelChange={handleLabelChange}
      />
    </div>
  );
};

const WorkflowDesigner: React.FC = () => (
  <ReactFlowProvider>
    <InnerDesigner />
  </ReactFlowProvider>
);

export default WorkflowDesigner;
