import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Search, Bookmark, Settings, Menu, X, Shield } from 'lucide-react';
import { VyreLogo } from '../common/VyreLogo';
import { SearchModal } from '../search/SearchModal';
import { getWatchlist } from '../../lib/storage';

export const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const updateCount = () => {
      setWatchlistCount(getWatchlist().length);
    };
    updateCount();
    window.addEventListener('storage', updateCount);
    const interval = setInterval(updateCount, 1000);
    return () => {
      window.removeEventListener('storage', updateCount);
      clearInterval(interval);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/tv' },
    { label: 'Trending', path: '/trending' },
    { label: 'Genres', path: '/genre/action' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0D10]/90 backdrop-blur-md border-b border-[#292F37]/80 py-3 shadow-lg'
            : 'bg-gradient-to-b from-[#0B0D10]/80 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <VyreLogo />

          <nav className="hidden md:flex items-center gap-1 bg-[#171B21]/60 border border-[#292F37] px-3 py-1.5 rounded-full backdrop-blur-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#D6FF3F] text-[#0B0D10] font-semibold shadow-sm'
                      : 'text-[#9BA3AE] hover:text-[#F4F5F7] hover:bg-[#1D2229]/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-[#F4F5F7] rounded-xl text-xs font-medium transition-all group"
              title="Search (Ctrl+K)"
            >
              <Search className="w-4 h-4 group-hover:text-[#D6FF3F] transition-colors" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[#626A75] bg-[#0B0D10] border border-[#292F37] rounded">
                ⌘K
              </kbd>
            </button>

            <Link
              to="/watchlist"
              className="relative p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-[#F4F5F7] rounded-xl transition-all group"
              title="Watchlist"
            >
              <Bookmark className="w-4 h-4 group-hover:text-[#D6FF3F] transition-colors" />
              {watchlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D6FF3F] text-[#0B0D10] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#0B0D10]">
                  {watchlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/admin"
              className="p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-[#D6FF3F] rounded-xl transition-all group"
              title="Audio & Stream Admin"
            >
              <Shield className="w-4 h-4 group-hover:text-[#D6FF3F] transition-colors" />
            </Link>

            <Link
              to="/settings"
              className="p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 text-[#9BA3AE] hover:text-[#F4F5F7] rounded-xl transition-all group"
              title="Settings"
            >
              <Settings className="w-4 h-4 group-hover:text-[#D6FF3F] transition-colors" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 bg-[#171B21] border border-[#292F37] text-[#9BA3AE] hover:text-[#F4F5F7] rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111419] border-b border-[#292F37] px-4 py-4 space-y-2 mt-2 animate-in slide-in-from-top-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#D6FF3F] text-[#0B0D10] font-bold'
                      : 'text-[#9BA3AE] hover:text-[#F4F5F7] hover:bg-[#171B21]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#D6FF3F] text-[#0B0D10] font-bold'
                    : 'text-[#9BA3AE] hover:text-[#F4F5F7] hover:bg-[#171B21]'
                }`
              }
            >
              Audio & Dubbing Admin
            </NavLink>
          </div>
        )}
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
