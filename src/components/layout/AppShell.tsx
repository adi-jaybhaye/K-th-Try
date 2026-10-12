import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Calendar,
  CheckSquare,
  RotateCcw,
  BookMarked,
  Briefcase,
  Terminal,
  BarChart3,
  Settings,
  Search,
  Menu,
  X,
  Database,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { BrandLogo, BrandIcon } from '../brand/BrandLogo';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { CommandPalette } from '../search/CommandPalette';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const PRIMARY_NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmap', path: '/roadmap', icon: Map },
  { name: 'My Timeline', path: '/timeline', icon: Calendar },
  { name: 'Practice', path: '/practice', icon: CheckSquare },
  { name: 'Revision', path: '/revision', icon: RotateCcw },
  { name: 'Resources', path: '/resources', icon: BookMarked },
  { name: 'Placement Prep', path: '/placement', icon: Briefcase },
  { name: 'Mock Interview', path: '/mock-interview', icon: Terminal },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

export const AppShell: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const location = useLocation();

  const isCloudActive = isSupabaseConfigured();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white text-[#1D1A39] ${isDarkTheme ? 'dark bg-[#0F0D1E] text-[#F7F5F9]' : ''}`}>
      {/* Command Palette Modal */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#F0EAE8] bg-[#FFFDFC] transition-all duration-300 z-30 shrink-0 select-none ${
            isSidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Logo Lockup */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#F0EAE8]">
            <NavLink to="/dashboard" className="flex items-center gap-2 overflow-hidden">
              {isSidebarCollapsed ? (
                <BrandIcon size={32} />
              ) : (
                <BrandLogo variant="lockup" size="md" isDark={isDarkTheme} />
              )}
            </NavLink>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 rounded-lg text-[#7E6C7C] hover:text-[#1D1A39] hover:bg-[#FAF7F6] transition-colors"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Search Button */}
          <div className="px-3 pt-3 pb-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#7E6C7C] bg-[#FAF7F6] border border-[#E2D6D4] hover:border-[#C8B6B4] rounded-xl transition-colors ${
                isSidebarCollapsed ? 'justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-[#AE445A]" />
                {!isSidebarCollapsed && <span>Search curriculum...</span>}
              </div>
              {!isSidebarCollapsed && (
                <kbd className="font-mono text-[10px] bg-white border border-[#E2D6D4] px-1.5 py-0.5 rounded text-[#7E6C7C]">
                  ⌘K
                </kbd>
              )}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#1D1A39] text-white shadow-xs'
                        : 'text-[#574459] hover:text-[#1D1A39] hover:bg-[#FAF7F6]'
                    } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`
                  }
                  title={isSidebarCollapsed ? item.name : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Secondary Controls */}
          <div className="p-3 border-t border-[#F0EAE8] space-y-2">
            {/* Storage status pill */}
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-[#FAF7F6] border border-[#E2D6D4] ${
                isSidebarCollapsed ? 'justify-center px-0' : ''
              }`}
              title={
                isCloudActive
                  ? 'Connected to Supabase PostgreSQL'
                  : 'Operating in Local Guest Mode (IndexedDB persistent)'
              }
            >
              {isCloudActive ? (
                <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <Database className="w-3.5 h-3.5 text-[#F39F5A] shrink-0" />
              )}
              {!isSidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="font-semibold text-[#1D1A39] text-[11px] leading-tight">
                    {isCloudActive ? 'Cloud Connected' : 'Guest Mode'}
                  </span>
                  <span className="text-[10px] text-[#7E6C7C] leading-tight">
                    {isCloudActive ? 'Supabase Sync' : 'IndexedDB Local'}
                  </span>
                </div>
              )}
            </div>

            {/* Settings & Theme */}
            <div className={`flex items-center ${isSidebarCollapsed ? 'flex-col gap-1' : 'justify-between'}`}>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-[#574459] hover:text-[#1D1A39] hover:bg-[#FAF7F6] transition-colors ${
                    isActive ? 'bg-[#FAF7F6] text-[#1D1A39]' : ''
                  }`
                }
                title="Settings & Data Management"
              >
                <Settings className="w-3.5 h-3.5" />
                {!isSidebarCollapsed && <span>Settings</span>}
              </NavLink>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-[#7E6C7C] hover:text-[#1D1A39] hover:bg-[#FAF7F6] transition-colors"
                title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle theme"
              >
                {isDarkTheme ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </aside>

        {/* MOBILE DRAWER OVERLAY */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#1D1A39]/60 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="w-4/5 max-w-xs h-full bg-white flex flex-col p-4 shadow-xl animate-in slide-in-from-left duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#F0EAE8]">
                <BrandLogo variant="lockup" size="md" isDark={isDarkTheme} />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#7E6C7C] hover:bg-[#FAF7F6]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                          isActive
                            ? 'bg-[#1D1A39] text-white shadow-xs'
                            : 'text-[#574459] hover:text-[#1D1A39] hover:bg-[#FAF7F6]'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-[#F0EAE8] space-y-2">
                <NavLink
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#574459]"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings &amp; Backup</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* TOPBAR */}
          <header className="h-14 sm:h-16 border-b border-[#F0EAE8] bg-white flex items-center justify-between px-4 sm:px-8 shrink-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-xl text-[#7E6C7C] hover:bg-[#FAF7F6]"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[#7E6C7C]">
                <span className="font-display font-semibold text-[#1D1A39]">KthTry</span>
                <span>/</span>
                <span className="capitalize">
                  {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
                </span>
              </div>

              <div className="sm:hidden">
                <BrandLogo variant="wordmark" size="sm" isDark={isDarkTheme} />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium bg-[#FAF7F6] border border-[#E2D6D4] text-[#574459] hover:border-[#C8B6B4]"
              >
                <Search className="w-3.5 h-3.5 text-[#AE445A]" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden sm:inline font-mono text-[10px] bg-white px-1 rounded text-[#7E6C7C]">
                  ⌘K
                </kbd>
              </button>

              <NavLink
                to="/onboarding"
                className="hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#F39F5A]/15 text-[#974C0C] border border-[#F39F5A]/35 hover:bg-[#F39F5A]/25 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#F39F5A]" />
                <span>Study Plan</span>
              </NavLink>

              <NavLink
                to="/settings"
                className="p-2 rounded-xl text-[#7E6C7C] hover:text-[#1D1A39] hover:bg-[#FAF7F6]"
                title="Settings"
              >
                <Settings className="w-4 h-4" />
              </NavLink>
            </div>
          </header>

          {/* PAGE OUTLET CONTAINER */}
          <main className="flex-1 overflow-y-auto bg-white p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
