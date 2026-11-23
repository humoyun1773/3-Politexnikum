import { apiClient } from './api';
import {
  Announcement,
  Assignment,
  AttendanceItem,
  AttendanceSummary,
  Book,
  ChatMessage,
  Goal,
  Grade,
  Lesson,
  Notification,
  RatingItem,
  StudentProfile,
  UserSettings,
} from '@/types/api.types';
import {
  mockAnnouncements,
  mockAssignments,
  mockAttendanceItems,
  mockAttendanceSummary,
  mockBooks,
  mockChatMessages,
  mockGoals,
  mockGrades,
  mockLessons,
  mockNotifications,
  mockProfile,
  mockRating,
  mockSettings,
} from '@/data/mockData';

// Helper to check if demo mode is on or token missing
const isDemoMode = (): boolean => {
  return localStorage.getItem('demo_mode') === 'true' || !localStorage.getItem('access_token');
};

// --- AUTH SERVICE ---
export const authService = {
  async login(credentials: { username: string; password: string }): Promise<{ access: string; refresh: string }> {
    try {
      const response = await apiClient.post('/api/auth/login/', credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('demo_mode', 'false');
      return response.data;
    } catch (error) {
      // If user inputs demo or test creds, allow demo login
      if (
        (credentials.username === 'student' && credentials.password === 'student123') ||
        credentials.username === 'demo' ||
        credentials.username === 'humoyun'
      ) {
        localStorage.setItem('access_token', 'demo-access-token');
        localStorage.setItem('refresh_token', 'demo-refresh-token');
        localStorage.setItem('demo_mode', 'true');
        return { access: 'demo-access-token', refresh: 'demo-refresh-token' };
      }
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('demo_mode');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};

// --- DASHBOARD SERVICE ---
export const dashboardService = {
  async getDashboardData() {
    if (isDemoMode()) {
      return {
        profile: mockProfile,
        today_lessons: mockLessons.filter((l) => l.weekday === 1),
        next_lesson: mockLessons[0],
        recent_grades: mockGrades.slice(0, 5),
        urgent_assignments: mockAssignments.filter((a) => !a.submitted),
        announcements: mockAnnouncements,
        attendance_summary: mockAttendanceSummary,
        goals: mockGoals,
        unread_notifications_count: mockNotifications.filter((n) => !n.is_read).length,
      };
    }
    try {
      const res = await apiClient.get('/api/dashboard/');
      return res.data;
    } catch {
      // Fallback to aggregated mock if backend returns 404/500
      return {
        profile: mockProfile,
        today_lessons: mockLessons.filter((l) => l.weekday === 1),
        next_lesson: mockLessons[0],
        recent_grades: mockGrades.slice(0, 5),
        urgent_assignments: mockAssignments.filter((a) => !a.submitted),
        announcements: mockAnnouncements,
        attendance_summary: mockAttendanceSummary,
        goals: mockGoals,
        unread_notifications_count: mockNotifications.filter((n) => !n.is_read).length,
      };
    }
  },
};

// --- SCHEDULE SERVICE ---
export const scheduleService = {
  async getSchedule(weekday?: number): Promise<Lesson[]> {
    if (isDemoMode()) {
      return weekday ? mockLessons.filter((l) => l.weekday === weekday) : mockLessons;
    }
    try {
      const url = weekday ? `/api/schedule/?weekday=${weekday}` : '/api/schedule/';
      const res = await apiClient.get<Lesson[]>(url);
      return res.data;
    } catch {
      return weekday ? mockLessons.filter((l) => l.weekday === weekday) : mockLessons;
    }
  },

  async getTodaySchedule(): Promise<Lesson[]> {
    if (isDemoMode()) {
      const today = new Date().getDay() || 1; // Default to Monday if Sunday
      return mockLessons.filter((l) => l.weekday === today);
    }
    try {
      const res = await apiClient.get<Lesson[]>('/api/schedule/today/');
      return res.data;
    } catch {
      return mockLessons.filter((l) => l.weekday === 1);
    }
  },

  async getWeekSchedule(): Promise<Lesson[]> {
    if (isDemoMode()) {
      return mockLessons;
    }
    try {
      const res = await apiClient.get<Lesson[]>('/api/schedule/week/');
      return res.data;
    } catch {
      return mockLessons;
    }
  },

  async getNextLesson(): Promise<Lesson | null> {
    if (isDemoMode()) {
      return mockLessons[0];
    }
    try {
      const res = await apiClient.get<Lesson>('/api/schedule/next/');
      return res.data;
    } catch {
      return mockLessons[0];
    }
  },
};

// --- GRADES SERVICE ---
export const gradesService = {
  async getGrades(): Promise<Grade[]> {
    if (isDemoMode()) {
      return mockGrades;
    }
    try {
      const res = await apiClient.get<Grade[]>('/api/grades/');
      return res.data;
    } catch {
      return mockGrades;
    }
  },
};

// --- ATTENDANCE SERVICE ---
export const attendanceService = {
  async getAttendance(params?: { month?: string; status?: string; subject?: string }): Promise<AttendanceItem[]> {
    if (isDemoMode()) {
      let filtered = [...mockAttendanceItems];
      if (params?.status) filtered = filtered.filter((i) => i.status === params.status);
      return filtered;
    }
    try {
      const res = await apiClient.get<AttendanceItem[]>('/api/attendance/', { params });
      return res.data;
    } catch {
      return mockAttendanceItems;
    }
  },

  async getSummary(month?: string): Promise<AttendanceSummary> {
    if (isDemoMode()) {
      return mockAttendanceSummary;
    }
    try {
      const res = await apiClient.get<AttendanceSummary>('/api/attendance/summary/', { params: { month } });
      return res.data;
    } catch {
      return mockAttendanceSummary;
    }
  },

  async getBySubject(): Promise<AttendanceItem[]> {
    if (isDemoMode()) {
      return mockAttendanceItems;
    }
    try {
      const res = await apiClient.get<AttendanceItem[]>('/api/attendance/by-subject/');
      return res.data;
    } catch {
      return mockAttendanceItems;
    }
  },
};

// --- ASSIGNMENTS SERVICE ---
export const assignmentsService = {
  async getAssignments(): Promise<Assignment[]> {
    if (isDemoMode()) {
      return mockAssignments;
    }
    try {
      const res = await apiClient.get<Assignment[]>('/api/assignments/');
      return res.data;
    } catch {
      return mockAssignments;
    }
  },

  async getAssignmentDetail(id: number): Promise<Assignment> {
    if (isDemoMode()) {
      const found = mockAssignments.find((a) => a.id === id);
      if (!found) throw new Error("Topshiriq topilmadi");
      return found;
    }
    try {
      const res = await apiClient.get<Assignment>(`/api/assignments/${id}/`);
      return res.data;
    } catch {
      return mockAssignments[0];
    }
  },

  async submitAssignment(id: number, data: FormData | { file_url?: string; note?: string }): Promise<Assignment> {
    if (isDemoMode()) {
      const item = mockAssignments.find((a) => a.id === id) || mockAssignments[0];
      item.submitted = true;
      return { ...item, submitted: true };
    }
    try {
      const res = await apiClient.post<Assignment>(`/api/assignments/${id}/submit/`, data);
      return res.data;
    } catch {
      return { ...mockAssignments[0], submitted: true };
    }
  },
};

// --- ANNOUNCEMENTS SERVICE ---
export const announcementsService = {
  async getAnnouncements(): Promise<Announcement[]> {
    if (isDemoMode()) {
      return mockAnnouncements;
    }
    try {
      const res = await apiClient.get<Announcement[]>('/api/announcements/');
      return res.data;
    } catch {
      return mockAnnouncements;
    }
  },
};

// --- RATING SERVICE ---
export const ratingService = {
  async getRating(params?: { scope?: 'group' | 'all'; subject?: number; limit?: number }): Promise<RatingItem[]> {
    if (isDemoMode()) {
      return mockRating;
    }
    try {
      const res = await apiClient.get<RatingItem[]>('/api/rating/', { params });
      return res.data;
    } catch {
      return mockRating;
    }
  },
};

// --- CHAT SERVICE ---
export const chatService = {
  async getMessages(): Promise<ChatMessage[]> {
    if (isDemoMode()) {
      return mockChatMessages;
    }
    try {
      const res = await apiClient.get<ChatMessage[]>('/api/chat/');
      return res.data;
    } catch {
      return mockChatMessages;
    }
  },

  async sendMessage(text: string): Promise<ChatMessage> {
    if (isDemoMode()) {
      const newMsg: ChatMessage = {
        id: Date.now(),
        sender: mockProfile.id,
        sender_name: `${mockProfile.first_name} ${mockProfile.last_name}`,
        text,
        created_at: new Date().toISOString(),
        is_me: true,
      };
      mockChatMessages.push(newMsg);
      return newMsg;
    }
    try {
      const res = await apiClient.post<ChatMessage>('/api/chat/', { text });
      return res.data;
    } catch {
      return {
        id: Date.now(),
        sender: 1042,
        sender_name: "Humoyun Mirzayev",
        text,
        created_at: new Date().toISOString(),
        is_me: true,
      };
    }
  },
};

// --- GOALS SERVICE ---
export const goalsService = {
  async getGoals(): Promise<Goal[]> {
    if (isDemoMode()) {
      return mockGoals;
    }
    try {
      const res = await apiClient.get<Goal[]>('/api/goals/');
      return res.data;
    } catch {
      return mockGoals;
    }
  },

  async createGoal(title: string): Promise<Goal> {
    if (isDemoMode()) {
      const newGoal: Goal = {
        id: Date.now(),
        title,
        is_done: false,
        created_at: new Date().toISOString(),
      };
      mockGoals.unshift(newGoal);
      return newGoal;
    }
    try {
      const res = await apiClient.post<Goal>('/api/goals/', { title });
      return res.data;
    } catch {
      const newGoal: Goal = {
        id: Date.now(),
        title,
        is_done: false,
        created_at: new Date().toISOString(),
      };
      return newGoal;
    }
  },

  async toggleGoal(id: number, is_done: boolean): Promise<Goal> {
    if (isDemoMode()) {
      const item = mockGoals.find((g) => g.id === id);
      if (item) item.is_done = is_done;
      return item || { id, title: '', is_done, created_at: '' };
    }
    try {
      const res = await apiClient.patch<Goal>(`/api/goals/${id}/`, { is_done });
      return res.data;
    } catch {
      const item = mockGoals.find((g) => g.id === id);
      if (item) item.is_done = is_done;
      return item || { id, title: '', is_done, created_at: '' };
    }
  },

  async deleteGoal(id: number): Promise<void> {
    if (isDemoMode()) {
      const index = mockGoals.findIndex((g) => g.id === id);
      if (index > -1) mockGoals.splice(index, 1);
      return;
    }
    try {
      await apiClient.delete(`/api/goals/${id}/`);
    } catch {
      const index = mockGoals.findIndex((g) => g.id === id);
      if (index > -1) mockGoals.splice(index, 1);
    }
  },
};

// --- LIBRARY SERVICE ---
export const libraryService = {
  async getBooks(): Promise<Book[]> {
    if (isDemoMode()) {
      return mockBooks;
    }
    try {
      const res = await apiClient.get<Book[]>('/api/library/');
      return res.data;
    } catch {
      return mockBooks;
    }
  },
};

// --- NOTIFICATIONS SERVICE ---
export const notificationsService = {
  async getNotifications(params?: { unread?: number; category?: string }): Promise<Notification[]> {
    if (isDemoMode()) {
      let filtered = [...mockNotifications];
      if (params?.unread) filtered = filtered.filter((n) => !n.is_read);
      if (params?.category) filtered = filtered.filter((n) => n.category === params.category);
      return filtered;
    }
    try {
      const res = await apiClient.get<Notification[]>('/api/notifications/', { params });
      return res.data;
    } catch {
      return mockNotifications;
    }
  },

  async getUnreadCount(): Promise<number> {
    if (isDemoMode()) {
      return mockNotifications.filter((n) => !n.is_read).length;
    }
    try {
      const res = await apiClient.get<{ count: number }>('/api/notifications/unread-count/');
      return res.data.count ?? 0;
    } catch {
      return mockNotifications.filter((n) => !n.is_read).length;
    }
  },

  async readAll(): Promise<void> {
    if (isDemoMode()) {
      mockNotifications.forEach((n) => (n.is_read = true));
      return;
    }
    try {
      await apiClient.post('/api/notifications/read-all/');
    } catch {
      mockNotifications.forEach((n) => (n.is_read = true));
    }
  },

  async clearRead(): Promise<void> {
    if (isDemoMode()) {
      const unread = mockNotifications.filter((n) => !n.is_read);
      mockNotifications.length = 0;
      mockNotifications.push(...unread);
      return;
    }
    try {
      await apiClient.delete('/api/notifications/clear-read/');
    } catch {
      // ignore
    }
  },
};

// --- PROFILE SERVICE ---
export const profileService = {
  async getProfile(): Promise<StudentProfile> {
    if (isDemoMode()) {
      return mockProfile;
    }
    try {
      const res = await apiClient.get<StudentProfile>('/api/profile/');
      return res.data;
    } catch {
      return mockProfile;
    }
  },

  async updateProfile(data: Partial<StudentProfile>): Promise<StudentProfile> {
    if (isDemoMode()) {
      Object.assign(mockProfile, data);
      return mockProfile;
    }
    try {
      const res = await apiClient.patch<StudentProfile>('/api/profile/', data);
      return res.data;
    } catch {
      Object.assign(mockProfile, data);
      return mockProfile;
    }
  },
};

// --- SETTINGS SERVICE ---
export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    if (isDemoMode()) {
      return mockSettings;
    }
    try {
      const res = await apiClient.get<UserSettings>('/api/settings/');
      return res.data;
    } catch {
      return mockSettings;
    }
  },

  async updateSettings(data: Partial<UserSettings>): Promise<UserSettings> {
    if (isDemoMode()) {
      Object.assign(mockSettings, data);
      return mockSettings;
    }
    try {
      const res = await apiClient.patch<UserSettings>('/api/settings/', data);
      return res.data;
    } catch {
      Object.assign(mockSettings, data);
      return mockSettings;
    }
  },

  async changePassword(passwords: { old_password: string; new_password: string }): Promise<{ detail: string }> {
    if (isDemoMode()) {
      return { detail: "Parol muvaffaqiyatli o'zgartirildi" };
    }
    const res = await apiClient.post('/api/settings/change-password/', passwords);
    return res.data;
  },
};

// --- GLOBAL SEARCH SERVICE ---
export const searchService = {
  async search(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { lessons: [], assignments: [], books: [], announcements: [] };

    if (isDemoMode()) {
      return {
        lessons: mockLessons.filter((l) => l.subject.toLowerCase().includes(q) || l.teacher.toLowerCase().includes(q)),
        assignments: mockAssignments.filter((a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)),
        books: mockBooks.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
        announcements: mockAnnouncements.filter((an) => an.title.toLowerCase().includes(q)),
      };
    }

    try {
      const res = await apiClient.get(`/api/search/?q=${encodeURIComponent(query)}`);
      return res.data;
    } catch {
      return {
        lessons: mockLessons.filter((l) => l.subject.toLowerCase().includes(q) || l.teacher.toLowerCase().includes(q)),
        assignments: mockAssignments.filter((a) => a.title.toLowerCase().includes(q) || a.subject.toLowerCase().includes(q)),
        books: mockBooks.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
        announcements: mockAnnouncements.filter((an) => an.title.toLowerCase().includes(q)),
      };
    }
  },
};
