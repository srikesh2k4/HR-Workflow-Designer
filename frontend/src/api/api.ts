import {
  AutomationAction,
  SimulationResponse,
  WorkflowGraphPayload,
} from "../types/workflow";

const API_BASE = "http://localhost:4000/api";

export async function getAutomations(): Promise<AutomationAction[]> {
  const res = await fetch(`${API_BASE}/automations`);
  if (!res.ok) {
    throw new Error(`Automations request failed: ${res.status}`);
  }
  return res.json();
}

export async function simulateWorkflow(
  payload: WorkflowGraphPayload
): Promise<SimulationResponse> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Simulation failed: ${res.status}`);
  }

  return res.json();
}
