import { apiClient } from './api';
import {
  Goal,
  CreateGoalPayload,
  UpdateGoalPayload,
} from '@/types/goals.types';

export const goalsService = {
  // GET all goals
  async getGoals(): Promise<Goal[]> {
    const response = await apiClient.get<Goal[]>('/api/goals/');
    return response.data || [];
  },

  // GET single goal by ID
  async getGoalById(id: number): Promise<Goal> {
    const response = await apiClient.get<Goal>(`/api/goals/${id}/`);
    return response.data;
  },

  // POST create new goal
  async createGoal(titleOrPayload: string | CreateGoalPayload): Promise<Goal> {
    const payload =
      typeof titleOrPayload === 'string'
        ? { title: titleOrPayload, is_done: false }
        : titleOrPayload;
    const response = await apiClient.post<Goal>('/api/goals/', payload);
    return response.data;
  },

  // PUT full update of goal
  async updateGoal(id: number, payload: CreateGoalPayload): Promise<Goal> {
    const response = await apiClient.put<Goal>(`/api/goals/${id}/`, payload);
    return response.data;
  },

  // PATCH partial update (e.g. toggle is_done)
  async patchGoal(id: number, payload: UpdateGoalPayload): Promise<Goal> {
    const response = await apiClient.patch<Goal>(`/api/goals/${id}/`, payload);
    return response.data;
  },

  async toggleGoal(id: number, is_done: boolean): Promise<Goal> {
    return this.patchGoal(id, { is_done });
  },

  // DELETE goal
  async deleteGoal(id: number): Promise<void> {
    await apiClient.delete(`/api/goals/${id}/`);
  },
};
