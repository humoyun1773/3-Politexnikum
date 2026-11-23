import React, { useState, useEffect } from 'react';
import { FileCheck2, Calendar, CheckCircle2, Upload, Inbox, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { SEO } from '@/components/common/SEO';
import { assignmentsService } from '@/services/assignments.service';
import { Assignment } from '@/types/assignments.types';
import { formatDate } from '@/lib/utils';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'submitted'>('all');
  const [loading, setLoading] = useState(true);

  // Submit modal state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitFileUrl, setSubmitFileUrl] = useState('');
  const [submitNote, setSubmitNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const data = await assignmentsService.getAssignments();
      setAssignments(data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSubmit = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setSubmitFileUrl('');
    setSubmitNote('');
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    try {
      await assignmentsService.submitAssignment(selectedAssignment.id, {
        file_url: submitFileUrl,
        note: submitNote,
      });
      setSubmitSuccess(true);
      setAssignments((prev) =>
        prev.map((a) => (a.id === selectedAssignment.id ? { ...a, submitted: true } : a))
      );
      setTimeout(() => {
        setSelectedAssignment(null);
        setSubmitSuccess(false);
      }, 1500);
    } catch {
      alert("Topshiriqni yuborishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'active') return !a.submitted;
    if (filter === 'submitted') return !!a.submitted;
    return true;
  });

  const getKindBadge = (kind: string, display: string) => {
    switch (kind) {
      case 'bsb':
        return <Badge variant="destructive">{display || 'BSB'}</Badge>;
      case 'control':
        return <Badge variant="warning">{display || 'Nazorat'}</Badge>;
      case 'practice':
        return <Badge variant="info">{display || 'Amaliyot'}</Badge>;
      case 'test':
        return <Badge variant="purple">{display || 'Test'}</Badge>;
      default:
        return <Badge variant="outline">{display}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Topshiriqlar & Amaliyot"
        description="3-Politexnikum talaba amaliy ishlari, BSB, nazorat topshiriqlari va muddatlari."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Topshiriqlar & BSB</h2>
          <p className="text-sm text-muted-foreground">
            Fanlar bo'yicha mustaqil ish, amaliy topshiriqlar va nazorat muddatlari (REST API)
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Barchasi ({assignments.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'active'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Faol ({assignments.filter((a) => !a.submitted).length})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'submitted'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Topshirilgan ({assignments.filter((a) => a.submitted).length})
          </button>
        </div>
      </div>

      {/* Assignments Cards Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Yuklanmoqda...
        </div>
      ) : filteredAssignments.length === 0 ? (
        <Card className="py-16 text-center rounded-2xl">
          <CardContent className="space-y-2">
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-semibold text-foreground">Topshiriqlar mavjud emas</p>
            <p className="text-xs text-muted-foreground">API dan hech qanday vazifa qaytarilmadi.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => (
            <Card
              key={assignment.id}
              className={`hover:border-primary/50 transition-all rounded-2xl shadow-sm ${
                assignment.submitted ? 'bg-card/60' : 'bg-card'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-primary block">
                      {assignment.subject}
                    </span>
                    <CardTitle className="text-base font-bold leading-snug">
                      {assignment.title}
                    </CardTitle>
                  </div>
                  {getKindBadge(assignment.kind, assignment.kind_display)}
                </div>
                {assignment.description && (
                  <CardDescription className="text-xs line-clamp-2 mt-1">
                    {assignment.description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/60">
                  <span className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Muddat: {formatDate(assignment.due_date)}
                  </span>
                  <span
                    className={`font-semibold ${
                      assignment.submitted
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {assignment.submitted ? 'Topshirilgan' : assignment.days_left}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Maksimal ball: <strong className="text-foreground">{assignment.max_score || 100}</strong>
                  </span>

                  {assignment.submitted ? (
                    <Badge variant="success" className="gap-1 py-1 px-3">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Qabul qilingan
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      className="rounded-xl text-xs gap-1.5 h-8 font-semibold shadow-xs"
                      onClick={() => handleOpenSubmit(assignment)}
                    >
                      <Upload className="h-3.5 w-3.5" /> Topshirish
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Submission Dialog Modal */}
      {selectedAssignment && (
        <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
          <DialogContent className="max-w-md rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Vazifani topshirish</DialogTitle>
              <DialogDescription className="text-xs">
                {selectedAssignment.subject} — {selectedAssignment.title}
              </DialogDescription>
            </DialogHeader>

            {submitSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-base text-foreground">Topshiriq yuborildi!</h4>
                <p className="text-xs text-muted-foreground">
                  O'qituvchi tekshirib chiqqach natijangiz tizimda e'lon qilinadi.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Loyiha / Fayl havolasi (GitHub yoki Drive)
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="url"
                      value={submitFileUrl}
                      onChange={(e) => setSubmitFileUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="pl-9 h-10 rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Izoh yoki qaydlar
                  </label>
                  <textarea
                    value={submitNote}
                    onChange={(e) => setSubmitNote(e.target.value)}
                    placeholder="O'qituvchiga xabar..."
                    rows={3}
                    className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <DialogFooter className="gap-2 sm:gap-0 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedAssignment(null)}
                    className="rounded-xl text-xs"
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    type="submit"
                    variant="gradient"
                    className="rounded-xl text-xs font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Yuborilmoqda...' : 'Topshiriqni yuborish'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
