import { apiClient } from './api';
import {
  TokenObtainPairRequest,
  TokenObtainPairResponse,
  TokenRefreshRequest,
  TokenRefreshResponse,
} from '@/types/auth.types';

export const authService = {
  async login(credentials: TokenObtainPairRequest): Promise<TokenObtainPairResponse> {
    const response = await apiClient.post<TokenObtainPairResponse>(
      '/api/auth/login/',
      credentials
    );
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  },

  async refreshToken(payload: TokenRefreshRequest): Promise<TokenRefreshResponse> {
    const response = await apiClient.post<TokenRefreshResponse>(
      '/api/auth/refresh/',
      payload
    );
    if (response.data.access) {
      localStorage.setItem('access_token', response.data.access);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  getStoredAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
