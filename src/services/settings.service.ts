import { apiClient } from './api';
import { UserSettings, ChangePasswordPayload } from '@/types/settings.types';

export const settingsService = {
  // GET settings
  async getSettings(): Promise<UserSettings> {
    const response = await apiClient.get<UserSettings>('/api/settings/');
    return response.data || {};
  },

  // PATCH settings
  async updateSettings(payload: UserSettings): Promise<UserSettings> {
    const response = await apiClient.patch<UserSettings>(
      '/api/settings/',
      payload
    );
    return response.data;
  },

  // POST change password
  async changePassword(
    payload: ChangePasswordPayload
  ): Promise<{ detail?: string }> {
    const response = await apiClient.post<{ detail?: string }>(
      '/api/settings/change-password/',
      payload
    );
    return response.data;
  },
};
