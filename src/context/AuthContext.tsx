import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentProfile } from '@/types/profile.types';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = async () => {
    setIsLoading(true);
    const token = authService.getStoredAccessToken();

    if (token) {
      setIsAuthenticated(true);
      try {
        const profile = await profileService.getProfile();
        setUser(profile);
      } catch (err: any) {
        // If 401 or profile fetch failed, token is invalid
        if (err?.response?.status === 401) {
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    try {
      await authService.login(credentials);
      setIsAuthenticated(true);
      const profile = await profileService.getProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await profileService.getProfile();
      setUser(profile);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
