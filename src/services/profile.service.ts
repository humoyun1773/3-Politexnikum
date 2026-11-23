import { apiClient } from './api';
import { StudentProfile, UpdateProfilePayload } from '@/types/profile.types';

export const profileService = {
  // GET profile + stats
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<StudentProfile>('/api/profile/');
    return response.data;
  },

  // PATCH profile
  async updateProfile(
    payload: UpdateProfilePayload | FormData
  ): Promise<StudentProfile> {
    const headers =
      payload instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

    const response = await apiClient.patch<StudentProfile>(
      '/api/profile/',
      payload,
      { headers }
    );
    return response.data;
  },
};
