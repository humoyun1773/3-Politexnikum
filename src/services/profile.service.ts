import { apiClient } from './api';
import { StudentProfile, UpdateProfilePayload } from '@/types/profile.types';

export const profileService = {
  // GET: Profil ma'lumotlarini olish
  async getProfile(): Promise<StudentProfile> {
    const response = await apiClient.get<StudentProfile>('/api/profile/');
    return response.data;
  },

  // PATCH: Profilni qisman yangilash
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

  // PUT: Profilni to'liq yangilash
  async putProfile(
    payload: UpdateProfilePayload | FormData
  ): Promise<StudentProfile> {
    const headers =
      payload instanceof FormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' };

    const response = await apiClient.put<StudentProfile>(
      '/api/profile/',
      payload,
      { headers }
    );
    return response.data;
  },

  // PUT / POST: Rasm (avatar) yuklash
  async uploadAvatar(file: File): Promise<StudentProfile> {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await apiClient.put<StudentProfile>(
        '/api/profile/avatar/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch {
      // Fallback: umumiy profile endpointiga PATCH/PUT qilish
      const response = await apiClient.patch<StudentProfile>(
        '/api/profile/',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    }
  },

  // DELETE: Profil rasmini o'chirish
  async deleteAvatar(): Promise<StudentProfile> {
    try {
      const response = await apiClient.delete<StudentProfile>('/api/profile/avatar/');
      return response.data;
    } catch {
      // Fallback: avatar maydonini bo'shatib PATCH/PUT qilish
      const response = await apiClient.patch<StudentProfile>('/api/profile/', {
        avatar: '',
      });
      return response.data;
    }
  },
};
