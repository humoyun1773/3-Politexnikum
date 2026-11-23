export type StatusEnum = 'present' | 'absent' | 'late';

export interface AttendanceItem {
  id: number;
  subject: string;
  date: string;
  status: StatusEnum;
  status_display: string;
}

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
