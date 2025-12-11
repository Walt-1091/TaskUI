export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export interface CreateTaskRequest {
  title: string;
}

export interface UpdateTaskStatusRequest {
  completed: boolean;
}

export interface ApiError {
  message: string;
}