import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Trash2, Plus, Sparkles, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SEO } from '@/components/common/SEO';
import { goalsService } from '@/services/goals.service';
import { Goal } from '@/types/goals.types';
import { formatDate } from '@/lib/utils';

export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const data = await goalsService.getGoals();
      setGoals(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsAdding(true);
    try {
      const created = await goalsService.createGoal({
        title: newTitle.trim(),
        is_done: false,
      });
      setGoals((prev) => [created, ...prev]);
      setNewTitle('');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggle = async (id: number, currentStatus: boolean) => {
    try {
      const updated = await goalsService.patchGoal(id, { is_done: !currentStatus });
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_done: updated.is_done } : g))
      );
    } catch {
      // toggle locally if needed
      setGoals((prev) =>
        prev.map((g) => (g.id === id ? { ...g, is_done: !currentStatus } : g))
      );
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await goalsService.deleteGoal(id);
      setGoals((prev) => prev.filter((g) => g.id !== id));
    } catch {
      // ignore
    }
  };

  const completedCount = goals.filter((g) => g.is_done).length;
  const progressPercent = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Shaxsiy maqsadlar"
        description="3-Politexnikum talabaning semestr davomidagi shaxsiy ta'lim maqsadlari va to-do ro'yxati."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Shaxsiy maqsadlar</h2>
          <p className="text-sm text-muted-foreground">
            O'quv yili davomida erishmoqchi bo'lgan maqsadlaringiz va amaliy rejalar (CRUD API)
          </p>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="shadow-sm bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 border-primary/20 rounded-2xl">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Umumiy bajarilish progressi
            </span>
            <span className="text-sm font-bold font-mono text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2.5 rounded-full" />
          <p className="text-xs text-muted-foreground">
            Jami {goals.length} ta maqsaddan {completedCount} tasi muvaffaqiyatli bajarildi.
          </p>
        </CardContent>
      </Card>

      {/* Add Goal Form */}
      <Card className="shadow-sm rounded-2xl">
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleAddGoal} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Yangi o'quv maqsadini kiriting (masalan: Ingliz tili B2 sertifikatini olish)..."
              className="h-11 rounded-xl text-xs sm:text-sm bg-background/50"
              disabled={isAdding}
            />
            <Button
              type="submit"
              variant="gradient"
              className="h-11 rounded-xl text-xs sm:text-sm font-semibold shrink-0 gap-2 shadow-md shadow-primary/25"
              disabled={isAdding || !newTitle.trim()}
            >
              <Plus className="h-4 w-4" /> Maqsad qo'shish
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card className="shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Maqsadlar ro'yxati
          </CardTitle>
          <CardDescription className="text-xs">
            Bajarilgan maqsadlarni ustiga bosib belgilang yoki o'chiring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          ) : goals.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
              <Inbox className="h-8 w-8 opacity-40" />
              <p>Hozircha maqsadlar kiritilmagan. Yuqoridagi formadan foydalanib yangi maqsad qo'shing.</p>
            </div>
          ) : (
            goals.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  goal.is_done
                    ? 'border-border/60 bg-muted/20 opacity-70'
                    : 'border-border/80 bg-card hover:border-primary/50'
                }`}
              >
                <div
                  onClick={() => handleToggle(goal.id, goal.is_done)}
                  className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                >
                  <button
                    type="button"
                    className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                      goal.is_done
                        ? 'bg-primary text-primary-foreground'
                        : 'border-2 border-muted-foreground/50 hover:border-primary'
                    }`}
                  >
                    {goal.is_done && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </button>
                  <span
                    className={`text-xs sm:text-sm truncate ${
                      goal.is_done ? 'line-through text-muted-foreground' : 'text-foreground font-medium'
                    }`}
                  >
                    {goal.title}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  {goal.created_at && (
                    <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
                      {formatDate(goal.created_at)}
                    </span>
                  )}
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
