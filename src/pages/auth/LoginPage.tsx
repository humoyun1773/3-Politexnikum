import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  Info,
  X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SEO } from '@/components/common/SEO';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { cn } from '@/lib/utils';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dialog info state for Forgot Password, Register
  const [dialogInfo, setDialogInfo] = useState<{ title: string; message: string } | null>(null);

  const { login, loginAsDemo } = useAuth();
  const { isDark } = useTheme();
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
        errorMsg = "Serverga ulanishda xatolik yuz berdi. Pastdagi \"Demo rejimda kirish\" tugmasi orqali tizimni sinab ko'rishingiz mumkin.";
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await loginAsDemo();
      navigate('/dashboard');
    } catch (err) {
      setError("Demo rejimga kirishda xatolik yuz berdi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#FAF9FE] dark:bg-[#08040F] transition-colors duration-300">
      <SEO
        title="Kirish | 3-Politexnikum"
        description="3-Politexnikum talabalar axborot boshqaruv tizimiga kirish."
      />

      {/* Instant 1-Click Floating Theme Toggle */}
      <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-white/90 dark:bg-[#150F24]/90 backdrop-blur-xl p-1.5 pl-3.5 rounded-2xl border border-slate-200/80 dark:border-violet-500/35 shadow-lg shadow-purple-500/5 transition-all">
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 select-none hidden sm:inline">
          {isDark ? "Qorong'i rejim" : "Yorug' rejim"}
        </span>
        <ThemeToggle />
      </div>

      {/* ================= LIGHT MODE DECORATIONS ================= */}
      <div className="absolute inset-0 pointer-events-none dark:hidden overflow-hidden">
        {/* Soft atmospheric blurred violet blobs */}
        <div className="absolute -left-28 top-1/4 w-[420px] h-[420px] rounded-full bg-purple-300/25 blur-[120px]" />
        <div className="absolute -right-28 top-1/3 w-[450px] h-[450px] rounded-full bg-violet-400/20 blur-[130px]" />
        <div className="absolute left-1/3 bottom-0 w-[400px] h-[350px] rounded-full bg-indigo-200/25 blur-[120px]" />

        {/* Top-right decorative dots matrix */}
        <div className="absolute top-10 right-20 grid grid-cols-3 gap-2 opacity-50">
          {[...Array(6)].map((_, i) => (
            <span key={`tr-${i}`} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          ))}
        </div>

        {/* Bottom-left decorative dots matrix */}
        <div className="absolute bottom-12 left-16 grid grid-cols-3 gap-2 opacity-50">
          {[...Array(6)].map((_, i) => (
            <span key={`bl-${i}`} className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          ))}
        </div>
      </div>

      {/* ================= DARK MODE DECORATIONS ================= */}
      <div className="absolute inset-0 pointer-events-none hidden dark:block overflow-hidden">
        {/* Deep ambient glow orbs */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-violet-700/25 blur-[150px]" />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-fuchsia-700/20 blur-[160px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-purple-900/15 blur-[180px]" />

        {/* Glowing neon purple curved ribbons / arcs */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 900"
          fill="none"
        >
          <g filter="url(#glowFilter)">
            <path
              d="M -100 200 C 200 150 400 320 500 500 C 600 680 700 850 650 1000"
              stroke="url(#neonPurpleGrad)"
              strokeWidth="2.5"
              strokeOpacity="0.85"
            />
            <path
              d="M -150 250 C 180 180 370 340 460 520 C 550 700 630 850 600 1000"
              stroke="url(#neonPurpleGradSoft)"
              strokeWidth="1.2"
              strokeOpacity="0.45"
            />

            <path
              d="M 1550 550 C 1300 620 1150 780 1000 950"
              stroke="url(#neonPurpleGrad)"
              strokeWidth="3"
              strokeOpacity="0.9"
            />
            <path
              d="M 1600 500 C 1350 580 1200 740 1080 920"
              stroke="url(#neonPurpleGradSoft)"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
          </g>

          <defs>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="10" result="blur1" />
              <feGaussianBlur stdDeviation="20" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="neonPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#7E22CE" />
            </linearGradient>
            <linearGradient id="neonPurpleGradSoft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ================= LOGIN CARD CONTAINER ================= */}
      <div className="w-full max-w-[430px] relative z-10">
        <div className={cn(
          "relative overflow-hidden rounded-[32px] transition-all duration-300",
          // Light Mode card style
          "bg-white/95 border border-purple-100 shadow-[0_20px_50px_rgba(139,92,246,0.12)]",
          // Dark Mode card style (glassmorphism with glowing border)
          "dark:bg-[#120B22]/80 dark:backdrop-blur-2xl dark:border-violet-500/35 dark:shadow-[0_0_55px_-5px_rgba(147,51,234,0.32)]"
        )}>

          {/* Top-right corner accent quarter-circle (Light mode only, matching screenshot) */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/50 rounded-bl-[44px] pointer-events-none dark:hidden transition-opacity" />

          <div className="p-7 sm:p-9 space-y-6 relative z-10">
            {/* 1. BRAND HEADER (Ultra-sleek modern dual-triangle glyph + 3-Politexnikum) */}
            <div className="flex items-center justify-center gap-2.5">
              <svg className="h-8 w-8 filter drop-shadow-[0_2px_10px_rgba(168,85,247,0.4)]" viewBox="0 0 36 36" fill="none">
                <path
                  d="M6 27L15 9L20 18L14 27H6Z"
                  fill="url(#brandGrad1)"
                />
                <path
                  d="M16 27L23 15L29 27H16Z"
                  fill="url(#brandGrad2)"
                />
                <defs>
                  <linearGradient id="brandGrad1" x1="6" y1="9" x2="20" y2="27" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F43F5E" />
                    <stop offset="0.6" stopColor="#D946EF" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                  <linearGradient id="brandGrad2" x1="16" y1="15" x2="29" y2="27" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#8B5CF6" />
                    <stop offset="1" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                3-Politexnikum
              </span>
            </div>

            {/* 2. TITLE & SUBTITLE */}
            <div className="text-center space-y-1.5">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Kirish
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-[300px] mx-auto leading-relaxed">
                Hisobingizga kiring va barcha imkoniyatlardan foydalaning.
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            {/* 3. LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="relative group">
                <User className="absolute left-4 top-3.5 h-[18px] w-[18px] text-slate-400 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 pointer-events-none transition-colors" />
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Foydalanuvchi nomi"
                  className={cn(
                    "pl-11 h-12 rounded-2xl text-sm transition-all duration-200",
                    "bg-[#FAFAFD] border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
                    "dark:bg-[#1B142D]/70 dark:border-violet-500/20 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-violet-500 dark:focus:bg-[#201836]"
                  )}
                  required
                  autoFocus
                />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 h-[18px] w-[18px] text-slate-400 group-focus-within:text-violet-600 dark:group-focus-within:text-violet-400 pointer-events-none transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Parol"
                  className={cn(
                    "pl-11 pr-11 h-12 rounded-2xl text-sm transition-all duration-200",
                    "bg-[#FAFAFD] border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
                    "dark:bg-[#1B142D]/70 dark:border-violet-500/20 dark:text-white dark:placeholder:text-slate-400 dark:focus:border-violet-500 dark:focus:bg-[#201836]"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-violet-600 dark:hover:text-violet-300 transition-colors cursor-pointer"
                  title={showPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2 group cursor-pointer select-none"
                >
                  <div className={cn(
                    "w-4 h-4 rounded-md flex items-center justify-center transition-all duration-150",
                    rememberMe
                      ? "bg-violet-600 text-white shadow-xs"
                      : "border border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-violet-500"
                  )}>
                    {rememberMe && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    Meni eslab qolish
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setDialogInfo({
                    title: "Parolni unutdingizmi?",
                    message: "Parolni tiklash yoki yangilash uchun 3-Politexnikum dekanati yoki tizim administratoriga murojaat qiling.",
                  })}
                  className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
                >
                  Parolni unutdingizmi?
                </button>
              </div>

              {/* Kirish Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 mt-2 group",
                  "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700",
                  "shadow-lg shadow-violet-500/25 dark:shadow-violet-600/35 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Tekshirilmoqda...
                  </span>
                ) : (
                  <>
                    Kirish <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>

            {/* 4. DEMO LOGIN BUTTON */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.99]",
                  "border border-violet-500/35 bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 shadow-xs hover:border-violet-500/60"
                )}
              >
                <Sparkles className="h-4 w-4 text-violet-500 animate-pulse" />
                Demo hisob orqali kirish
              </button>
            </div>

            {/* 5. BOTTOM REGISTER LINK */}
            <div className="text-center pt-2">
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Hisobingiz yo'qmi?
              </span>{' '}
              <button
                type="button"
                onClick={() => setDialogInfo({
                  title: "Ro'yxatdan o'tish",
                  message: "Talabalar va xodimlar akkaunti 3-Politexnikum ma'muriyati tomonidan ochiladi. Ro'yxatdan o'tish yoki ma'lumot olish uchun dekanatga murojaat qiling.",
                })}
                className="text-xs sm:text-sm font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors cursor-pointer"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL / ALERT DIALOG ================= */}
      {dialogInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#18112A] border border-purple-100 dark:border-violet-500/30 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold">
                <Info className="h-5 w-5" />
                <span>{dialogInfo.title}</span>
              </div>
              <button
                onClick={() => setDialogInfo(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {dialogInfo.message}
            </p>
            <button
              onClick={() => setDialogInfo(null)}
              className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Tushunarli
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
