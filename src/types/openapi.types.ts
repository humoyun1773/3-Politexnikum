/**
 * 3-Politexnikum Student Hub API
 * Version: 1.0.0
 * Generated OpenAPI 3.0.3 Types matching http://169.58.215.170:8090/api/schema/
 */

export type CategoryEnum = 'info' | 'grade' | 'assignment' | 'attendance' | 'system';

export type KindEnum = 'control' | 'practice' | 'test' | 'bsb';

export type StatusEnum = 'present' | 'absent' | 'late';

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

export interface Book {
  id: number;
  title: string;
  author: string;
  file: string;
  pages?: number;
  download_count?: number;
  cover?: string;
  subject?: string;
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
  created_at?: string;
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

export interface PatchedNotification {
  id?: number;
  category?: CategoryEnum;
  category_display?: string;
  title?: string;
  text?: string;
  is_read?: boolean;
  created_at?: string;
}

export interface TokenObtainPair {
  username: string;
  password?: string;
  access?: string;
  refresh?: string;
}

export interface TokenRefresh {
  access?: string;
  refresh: string;
}
