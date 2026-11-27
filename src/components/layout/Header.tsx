import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Bell,
  CheckCheck,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Calendar,
  GraduationCap,
  ClipboardCheck,
  FileCheck2,
  Trophy,
  MessageSquare,
  BookOpen,
  Target,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { notificationsService } from '@/services/student.service';
import { Notification } from '@/types/api.types';
import { formatDate } from '@/lib/utils';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onToggleSidebar,
  isSidebarCollapsed = false,
  title,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    loadNotifications();

    // Keyboard shortcut for Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(typeof count === 'number' ? count : 0);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  const handleReadAll = async () => {
    await notificationsService.readAll();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  // Helper icon for current page
  const getPageIcon = (path: string) => {
    switch (path) {
      case '/dashboard':
        return LayoutDashboard;
      case '/schedule':
        return Calendar;
      case '/grades':
        return GraduationCap;
      case '/attendance':
        return ClipboardCheck;
      case '/assignments':
        return FileCheck2;
      case '/rating':
        return Trophy;
      case '/chat':
        return MessageSquare;
      case '/library':
        return BookOpen;
      case '/announcements':
        return Bell;
      case '/goals':
        return Target;
      case '/profile':
      case '/settings':
        return User;
      default:
        return LayoutDashboard;
    }
  };

  const PageIcon = getPageIcon(location.pathname);

  return (
    <>
      <header className="h-16 px-4 sm:px-5 bg-white dark:bg-[#120B25] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-violet-500/30 z-20 flex items-center justify-between gap-4 transition-colors duration-200 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_-5px_rgba(0,0,0,0.5)] shrink-0 relative">
        {/* Left: Sidebar Toggle & Page Breadcrumb */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Mobile drawer toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 rounded-2xl border border-slate-200/80 dark:border-violet-500/20 bg-slate-50 dark:bg-white/5"
            onClick={onToggleMobileMenu}
            aria-label="Mobil menyu ochish"
          >
            <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
          </Button>

          {/* Desktop collapse toggle */}
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              onClick={onToggleSidebar}
              title={isSidebarCollapsed ? "Sidebarni ochish" : "Sidebarni yig'ish"}
              aria-label={isSidebarCollapsed ? "Sidebarni ochish" : "Sidebarni yig'ish"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4.5 w-4.5 text-violet-600 dark:text-violet-400" />
              ) : (
                <PanelLeftClose className="h-4.5 w-4.5" />
              )}
            </Button>
          )}

          {/* Active Page Header with Icon */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-violet-600/10 to-indigo-600/10 dark:from-violet-500/20 dark:to-indigo-500/20 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 shadow-xs">
              <PageIcon className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                <span>Portali</span>
                <span>/</span>
                <span className="text-violet-600 dark:text-violet-400">Sahifa</span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white truncate max-w-[170px] sm:max-w-none mt-0.5 leading-none">
                {title}
              </h1>
            </div>
          </div>
        </div>

        {/* Center: Global Search Trigger Button */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border border-slate-200/80 dark:border-violet-500/25 bg-slate-50/80 dark:bg-[#160E28]/80 hover:bg-white dark:hover:bg-[#1E1436] hover:border-violet-400/60 dark:hover:border-violet-500/50 text-muted-foreground text-xs sm:text-sm max-w-xs md:max-w-md w-full transition-all duration-200 cursor-pointer text-left shadow-xs hover:shadow-sm group"
        >
          <Search className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
          <span className="truncate flex-1 text-slate-500 dark:text-slate-400 font-normal">
            Qidirish (darslar, baholar, xabarlar)...
          </span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-black/40 px-2 font-mono text-[10px] font-semibold text-muted-foreground shadow-xs">
            Ctrl K
          </kbd>
        </button>

        {/* Right: Quick Stats, Notifications, Theme & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick GPA indicator pill */}
          {user?.gpa && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>GPA: {user.gpa}</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-2xl border border-slate-200/80 dark:border-violet-500/25 bg-white dark:bg-[#160E28] hover:bg-violet-50/80 dark:hover:bg-[#22163E] shadow-xs cursor-pointer"
                aria-label="Xabarnomalar"
              >
                <Bell className="h-4.5 w-4.5 text-slate-700 dark:text-slate-200" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#160E28] animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-3xl shadow-2xl border-slate-200/80 dark:border-violet-500/30 overflow-hidden bg-white/95 dark:bg-[#140D26]/95 backdrop-blur-2xl">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-200/80 dark:border-violet-500/20 bg-slate-50/60 dark:bg-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">Xabarnomalar</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] bg-violet-600 text-white font-bold px-2 py-0.5 rounded-full shadow-xs">
                      {unreadCount} yangi
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleReadAll}
                    className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Barchasini o'qish
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground space-y-1">
                    <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto opacity-50" />
                    <p>Hozircha yangi xabarnomalar yo'q</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors ${!n.is_read ? 'bg-violet-500/5' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                          {n.category_display}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(n.created_at)}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-200/80 dark:border-violet-500/20 bg-slate-50/50 dark:bg-white/5 text-center">
                <NavLink
                  to="/announcements"
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline block py-1"
                >
                  Barcha e'lonlar va bildirishnomalar →
                </NavLink>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle (Instant 1-Click) */}
          <ThemeToggle />

          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 pl-2 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200/80 dark:border-violet-500/25 transition-all outline-none cursor-pointer">
                <div className="relative">
                  <Avatar className="h-8 w-8 ring-2 ring-violet-500/30">
                    <AvatarImage src={user?.avatar} alt={user?.first_name} />
                    <AvatarFallback className="bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs">
                      {user?.first_name?.[0] || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0B0716]" />
                </div>
                <div className="text-left hidden sm:block max-w-[110px]">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight">
                    {user?.first_name || 'Talaba'}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate leading-tight">
                    {user?.group || '301-AT'}
                  </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-3xl p-1.5 shadow-2xl border-slate-200/80 dark:border-violet-500/30 bg-white/95 dark:bg-[#140D26]/95 backdrop-blur-2xl">
              <DropdownMenuLabel className="p-3 bg-muted/30 rounded-2xl mb-1">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-10 w-10 ring-2 ring-violet-500/40">
                    <AvatarImage src={user?.avatar} alt={user?.first_name} />
                    <AvatarFallback className="bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm">
                      {user?.first_name?.[0] || 'T'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {user?.email || 'student@politexnikum.uz'}
                    </p>
                    <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[9px]">
                      Guruh: {user?.group || '301-AT'}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigate('/profile?tab=profile')}
                className="cursor-pointer gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Mening profilim</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/profile?tab=settings')}
                className="cursor-pointer gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <Settings className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Tizim sozlamalari</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate('/profile?tab=security')}
                className="cursor-pointer gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold"
              >
                <Shield className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                <span>Xavfsizlik & Parol</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 bg-slate-200/80 dark:bg-white/10" />

              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="cursor-pointer gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="h-4 w-4" />
                <span>Tizimdan chiqish</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
