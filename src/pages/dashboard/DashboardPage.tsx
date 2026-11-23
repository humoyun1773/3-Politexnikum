import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  GraduationCap,
  ClipboardCheck,
  FileCheck2,
  Trophy,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Plus,
  Sparkles,
  Inbox,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { useAuth } from '@/context/AuthContext';
import {
  dashboardService,
  scheduleService,
  gradesService,
  assignmentsService,
  goalsService,
  announcementsService,
} from '@/services';
import { DashboardData, Lesson, Grade, Assignment, Goal, Announcement } from '@/types';
import { formatDate, formatTime } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [todayLessons, setTodayLessons] = useState<Lesson[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newGoalText, setNewGoalText] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch in parallel directly from real Swagger API
      const [dashRes, schedRes, gradesRes, assignRes, goalsRes, annRes] =
        await Promise.allSettled([
          dashboardService.getDashboardData(),
          scheduleService.getTodaySchedule(),
          gradesService.getGrades(),
          assignmentsService.getAssignments(),
          goalsService.getGoals(),
          announcementsService.getAnnouncements(),
        ]);

      if (dashRes.status === 'fulfilled' && dashRes.value) {
        setData(dashRes.value);
      }
      if (schedRes.status === 'fulfilled') {
        setTodayLessons(schedRes.value || []);
      }
      if (gradesRes.status === 'fulfilled') {
        setGrades(gradesRes.value || []);
      }
      if (assignRes.status === 'fulfilled') {
        setAssignments(assignRes.value || []);
      }
      if (goalsRes.status === 'fulfilled') {
        setGoals(goalsRes.value || []);
      }
      if (annRes.status === 'fulfilled') {
        setAnnouncements(annRes.value || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGoal = async (id: number, currentStatus: boolean) => {
    try {
      const updated = await goalsService.toggleGoal(id, !currentStatus);
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_done: updated.is_done } : g))
      );
    } catch {
      // fallback toggle locally
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_done: !currentStatus } : g))
      );
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    setAddingGoal(true);
    try {
      const created = await goalsService.createGoal({
        title: newGoalText.trim(),
        is_done: false,
      });
      setGoals((prev) => [created, ...prev]);
      setNewGoalText('');
    } catch {
      // ignore
    } finally {
      setAddingGoal(false);
    }
  };

  // Build chart points from real grades
  const gradeChartData =
    grades.length > 0
      ? grades.slice(-7).map((g) => ({
          name: formatDate(g.date) || g.subject,
          score: g.score,
          subject: g.subject,
        }))
      : [];

  const urgentAssignments = assignments.filter((a) => !a.submitted).slice(0, 4);

  // Profile data from API
  const student = data?.profile || user;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Boshqaruv paneli"
        description="3-Politexnikum talabalar dashboardi - GPA, dars jadvali, baholar va topshiriqlar statistikasi."
      />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/15">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-72 w-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 h-56 w-56 rounded-full bg-cyan-400/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-white/95">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>3-Politexnikum Talabalar Portali</span>
            {student?.group && <span>• Guruh: {student.group}</span>}
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Assalomu alaykum, {student?.first_name || 'Talaba'}! 👋
          </h1>

          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xl">
            O'quv jarayoni tahlili, dars jadvali va topshiriqlar nazorati bitta oynada. Barcha ma'lumotlar real vaqtda yangilanmoqda.
          </p>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPA */}
        <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">O'rtacha GPA ko'rsatkichi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {student?.gpa ?? '0.00'}
                </span>
                <span className="text-xs font-semibold text-emerald-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> A'lo
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">5.00 ballik shkala bo'yicha</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <GraduationCap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Davomat */}
        <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Davomat ko'rsatkichi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {student?.attendance_percentage ?? data?.attendance_summary?.attendance_rate ?? 0}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Darslarga to'liq qatnashish</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <ClipboardCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Topshiriqlar */}
        <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Kutilayotgan topshiriqlar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {urgentAssignments.length} ta
                </span>
                {urgentAssignments.length > 0 && (
                  <Badge variant="warning" className="text-[10px] py-0">Faol</Badge>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">Topshirilishi kerak bo'lgan</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <FileCheck2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Reyting */}
        <Card className="hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Akademik o'rni</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  #{student?.rating_position ?? 1}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {student?.total_students ?? 1} talaba
                </span>
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Reyting jadvalida</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <Trophy className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Performance Chart & Assignments + Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <Card className="shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  O'zlashtirish dinamikasi (Baholar)
                </CardTitle>
                <CardDescription className="text-xs">
                  Fanlar bo'yicha eng so'nggi baholangan ballar grafigi
                </CardDescription>
              </div>
              <NavLink to="/grades">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 rounded-lg">
                  Barcha baholar <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent>
              {gradeChartData.length === 0 ? (
                <div className="h-60 flex flex-col items-center justify-center text-xs text-muted-foreground space-y-2">
                  <Inbox className="h-8 w-8 opacity-40" />
                  <p>Hozircha baholangan topshiriqlar mavjud emas</p>
                </div>
              ) : (
                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis domain={[50, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const item = payload[0].payload;
                            return (
                              <div className="bg-popover border border-border p-3 rounded-xl shadow-xl text-xs">
                                <p className="font-bold text-foreground">{item.subject}</p>
                                <p className="text-primary font-extrabold text-sm mt-0.5">{item.score} ball</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">{item.name}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#gradeGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Urgent Assignments Card */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Muddati yaqin vazifalar
                </CardTitle>
                <CardDescription className="text-xs">
                  Yaqin kunlarda topshirilishi kutilayotgan amaliyot va BSB ishlari
                </CardDescription>
              </div>
              <NavLink to="/assignments">
                <Button variant="ghost" size="sm" className="text-xs gap-1 h-8 rounded-lg">
                  Barchasi <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent className="space-y-3">
              {urgentAssignments.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-60" />
                  <p>Barcha topshiriqlar topshirilgan yoki yangi vazifalar belgilanmagan.</p>
                </div>
              ) : (
                urgentAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 hover:bg-muted/20 transition-all gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground truncate">{assignment.title}</span>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">
                          {assignment.kind_display}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{assignment.subject}</p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-semibold text-amber-500 block">
                          {assignment.days_left}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(assignment.due_date)}
                        </span>
                      </div>
                      <NavLink to="/assignments">
                        <Button size="sm" variant="default" className="h-8 rounded-lg text-xs font-semibold">
                          Topshirish
                        </Button>
                      </NavLink>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Schedule, Goals, Announcements */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Bugungi darslar
                </CardTitle>
                <CardDescription className="text-xs">Joriy kun jadvali</CardDescription>
              </div>
              <NavLink to="/schedule">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 rounded-lg">
                  To'liq jadval
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent className="space-y-3">
              {todayLessons.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-8 w-8 opacity-40" />
                  <p>Bugunga dars rejalashtirilmagan</p>
                </div>
              ) : (
                todayLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="relative pl-5 pb-3 border-l-2 border-primary/40 last:border-l-transparent last:pb-0"
                  >
                    <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-primary flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" />
                        {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                      </span>
                      {lesson.room && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                          {lesson.room}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-foreground">{lesson.subject}</p>
                    <p className="text-xs text-muted-foreground">{lesson.teacher}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Goals Checklist with Real API calls */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Shaxsiy maqsadlar</CardTitle>
                <CardDescription className="text-xs">API orqali boshqariluvchi to-do</CardDescription>
              </div>
              <NavLink to="/goals">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2 rounded-lg">
                  Barchasi
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleAddGoal} className="flex gap-2">
                <input
                  type="text"
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  placeholder="Yangi maqsad yozing..."
                  className="flex-1 h-8 rounded-lg border border-input bg-transparent px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={addingGoal}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg text-xs font-semibold"
                  disabled={addingGoal || !newGoalText.trim()}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>

              <div className="space-y-2">
                {goals.length === 0 ? (
                  <p className="py-4 text-center text-xs text-muted-foreground">Maqsadlar mavjud emas</p>
                ) : (
                  goals.slice(0, 4).map((goal) => (
                    <div
                      key={goal.id}
                      onClick={() => handleToggleGoal(goal.id, goal.is_done)}
                      className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/40 cursor-pointer transition-colors group"
                    >
                      <button
                        type="button"
                        className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                          goal.is_done
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/40 group-hover:border-primary'
                        }`}
                      >
                        {goal.is_done && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </button>
                      <span
                        className={`text-xs flex-1 leading-snug ${
                          goal.is_done ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
                        }`}
                      >
                        {goal.title}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Announcements Widget */}
          <Card className="shadow-sm rounded-2xl bg-gradient-to-br from-card to-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" />
                So'nggi dekanat e'loni
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">E'lonlar mavjud emas</p>
              ) : (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-foreground">
                    {announcements[0].title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {announcements[0].text}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{formatDate(announcements[0].created_at)}</span>
                    <NavLink to="/announcements" className="text-primary hover:underline font-semibold">
                      O'qish
                    </NavLink>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
