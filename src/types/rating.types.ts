export interface RatingItem {
  rank: number;
  student_id: number;
  full_name: string;
  group: string;
  average_grade: number;
  attendance_rate: number;
  completed_assignments: number;
  is_current_user?: boolean;
}

export interface RatingFilterParams {
  scope?: 'group' | 'all';
  subject?: number;
  limit?: number;
}
