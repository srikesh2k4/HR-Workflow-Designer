import React, { useState } from "react";
import { useReactFlow } from "reactflow";
import { simulateWorkflow } from "../api/api";
import { useWorkflowStore } from "../store/useWorkflowStore";
import { SimulationResponse } from "../types/workflow";

const TestSandboxPanel: React.FC = () => {
  const instance = useReactFlow();
  const nodeConfigs = useWorkflowStore((s) => s.nodeConfigs);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const nodes = instance.getNodes();
      const edges = instance.getEdges();

      const payload = {
        nodes: nodes.map((n) => ({
          id: n.id,
          type: (n.type || "task") as any,
          data: nodeConfigs[n.id],
        })),
        edges: edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
        })),
      };

      const res = await simulateWorkflow(payload);
      setResult(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        borderTop: "1px solid #ddd",
        padding: "0.5rem 0.75rem",
        fontSize: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <strong>Workflow Test / Sandbox</strong>
        <button disabled={loading} onClick={handleRun}>
          {loading ? "Simulating..." : "Run Simulation"}
        </button>
      </div>

      {error && (
        <p style={{ color: "red", marginTop: 4 }}>
          Error contacting API: {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 6, maxHeight: 180, overflow: "auto" }}>
          <p style={{ margin: 0 }}>
            Status:{" "}
            <span style={{ color: result.valid ? "green" : "red" }}>
              {result.valid ? "Valid" : "Has issues"}
            </span>
          </p>
          {result.errors.length > 0 && (
            <>
              <h4 style={{ margin: "4px 0" }}>Validation Errors</h4>
              <ul>
                {result.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            </>
          )}

          <h4 style={{ margin: "4px 0" }}>Execution Log</h4>
          <ol>
            {result.log.map((s) => (
              <li key={s.stepIndex}>
                [{s.stepIndex}] {s.message}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default TestSandboxPanel;
