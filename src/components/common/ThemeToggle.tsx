import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "relative group inline-flex items-center justify-center h-10 w-10 rounded-2xl transition-all duration-300 outline-none cursor-pointer active:scale-90",
        // Light mode button styling
        "bg-white hover:bg-violet-50/80 border border-slate-200/80 text-violet-600 shadow-sm hover:shadow-md hover:border-violet-300",
        // Dark mode button styling
        "dark:bg-[#160E28] dark:hover:bg-[#23163E] dark:border-violet-500/35 dark:text-amber-400 dark:shadow-[0_0_20px_-3px_rgba(139,92,246,0.35)]",
        className
      )}
      title={isDark ? "Yorug' rejimga o'tish (Light mode)" : "Qorong'i rejimga o'tish (Dark mode)"}
      aria-label="Mavzuni almashtirish"
    >
      {/* Background radial highlight glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
        isDark ? "bg-amber-400/10 blur-sm" : "bg-violet-600/10 blur-sm"
      )} />

      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 fill-amber-400/30 transition-transform duration-300 transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
      ) : (
        <Moon className="h-5 w-5 text-violet-600 fill-violet-600/25 transition-transform duration-300 transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]" />
      )}
    </button>
  );
};
