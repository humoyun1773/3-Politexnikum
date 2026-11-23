import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Save,
  Lock,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  AlertCircle,
  Settings,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SEO } from '@/components/common/SEO';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { profileService, settingsService } from '@/services/student.service';
import { UserSettings } from '@/types/api.types';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab state (reads from URL query if ?tab=settings or ?tab=security)
  const defaultTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(user?.phone || '+998 (90) 123-45-67');
  const [email, setEmail] = useState(user?.email || 'humoyun.mirzayev@politexnikum.uz');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    language: 'uz',
    email_notifications: true,
    sms_notifications: false,
    chat_notifications: true,
    show_rating_publicly: true,
  });

  // Password Change State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setPhone(user.phone || '+998 (90) 123-45-67');
      setEmail(user.email || 'humoyun.mirzayev@politexnikum.uz');
      setAvatarUrl(user.avatar || '');
    }
    loadSettings();
  }, [user]);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['profile', 'settings', 'security'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch {
      // fallback
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await profileService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        phone,
        email,
        avatar: avatarUrl,
      });
      await refreshUser();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleSetting = async (key: keyof UserSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await settingsService.updateSettings({ [key]: updated[key] });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 6) {
      setPasswordError("Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Yangi parollar bir-biriga mos kelmadi");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await settingsService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      setPasswordSuccess(res.detail || "Parol muvaffaqiyatli o'zgartirildi!");
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Eski parol noto'g'ri kiritildi yoki server bilan bog'lanishda xatolik yuz berdi.";
      setPasswordError(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Profil & Sozlamalar"
        description="3-Politexnikum talaba profili, shaxsiy ma'lumotlar, interfeys sozlamalari va xavfsizlik."
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Profil & Sozlamalar</h2>
          <p className="text-sm text-muted-foreground">
            Shaxsiy ma'lumotlaringiz, akademik holat, bildirishnomalar va xavfsizlik sozlamalari
          </p>
        </div>
      </div>

      {/* Unified Tabs Controller */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-muted/70 p-1 rounded-xl h-11 w-full sm:w-auto grid grid-cols-3 max-w-md">
          <TabsTrigger value="profile" className="rounded-lg text-xs sm:text-sm font-semibold gap-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg text-xs sm:text-sm font-semibold gap-2">
            <Settings className="h-4 w-4" />
            <span>Sozlamalar</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs sm:text-sm font-semibold gap-2">
            <Shield className="h-4 w-4" />
            <span>Xavfsizlik</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFIL & SHAXSIY MA'LUMOTLAR */}
        <TabsContent value="profile" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col: Identity Card */}
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
                  {user?.course || 3}-kurs talabasi
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
                    Qabul qilingan sana:
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

            {/* Right 2 Cols: Edit Details Form & Academic Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Edit Details */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-bold">Shaxsiy ma'lumotlarni yangilash</CardTitle>
                  <CardDescription className="text-xs">
                    Ism, familiya, telefon raqami va profil rasmini tahrirlang
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {profileSuccess && (
                    <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Profil ma'lumotlari muvaffaqiyatli saqlandi!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Ism
                        </label>
                        <Input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-10 rounded-xl text-xs sm:text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Familiya
                        </label>
                        <Input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-10 rounded-xl text-xs sm:text-sm"
                          required
                        />
                      </div>
                    </div>

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
                        disabled={isSavingProfile}
                      >
                        <Save className="h-4 w-4" />
                        {isSavingProfile ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Academic Stats Summary */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    Akademik ko'rsatkichlar
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                    <span className="text-xs text-muted-foreground block">O'rtacha GPA</span>
                    <span className="text-xl font-bold text-foreground mt-1 block">
                      {user?.gpa || '4.82'} / 5.0
                    </span>
                    <span className="text-[10px] text-emerald-500 font-semibold">A'lo natija</span>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/60">
                    <span className="text-xs text-muted-foreground block">Davomat ko'rsatkichi</span>
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
                    <span className="text-[10px] text-purple-500 font-semibold">Top talaba</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: TIZIM SOZLAMALARI & INTERFEYS */}
        <TabsContent value="settings" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appearance / Theme */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sun className="h-4 w-4 text-primary" />
                  Mavzuni tanlash (Dark / Light)
                </CardTitle>
                <CardDescription className="text-xs">
                  Ilova ko'rinishini qulay rejimga sozlang
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border/80 text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Sun className="h-6 w-6 text-amber-500" />
                    <span className="text-xs">Yorug' (Light)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border/80 text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Moon className="h-6 w-6 text-blue-400" />
                    <span className="text-xs">Qorong'i (Dark)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      theme === 'system'
                        ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                        : 'border-border/80 text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    <Monitor className="h-6 w-6 text-foreground" />
                    <span className="text-xs">Tizim (Auto)</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Preferences */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  Xabarnoma sozlamalari
                </CardTitle>
                <CardDescription className="text-xs">
                  Bildirishnomalarni qabul qilish parametrlarini sozlang
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Email bildirishnomalari</p>
                    <p className="text-xs text-muted-foreground">Yangi baholar va topshiriqlar pochtaga yuboriladi</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.email_notifications}
                    onChange={() => handleToggleSetting('email_notifications')}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Guruh chati bildirishnomalari</p>
                    <p className="text-xs text-muted-foreground">Yangi guruh xabarlari kelganda tovushli xabarnoma</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.chat_notifications}
                    onChange={() => handleToggleSetting('chat_notifications')}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Ommaviy reytingda ko'rinish</p>
                    <p className="text-xs text-muted-foreground">Ismingiz va o'rningiz barcha talabalar reytingida chiqadi</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.show_rating_publicly}
                    onChange={() => handleToggleSetting('show_rating_publicly')}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: XAVFSIZLIK & PAROL */}
        <TabsContent value="security" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Change Password Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Parolni o'zgartirish
                </CardTitle>
                <CardDescription className="text-xs">
                  Xavfsizlik uchun parolni muntazam ravishda yangilab turing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {passwordError && (
                  <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Joriy parol
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showOldPass ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 pr-10 h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Yangi parol
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 pr-10 h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Yangi parolni tasdiqlang
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="pl-9 h-10 rounded-xl text-xs sm:text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="gradient"
                      className="w-full h-11 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? 'Yangilanmoqda...' : 'Parolni yangilash'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Account Protection Tips Card */}
            <Card className="shadow-sm bg-gradient-to-br from-card to-muted/20 border-border/80">
              <CardHeader>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  Xavfsizlik bo'yicha tavsiyalar
                </CardTitle>
                <CardDescription className="text-xs">
                  Talaba profilingiz xavfsizligini ta'minlash
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Murakkab parol tanlang</span>
                    Parolingizda kamida bitta katta harf, raqam va maxsus belgi qatnashganiga ishonch hosil qiling.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">Ommaviy kompyuterlarda saqlamang</span>
                    Politexnikum kompyuter xonalarida foydalangandan so'ng doimo profil menyusi orqali tizimdan chiqing.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/60">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">JWT Sessiya nazorati</span>
                    Token muddati tugaganda tizim avtomatik yangilanadi va xavfsizlikni to'liq ta'minlaydi.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
