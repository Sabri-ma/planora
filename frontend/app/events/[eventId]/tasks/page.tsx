"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
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

      <main className="flex min-h-screen items-center justify-center bg-[#f6f8fc]">

        <p className="text-[#667085]">

          Loading tasks...

        </p>

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-[#f6f8fc]">
<section className="mx-auto max-w-[1500px] px-5 py-6 sm:px-7 lg:px-10 lg:py-8">

        <div
          className="relative overflow-hidden rounded-[30px] bg-cover bg-center px-6 py-7 text-white shadow-[0_24px_70px_rgba(8,23,47,0.22)] sm:px-8 sm:py-8"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(5,17,38,0.92) 0%, rgba(6,24,55,0.74) 58%, rgba(6,24,55,0.46) 100%), url('/images/event-hero.jpg')",
          }}
        >
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#D4A646]/20 blur-3xl" />
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#1D4ED8]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] !text-[#E7C875]">
                Planning
              </p>

              <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em] !text-white">
                Tasks
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 !text-white/70 sm:text-base">
                Keep deadlines, priorities and every important detail moving toward the big day.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setTaskModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#D4A646] px-5 py-3 text-sm font-bold !text-[#08172F] shadow-[0_10px_28px_rgba(212,166,70,0.24)] transition hover:-translate-y-0.5 hover:bg-[#E7C875] hover:!text-[#08172F]"
            >
              <Plus size={16} />
              New task
            </button>
          </div>
        </div>

        {error && (

          <p className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">

            {error}

          </p>

        )}

        <div className="mt-6 space-y-4">

          {tasks.length === 0 ? (

            <div className="rounded-[26px] border border-[#e2e7ef] bg-white p-8 shadow-[0_8px_30px_rgba(15,43,91,0.04)]">

              <h2 className="text-xl font-semibold">

                No tasks yet

              </h2>

              <p className="mt-2 text-[#667085]">

                Create your first task to start organizing this event.

              </p>

              

            </div>

          ) : (

            tasks.map((task) => (

              <div

                key={task.id}

                className="rounded-[24px] border border-[#e2e7ef] bg-white p-6 shadow-[0_8px_30px_rgba(15,43,91,0.04)] transition hover:-translate-y-0.5 hover:border-[#d4dcea] hover:shadow-[0_16px_38px_rgba(15,43,91,0.08)]"

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

                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition hover:bg-[#eef3fb] disabled:opacity-50"

                      aria-label={

                        task.status === "completed"

                          ? "Mark task as incomplete"

                          : "Mark task as completed"

                      }

                    >

                      {task.status === "completed" ? (

                        <CheckCircle2

                          size={22}

                          className="text-[#1D4ED8]"

                        />

                      ) : (

                        <Circle

                          size={22}

                          className="text-[#8b94a8]"

                        />

                      )}

                    </button>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2

                          className={`text-lg font-semibold ${

                            task.status === "completed"

                              ? "text-[#8b94a8] line-through"

                              : ""

                          }`}

                        >

                          {task.title}

                        </h2>

                        <span className="rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-semibold capitalize text-[#9a6b23]">

                          {task.priority}

                        </span>

                        <span className="rounded-full border border-[#dce3ee] bg-[#f8faff] px-3 py-1 text-xs font-medium capitalize text-[#667085]">

                          {task.status.replace(

                            "_",

                            " "

                          )}

                        </span>

                      </div>

                      {task.description && (

                        <p className="mt-2 text-sm leading-6 text-[#667085]">

                          {task.description}

                        </p>

                      )}

                      <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#8b94a8]">

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

                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#dce3ee] text-[#0F2B5B] transition hover:border-[#9fb3d1] hover:bg-[#eef4ff] hover:text-[#1D4ED8]"

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

                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#f1d0d4] text-red-600 transition hover:bg-red-50 disabled:opacity-50"

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

          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08172F]/55 px-4 backdrop-blur-sm"

          onClick={() =>

            setTaskModalOpen(false)

          }

        >

          <div

            className="w-full max-w-lg rounded-[28px] border border-[#e2e7ef] bg-white p-7 shadow-[0_30px_90px_rgba(8,23,47,0.24)]"

            onClick={(event) =>

              event.stopPropagation()

            }

          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

                  Planning

                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

                  New task

                </h2>

              </div>

              <button

                type="button"

                onClick={() =>

                  setTaskModalOpen(false)

                }

                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B] transition hover:bg-[#e4ecf8]"

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

                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                  className="w-full resize-none rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                    className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                    className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button

                  type="button"

                  onClick={() =>

                    setTaskModalOpen(false)

                  }

                  className="rounded-xl border border-[#dce3ee] bg-white px-5 py-3 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={creating}

                  className="rounded-xl bg-[#0F2B5B] px-6 py-3 font-semibold !text-white transition hover:bg-[#173B78] hover:!text-white disabled:opacity-60"

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

          className="fixed inset-0 z-50 flex items-center justify-center bg-[#08172F]/55 px-4 backdrop-blur-sm"

          onClick={closeEditModal}

        >

          <div

            className="w-full max-w-lg rounded-[28px] border border-[#e2e7ef] bg-white p-7 shadow-[0_30px_90px_rgba(8,23,47,0.24)]"

            onClick={(event) =>

              event.stopPropagation()

            }

          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b8862f]">

                  Planning

                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-[-0.03em] text-[#08172F]">

                  Edit task

                </h2>

              </div>

              <button

                type="button"

                onClick={closeEditModal}

                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef3fb] text-[#0F2B5B] transition hover:bg-[#e4ecf8]"

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

                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                  className="w-full resize-none rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                  className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                    className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

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

                    className="w-full rounded-xl border border-[#dce3ee] bg-white px-4 py-3 text-[#111827] outline-none transition focus:border-[#D4A646] focus:ring-2 focus:ring-[#D4A646]/15"

                  />

                </div>

              </div>

              <div className="flex justify-end gap-3 pt-2">

                <button

                  type="button"

                  onClick={closeEditModal}

                  className="rounded-xl border border-[#dce3ee] bg-white px-5 py-3 font-semibold text-[#44506a] transition hover:border-[#9fb3d1] hover:bg-[#f8faff] hover:text-[#0F2B5B]"

                >

                  Cancel

                </button>

                <button

                  type="submit"

                  disabled={

                    updatingTaskId === editingTask.id

                  }

                  className="flex items-center gap-2 rounded-xl bg-[#0F2B5B] px-6 py-3 font-semibold !text-white transition hover:bg-[#173B78] hover:!text-white disabled:opacity-60"

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