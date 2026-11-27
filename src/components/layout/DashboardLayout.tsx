import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { X } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });
  const location = useLocation();

  const handleToggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  // Determine current page title based on route
  const getPageTitle = (path: string): string => {
    switch (path) {
      case '/dashboard':
        return 'Boshqaruv paneli';
      case '/schedule':
        return 'Dars jadvali';
      case '/grades':
        return "O'zlashtirish & Baholar";
      case '/attendance':
        return 'Davomat jurnali';
      case '/assignments':
        return 'Topshiriqlar & Amaliyot';
      case '/rating':
        return 'Talabalar reytingi';
      case '/chat':
        return 'Guruh muloqoti';
      case '/library':
        return 'Elektron kutubxona';
      case '/announcements':
        return "E'lonlar & Yangiliklar";
      case '/goals':
        return 'Shaxsiy maqsadlar';
      case '/profile':
      case '/settings':
        return 'Profil & Sozlamalar';
      default:
        return '3-Politexnikum';
    }
  };

  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#EFEFF6] dark:bg-[#06030B] p-2.5 sm:p-3.5 gap-2.5 sm:gap-3.5 transition-colors duration-200">
      {/* Desktop Collapsible Floating Rounded Sidebar */}
      <Sidebar
        collapsed={isCollapsed}
        onToggleCollapse={handleToggleSidebar}
        className="hidden md:flex"
      />

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex p-2.5">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 flex flex-col w-72 max-w-[82vw] h-full rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-muted-foreground hover:bg-slate-100 dark:hover:bg-white/10 z-20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar
              collapsed={false}
              onNavigate={() => setMobileMenuOpen(false)}
              className="w-full shadow-none"
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden gap-2.5 sm:gap-3.5">
        <Header
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
          onToggleSidebar={handleToggleSidebar}
          isSidebarCollapsed={isCollapsed}
          title={title}
        />

        <main className="flex-1 overflow-y-auto px-1 sm:px-2 pb-4 pt-1">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
