"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createTask,
  deleteTask,
  getTasks,
  Task,
  updateTask,
} from "@/services/tasks";

type TaskPriority = "low" | "medium" | "high" | "urgent";

export default function EventTasksPage() {
  const params = useParams();
  const router = useRouter();

  const eventId = Number(params.eventId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(
    null
  );
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(
    null
  );

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as TaskPriority,
    due_date: "",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as TaskPriority,
    due_date: "",
  });

  const loadTasks = async () => {
    try {
      setError("");

      const data = await getTasks(eventId);

      setTasks(data);
    } catch {
      setError("Could not load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [eventId]);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setEditForm({
      ...editForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreateTask = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setCreating(true);
    setError("");

    try {
      await createTask({
        event: eventId,
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        status: "todo",
        due_date: form.due_date || null,
      });

      setForm({
        title: "",
        description: "",
        category: "",
        priority: "medium",
        due_date: "",
      });

      setTaskModalOpen(false);

      await loadTasks();
    } catch {
      setError("Could not create task.");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    setUpdatingTaskId(task.id);
    setError("");

    try {
      await updateTask(task.id, {
        status:
          task.status === "completed"
            ? "todo"
            : "completed",
      });

      await loadTasks();
    } catch {
      setError("Could not update task.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setDeletingTaskId(taskId);
    setError("");

    try {
      await deleteTask(taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId)
      );
    } catch {
      setError("Could not delete task.");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);

    setEditForm({
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      due_date: task.due_date || "",
    });

    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!editingTask) {
      return;
    }

    setUpdatingTaskId(editingTask.id);
    setError("");

    try {
      await updateTask(editingTask.id, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        priority: editForm.priority,
        due_date: editForm.due_date || null,
      });

      closeEditModal();

      await loadTasks();
    } catch {
      setError("Could not update task.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-[#746f67]">
          Loading tasks...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f5ef]">
      <header className="border-b border-[#e5ded3] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <button
            type="button"
            onClick={() =>
              router.push(`/events/${eventId}`)
            }
            className="flex items-center gap-2 text-sm text-[#746f67] transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to event
          </button>

          <button
            type="button"
            onClick={() => setTaskModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-5 py-2.5 text-sm font-medium !text-white transition hover:bg-black"
          >
            <Plus size={16} />
            New task
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <p className="text-sm uppercase tracking-[0.16em] text-[#9a7b4c]">
          Planning
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Tasks
        </h1>

        <p className="mt-3 text-[#746f67]">
          Track everything that needs to be done for this event.
        </p>

        {error && (
          <p className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-10 space-y-4">
          {tasks.length === 0 ? (
            <div className="rounded-[24px] border border-[#e5ded3] bg-white p-8">
              <h2 className="text-xl font-semibold">
                No tasks yet
              </h2>

              <p className="mt-2 text-[#746f67]">
                Create your first task to start organizing this event.
              </p>

              <button
                type="button"
                onClick={() =>
                  setTaskModalOpen(true)
                }
                className="mt-6 rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white"
              >
                Create task
              </button>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-[24px] border border-[#e5ded3] bg-white p-6"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleComplete(task)
                      }
                      disabled={
                        updatingTaskId === task.id
                      }
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-[#f3ede4] disabled:opacity-50"
                      aria-label={
                        task.status === "completed"
                          ? "Mark task as incomplete"
                          : "Mark task as completed"
                      }
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2
                          size={22}
                          className="text-green-600"
                        />
                      ) : (
                        <Circle
                          size={22}
                          className="text-[#817b72]"
                        />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2
                          className={`text-lg font-semibold ${
                            task.status === "completed"
                              ? "text-[#817b72] line-through"
                              : ""
                          }`}
                        >
                          {task.title}
                        </h2>

                        <span className="rounded-full bg-[#f3ede4] px-3 py-1 text-xs font-medium capitalize">
                          {task.priority}
                        </span>

                        <span className="rounded-full border border-[#e5ded3] px-3 py-1 text-xs capitalize text-[#746f67]">
                          {task.status.replace(
                            "_",
                            " "
                          )}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-2 text-sm leading-6 text-[#746f67]">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#817b72]">
                        {task.category && (
                          <span>
                            {task.category}
                          </span>
                        )}

                        {task.due_date && (
                          <span className="flex items-center gap-1.5">
                            <CalendarDays
                              size={14}
                            />

                            {new Date(
                              task.due_date
                            ).toLocaleDateString()}
                          </span>
                        )}

                        <span>
                          Created by{" "}
                          {task.created_by}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(task)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] transition hover:bg-[#f8f5ef]"
                      aria-label="Edit task"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteTask(task.id)
                      }
                      disabled={
                        deletingTaskId === task.id
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5ded3] text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {taskModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() =>
            setTaskModalOpen(false)
          }
        >
          <div
            className="w-full max-w-lg rounded-[28px] bg-[#fffdf9] p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#817b72]">
                  Planning
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  New task
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setTaskModalOpen(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ebe2]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleCreateTask}
              className="mt-7 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Book photographer"
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Photography"
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="urgent">
                      Urgent
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Due date
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={form.due_date}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setTaskModalOpen(false)
                  }
                  className="rounded-full border border-[#ddd5ca] px-5 py-3 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white disabled:opacity-60"
                >
                  {creating
                    ? "Creating..."
                    : "Create task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={closeEditModal}
        >
          <div
            className="w-full max-w-lg rounded-[28px] bg-[#fffdf9] p-7 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#817b72]">
                  Planning
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  Edit task
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ebe2]"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleEditTask}
              className="mt-7 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  required
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={editForm.priority}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                  >
                    <option value="low">
                      Low
                    </option>

                    <option value="medium">
                      Medium
                    </option>

                    <option value="high">
                      High
                    </option>

                    <option value="urgent">
                      Urgent
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Due date
                  </label>

                  <input
                    type="date"
                    name="due_date"
                    value={editForm.due_date}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-[#ddd5ca] bg-white px-4 py-3 outline-none focus:border-[#a98b5d]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-full border border-[#ddd5ca] px-5 py-3 font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    updatingTaskId === editingTask.id
                  }
                  className="flex items-center gap-2 rounded-full bg-[#1f1d1a] px-6 py-3 font-medium !text-white disabled:opacity-60"
                >
                  <Check size={16} />

                  {updatingTaskId === editingTask.id
                    ? "Saving..."
                    : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}