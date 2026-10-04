import api from "./api";

export interface Task {
  id: number;
  event: number;
  title: string;
  description: string;
  category: string;
  status: "todo" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_date: string | null;
  assigned_to: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskData {
  event: number;
  title: string;
  description?: string;
  category?: string;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  due_date?: string | null;
  assigned_to?: number | null;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  category?: string;
  status?: "todo" | "in_progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  due_date?: string | null;
  assigned_to?: number | null;
}

export async function getTasks(eventId: number): Promise<Task[]> {
  const response = await api.get(`/tasks/?event=${eventId}`);

  return response.data;
}

export async function createTask(
  data: CreateTaskData
): Promise<Task> {
  const response = await api.post("/tasks/", data);

  return response.data;
}

export async function updateTask(
  taskId: number,
  data: UpdateTaskData
): Promise<Task> {
  const response = await api.patch(`/tasks/${taskId}/`, data);

  return response.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  await api.delete(`/tasks/${taskId}/`);
}