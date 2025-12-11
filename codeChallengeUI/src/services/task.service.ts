import axios, { type AxiosResponse } from "axios";
import type { CreateTaskRequest, Task } from "../types/task.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5103/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class TaskService {
  private static handleResponse<T>(response: AxiosResponse<T>): T {
    if (response.status < 200 || response.status >= 300) {
      const data: any = response.data ?? {};
      const message =
        (typeof data === "object" && "message" in data && data.message) ||
        `HTTP ${response.status}`;
      throw new Error(String(message));
    }

    return response.data;
  }

  static async getAllTasks(): Promise<Task[]> {
    const response = await api.get<Task[]>("/tasks");
    return this.handleResponse(response);
  }

  static async createTask(request: CreateTaskRequest): Promise<Task> {
    const response = await api.post<Task>("/tasks", request);
    return this.handleResponse(response);
  }

  static async getTaskById(id: number): Promise<Task> {
    const response = await api.get<Task>(`/tasks/${id}`);
    return this.handleResponse(response);
  }

  static async updateTaskStatus(
    id: number,
    completed: boolean
  ): Promise<Task> {
    const response = await api.put<Task>(`/tasks/${id}`, { completed });
    return this.handleResponse(response);
  }
}

export default TaskService;
