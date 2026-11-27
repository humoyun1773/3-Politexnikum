import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  FileCheck2,
  Trophy,
  MessageSquare,
  BookOpen,
  Bell,
  Target,
  User,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onNavigate?: () => void;
}

export const navigationItems = [
  { name: 'Boshqaruv paneli', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Dars jadvali', path: '/schedule', icon: Calendar },
  { name: "Baholar & O'zlashtirish", path: '/grades', icon: GraduationCap },
  { name: 'Davomat', path: '/attendance', icon: ClipboardCheck },
  { name: 'Topshiriqlar', path: '/assignments', icon: FileCheck2 },
  { name: 'Talabalar reytingi', path: '/rating', icon: Trophy },
  { name: 'Guruh muloqoti', path: '/chat', icon: MessageSquare },
  { name: 'Elektron kutubxona', path: '/library', icon: BookOpen },
  { name: "E'lonlar", path: '/announcements', icon: Bell },
  { name: 'Maqsadlar', path: '/goals', icon: Target },
  { name: 'Profil & Sozlamalar', path: '/profile', icon: User },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  className,
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-zinc-800 select-none shrink-0 transition-all duration-300 ease-in-out relative z-30 shadow-sm',
        collapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-slate-100 dark:border-zinc-800/80 transition-all shrink-0',
          collapsed ? 'justify-center px-2' : 'justify-between px-4'
        )}
      >
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 group min-w-0"
          onClick={onNavigate}
          title="3-Politexnikum"
        >
          <div className="h-9 w-9 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center shrink-0">
            <svg className="h-5 w-5" viewBox="0 0 32 32" fill="none">
              <path d="M5 25L14 8L18 16L13 25H5Z" fill="url(#sideBrandGrad1)" />
              <path d="M15 25L21 14L27 25H15Z" fill="url(#sideBrandGrad2)" />
              <defs>
                <linearGradient id="sideBrandGrad1" x1="5" y1="8" x2="18" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F43F5E" />
                  <stop offset="1" stopColor="#8B5CF6" />
                </linearGradient>
                <linearGradient id="sideBrandGrad2" x1="15" y1="14" x2="27" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8B5CF6" />
                  <stop offset="1" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-zinc-100 truncate block">
                3-Politexnikum
              </span>
            </div>
          )}
        </NavLink>

        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hidden md:flex items-center justify-center cursor-pointer"
            title="Sidebarni yig'ish"
            aria-label="Sidebarni yig'ish"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1 scrollbar-thin">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              title={collapsed ? item.name : undefined}
              className={cn(
                'flex items-center transition-all duration-150 select-none cursor-pointer',
                collapsed
                  ? 'justify-center h-10 w-10 mx-auto rounded-xl'
                  : 'gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium',
                isActive
                  ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800/70'
              )}
            >
              <Icon
                className={cn(
                  'h-[18px] w-[18px] shrink-0',
                  isActive ? 'text-primary-foreground' : 'text-slate-400 dark:text-zinc-500'
                )}
              />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Expand Button for Collapsed State */}
      {onToggleCollapse && collapsed && (
        <div className="p-2 border-t border-slate-100 dark:border-zinc-800/80 flex justify-center hidden md:flex">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Sidebarni ochish"
            aria-label="Sidebarni ochish"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User Footer */}
      <div className={cn('border-t border-slate-100 dark:border-zinc-800/80 mt-auto transition-all', collapsed ? 'p-2' : 'p-3')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <NavLink
              to="/profile"
              title={`${user?.first_name || 'Talaba'} (${user?.group || '301-AT'})`}
              className="hover:opacity-90 transition-opacity"
            >
              <Avatar className="h-9 w-9 ring-1 ring-slate-200 dark:ring-zinc-700 mx-auto">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>
            </NavLink>
            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-800">
            <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity">
              <Avatar className="h-8 w-8 ring-1 ring-slate-200 dark:ring-zinc-700 shrink-0">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Talaba'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                  {user?.group || '301-AT'}
                </p>
              </div>
            </NavLink>

            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
