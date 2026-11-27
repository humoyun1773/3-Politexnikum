import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Lock,
  Moon,
  Sun,
  Monitor,
  Bell,
  Shield,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  Upload,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SEO } from '@/components/common/SEO';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { settingsService } from '@/services/student.service';
import { profileService } from '@/services/profile.service';
import { UserSettings } from '@/types/api.types';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);

  const [settings, setSettings] = useState<UserSettings>({
    theme: 'dark',
    language: 'uz',
    email_notifications: true,
    sms_notifications: false,
    chat_notifications: true,
    show_rating_publicly: true,
  });

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch {
      // fallback
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Rasm hajmi 5MB dan oshmasligi kerak");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target?.result as string;
      updateUser({ avatar: base64Url });

      try {
        await profileService.uploadAvatar(file);
      } catch {
        try {
          await profileService.updateProfile({ avatar: base64Url });
        } catch {
          // keep local
        }
      }
      setAvatarSuccess("Profil rasmi muvaffaqiyatli yangilandi!");
      setTimeout(() => setAvatarSuccess(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Profil rasmini o'chirishni xohlaysizmi?")) return;

    updateUser({ avatar: '' });

    try {
      await profileService.deleteAvatar();
    } catch {
      try {
        await profileService.updateProfile({ avatar: '' });
      } catch {
        // ignore
      }
    }
    setAvatarSuccess("Profil rasmi muvaffaqiyatli o'chirildi!");
    setTimeout(() => setAvatarSuccess(null), 3000);
  };

  const handleToggle = async (key: keyof UserSettings) => {
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
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Eski parol xato kiritildi yoki server bilan bog'lanishda xatolik yuz berdi.";
      setPasswordError(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO
        title="Tizim sozlamalari"
        description="3-Politexnikum talabalar portali sozlamalari - mavzular, xabarnomalar va parol boshqaruvi."
      />

      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Tizim sozlamalari</h2>
        <p className="text-sm text-muted-foreground">
          Ilova ko'rinishi, profil rasmi, bildirishnomalar va xavfsizlik parametrlarini sozlang
        </p>
      </div>

      {/* Hidden file input for Avatar upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFileSelect}
      />

      {/* Top Banner: Profile Picture Quick Settings */}
      <Card className="shadow-sm rounded-3xl border-border/80 overflow-hidden">
        <CardContent className="p-6">
          {avatarSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>{avatarSuccess}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group/avatar cursor-pointer">
              <Avatar className="h-24 w-24 ring-4 ring-primary/25 shadow-lg transition-transform group-hover/avatar:scale-105">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1 cursor-pointer"
                title="Rasmni o'zgartirish"
              >
                <Camera className="h-4 w-4" />
                <span>O'zgartirish</span>
              </button>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1">
              <h3 className="text-base font-bold text-foreground">
                Profil rasmi (Avatar boshqaruvi)
              </h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Yangi rasm yuklang yoki mavjud rasmni o'chiring. Formatlar: JPG, PNG, WEBP (maksimal 5MB).
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/40"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Yangi rasm yuklash (Edit / PUT)
                </Button>

                {user?.avatar && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteAvatar}
                    className="rounded-xl text-xs font-semibold gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Rasmni o'chirish (Delete)
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Col: Appearance & Notifications */}
        <div className="space-y-6">
          {/* Appearance / Theme */}
          <Card className="shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sun className="h-4 w-4 text-primary" />
                Interfeys mavzusi (Dark / Light)
              </CardTitle>
              <CardDescription className="text-xs">
                Ko'zingizga qulay rejimni tanlang
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                      : 'border-border/80 text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span className="text-xs">Yorug' (Light)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                      : 'border-border/80 text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Moon className="h-5 w-5 text-blue-400" />
                  <span className="text-xs">Qorong'i (Dark)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                    theme === 'system'
                      ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                      : 'border-border/80 text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Monitor className="h-5 w-5 text-foreground" />
                  <span className="text-xs">Tizim (Auto)</span>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Preferences */}
          <Card className="shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                Bildirishnoma sozlamalari
              </CardTitle>
              <CardDescription className="text-xs">
                Xabarlar va yangiliklar yetkazib berish kanallari
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Email bildirishnomalari</p>
                  <p className="text-xs text-muted-foreground">Yangi baholar va topshiriqlar pochtangizga yuboriladi</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.email_notifications}
                  onChange={() => handleToggle('email_notifications')}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Guruh chati bildirishnomalari</p>
                  <p className="text-xs text-muted-foreground">Guruhdoshlar xabar yozganda ovozli bildirishnoma</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.chat_notifications}
                  onChange={() => handleToggle('chat_notifications')}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Reytingda ommaviy ko'rinish</p>
                  <p className="text-xs text-muted-foreground">Ismingiz va o'rningiz umumiy reyting jadvalida ko'rinadi</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_rating_publicly}
                  onChange={() => handleToggle('show_rating_publicly')}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Change Password */}
        <Card className="shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Parolni o'zgartirish
            </CardTitle>
            <CardDescription className="text-xs">
              Xavfsizlik uchun parolni muntazam yangilab turish tavsiya etiladi
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
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-10 rounded-xl text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Yangi parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 h-10 rounded-xl text-xs sm:text-sm"
                    required
                  />
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
                  className="w-full h-10 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Yangilanmoqda...' : 'Parolni yangilash'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
