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
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
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
  { name: 'Profil', path: '/profile', icon: User },
  { name: 'Sozlamalar', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-card border-r border-border/80 w-64 select-none shrink-0 transition-all duration-300',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border/70 justify-between">
        <NavLink to="/dashboard" className="flex items-center gap-3 group" onClick={onNavigate}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              3-Politexnikum
            </span>
            <p className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">
              Student Hub
            </p>
          </div>
        </NavLink>
      </div>

      {isDemo && (
        <div className="mx-4 mt-3 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <span className="text-xs font-medium text-amber-500 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Demo rejim faol
          </span>
          <Badge variant="warning" className="text-[10px] py-0 px-1.5">
            Test
          </Badge>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Asosiy bo'limlar
        </div>
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={cn(
                        'h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-110',
                        isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-primary'
                      )}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.badge && !isActive && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-500/10 text-blue-500 border-0">
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && <ChevronRight className="h-4 w-4 shrink-0 opacity-80" />}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-border/70 mt-auto bg-muted/30">
        <div className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/80 shadow-sm">
          <NavLink to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-90 transition-opacity">
            <Avatar className="h-9 w-9 ring-1 ring-primary/30">
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
      </div>
    </aside>
  );
};
