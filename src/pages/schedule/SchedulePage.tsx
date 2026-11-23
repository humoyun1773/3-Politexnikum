import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Sparkles, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { scheduleService } from '@/services/student.service';
import { Lesson, WeekdayEnum } from '@/types/api.types';
import { formatTime } from '@/lib/utils';

const weekdays = [
  { id: 1, name: 'Dushanba' },
  { id: 2, name: 'Seshanba' },
  { id: 3, name: 'Chorshanba' },
  { id: 4, name: 'Payshanba' },
  { id: 5, name: 'Juma' },
  { id: 6, name: 'Shanba' },
];

export const SchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(() => {
    const today = new Date().getDay();
    return today >= 1 && today <= 6 ? today : 1;
  });
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule(selectedDay);
  }, [selectedDay]);

  const loadSchedule = async (day: number) => {
    setLoading(true);
    try {
      const data = await scheduleService.getSchedule(day);
      setLessons(data);
      const next = await scheduleService.getNextLesson();
      setNextLesson(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Dars jadvali"
        description="3-Politexnikum haftalik va kunlik dars jadvali - vaqtlar, xonalar va o'qituvchilar."
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dars jadvali</h2>
          <p className="text-sm text-muted-foreground">
            2026-yil Kuzgi semestr dars mashg'ulotlari jadvali (Guruh: AT-21/1)
          </p>
        </div>

        {nextLesson && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-xs">
              <span className="font-semibold text-primary block">Keyingi dars:</span>
              <span className="text-foreground font-medium">{nextLesson.subject}</span>
              <span className="text-muted-foreground ml-1.5 font-mono">({formatTime(nextLesson.start_time)})</span>
            </div>
          </div>
        )}
      </div>

      {/* Weekday Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {weekdays.map((day) => {
          const isSelected = selectedDay === day.id;
          return (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-[1.02]'
                  : 'bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              {day.name}
            </button>
          );
        })}
      </div>

      {/* Lessons List */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              {weekdays.find((d) => d.id === selectedDay)?.name} kungi darslar
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {lessons.length} ta mashg'ulot
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Mashg'ulotlar 80 daqiqa davom etadi. Darsga kechikmasdan kelish so'raladi.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Yuklanmoqda...
            </div>
          ) : lessons.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Ushbu kunga darslar belgilanmagan (Dam olish kuni).
            </div>
          ) : (
            lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/80 bg-card hover:bg-accent/40 transition-all gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base text-foreground">
                      {lesson.subject}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-blue-500" />
                        {lesson.teacher}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <MapPin className="h-3.5 w-3.5 text-rose-500" />
                        Xona: {lesson.room || 'Noma\'lum'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-border/50">
                  <div className="flex items-center gap-2 bg-muted/60 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {formatTime(lesson.start_time)} - {formatTime(lesson.end_time)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    80 daqiqa
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};
