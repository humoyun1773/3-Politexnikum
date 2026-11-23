// OpenAPI Types for 3-Politexnikum Student Hub API

export type KindEnum = 'control' | 'practice' | 'test' | 'bsb';
export type StatusEnum = 'present' | 'absent' | 'late';
export type CategoryEnum = 'info' | 'grade' | 'assignment' | 'attendance' | 'system';
export type WeekdayEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface Announcement {
  id: number;
  title: string;
  text?: string;
  created_at: string;
}

export interface Assignment {
  id: number;
  title: string;
  subject: string;
  kind: KindEnum;
  kind_display: string;
  due_date: string;
  days_left: string;
  submitted: string | boolean;
  description?: string;
  max_score?: number;
}

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

export interface Book {
  id: number;
  title: string;
  author: string;
  file: string;
  cover?: string;
  subject?: string;
  pages?: number;
  download_count?: number;
}

export interface ChatMessage {
  id: number;
  sender: number;
  sender_name: string;
  text: string;
  created_at: string;
  avatar?: string;
  is_me?: boolean;
}

export interface Goal {
  id: number;
  title: string;
  is_done: boolean;
  created_at: string;
}

export interface PatchedGoal {
  id?: number;
  title?: string;
  is_done?: boolean;
}

export interface Grade {
  id: number;
  subject: string;
  score: number;
  date: string;
  type?: string;
  teacher?: string;
}

export interface Lesson {
  id: number;
  subject: string;
  teacher: string;
  weekday: WeekdayEnum;
  weekday_name: string;
  start_time: string;
  end_time: string;
  room?: string;
}

export interface Notification {
  id: number;
  category: CategoryEnum;
  category_display: string;
  title: string;
  text: string;
  is_read: boolean;
  created_at: string;
}

export interface StudentProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  group: string;
  specialty: string;
  course: number;
  email?: string;
  phone?: string;
  avatar?: string;
  gpa: number;
  attendance_percentage: number;
  rating_position: number;
  total_students: number;
  joined_date?: string;
}

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

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'uz' | 'ru' | 'en';
  email_notifications: boolean;
  sms_notifications: boolean;
  chat_notifications: boolean;
  show_rating_publicly: boolean;
}

export interface DashboardData {
  profile: StudentProfile;
  today_lessons: Lesson[];
  next_lesson?: Lesson | null;
  recent_grades: Grade[];
  urgent_assignments: Assignment[];
  announcements: Announcement[];
  attendance_summary: AttendanceSummary;
  goals: Goal[];
  unread_notifications_count: number;
}
