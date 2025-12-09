import {
  AutomationAction,
  SimulationResponse,
  WorkflowGraphPayload,
} from "../types/workflow";

export const API_BASE = "https://hr-workflow-designer.onrender.com/api";


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
