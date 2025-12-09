import React, { useEffect } from "react";
import WorkflowDesigner from "./components/WorkflowDesigner";
import { getAutomations } from "./api/api";
import { useWorkflowStore } from "./store/useWorkflowStore";

const App: React.FC = () => {
  const setAutomations = useWorkflowStore((s) => s.setAutomations);

  useEffect(() => {
    getAutomations().then(setAutomations).catch((err) => {
      console.error("Failed to load automations from API", err);
    });
  }, [setAutomations]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <h1 style={{ fontSize: "18px", margin: 0 }}>HR Workflow Designer</h1>
          <span
            style={{
              padding: "2px 6px",
              fontSize: 11,
              borderRadius: 999,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          >
            Prototype
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Backend: <code>http://localhost:4000/api</code>
          </span>
        </div>
      </header>
      <WorkflowDesigner />
    </div>
  );
};

export default App;
