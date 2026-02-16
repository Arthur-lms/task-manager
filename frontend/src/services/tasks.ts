import api from './api';
import { Task, TaskFilters, CreateTaskData } from '../types';

interface PaginatedTasks {
  data: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const taskService = {
  async getAll(filters: TaskFilters = {}): Promise<Task[] | PaginatedTasks> {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.search) params.append('search', filters.search);

    const { data } = await api.get<Task[]>(`/tasks?${params.toString()}`);
    return data;
  },

  async create(taskData: CreateTaskData): Promise<Task> {
    const { data } = await api.post<Task>('/tasks', taskData);
    return data;
  },

  async update(id: string, taskData: Partial<Task>): Promise<Task> {
    const { data } = await api.put<Task>(`/tasks/${id}`, taskData);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/tasks/${id}`);
  },

  async getStats(): Promise<{ [key: string]: number }> {
    const { data } = await api.get<{ stats: { [key: string]: number } }>(
      `/tasks/stats`,
    );
    return data.stats;
  },
};
