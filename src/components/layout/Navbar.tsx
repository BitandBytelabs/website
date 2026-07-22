import React, { useState } from 'react';
import { Cpu, Radio, Search, Shield, Menu, X, Terminal, BookOpen, User, FolderGit2, Info, Mail, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme, Theme } from '../../context/ThemeContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearchOpen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onSearchOpen }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeDropdown, setThemeDropdown] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const navItems = [
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Team', path: '/team', icon: User },
    { label: 'Research', path: '/research', icon: Terminal },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-surface)]/90 backdrop-blur-md border-b border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* BRAND LOGO */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-[var(--bg-card)] border border-[var(--border-color)] flex items-center justify-center text-[var(--accent-color)] group-hover:border-[var(--accent-color)] transition-all">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex items-center space-x-3">
              <div>
                <div className="text-lg font-bold tracking-tighter text-[var(--text-primary)] font-mono flex items-center space-x-1">
                  <span>BIT</span>
                  <span className="text-[var(--accent-color)]">//</span>
                  <span>VOLT</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-mono hidden sm:block">
                  Bits. Signals. Systems.
                </p>
              </div>
            </div>
          </button>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`text-[11px] uppercase tracking-wider font-mono font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent-color)] pb-0.5'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT UTILITIES */}
          <div className="flex items-center space-x-3">
            {/* THEME SWITCHER */}
            <div className="relative">
              <button
                onClick={() => setThemeDropdown(!themeDropdown)}
                className="p-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[var(--accent-color)] text-[var(--text-secondary)] rounded-sm font-mono text-[11px] flex items-center space-x-1 transition-colors"
                title={`Current theme: ${theme}`}
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span className="uppercase text-[10px] hidden sm:inline">{theme}</span>
              </button>

              {themeDropdown && (
                <div className="absolute right-0 mt-2 w-32 bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xl rounded-sm py-1 z-50 font-mono text-xs">
                  <button
                    onClick={() => { setTheme('dark'); setThemeDropdown(false); }}
                    className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-[var(--bg-card-hover)] ${
                      theme === 'dark' ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Dark</span>
                  </button>
                  <button
                    onClick={() => { setTheme('light'); setThemeDropdown(false); }}
                    className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-[var(--bg-card-hover)] ${
                      theme === 'light' ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() => { setTheme('system'); setThemeDropdown(false); }}
                    className={`w-full px-3 py-1.5 text-left flex items-center space-x-2 hover:bg-[var(--bg-card-hover)] ${
                      theme === 'system' ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>System</span>
                  </button>
                </div>
              )}
            </div>

            {/* ADMIN CMS PORTAL (ICON ONLY IF DESKTOP OR COMPACT) */}
            <button
              onClick={() => handleNav('/admin')}
              className={`px-3 py-1 rounded-sm text-[11px] uppercase tracking-wider font-mono transition-all flex items-center space-x-1.5 ${
                isAuthenticated
                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30 hover:bg-purple-500/20'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:border-[var(--accent-color)]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span className="hidden sm:inline font-bold">
                {isAuthenticated ? `CMS [${user?.role || 'Admin'}]` : 'Admin'}
              </span>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              {mobileOpen ? <X className="w-6 h-6 text-[var(--accent-color)]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[var(--bg-card-hover)] text-[var(--accent-color)] border-l-2 border-[var(--accent-color)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4 text-[var(--accent-color)]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};

