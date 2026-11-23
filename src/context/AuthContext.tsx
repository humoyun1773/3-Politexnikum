import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentProfile } from '@/types/api.types';
import { authService, profileService } from '@/services/student.service';
import { mockProfile } from '@/data/mockData';

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemo: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  loginAsDemo: () => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemo, setIsDemo] = useState<boolean>(false);

  const checkAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem('access_token');
    const demo = localStorage.getItem('demo_mode') === 'true';

    if (token) {
      setIsAuthenticated(true);
      setIsDemo(demo);
      try {
        const profile = await profileService.getProfile();
        setUser(profile);
      } catch {
        setUser(mockProfile);
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
      const demo = localStorage.getItem('demo_mode') === 'true';
      setIsDemo(demo);
      const profile = await profileService.getProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = () => {
    localStorage.setItem('access_token', 'demo-token-12345');
    localStorage.setItem('refresh_token', 'demo-refresh-12345');
    localStorage.setItem('demo_mode', 'true');
    setIsAuthenticated(true);
    setIsDemo(true);
    setUser(mockProfile);
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setIsDemo(false);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await profileService.getProfile();
      setUser(profile);
    } catch {
      // fallback
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        isDemo,
        login,
        loginAsDemo,
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
