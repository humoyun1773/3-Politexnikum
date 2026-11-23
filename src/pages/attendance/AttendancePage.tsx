import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, Filter, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { attendanceService } from '@/services/attendance.service';
import { AttendanceItem, AttendanceSummary } from '@/types/attendance.types';
import { formatDate } from '@/lib/utils';

export const AttendancePage: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [statusFilter]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : undefined;
      const data = await attendanceService.getAttendance(params);
      setAttendance(data || []);
      const sum = await attendanceService.getSummary();
      setSummary(sum || null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, display: string) => {
    switch (status) {
      case 'present':
        return (
          <Badge variant="success" className="gap-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> {display || 'Keldi'}
          </Badge>
        );
      case 'absent':
        return (
          <Badge variant="destructive" className="gap-1 text-xs">
            <XCircle className="h-3.5 w-3.5" /> {display || 'Qoldirilgan'}
          </Badge>
        );
      case 'late':
        return (
          <Badge variant="warning" className="gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" /> {display || 'Kechikish'}
          </Badge>
        );
      default:
        return <Badge variant="outline">{display}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Davomat jurnali"
        description="3-Politexnikum talaba davomat statistikasi, darsga qatnashish foizi va sababli qoldirishlar."
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Davomat jurnali</h2>
        <p className="text-sm text-muted-foreground">
          Darslarga qatnashish nazorati va davomat ko'rsatkichlari (Swagger REST API)
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Umumiy davomat</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">
                {summary?.attendance_rate ?? 0}%
              </p>
              <p className="text-[11px] text-emerald-500 font-medium mt-0.5">Normativ: &gt; 75%</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/25">
              <ClipboardCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Qatnashgan darslar</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">
                {summary?.present ?? 0} soat
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Jami: {summary?.total_lessons ?? 0} soatdan
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Qoldirilgan darslar</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">
                {summary?.absent ?? 0} soat
              </p>
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">Sababli / Sababsiz</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center shadow-md shadow-rose-500/25">
              <XCircle className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Kechikishlar</p>
              <p className="text-2xl font-extrabold text-foreground mt-1">
                {summary?.late ?? 0} marta
              </p>
              <p className="text-[11px] text-amber-500 font-medium mt-0.5">Qayd etilgan</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/25">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Log Table */}
      <Card className="shadow-sm rounded-2xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle className="text-base font-bold">Davomat qaydlari</CardTitle>
            <CardDescription className="text-xs">Elektron jurnal orqali kiritilgan barcha qaydlar</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" /> Saralash:
            </span>
            <div className="flex gap-1">
              {['all', 'present', 'late', 'absent'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    statusFilter === f
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {f === 'all' ? 'Barchasi' : f === 'present' ? 'Keldi' : f === 'late' ? 'Kechikish' : 'Qoldirilgan'}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          ) : attendance.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center space-y-2">
              <Inbox className="h-8 w-8 opacity-40" />
              <p>Davomat qaydlari topilmadi.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Fan nomi</th>
                    <th className="py-3 px-3">Sana</th>
                    <th className="py-3 px-3 text-right">Holati</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {attendance.map((item) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 px-3 font-semibold text-foreground">
                        {item.subject}
                      </td>
                      <td className="py-3.5 px-3 text-muted-foreground font-mono text-xs">
                        {formatDate(item.date)}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        {getStatusBadge(item.status, item.status_display)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
