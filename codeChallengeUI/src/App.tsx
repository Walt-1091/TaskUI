import React, { useEffect, useState } from "react";
import TaskService from "./services/task.service";
import type { Task } from "./types/task.types";

import { TaskItem } from "./components/TaskItem";
import { EmptyState } from "./components/EmptyState";
import { ErrorMessage } from "./components/ErrorMessage";
import LoadingSpinner from "./components/LoadingSpinner";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await TaskService.getAllTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setSaving(true);
      setError(null);
      const created = await TaskService.createTask({
        title: newTitle.trim(),
      });
      setTasks((prev) => [...prev, created]);
      setNewTitle("");
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: number) => {
    const current = tasks.find((t) => t.id === id);
    if (!current) return;

    try {
      setUpdatingId(id);
      setError(null);
      const updated = await TaskService.updateTaskStatus(
        id,
        !current.completed
      );
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-10 border-b border-slate-200 pb-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Task Manager
              </h1>
              <p className="mt-2 text-sm text-slate-600 max-w-xl">
                Manage your tasks efficiently with{" "}
                <span className="font-semibold">React</span>,{" "}
                <span className="font-semibold">TypeScript</span> and a{" "}
                <span className="font-semibold">C# ASP.NET Core API</span>.
              </p>
            </div>
            <div className="text-xs text-slate-500 md:text-right">
              <p>Frontend: React + TS + Tailwind</p>
              <p>Backend: ASP.NET Core Web API</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">
              Add New Task
            </h2>
            <p className="text-sm text-slate-500 mb-4">
              Quickly create a task by entering a title. Tasks are stored in the
              in-memory API.
            </p>

            <form
              onSubmit={handleAddTask}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter task title..."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm
                             bg-slate-50 focus:bg-white
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                             placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                disabled={!newTitle.trim() || saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl
                           bg-blue-600 text-white px-4 py-2.5 text-sm font-semibold shadow-sm
                           disabled:opacity-60 disabled:cursor-not-allowed
                           hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                {saving && (
                  <span className="h-4 w-4 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                )}
                {saving ? "Saving..." : "Add Task"}
              </button>
            </form>

            <p className="mt-3 text-xs text-slate-400">
              Press <span className="font-mono">Enter</span> to save quickly.
            </p>
          </div>

        </section>

        {error && <ErrorMessage message={error} onRetry={loadTasks} />}

        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Your Tasks
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Toggle a task to mark it as completed.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {tasks.length} task{tasks.length !== 1 && "s"}
            </span>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading tasks..." />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  isUpdating={updatingId === task.id}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
