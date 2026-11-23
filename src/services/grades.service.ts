import { apiClient } from './api';
import { Grade } from '@/types/grades.types';

export const gradesService = {
  async getGrades(): Promise<Grade[]> {
    const response = await apiClient.get<Grade[]>('/api/grades/');
    return response.data || [];
  },
};
