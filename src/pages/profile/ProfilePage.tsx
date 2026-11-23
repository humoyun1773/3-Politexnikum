import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar, CheckCircle2, Save, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SEO } from '@/components/common/SEO';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/student.service';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [phone, setPhone] = useState(user?.phone || '+998 (90) 123-45-67');
  const [email, setEmail] = useState(user?.email || 'humoyun.mirzayev@politexnikum.uz');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await profileService.updateProfile({
        phone,
        email,
        avatar: avatarUrl,
      });
      await refreshUser();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Talaba profili"
        description="3-Politexnikum talabaning shaxsiy ma'lumotlari, guruhi, mutaxassisligi va akademik holati."
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Talaba profili</h2>
        <p className="text-sm text-muted-foreground">
          Shaxsiy ma'lumotlar, aloqa vositalari va akademik ko'rsatkichlar
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Profile Identity Card */}
        <Card className="shadow-sm border-border/80 text-center p-6 flex flex-col items-center">
          <Avatar className="h-28 w-28 ring-4 ring-primary/30 shadow-xl mb-4">
            <AvatarImage src={user?.avatar || avatarUrl} alt={user?.first_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-3xl">
              {user?.first_name?.[0] || 'T'}
            </AvatarFallback>
          </Avatar>

          <h3 className="text-lg font-bold text-foreground">
            {user?.first_name} {user?.last_name}
          </h3>
          <p className="text-xs text-primary font-semibold mt-0.5">@{user?.username || 'talaba'}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary" className="text-xs">
              Guruh: {user?.group || 'AT-21/1'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {user?.course || 3}-kurs
            </Badge>
          </div>

          <div className="w-full mt-6 pt-6 border-t border-border/60 text-left space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                Mutaxassislik:
              </span>
              <span className="font-medium text-foreground">
                {user?.specialty || 'Dasturiy injiniring va axborot tizimlari'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                Talabalikka qabul qilingan:
              </span>
              <span className="font-medium text-foreground">
                {user?.joined_date || '2022-09-01'}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase font-semibold">
                Talaba ID raqami:
              </span>
              <span className="font-mono font-medium text-foreground">
                #POLI-{user?.id || 1042}
              </span>
            </div>
          </div>
        </Card>

        {/* Right 2 Cols: Edit Details Form & Academic Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Form */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Aloqa ma'lumotlarini tahrirlash</CardTitle>
              <CardDescription className="text-xs">
                Email, telefon raqami yoki profil rasmini yangilang
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Ma'lumotlar muvaffaqiyatli saqlandi!</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Email manzili
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-9 h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Telefon raqami
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Profil rasmi havolasi (Avatar URL)
                  </label>
                  <Input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="h-10 rounded-xl text-xs sm:text-sm"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="rounded-xl text-xs sm:text-sm font-semibold gap-2 shadow-md shadow-blue-500/20"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Academic Stats Summary */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Akademik ko'rsatkichlar
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-xs text-muted-foreground block">GPA Natijasi</span>
                <span className="text-xl font-bold text-foreground mt-1 block">
                  {user?.gpa || '4.82'} / 5.0
                </span>
                <span className="text-[10px] text-emerald-500 font-semibold">A'lo baholar</span>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-xs text-muted-foreground block">Davomat darajasi</span>
                <span className="text-xl font-bold text-foreground mt-1 block">
                  {user?.attendance_percentage || '96.4'}%
                </span>
                <span className="text-[10px] text-blue-500 font-semibold">Namunali intizom</span>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                <span className="text-xs text-muted-foreground block">Guruhdagi o'rni</span>
                <span className="text-xl font-bold text-foreground mt-1 block">
                  #{user?.rating_position || 3}
                </span>
                <span className="text-[10px] text-purple-500 font-semibold">Top 3 talaba</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
