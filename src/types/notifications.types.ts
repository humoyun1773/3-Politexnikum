export type { CategoryEnum, Notification, PatchedNotification } from './openapi.types';

export interface NotificationFilterParams {
  unread?: number;
  category?: string;
}
