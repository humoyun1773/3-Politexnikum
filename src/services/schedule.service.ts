import { apiClient } from './api';
import { Lesson, ScheduleFilterParams } from '@/types/schedule.types';

export const scheduleService = {
  async getSchedule(params?: ScheduleFilterParams | number): Promise<Lesson[]> {
    const queryParams = typeof params === 'number' ? { weekday: params } : params;
    const response = await apiClient.get<Lesson[]>('/api/schedule/', {
      params: queryParams,
    });
    return response.data || [];
  },

  async getTodaySchedule(): Promise<Lesson[]> {
    const response = await apiClient.get<Lesson[]>('/api/schedule/today/');
    return response.data || [];
  },

  async getWeekSchedule(): Promise<Lesson[]> {
    const response = await apiClient.get<Lesson[]>('/api/schedule/week/');
    return response.data || [];
  },

  async getNextLesson(): Promise<Lesson | null> {
    const response = await apiClient.get<Lesson>('/api/schedule/next/');
    return response.data;
  },
};
