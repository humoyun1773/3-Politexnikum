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
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
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

export const navigationSections = [
  {
    title: 'ASOSIY',
    items: [
      { name: 'Boshqaruv paneli', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Dars jadvali', path: '/schedule', icon: Calendar },
      { name: "O'zlashtirish & Baholar", path: '/grades', icon: GraduationCap },
      { name: 'Davomat jurnali', path: '/attendance', icon: ClipboardCheck },
      { name: 'Topshiriqlar', path: '/assignments', icon: FileCheck2 },
    ],
  },
  {
    title: "IJTIMOIY & O'QUV",
    items: [
      { name: 'Talabalar reytingi', path: '/rating', icon: Trophy },
      { name: 'Guruh muloqoti', path: '/chat', icon: MessageSquare, badge: 'Chat' },
      { name: 'Elektron kutubxona', path: '/library', icon: BookOpen },
      { name: "E'lonlar", path: '/announcements', icon: Bell },
    ],
  },
  {
    title: 'SHAXSIY',
    items: [
      { name: 'Maqsadlar', path: '/goals', icon: Target },
      { name: 'Profil & Sozlamalar', path: '/profile', icon: User },
    ],
  },
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
        'flex flex-col h-full bg-white dark:bg-[#0E081E] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-violet-500/30 select-none shrink-0 transition-all duration-300 ease-in-out relative z-30 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_40px_-5px_rgba(0,0,0,0.65)]',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'h-16 flex items-center bg-slate-50/90 dark:bg-[#130B29] border-b border-slate-200/80 dark:border-violet-500/20 transition-all',
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        )}
      >
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 group min-w-0"
          onClick={onNavigate}
          title="3-Politexnikum Talabalar Portali"
        >
          {/* Dual-triangle geometric brand logo */}
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-violet-600/10 via-purple-600/10 to-indigo-600/10 dark:bg-[#160E28] border border-purple-200/60 dark:border-violet-500/35 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-violet-500 transition-all shrink-0">
            <svg className="h-6 w-6 filter drop-shadow-[0_2px_8px_rgba(168,85,247,0.4)]" viewBox="0 0 32 32" fill="none">
              <path d="M5 25L14 8L18 16L13 25H5Z" fill="url(#sideBrandGrad1)" />
              <path d="M15 25L21 14L27 25H15Z" fill="url(#sideBrandGrad2)" />
              <defs>
                <linearGradient id="sideBrandGrad1" x1="5" y1="8" x2="18" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F43F5E" />
                  <stop offset="1" stopColor="#A855F7" />
                </linearGradient>
                <linearGradient id="sideBrandGrad2" x1="15" y1="14" x2="27" y2="25" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7" />
                  <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {!collapsed && (
            <div className="overflow-hidden transition-all duration-200">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white truncate block">
                3-Politexnikum
              </span>
              <p className="text-[10px] text-violet-600 dark:text-violet-400 font-bold uppercase tracking-wider truncate flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Talabalar Portali
              </p>
            </div>
          )}
        </NavLink>

        {/* Desktop Collapse Toggle in Brand Header */}
        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors hidden md:flex items-center justify-center cursor-pointer"
            title="Sidebarni yig'ish"
            aria-label="Sidebarni yig'ish"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  title={collapsed ? item.name : undefined}
                  className={cn(
                    'group relative flex items-center transition-all duration-200 select-none cursor-pointer',
                    collapsed
                      ? 'justify-center h-11 w-11 mx-auto my-1 rounded-2xl'
                      : 'justify-between px-3.5 py-2.5 rounded-2xl my-0.5 text-xs sm:text-sm font-medium',
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 dark:shadow-violet-600/35'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5'
                  )}
                >
                  <div className={cn('flex items-center min-w-0', collapsed ? 'justify-center' : 'gap-3')}>
                    <Icon
                      className={cn(
                        'h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                        isActive
                          ? 'text-white'
                          : 'text-slate-400 dark:text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate text-xs sm:text-sm">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {!collapsed && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && !isActive && (
                        <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                          {item.badge}
                        </span>
                      )}
                      <ChevronRight
                        className={cn(
                          'h-3.5 w-3.5 transition-all duration-200',
                          isActive
                            ? 'opacity-90 translate-x-0.5'
                            : 'opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0'
                        )}
                      />
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Expand Button for Collapsed State */}
      {onToggleCollapse && collapsed && (
        <div className="p-2 border-t border-slate-200/80 dark:border-violet-500/20 flex justify-center hidden md:flex">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Sidebarni ochish"
            aria-label="Sidebarni ochish"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* User Footer Card */}
      <div className={cn('border-t-2 border-slate-200/90 dark:border-violet-500/25 mt-auto bg-slate-50/90 dark:bg-[#130B29] transition-all', collapsed ? 'p-2' : 'p-3')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <NavLink
              to="/profile"
              title={`${user?.first_name || 'Talaba'} (${user?.group || '301-AT'})`}
              className="relative group hover:opacity-95 transition-opacity"
            >
              <Avatar className="h-9 w-9 ring-2 ring-violet-500/40 mx-auto shadow-sm">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#130B29]" />
            </NavLink>
            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-2 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#181132] border border-slate-200/90 dark:border-violet-500/30 shadow-xs">
            <NavLink to="/profile" className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-90 transition-opacity">
              <div className="relative shrink-0">
                <Avatar className="h-9 w-9 ring-2 ring-violet-500/30">
                  <AvatarImage src={user?.avatar} alt={user?.first_name} />
                  <AvatarFallback className="bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs">
                    {user?.first_name?.[0] || 'T'}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#18112C]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Talaba'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                  <span>{user?.group || '301-AT'}</span>
                  {user?.gpa && <span className="text-emerald-500 font-semibold">• GPA {user.gpa}</span>}
                </p>
              </div>
            </NavLink>

            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-2 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer ml-1 shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
