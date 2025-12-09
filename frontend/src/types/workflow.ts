export type NodeKind =
  | "start"
  | "task"
  | "approval"
  | "automated"
  | "end";

export interface BaseNodeConfig {
  id: string;
  label: string;
  type: NodeKind;
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface StartNodeConfig extends BaseNodeConfig {
  type: "start";
  metadata: KeyValue[];
}

export interface TaskNodeConfig extends BaseNodeConfig {
  type: "task";
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields: KeyValue[];
}

export interface ApprovalNodeConfig extends BaseNodeConfig {
  type: "approval";
  approverRole?: string;
  autoApproveThreshold?: number | null;
}

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface AutomatedNodeConfig extends BaseNodeConfig {
  type: "automated";
  actionId?: string;
  actionParams: Record<string, string>;
}

export interface EndNodeConfig extends BaseNodeConfig {
  type: "end";
  endMessage?: string;
  summaryEnabled: boolean;
}

export type WorkflowNodeConfig =
  | StartNodeConfig
  | TaskNodeConfig
  | ApprovalNodeConfig
  | AutomatedNodeConfig
  | EndNodeConfig;

export interface WorkflowGraphPayload {
  nodes: {
    id: string;
    type: NodeKind;
    data: WorkflowNodeConfig;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}

export interface SimulationLogStep {
  stepIndex: number;
  nodeId: string;
  nodeLabel: string;
  message: string;
}

export interface SimulationResponse {
  valid: boolean;
  errors: string[];
  log: SimulationLogStep[];
}
