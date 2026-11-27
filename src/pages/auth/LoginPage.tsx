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

  // Dialog info state for Forgot Password, Register, and Social Login clicks
  const [dialogInfo, setDialogInfo] = useState<{ title: string; message: string } | null>(null);

  const { login } = useAuth();
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
        errorMsg = "Serverga ulanishda xatolik yuz berdi. Internet aloqasini tekshiring.";
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = (provider: string) => {
    setDialogInfo({
      title: `${provider} orqali kirish`,
      message: "Talabalar va o'qituvchilar tizimga faqat texnikum ma'muriyati taqdim etgan rasmiy foydalanuvchi nomi va parol orqali kirishlari mumkin.",
    });
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
            {/* Top-left sweeping luminous arc */}
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

            {/* Bottom-right sweeping neon arc */}
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

            {/* 4. DIVIDER: "Yoki quyidagilar orqali kiring" */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
              <span className="text-[11px] text-slate-400 dark:text-slate-400 whitespace-nowrap">
                Yoki quyidagilar orqali kiring
              </span>
              <div className="h-px bg-slate-200 dark:bg-white/10 flex-1" />
            </div>

            {/* 5. BEAUTIFUL SOCIAL LOGIN BUTTONS (Google, Telegram, GitHub) */}
            <div className="grid grid-cols-3 gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={() => handleSocialClick('Google')}
                className={cn(
                  "h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer group",
                  "bg-[#FAF9FD] border border-slate-200 hover:border-violet-300 hover:bg-white shadow-xs hover:shadow-md",
                  "dark:bg-[#1B142D]/80 dark:border-white/10 dark:hover:border-violet-500/40 dark:hover:bg-[#221a38]"
                )}
                aria-label="Google orqali kirish"
              >
                <svg className="h-5 w-5 transform group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={() => handleSocialClick('Telegram')}
                className={cn(
                  "h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer group",
                  "bg-[#FAF9FD] border border-slate-200 hover:border-violet-300 hover:bg-white shadow-xs hover:shadow-md",
                  "dark:bg-[#1B142D]/80 dark:border-white/10 dark:hover:border-violet-500/40 dark:hover:bg-[#221a38]"
                )}
                aria-label="Telegram orqali kirish"
              >
                <svg className="h-6 w-6 transform group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="url(#tgGradOfficial)" />
                  <path
                    d="M6.8 11.9l9.6-3.9c.4-.2.8.1.7.5l-1.6 7.6c-.1.5-.4.6-.9.3l-2.4-1.8-1.2 1.1c-.2.2-.3.3-.5.3l.2-2.5 4.5-4.1c.2-.2 0-.3-.3-.1l-5.6 3.5-2.4-.7c-.5-.2-.5-.5.1-.8z"
                    fill="white"
                  />
                  <defs>
                    <linearGradient id="tgGradOfficial" x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#2AABEE" />
                      <stop offset="1" stopColor="#229ED9" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleSocialClick('GitHub')}
                className={cn(
                  "h-12 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer group",
                  "bg-[#FAF9FD] border border-slate-200 hover:border-violet-300 hover:bg-white shadow-xs hover:shadow-md",
                  "dark:bg-[#1B142D]/80 dark:border-white/10 dark:hover:border-violet-500/40 dark:hover:bg-[#221a38]"
                )}
                aria-label="GitHub orqali kirish"
              >
                <svg className="h-5 w-5 fill-current text-slate-800 dark:text-white transform group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </button>
            </div>

            {/* 6. BOTTOM REGISTER LINK */}
            <div className="text-center pt-1">
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
