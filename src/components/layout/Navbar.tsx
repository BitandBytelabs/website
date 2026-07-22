import React, { useState } from 'react';
import { Cpu, Radio, Search, Shield, Menu, X, Terminal, BookOpen, User, FolderGit2, Info, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onSearchOpen?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onSearchOpen }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const navItems = [
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Team', path: '/team', icon: User },
    { label: 'Research', path: '/research', icon: Terminal },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
    { label: 'Docs', path: '/docs', icon: BookOpen },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* BRAND LOGO */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#00FF41] group-hover:border-[#00FF41] transition-all">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div className="flex items-center space-x-3">
              <div>
                <div className="text-lg font-bold tracking-tighter text-white font-mono flex items-center space-x-1">
                  <span>BIT</span>
                  <span className="text-[#00FF41]">//</span>
                  <span>VOLT</span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-[#888] font-mono hidden sm:block">
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
                      ? 'text-white border-b-2 border-[#00FF41] pb-0.5'
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT UTILITIES */}
          <div className="flex items-center space-x-3">
            {/* LIVE SYSTEM STATUS BADGE */}
            <div className="hidden lg:flex items-center gap-2 text-[10px] px-3 py-1 bg-[#1A1A1A] rounded-full border border-[#2A2A2A] font-mono">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse"></div>
              <span className="text-[#00FF41] font-bold tracking-wider">CORE SYSTEMS ONLINE</span>
            </div>

            {/* SEARCH BUTTON */}
            <button
              onClick={onSearchOpen}
              className="px-3 py-1 bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#00FF41]/50 text-[#888] hover:text-white text-[11px] font-mono flex items-center space-x-2 transition-colors rounded-sm"
              title="Search Projects & Research"
            >
              <Search className="w-3.5 h-3.5 text-[#00FF41]" />
              <span className="hidden sm:inline">Search [Ctrl+K]</span>
            </button>

            {/* ADMIN PORTAL LINK */}
            <button
              onClick={() => handleNav('/admin')}
              className={`px-3 py-1 rounded-sm text-[11px] uppercase tracking-wider font-mono transition-all flex items-center space-x-1.5 ${
                isAuthenticated
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:bg-purple-500/20'
                  : 'bg-[#1A1A1A] text-[#E0E0E0] border border-[#2A2A2A] hover:border-[#00FF41]'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-[#00FF41]" />
              <span className="hidden sm:inline font-bold">
                {isAuthenticated ? `CMS [${user?.role || 'Admin'}]` : 'Admin Portal'}
              </span>
            </button>

            {/* MOBILE MENU TOGGLE */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[#888] hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6 text-[#00FF41]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-[#2A2A2A] px-4 pt-2 pb-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full text-left px-3 py-2 text-xs font-mono uppercase tracking-wider flex items-center space-x-2 ${
                  isActive
                    ? 'bg-[#1A1A1A] text-[#00FF41] border-l-2 border-[#00FF41]'
                    : 'text-[#888] hover:bg-[#1A1A1A] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-[#00FF41]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
