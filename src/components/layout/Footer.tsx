import React from 'react';
import { Link } from 'react-router-dom';
import { VyreLogo } from '../common/VyreLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0D10] border-t border-[#292F37] pt-16 pb-12 mt-20 text-xs text-[#9BA3AE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <VyreLogo />
            <p className="text-[#626A75] text-xs leading-relaxed max-w-xs">
              VYRE is a premium cinematic discovery and playback platform built for digital entertainment enthusiasts.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F5F7] mb-4">Discover</h4>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/movies" className="hover:text-[#D6FF3F] transition-colors">Popular Movies</Link></li>
              <li><Link to="/tv" className="hover:text-[#D6FF3F] transition-colors">Top TV Shows</Link></li>
              <li><Link to="/trending" className="hover:text-[#D6FF3F] transition-colors">Trending Now</Link></li>
              <li><Link to="/genre/action" className="hover:text-[#D6FF3F] transition-colors">Action & Adventure</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F5F7] mb-4">Genres</h4>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/genre/sci-fi" className="hover:text-[#D6FF3F] transition-colors">Sci-Fi & Fantasy</Link></li>
              <li><Link to="/genre/thriller" className="hover:text-[#D6FF3F] transition-colors">Thrillers</Link></li>
              <li><Link to="/genre/comedy" className="hover:text-[#D6FF3F] transition-colors">Comedies</Link></li>
              <li><Link to="/genre/drama" className="hover:text-[#D6FF3F] transition-colors">Dramas</Link></li>
            </ul>
          </div>

          {/* Legal & Platform info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F4F5F7] mb-4">Account</h4>
            <ul className="space-y-2.5 font-medium">
              <li><Link to="/watchlist" className="hover:text-[#D6FF3F] transition-colors">My Watchlist</Link></li>
              <li><Link to="/settings" className="hover:text-[#D6FF3F] transition-colors">Preferences</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#292F37]/60 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-[11px] text-[#626A75]">
            © {new Date().getFullYear()} VYRE Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
