import { apiClient } from './api';
import { Announcement } from '@/types/announcements.types';

export const announcementsService = {
  async getAnnouncements(): Promise<Announcement[]> {
    const response = await apiClient.get<Announcement[]>('/api/announcements/');
    return response.data || [];
  },
};
