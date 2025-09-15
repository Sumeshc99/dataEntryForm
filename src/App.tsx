import React, { useEffect, useMemo, useState } from "react";
import { Task } from "./models/Task";
import { InMemoryTaskRepository } from "./repositories/InMemoryTaskRepository";
import { TaskService } from "./services/TaskService";
import { TaskForm } from "./components/TaskForm";
import { TaskRow } from "./components/TaskRow";

export default function App() {
  const repo = useMemo(
    () =>
      new InMemoryTaskRepository([
        new Task("seed1", "Welcome!", "Edit or add tasks here"),
      ]),
    []
  );
  const service = useMemo(() => new TaskService(repo), [repo]);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await service.getAll();
      setTasks(all);
    } catch (err: any) {
      setError(err?.message ?? "Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (title: string, description: string) => {
    try {
      await service.createTask(title, description);
      await load();
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const handleEdit = async (title: string, description: string) => {
    if (!editing) return;
    try {
      await service.updateTask(editing.id, { title, description });
      setEditing(null);
      await load();
    } catch (err: any) {
      setError(err?.message);
    }
  };

  const handleToggle = async (id: string) => {
    await service.toggleTaskComplete(id);
    setTasks((prev: any) =>
      prev.map((t: any) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDelete = async (id: string) => {
    await service.deleteTask(id);
    await load();
  };

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "system-ui, sans-serif",
        background: "#fff",
        padding: "32px",
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Data entry form</h1>

      <TaskForm
        initialTitle={editing?.title}
        initialDescription={editing?.description}
        submitLabel={editing ? "Update Task" : "Add Task"}
        onSubmit={(title, desc) =>
          editing ? handleEdit(title, desc) : handleAdd(title, desc)
        }
        onCancel={() => setEditing(null)}
      />

      <div
        style={{
          margin: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ marginRight: 8, fontWeight: 500 }}>Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid #ccc",
            }}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          onClick={load}
          disabled={loading}
          style={{
            background: "#007bff",
            color: "#fff",
            padding: "6px 14px",
            border: "none",
            borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          style={{
            background: "#ffe6e6",
            color: "#b30000",
            padding: "10px 14px",
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>Loading...</div>
      ) : visible.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666", padding: "20px 0" }}>
          No tasks yet
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {visible.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
