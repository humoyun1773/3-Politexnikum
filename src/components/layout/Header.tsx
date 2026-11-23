import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
      setNotifications(data);
      const count = await notificationsService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // fallback
    }
  };

  const handleReadAll = async () => {
    await notificationsService.readAll();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <>
      <header className="h-16 border-b border-border/80 bg-card/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle & Page Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile drawer toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 rounded-lg"
            onClick={onToggleMobileMenu}
            aria-label="Mobil menyu ochish"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Desktop collapse toggle */}
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={onToggleSidebar}
              title={isSidebarCollapsed ? "Sidebarni ochish" : "Sidebarni yig'ish"}
              aria-label={isSidebarCollapsed ? "Sidebarni ochish" : "Sidebarni yig'ish"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5 text-primary" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </Button>
          )}

          {title && (
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground truncate max-w-[200px] sm:max-w-none">
              {title}
            </h1>
          )}
        </div>

        {/* Center: Search trigger */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-input/60 bg-muted/40 hover:bg-muted/80 text-muted-foreground text-xs sm:text-sm max-w-xs md:max-w-md w-full transition-colors cursor-pointer text-left shadow-xs"
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate flex-1">Fanlar, darslar, topshiriqlar...</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg" aria-label="Xabarnomalar">
                <Bell className="h-4 w-4 text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-2xl border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Xabarnomalar</span>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-primary/20 text-primary font-bold px-1.5 py-0.5 rounded-full">
                      {unreadCount} yangi
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleReadAll}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="h-3.5 w-3.5" /> Barchasini o'qish
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-muted-foreground">
                    Hozircha yangi xabarnomalar yo'q
                  </div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 hover:bg-accent/50 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                          {n.category_display}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(n.created_at)}</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-border bg-muted/20 text-center">
                <NavLink
                  to="/announcements"
                  className="text-xs font-medium text-primary hover:underline block py-1"
                >
                  Barcha e'lonlar va bildirishnomalar
                </NavLink>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-accent transition-colors outline-none">
                <Avatar className="h-8 w-8 ring-1 ring-primary/40">
                  <AvatarImage src={user?.avatar} alt={user?.first_name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {user?.first_name?.[0] || 'T'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user?.first_name} {user?.last_name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || 'student@politexnikum.uz'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile?tab=profile')} className="cursor-pointer gap-2">
                <User className="h-4 w-4" />
                <span>Mening profilim</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile?tab=settings')} className="cursor-pointer gap-2">
                <Settings className="h-4 w-4" />
                <span>Sozlamalar</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="cursor-pointer gap-2 text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                <span>Chiqish</span>
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
