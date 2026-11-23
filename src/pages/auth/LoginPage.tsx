import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
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

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Foydalanuvchi nomi va parolni kiriting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login({ username, password });
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Login yoki parol xato kiritildi. Agar hisobingiz bo'lmasa, quyidagi Demo rejim orqali kiring.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-card to-background relative overflow-hidden">
      <SEO
        title="Kirish | Talabalar Portali"
        description="3-Politexnikum talabalar axborot boshqaruv tizimiga kirish sahifasi."
      />

      {/* Background ambient glows */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 items-center justify-center text-white shadow-xl shadow-blue-500/25 mb-4 transform hover:rotate-6 transition-transform">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            3-Politexnikum
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Talabalar Boshqaruv Portali & Student Hub
          </p>
        </div>

        <Card className="border-border/80 shadow-2xl backdrop-blur-xl bg-card/90">
          <CardContent className="pt-6 px-6 sm:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div className="flex-1">{error}</div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Foydalanuvchi nomi
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="student yoki username"
                    className="pl-9 h-10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Parol
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9 pr-10 h-10 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full h-11 rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/25 mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tekshirilmoqda...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Tizimga kirish <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/80" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">yoki</span>
              </div>
            </div>

            {/* Quick Demo Preview Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full h-11 rounded-xl border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 text-primary font-medium flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>1-klik bilan Demo rejimda kirish</span>
            </Button>

            {/* API connection status info */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>API: 169.58.215.170:8090</span>
              </div>
              <span className="font-mono">v1.0 (OpenAPI 3)</span>
            </div>
          </CardContent>
        </Card>

        {/* Credentials hints for easy testing */}
        <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" /> Eslatma:
          </p>
          <p>Tizimga Swagger API da mavjud bo'lgan talaba foydalanuvchi hisobi bilan kirish mumkin yoki yuqoridagi <strong>Demo rejim</strong> orqali barcha bo'limlarni testdan o'tkazishingiz mumkin.</p>
        </div>
      </div>
    </div>
  );
};
