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
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SEO } from '@/components/common/SEO';
import { useAuth } from '@/context/AuthContext';
import { dashboardService, goalsService } from '@/services/student.service';
import { DashboardData, Goal } from '@/types/api.types';
import { formatDate, formatTime, getScoreColor } from '@/lib/utils';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [newGoalText, setNewGoalText] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(false);
    try {
      const res = await dashboardService.getDashboardData();
      setData(res);
      setGoals(res.goals || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGoal = async (id: number, currentStatus: boolean) => {
    const updated = await goalsService.toggleGoal(id, !currentStatus);
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, is_done: updated.is_done } : g)));
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    const created = await goalsService.createGoal(newGoalText.trim());
    setGoals((prev) => [created, ...prev]);
    setNewGoalText('');
  };

  // Chart data formatted from recent grades
  const gradeChartData = [
    { name: 'Okt 15', score: 85, subject: 'Algoritmlar' },
    { name: 'Okt 25', score: 88, subject: 'Tarmoqlar' },
    { name: 'Noy 02', score: 94, subject: 'Ingliz tili' },
    { name: 'Noy 05', score: 98, subject: 'Mobil ilova' },
    { name: 'Noy 12', score: 90, subject: 'Algoritmlar' },
    { name: 'Noy 18', score: 88, subject: 'Baza & SQL' },
    { name: 'Noy 20', score: 95, subject: 'React Web' },
  ];

  if (loading || !data) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Boshqaruv paneli yuklanmoqda...</p>
      </div>
    );
  }

  const profile = data.profile || user;

  return (
    <div className="space-y-6">
      <SEO
        title="Boshqaruv paneli"
        description="3-Politexnikum talabalar dashboardi - GPA, dars jadvali, baholar va topshiriqlar statistikasi."
      />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold text-blue-100">
            <span>Guruh: {profile?.group || 'AT-21/1'}</span> • <span>{profile?.course || 3}-bosqich talabasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Xush kelibsiz, {profile?.first_name || 'Talaba'}! 👋
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Bugungi dars jadvalingiz bilan tanishing, topshiriqlarni o'z vaqtida topshiring va o'zlashtirish reytingingizni oshiring.
          </p>
        </div>
      </div>

      {/* 4 Key Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GPA */}
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">O'rtacha GPA ko'rsatkichi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {profile?.gpa || '4.82'}
                </span>
                <span className="text-xs font-semibold text-emerald-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" /> +0.12
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">Maksimal: 5.00 ball</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GraduationCap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Davomat */}
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Davomat ko'rsatkichi</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {data.attendance_summary?.attendance_rate || 96.4}%
                </span>
                <span className="text-xs font-semibold text-emerald-500">A'lo</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                {data.attendance_summary?.present || 108} ta darsda qatnashgan
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ClipboardCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Faol Topshiriqlar */}
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Faol topshiriqlar</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  {data.urgent_assignments?.length || 3} ta
                </span>
                <Badge variant="warning" className="text-[10px] py-0">Muddati yaqin</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">Yaqin 7 kun ichida</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* Reyting o'rni */}
        <Card className="hover:border-primary/50 transition-colors shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Guruh reytingida</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground">
                  #{profile?.rating_position || 3}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  / {profile?.total_students || 180} talaba
                </span>
              </div>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Top 3% ichida</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Today's Schedule + Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Performance Chart & Urgent Assignments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base font-bold">O'zlashtirish dinamikasi (Baholar)</CardTitle>
                <CardDescription className="text-xs">So'nggi nazorat va amaliy topshiriqlar bo'yicha ballar grafigi</CardDescription>
              </div>
              <NavLink to="/grades">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Barcha baholar <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gradeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradeColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-popover border border-border p-2.5 rounded-xl shadow-lg text-xs">
                              <p className="font-semibold text-foreground">{item.subject}</p>
                              <p className="text-primary font-bold">{item.score} ball</p>
                              <p className="text-muted-foreground">{item.name}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#gradeColor)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Urgent Assignments Card */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Topshirish muddati yaqin vazifalar</CardTitle>
                <CardDescription className="text-xs">Ushbu hafta topshirilishi lozim bo'lgan amaliy ishlar</CardDescription>
              </div>
              <NavLink to="/assignments">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  Barchasi <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.urgent_assignments?.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/40 transition-colors gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground truncate">{assignment.title}</span>
                      <Badge variant="outline" className="text-[10px] uppercase font-bold shrink-0">
                        {assignment.kind_display}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-semibold text-amber-500 block">
                        {assignment.days_left}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Muddati: {formatDate(assignment.due_date)}
                      </span>
                    </div>
                    <NavLink to={`/assignments`}>
                      <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-medium">
                        Topshirish
                      </Button>
                    </NavLink>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Today's Schedule & Goals Checklist */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Bugungi darslar
                </CardTitle>
                <CardDescription className="text-xs">Dushanba kungi mashg'ulotlar</CardDescription>
              </div>
              <NavLink to="/schedule">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
                  Jadval
                </Button>
              </NavLink>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.today_lessons?.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  Bugunga dars rejalashtirilmagan
                </div>
              ) : (
                data.today_lessons?.map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="relative pl-5 pb-3 border-l-2 border-primary/40 last:border-l-transparent last:pb-0"
                  >
                    <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-semibold text-primary flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        {lesson.room || 'Xona noma\'lum'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{lesson.subject}</p>
                    <p className="text-xs text-muted-foreground">{lesson.teacher}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Personal Goals Checklist */}
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Haftalik maqsadlarim</CardTitle>
                <CardDescription className="text-xs">Shaxsiy rejalar va to-do ro'yxati</CardDescription>
              </div>
              <NavLink to="/goals">
                <Button variant="ghost" size="sm" className="h-7 text-xs px-2">
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
                />
                <Button type="submit" size="sm" className="h-8 px-2.5 rounded-lg text-xs">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </form>

              <div className="space-y-2">
                {goals.slice(0, 4).map((goal) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements Quick Widget */}
          <Card className="shadow-sm bg-gradient-to-br from-card to-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                So'nggi e'lon
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.announcements?.[0] && (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground">
                    {data.announcements[0].title}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-3">
                    {data.announcements[0].text}
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{formatDate(data.announcements[0].created_at)}</span>
                    <NavLink to="/announcements" className="text-primary hover:underline font-medium">
                      Batafsil o'qish
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
