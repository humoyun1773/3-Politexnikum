import React from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

// Page components
import { LoginPage } from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { SchedulePage } from '@/pages/schedule/SchedulePage';
import { GradesPage } from '@/pages/grades/GradesPage';
import { AttendancePage } from '@/pages/attendance/AttendancePage';
import { AssignmentsPage } from '@/pages/assignments/AssignmentsPage';
import { RatingPage } from '@/pages/rating/RatingPage';
import { ChatPage } from '@/pages/chat/ChatPage';
import { LibraryPage } from '@/pages/library/LibraryPage';
import { AnnouncementsPage } from '@/pages/announcements/AnnouncementsPage';
import { GoalsPage } from '@/pages/goals/GoalsPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

// Protected Route Guard
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" replace />;
};

// Public Route Guard (Redirects away from /login if already logged in)
const PublicRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export const router = createBrowserRouter([
  // Public Login Route
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  // Protected Dashboard Routes (No landing page, direct dashboard)
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'schedule',
        element: <SchedulePage />,
      },
      {
        path: 'grades',
        element: <GradesPage />,
      },
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
      {
        path: 'assignments',
        element: <AssignmentsPage />,
      },
      {
        path: 'rating',
        element: <RatingPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'library',
        element: <LibraryPage />,
      },
      {
        path: 'announcements',
        element: <AnnouncementsPage />,
      },
      {
        path: 'goals',
        element: <GoalsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },

  // 404 Route
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
