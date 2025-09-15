import React from "react";
import { Task } from "../models/Task";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskRow: React.FC<Props> = ({
  task,
  onToggle,
  onEdit,
  onDelete,
}) => (
  <div
    style={{
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: 8,
      border: "1px solid #eee",
      borderRadius: 6,
    }}
  >
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => onToggle(task.id)}
    />
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontWeight: 600,
          textDecoration: task.completed ? "line-through" : "none",
        }}
      >
        {task.title}
      </div>
      {task.description && (
        <div style={{ color: "#555", fontSize: 13 }}>{task.description}</div>
      )}
      <div style={{ fontSize: 11, color: "#999" }}>
        {task.createdAt.toLocaleString()}
      </div>
    </div>
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  </div>
);
