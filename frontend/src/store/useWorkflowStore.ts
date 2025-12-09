import { create } from "zustand";
import {
  WorkflowNodeConfig,
  NodeKind,
  AutomationAction,
} from "../types/workflow";

interface WorkflowState {
  selectedNodeId: string | null;
  nodeConfigs: Record<string, WorkflowNodeConfig>;
  automations: AutomationAction[];
  setSelectedNode: (id: string | null) => void;
  upsertNodeConfig: (config: WorkflowNodeConfig) => void;
  deleteNodeConfig: (id: string) => void;
  setAutomations: (actions: AutomationAction[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
  selectedNodeId: null,
  nodeConfigs: {},
  automations: [],
  setSelectedNode: (id) => set({ selectedNodeId: id }),
  upsertNodeConfig: (config) =>
    set((state) => ({
      nodeConfigs: { ...state.nodeConfigs, [config.id]: config },
    })),
  deleteNodeConfig: (id) =>
    set((state) => {
      const copy = { ...state.nodeConfigs };
      delete copy[id];
      return { nodeConfigs: copy };
    }),
  setAutomations: (actions) => set({ automations: actions }),
}));

export function createDefaultConfig(
  id: string,
  kind: NodeKind
): WorkflowNodeConfig {
  const base = {
    id,
    label: kind.toUpperCase() + " Node",
    type: kind,
  } as any;

  switch (kind) {
    case "start":
      return { ...base, metadata: [] };
    case "task":
      return {
        ...base,
        description: "",
        assignee: "",
        dueDate: "",
        customFields: [],
      };
    case "approval":
      return { ...base, approverRole: "", autoApproveThreshold: null };
    case "automated":
      return { ...base, actionId: undefined, actionParams: {} };
    case "end":
      return { ...base, endMessage: "", summaryEnabled: true };
  }
}
