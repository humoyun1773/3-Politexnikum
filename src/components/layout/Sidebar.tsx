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
  Sparkles,
  ChevronRight,
  ChevronLeft,
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
  { name: 'Topshiriqlar', path: '/assignments', icon: FileCheck2, badge: 'Faol' },
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
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-r border-border/80 select-none shrink-0 transition-all duration-300 ease-in-out relative',
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
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
            <GraduationCap className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden transition-opacity duration-200">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent truncate block">
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
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden md:flex items-center justify-center"
            title="Sidebarni yig'ish"
            aria-label="Sidebarni yig'ish"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Demo Mode Badge */}
      {isDemo && (
        <div
          className={cn(
            'transition-all',
            collapsed
              ? 'mx-auto my-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center'
              : 'mx-4 mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between'
          )}
          title="Demo rejim faol"
        >
          <span className="text-xs font-medium text-amber-500 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {!collapsed && 'Demo rejim faol'}
          </span>
          {!collapsed && (
            <Badge variant="warning" className="text-[10px] py-0 px-1.5">
              Test
            </Badge>
          )}
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
        {!collapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Asosiy bo'limlar
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
                    ? 'justify-center h-11 w-11 mx-auto'
                    : 'justify-between px-3.5 py-2.5',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className={cn('flex items-center min-w-0', collapsed ? 'justify-center' : 'gap-3')}>
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'
                      )}
                    />
                    {!collapsed && <span className="truncate">{item.name}</span>}
                  </div>
                  {!collapsed && item.badge && !isActive && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-500 border-0">
                      {item.badge}
                    </Badge>
                  )}
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
            <PanelLeftOpen className="h-5 w-5 text-primary" />
          </button>
        </div>
      )}

      {/* User Footer Card */}
      <div className={cn('border-t border-border/70 mt-auto bg-muted/30 transition-all', collapsed ? 'p-2' : 'p-3')}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <NavLink
              to="/profile"
              title={`${user?.first_name || 'Talaba'} (${user?.group || 'AT-21/1'})`}
              className="hover:opacity-90 transition-opacity"
            >
              <Avatar className="h-9 w-9 ring-1 ring-primary/30 mx-auto">
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
          <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 shadow-sm">
            <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity">
              <Avatar className="h-9 w-9 ring-1 ring-primary/30 shrink-0">
                <AvatarImage src={user?.avatar} alt={user?.first_name} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                  {user?.first_name?.[0] || 'T'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Talaba'}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{user?.group || 'AT-21/1'}</p>
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
