import { apiClient } from './api';
import { Assignment, AssignmentSubmitPayload } from '@/types/assignments.types';

export const assignmentsService = {
  async getAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>('/api/assignments/');
    return response.data || [];
  },

  async getAssignmentDetail(id: number): Promise<Assignment> {
    const response = await apiClient.get<Assignment>(`/api/assignments/${id}/`);
    return response.data;
  },

  async submitAssignment(
    id: number,
    data: FormData | AssignmentSubmitPayload
  ): Promise<Assignment> {
    const headers =
      data instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

    const response = await apiClient.post<Assignment>(
      `/api/assignments/${id}/submit/`,
      data,
      { headers }
    );
    return response.data;
  },
};
