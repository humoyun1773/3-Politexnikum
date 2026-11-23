import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, TrendingUp, Search, Inbox, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { gradesService } from '@/services/grades.service';
import { Grade } from '@/types/grades.types';
import { formatDate, getScoreColor } from '@/lib/utils';

export const GradesPage: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    setLoading(true);
    try {
      const data = await gradesService.getGrades();
      setGrades(data || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredGrades = grades.filter(
    (g) =>
      g.subject.toLowerCase().includes(search.toLowerCase()) ||
      (g.type && g.type.toLowerCase().includes(search.toLowerCase())) ||
      (g.teacher && g.teacher.toLowerCase().includes(search.toLowerCase()))
  );

  const averageScore =
    grades.length > 0
      ? (grades.reduce((acc, g) => acc + g.score, 0) / grades.length).toFixed(1)
      : '0.0';

  const highestScore =
    grades.length > 0 ? Math.max(...grades.map((g) => g.score)) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Baholar & O'zlashtirish"
        description="3-Politexnikum talabaning semestr davomidagi barcha fanlardan olingan baholari va o'zlashtirish ko'rsatkichlari."
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Baholar & O'zlashtirish</h2>
        <p className="text-sm text-muted-foreground">
          Oraliq, yakuniy va joriy nazorat natijalari (Swagger REST API)
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">O'rtacha o'zlashtirish bali</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{averageScore} ball</p>
              <p className="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="h-3 w-3" /> 100 ballik shkala
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <GraduationCap className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Eng yuqori ball</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{highestScore} ball</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Maksimal: 100 ball</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Award className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Baholangan ishlar</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">{grades.length} ta</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Jami qaydlar</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table & Filter */}
      <Card className="shadow-sm rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Baholar qaydnomasi</CardTitle>
            <CardDescription className="text-xs">Barcha baholangan amaliy va nazorat ishlari ro'yxati</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Fan yoki topshiriq qidirish..."
              className="pl-9 h-9 text-xs rounded-xl bg-background/50"
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          ) : filteredGrades.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
              <Inbox className="h-8 w-8 opacity-40" />
              <p>Baholar topilmadi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Fan nomi</th>
                    <th className="py-3 px-3">Topshiriq turi</th>
                    <th className="py-3 px-3">O'qituvchi</th>
                    <th className="py-3 px-3">Sana</th>
                    <th className="py-3 px-3 text-right">Ball</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filteredGrades.map((grade) => {
                    const color = getScoreColor(grade.score);
                    return (
                      <tr key={grade.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-3 font-semibold text-foreground">
                          {grade.subject}
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">
                          {grade.type || 'Amaliyot / Nazorat'}
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">
                          {grade.teacher || 'Kafedra'}
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground font-mono text-xs">
                          {formatDate(grade.date)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg font-bold font-mono text-xs ${color.bg} ${color.text} border ${color.border}`}
                          >
                            {grade.score} ball
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
