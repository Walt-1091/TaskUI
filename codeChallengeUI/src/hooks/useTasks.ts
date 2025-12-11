import { useState, useEffect, useCallback } from 'react';
import TaskService from '../services/task.service';
import type { Task } from '../types/task.types';

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  addTask: (title: string) => Promise<void>;
  toggleTask: (taskId: number) => Promise<void>;
  isAddingTask: boolean;
  updatingTaskId: number | null;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await TaskService.getAllTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTask = useCallback(async (title: string): Promise<void> => {
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      setError('Task title cannot be empty');
      return;
    }

    setIsAddingTask(true);
    setError(null);

    try {
      const newTask = await TaskService.createTask({ title: trimmedTitle });
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    } finally {
      setIsAddingTask(false);
    }
  }, []);

  const toggleTask = useCallback(async (taskId: number): Promise<void> => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setUpdatingTaskId(taskId);
    setError(null);

    try {
      const updatedTask = await TaskService.updateTaskStatus(taskId, !task.completed);
      setTasks(prevTasks => 
        prevTasks.map(t => (t.id === taskId ? updatedTask : t))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      console.error('Error updating task:', err);
    } finally {
      setUpdatingTaskId(null);
    }
  }, [tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    isAddingTask,
    updatingTaskId,
  };
};