export type WeekdayEnum = 1 | 2 | 3 | 4 | 5 | 6 | 7;

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

export interface ScheduleFilterParams {
  weekday?: number;
}
