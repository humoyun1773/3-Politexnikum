import React, { createContext, useContext, useEffect, useState } from 'react';
import { StudentProfile } from '@/types/profile.types';
import { authService } from '@/services/auth.service';
import { profileService } from '@/services/profile.service';

export const DEMO_USER: StudentProfile = {
  id: 1,
  username: 'demo_talaba',
  first_name: 'Humoyun',
  last_name: 'Mirzo',
  group: '301-AT',
  specialty: 'Axborot texnologiyalari va dasturiy injiniring',
  course: 3,
  email: 'talaba@3politexnikum.uz',
  phone: '+998 90 123 45 67',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  gpa: 4.85,
  attendance_percentage: 96,
  rating_position: 3,
  total_students: 145,
  joined_date: '2023-09-01',
};

interface AuthContextType {
  user: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updatedData: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = async () => {
    setIsLoading(true);
    const token = authService.getStoredAccessToken();
    const isDemo = localStorage.getItem('is_demo_mode') === 'true';

    if (token) {
      setIsAuthenticated(true);
      if (isDemo) {
        const savedDemo = localStorage.getItem('demo_user_profile');
        setUser(savedDemo ? JSON.parse(savedDemo) : DEMO_USER);
        setIsLoading(false);
        return;
      }
      try {
        const profile = await profileService.getProfile();
        setUser(profile);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          authService.logout();
          setIsAuthenticated(false);
          setUser(null);
        } else {
          // Fallback to demo user if backend is offline
          const savedDemo = localStorage.getItem('demo_user_profile');
          setUser(savedDemo ? JSON.parse(savedDemo) : DEMO_USER);
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

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem('access_token', 'demo_access_token_3politexnikum');
      localStorage.setItem('refresh_token', 'demo_refresh_token_3politexnikum');
      localStorage.setItem('is_demo_mode', 'true');
      const savedDemo = localStorage.getItem('demo_user_profile');
      setUser(savedDemo ? JSON.parse(savedDemo) : DEMO_USER);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    setIsLoading(true);
    if (credentials.username.toLowerCase() === 'demo') {
      await loginAsDemo();
      return;
    }

    try {
      await authService.login(credentials);
      localStorage.removeItem('is_demo_mode');
      setIsAuthenticated(true);
      const profile = await profileService.getProfile();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('is_demo_mode');
    localStorage.removeItem('demo_user_profile');
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = async () => {
    if (localStorage.getItem('is_demo_mode') === 'true') {
      const savedDemo = localStorage.getItem('demo_user_profile');
      setUser(savedDemo ? JSON.parse(savedDemo) : DEMO_USER);
      return;
    }
    try {
      const profile = await profileService.getProfile();
      setUser(profile);
    } catch {
      // ignore
    }
  };

  const updateUser = (updatedData: Partial<StudentProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedData };
      if (localStorage.getItem('is_demo_mode') === 'true') {
        localStorage.setItem('demo_user_profile', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginAsDemo,
        logout,
        refreshUser,
        updateUser,
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
