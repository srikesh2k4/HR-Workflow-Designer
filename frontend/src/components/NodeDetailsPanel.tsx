import React, { ChangeEvent } from "react";
import {
  ApprovalNodeConfig,
  AutomatedNodeConfig,
  EndNodeConfig,
  StartNodeConfig,
  TaskNodeConfig,
  WorkflowNodeConfig,
} from "../types/workflow";
import { useWorkflowStore } from "../store/useWorkflowStore";

const textInputStyle: React.CSSProperties = {
  width: "100%",
  marginBottom: 8,
  padding: "4px 6px",
  fontSize: 13,
};

interface Props {
  nodeId: string | null;
  onLabelChange?: (id: string, newLabel: string) => void;
}

const NodeDetailsPanel: React.FC<Props> = ({ nodeId, onLabelChange }) => {
  const config = useWorkflowStore((s) =>
    nodeId ? s.nodeConfigs[nodeId] : undefined
  );
  const upsert = useWorkflowStore((s) => s.upsertNodeConfig);
  const automations = useWorkflowStore((s) => s.automations);

  if (!nodeId || !config) {
    return (
      <aside
        style={{
          width: 280,
          borderLeft: "1px solid #ddd",
          padding: "0.75rem",
          fontSize: 13,
        }}
      >
        <h3 style={{ marginTop: 0 }}>Node Details</h3>
        <p style={{ color: "#777" }}>Select a node to edit its settings.</p>
      </aside>
    );
  }

  const update = (partial: Partial<WorkflowNodeConfig>) =>
    upsert({ ...config, ...partial } as WorkflowNodeConfig);

  const handleBaseLabelChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    update({ label: newLabel });
    if (onLabelChange) {
      onLabelChange(config.id, newLabel);
    }
  };

  const renderStart = (c: StartNodeConfig) => {
    const updateMeta = (idx: number, key: "key" | "value", value: string) => {
      const copy = [...c.metadata];
      copy[idx] = { ...copy[idx], [key]: value };
      update({ metadata: copy } as any);
    };
    const addMeta = () =>
      update({ metadata: [...c.metadata, { key: "", value: "" }] } as any);
    const removeMeta = (idx: number) =>
      update({
        metadata: c.metadata.filter((_, i) => i !== idx),
      } as any);

    return (
      <>
        <label>
          Start Title
          <input
            style={textInputStyle}
            value={c.label}
            onChange={handleBaseLabelChange}
          />
        </label>

        <h4>Metadata</h4>
        {c.metadata.map((m, idx) => (
          <div key={idx} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            <input
              placeholder="Key"
              style={{ ...textInputStyle, marginBottom: 0 }}
              value={m.key}
              onChange={(e) => updateMeta(idx, "key", e.target.value)}
            />
            <input
              placeholder="Value"
              style={{ ...textInputStyle, marginBottom: 0 }}
              value={m.value}
              onChange={(e) => updateMeta(idx, "value", e.target.value)}
            />
            <button onClick={() => removeMeta(idx)}>x</button>
          </div>
        ))}
        <button onClick={addMeta}>+ Add metadata</button>
      </>
    );
  };

  const renderTask = (c: TaskNodeConfig) => {
    const updateCustom = (idx: number, key: "key" | "value", value: string) => {
      const copy = [...c.customFields];
      copy[idx] = { ...copy[idx], [key]: value };
      update({ customFields: copy } as any);
    };
    const addField = () =>
      update({
        customFields: [...c.customFields, { key: "", value: "" }],
      } as any);
    const removeField = (idx: number) =>
      update({
        customFields: c.customFields.filter((_, i) => i !== idx),
      } as any);

    return (
      <>
        <label>
          Title *
          <input
            style={textInputStyle}
            value={c.label}
            onChange={handleBaseLabelChange}
          />
        </label>
        <label>
          Description
          <textarea
            style={{ ...textInputStyle, minHeight: 60 }}
            value={c.description || ""}
            onChange={(e) => update({ description: e.target.value } as any)}
          />
        </label>
        <label>
          Assignee
          <input
            style={textInputStyle}
            value={c.assignee || ""}
            onChange={(e) => update({ assignee: e.target.value } as any)}
          />
        </label>
        <label>
          Due date
          <input
            style={textInputStyle}
            type="date"
            value={c.dueDate || ""}
            onChange={(e) => update({ dueDate: e.target.value } as any)}
          />
        </label>

        <h4>Custom Fields</h4>
        {c.customFields.map((f, idx) => (
          <div key={idx} style={{ display: "flex", gap: 4, marginBottom: 4 }}>
            <input
              placeholder="Key"
              style={{ ...textInputStyle, marginBottom: 0 }}
              value={f.key}
              onChange={(e) => updateCustom(idx, "key", e.target.value)}
            />
            <input
              placeholder="Value"
              style={{ ...textInputStyle, marginBottom: 0 }}
              value={f.value}
              onChange={(e) => updateCustom(idx, "value", e.target.value)}
            />
            <button onClick={() => removeField(idx)}>x</button>
          </div>
        ))}
        <button onClick={addField}>+ Add field</button>
      </>
    );
  };

  const renderApproval = (c: ApprovalNodeConfig) => (
    <>
      <label>
        Title
        <input
          style={textInputStyle}
          value={c.label}
          onChange={handleBaseLabelChange}
        />
      </label>
      <label>
        Approver Role
        <input
          style={textInputStyle}
          value={c.approverRole || ""}
          onChange={(e) => update({ approverRole: e.target.value } as any)}
        />
      </label>
      <label>
        Auto-approve threshold
        <input
          style={textInputStyle}
          type="number"
          value={c.autoApproveThreshold ?? ""}
          onChange={(e) =>
            update({
              autoApproveThreshold: e.target.value
                ? Number(e.target.value)
                : null,
            } as any)
          }
        />
      </label>
    </>
  );

  const renderAutomated = (c: AutomatedNodeConfig) => {
    const selected = automations.find((a) => a.id === c.actionId);

    const handleParamChange = (param: string, value: string) => {
      update({
        actionParams: { ...c.actionParams, [param]: value },
      } as any);
    };

    return (
      <>
        <label>
          Title
          <input
            style={textInputStyle}
            value={c.label}
            onChange={handleBaseLabelChange}
          />
        </label>
        <label>
          Action
          <select
            style={textInputStyle}
            value={c.actionId || ""}
            onChange={(e) => update({ actionId: e.target.value } as any)}
          >
            <option value="">-- Select action --</option>
            {automations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        {selected && (
          <>
            <h4>Action Parameters</h4>
            {selected.params.map((p) => (
              <label key={p}>
                {p}
                <input
                  style={textInputStyle}
                  value={c.actionParams[p] || ""}
                  onChange={(e) => handleParamChange(p, e.target.value)}
                />
              </label>
            ))}
          </>
        )}
      </>
    );
  };

  const renderEnd = (c: EndNodeConfig) => (
    <>
      <label>
        End Message
        <input
          style={textInputStyle}
          value={c.endMessage || ""}
          onChange={(e) => update({ endMessage: e.target.value } as any)}
        />
      </label>
      <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="checkbox"
          checked={c.summaryEnabled}
          onChange={(e) =>
            update({ summaryEnabled: e.target.checked } as any)
          }
        />
        Add workflow summary
      </label>
    </>
  );

  let body: React.ReactNode;
  switch (config.type) {
    case "start":
      body = renderStart(config as StartNodeConfig);
      break;
    case "task":
      body = renderTask(config as TaskNodeConfig);
      break;
    case "approval":
      body = renderApproval(config as ApprovalNodeConfig);
      break;
    case "automated":
      body = renderAutomated(config as AutomatedNodeConfig);
      break;
    case "end":
      body = renderEnd(config as EndNodeConfig);
      break;
  }

  return (
    <aside
      style={{
        width: 280,
        borderLeft: "1px solid #ddd",
        padding: "0.75rem",
        fontSize: 13,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Node Details</h3>
      <p style={{ fontSize: 12, color: "#777" }}>
        Editing <strong>{config.label}</strong> ({config.type})
      </p>
      <div style={{ marginTop: 8 }}>{body}</div>
    </aside>
  );
};

export default NodeDetailsPanel;
