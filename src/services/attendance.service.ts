import { apiClient } from './api';
import {
  AttendanceItem,
  AttendanceSummary,
  AttendanceFilterParams,
} from '@/types/attendance.types';

export const attendanceService = {
  async getAttendance(params?: AttendanceFilterParams): Promise<AttendanceItem[]> {
    const response = await apiClient.get<AttendanceItem[]>('/api/attendance/', {
      params,
    });
    return response.data || [];
  },

  async getSummary(month?: string): Promise<AttendanceSummary> {
    const response = await apiClient.get<AttendanceSummary>('/api/attendance/summary/', {
      params: { month },
    });
    return response.data;
  },

  async getBySubject(): Promise<AttendanceItem[]> {
    const response = await apiClient.get<AttendanceItem[]>('/api/attendance/by-subject/');
    return response.data || [];
  },

  async getCalendar(month?: string): Promise<AttendanceItem[]> {
    const response = await apiClient.get<AttendanceItem[]>('/api/attendance/calendar/', {
      params: { month },
    });
    return response.data || [];
  },
};
