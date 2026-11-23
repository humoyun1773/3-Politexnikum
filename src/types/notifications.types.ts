export type CategoryEnum = 'info' | 'grade' | 'assignment' | 'attendance' | 'system';

export interface Notification {
  id: number;
  category: CategoryEnum;
  category_display: string;
  title: string;
  text: string;
  is_read: boolean;
  created_at: string;
}

export interface NotificationFilterParams {
  unread?: number;
  category?: string;
}
