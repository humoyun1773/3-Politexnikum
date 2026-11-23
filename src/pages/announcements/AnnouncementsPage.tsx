import React, { useState, useEffect } from 'react';
import { Bell, Calendar, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { announcementsService } from '@/services/announcements.service';
import { Announcement } from '@/types/announcements.types';
import { formatDate } from '@/lib/utils';

export const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await announcementsService.getAnnouncements();
      setAnnouncements(data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <SEO
        title="E'lonlar & Yangiliklar"
        description="3-Politexnikum rasmiy e'lonlari, imtihon muddatlari va talabalar uchun muhim xabarlar."
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">E'lonlar & Yangiliklar</h2>
        <p className="text-sm text-muted-foreground">
          Politexnikum ma'muriyati va dekanat tomonidan berilgan rasmiy xabarlar (Swagger API)
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-muted-foreground flex justify-center items-center gap-2">
          <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Yuklanmoqda...
        </div>
      ) : announcements.length === 0 ? (
        <Card className="py-16 text-center rounded-2xl">
          <CardContent className="space-y-2">
            <Inbox className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm font-semibold text-foreground">Hozircha e'lonlar mavjud emas</p>
            <p className="text-xs text-muted-foreground">Yangi rasmiy xabarlar e'lon qilinganda shu yerda ko'rinadi.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((item, index) => (
            <Card
              key={item.id}
              className={`hover:border-primary/50 transition-all rounded-2xl shadow-sm ${
                index === 0 ? 'border-primary/30 bg-primary/5' : 'bg-card'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <Badge variant="destructive" className="text-[10px] uppercase tracking-wider">
                        Muhim
                      </Badge>
                    )}
                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs self-start sm:self-auto">
                    Rasmiy e'lon
                  </Badge>
                </div>
                <CardTitle className="text-base sm:text-lg font-bold text-foreground mt-1">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {item.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
