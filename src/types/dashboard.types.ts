import { StudentProfile } from './profile.types';
import { Lesson } from './schedule.types';
import { Grade } from './grades.types';
import { Assignment } from './assignments.types';
import { Announcement } from './announcements.types';
import { AttendanceSummary } from './attendance.types';
import { Goal } from './goals.types';

export interface DashboardData {
  profile?: StudentProfile;
  today_lessons?: Lesson[];
  next_lesson?: Lesson | null;
  recent_grades?: Grade[];
  urgent_assignments?: Assignment[];
  announcements?: Announcement[];
  attendance_summary?: AttendanceSummary;
  goals?: Goal[];
  unread_notifications_count?: number;
}
