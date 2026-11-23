import { apiClient } from './api';
import {
  Notification,
  NotificationFilterParams,
} from '@/types/notifications.types';

export const notificationsService = {
  // GET all notifications
  async getNotifications(params?: NotificationFilterParams): Promise<Notification[]> {
    const response = await apiClient.get<Notification[]>('/api/notifications/', {
      params,
    });
    return response.data || [];
  },

  // GET single notification
  async getNotificationById(id: number): Promise<Notification> {
    const response = await apiClient.get<Notification>(`/api/notifications/${id}/`);
    return response.data;
  },

  // PATCH notification (e.g. is_read)
  async patchNotification(id: number, payload: { is_read?: boolean }): Promise<Notification> {
    const response = await apiClient.patch<Notification>(
      `/api/notifications/${id}/`,
      payload
    );
    return response.data;
  },

  // DELETE single notification
  async deleteNotification(id: number): Promise<void> {
    await apiClient.delete(`/api/notifications/${id}/`);
  },

  // POST mark all as read
  async readAll(): Promise<void> {
    await apiClient.post('/api/notifications/read-all/');
  },

  // DELETE clear read notifications
  async clearRead(): Promise<void> {
    await apiClient.delete('/api/notifications/clear-read/');
  },

  // GET unread count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await apiClient.get<{ count: number }>(
        '/api/notifications/unread-count/'
      );
      return response.data?.count ?? 0;
    } catch {
      return 0;
    }
  },
};
