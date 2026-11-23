import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
  onNavigate?: () => void;
}

export const navigationItems = [
  { name: 'Boshqaruv paneli', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Dars jadvali', path: '/schedule', icon: Calendar },
  { name: 'Baholar & O\'zlashtirish', path: '/grades', icon: GraduationCap },
  { name: 'Davomat', path: '/attendance', icon: ClipboardCheck },
  { name: 'Topshiriqlar', path: '/assignments', icon: FileCheck2 },
  { name: 'Talabalar reytingi', path: '/rating', icon: Trophy },
  { name: 'Guruh chat', path: '/chat', icon: MessageSquare },
  { name: 'Kutubxona', path: '/library', icon: BookOpen },
  { name: 'E\'lonlar', path: '/announcements', icon: Bell },
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card/90 backdrop-blur-xl border-r border-border/70 select-none shrink-0 transition-all duration-300 ease-in-out relative z-30',
        collapsed ? 'w-20' : 'w-64',
        className
      )}
    >
      {/* Brand Header */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-border/70 transition-all',
          collapsed ? 'justify-center px-2' : 'justify-between px-5'
        )}
      >
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 group min-w-0"
          onClick={onNavigate}
          title="3-Politexnikum Student Hub"
        >
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden transition-opacity duration-200">
              <span className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent truncate block">
                3-Politexnikum
              </span>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider truncate">
                Student Hub
              </p>
            </div>
          )}
        </NavLink>

        {/* Desktop Collapse/Expand Toggle Button in Header */}
        {onToggleCollapse && !collapsed && (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors hidden md:flex items-center justify-center"
            title="Sidebarni yig'ish"
            aria-label="Sidebarni yig'ish"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/75">
            Menyular
          </div>
        )}
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-xl text-sm font-medium transition-all group',
                  collapsed
                    ? 'justify-center h-10 w-10 mx-auto my-1'
                    : 'justify-between px-3 py-2.5',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/70'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn('flex items-center min-w-0', collapsed ? 'justify-center' : 'gap-3')}>
                    <Icon
                      className={cn(
                        'h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'
                      )}
                    />
                    {!collapsed && <span className="truncate text-xs sm:text-sm">{item.name}</span>}
                  </div>
                  {!collapsed && isActive && <ChevronRight className="h-4 w-4 shrink-0 opacity-80" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Expand Button for Collapsed State */}
      {onToggleCollapse && collapsed && (
        <div className="p-2 border-t border-border/70 flex justify-center hidden md:flex">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Sidebarni ochish"
            aria-label="Sidebarni ochish"
          >
            <PanelLeftOpen className="h-4 w-4 text-primary" />
          </button>
        </div>
      )}

      {/* User Footer Card */}
      <div className={cn('border-t border-border/70 mt-auto bg-muted/20 transition-all', collapsed ? 'p-2' : 'p-3')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <NavLink
              to="/profile"
              title={`${user?.first_name || 'Talaba'} (${user?.group || 'AT-21/1'})`}
              className="hover:opacity-90 transition-opacity"
            >
              <Avatar className="h-8 w-8 ring-2 ring-primary/40 mx-auto">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>
            </NavLink>
            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 shadow-xs">
            <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity">
              <Avatar className="h-9 w-9 ring-2 ring-primary/30 shrink-0">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Talaba'}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.group || 'Guruh biriktirilmagan'}</p>
              </div>
            </NavLink>

            <button
              onClick={handleLogout}
              title="Tizimdan chiqish"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
