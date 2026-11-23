import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Users, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SEO } from '@/components/common/SEO';
import { ratingService } from '@/services/rating.service';
import { RatingItem } from '@/types/rating.types';

export const RatingPage: React.FC = () => {
  const [rating, setRating] = useState<RatingItem[]>([]);
  const [scope, setScope] = useState<'group' | 'all'>('group');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRating();
  }, [scope]);

  const loadRating = async () => {
    setLoading(true);
    try {
      const data = await ratingService.getRating({ scope });
      setRating(data || []);
    } finally {
      setLoading(false);
    }
  };

  const top3 = rating.slice(0, 3);
  const first = top3.find((r) => r.rank === 1);
  const second = top3.find((r) => r.rank === 2);
  const third = top3.find((r) => r.rank === 3);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="Talabalar reytingi"
        description="3-Politexnikum talabalarining umumiy o'zlashtirish va davomat bo'yicha akademik reytingi."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Talabalar reytingi</h2>
          <p className="text-sm text-muted-foreground">
            O'rtacha baho va davomat ko'rsatkichlari bo'yicha talabalar peshqadamligi (REST API)
          </p>
        </div>

        {/* Scope Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setScope('group')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              scope === 'group'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Guruh bo'yicha
          </button>
          <button
            onClick={() => setScope('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              scope === 'all'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Barcha talabalar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Reyting yuklanmoqda...
        </div>
      ) : rating.length === 0 ? (
        <Card className="py-16 text-center rounded-2xl">
          <CardContent className="space-y-2">
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-semibold text-foreground">Reyting ma'lumotlari topilmadi</p>
            <p className="text-xs text-muted-foreground">Hozircha baholash jurnali bo'yicha reyting hisoblanmagan.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Top 3 Podium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* 2nd Place */}
            {second && (
              <Card className="order-2 md:order-1 relative overflow-hidden border-border/80 bg-gradient-to-t from-slate-500/5 to-transparent text-center p-6 flex flex-col items-center justify-between shadow-sm rounded-2xl">
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <Avatar className="h-16 w-16 ring-4 ring-slate-400/40">
                      <AvatarFallback className="bg-slate-500/20 text-slate-600 dark:text-slate-300 font-bold text-lg">
                        {second.full_name?.[0] || '2'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-slate-400 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      2
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{second.full_name}</h4>
                    <p className="text-xs text-muted-foreground">{second.group}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 w-full flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">O'rtacha ball</span>
                    <span className="font-bold text-foreground text-sm">{second.average_grade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Davomat</span>
                    <span className="font-bold text-foreground text-sm">{second.attendance_rate}%</span>
                  </div>
                </div>
              </Card>
            )}

            {/* 1st Place */}
            {first && (
              <Card className="order-1 md:order-2 relative overflow-hidden border-amber-500/50 bg-gradient-to-t from-amber-500/10 via-card to-card text-center p-6 flex flex-col items-center justify-between shadow-lg shadow-amber-500/10 scale-100 md:-translate-y-2 rounded-2xl">
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <Crown className="h-6 w-6 text-amber-500 mx-auto mb-1 animate-bounce" />
                    <Avatar className="h-20 w-20 ring-4 ring-amber-500/60 shadow-lg">
                      <AvatarFallback className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xl">
                        {first.full_name?.[0] || '1'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      1
                    </span>
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-500 uppercase tracking-wider mb-1">
                      <Trophy className="h-3 w-3" /> Peshqadam
                    </div>
                    <h4 className="font-extrabold text-base text-foreground">{first.full_name}</h4>
                    <p className="text-xs text-muted-foreground">{first.group}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 w-full flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">O'rtacha ball</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-base">
                      {first.average_grade}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Davomat</span>
                    <span className="font-bold text-foreground text-base">{first.attendance_rate}%</span>
                  </div>
                </div>
              </Card>
            )}

            {/* 3rd Place */}
            {third && (
              <Card className="order-3 relative overflow-hidden border-border/80 bg-gradient-to-t from-amber-700/5 to-transparent text-center p-6 flex flex-col items-center justify-between shadow-sm rounded-2xl">
                <div className="space-y-3">
                  <div className="relative inline-block">
                    <Avatar className="h-16 w-16 ring-4 ring-amber-700/40">
                      <AvatarFallback className="bg-amber-700/20 text-amber-700 dark:text-amber-500 font-bold text-lg">
                        {third.full_name?.[0] || '3'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs shadow-md">
                      3
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{third.full_name}</h4>
                    <p className="text-xs text-muted-foreground">{third.group}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 w-full flex items-center justify-around text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">O'rtacha ball</span>
                    <span className="font-bold text-foreground text-sm">{third.average_grade}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Davomat</span>
                    <span className="font-bold text-foreground text-sm">{third.attendance_rate}%</span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Leaderboard Table */}
          <Card className="shadow-sm rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Reyting jadvali
              </CardTitle>
              <CardDescription className="text-xs">
                O'rtacha baho bo'yicha saralangan talabalar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground text-[11px] uppercase tracking-wider font-semibold">
                      <th className="py-3 px-3">O'rin</th>
                      <th className="py-3 px-3">Talaba F.I.Sh</th>
                      <th className="py-3 px-3">Guruh</th>
                      <th className="py-3 px-3">Davomat</th>
                      <th className="py-3 px-3">Topshiriqlar</th>
                      <th className="py-3 px-3 text-right">O'rtacha ball</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {rating.map((item) => (
                      <tr
                        key={item.student_id || item.rank}
                        className={`transition-colors ${
                          item.is_current_user
                            ? 'bg-primary/10 font-semibold border-l-4 border-l-primary'
                            : 'hover:bg-muted/30'
                        }`}
                      >
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-1.5 font-bold font-mono">
                            {item.rank === 1 ? '🥇' : item.rank === 2 ? '🥈' : item.rank === 3 ? '🥉' : `#${item.rank}`}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-foreground">
                          {item.full_name}
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground font-mono">{item.group}</td>
                        <td className="py-3.5 px-3 text-muted-foreground font-mono">
                          {item.attendance_rate}%
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">
                          {item.completed_assignments ?? 0} ta
                        </td>
                        <td className="py-3.5 px-3 text-right font-bold font-mono text-primary">
                          {item.average_grade}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
