import { apiClient } from './api';
import { DashboardData } from '@/types/dashboard.types';

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/api/dashboard/');
    return response.data;
  },
};
