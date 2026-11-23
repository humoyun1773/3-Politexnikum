import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { SEO } from '@/components/common/SEO';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Foydalanuvchi nomi va parolni to\'liq kiriting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login({ username: username.trim(), password: password.trim() });
      navigate('/dashboard');
    } catch (err: any) {
      let errorMsg = "Login yoki parol noto'g'ri kiritildi";
      if (err?.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err?.response?.data?.username) {
        errorMsg = Array.isArray(err.response.data.username)
          ? err.response.data.username[0]
          : err.response.data.username;
      } else if (err?.response?.data?.password) {
        errorMsg = Array.isArray(err.response.data.password)
          ? err.response.data.password[0]
          : err.response.data.password;
      } else if (err?.message === 'Network Error') {
        errorMsg = "API serverga (169.58.215.170:8090) ulanishda xatolik yuz berdi. Internetni tekshiring.";
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <SEO
        title="Kirish | Talabalar Portali"
        description="3-Politexnikum talabalar axborot boshqaruv tizimiga kirish."
      />

      {/* Atmospheric glowing backdrop orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 items-center justify-center text-white shadow-glow-primary shadow-2xl mb-1 transform hover:scale-105 transition-transform duration-300">
            <GraduationCap className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              3-Politexnikum
            </h1>
            <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground mt-1">
              Talabalar Axborot Tizimi Dashboard
            </p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="border-border/80 shadow-2xl backdrop-blur-2xl bg-card/85 rounded-3xl overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-foreground">Tizimga kirish</h2>
              <p className="text-xs text-muted-foreground">
                Swagger API (169.58.215.170:8090) orqali avtorizatsiyadan o'ting
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Foydalanuvchi nomi
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Talaba loginini kiriting"
                    className="pl-10 h-11 rounded-xl text-sm bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolingizni kiriting"
                    className="pl-10 pr-10 h-11 rounded-xl text-sm bg-background/50 border-border focus:border-primary focus:ring-primary/20"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-glow-primary shadow-lg mt-2 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tekshirilmoqda...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Kirish <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>

            {/* Server connection indicator */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <Server className="h-3.5 w-3.5 text-muted-foreground" />
                <span>API: 169.58.215.170:8090</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> SimpleJWT
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
