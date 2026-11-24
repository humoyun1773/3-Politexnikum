export type { StatusEnum, AttendanceItem } from './openapi.types';

export interface AttendanceSummary {
  total_lessons: number;
  present: number;
  absent: number;
  late: number;
  attendance_rate: number;
}

export interface AttendanceBySubject {
  subject: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

export interface AttendanceFilterParams {
  month?: string;
  status?: string;
  subject?: string;
}
