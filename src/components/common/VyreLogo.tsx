import React from 'react';
import { Link } from 'react-router-dom';

interface VyreLogoProps {
  compact?: boolean;
  className?: string;
}

export const VyreLogo: React.FC<VyreLogoProps> = ({ compact = false, className = '' }) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group focus:outline-none ${className}`}>
      {/* Custom Geometric V Mark */}
      <div className="relative w-8 h-8 flex items-center justify-center bg-[#171B21] border border-[#292F37] rounded-lg group-hover:border-[#D6FF3F]/50 transition-colors duration-200 shadow-sm">
        <svg
          viewBox="0 0 100 100"
          className="w-5 h-5 transition-transform duration-200 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M22 25 L46 75 L54 75 L78 25 L64 25 L50 56 L36 25 Z" fill="#D6FF3F" />
        </svg>
      </div>

      {!compact && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-wider text-[#F4F5F7] group-hover:text-white transition-colors uppercase font-mono">
            VYRE
          </span>
          <span className="text-[9px] font-semibold text-[#9BA3AE] tracking-widest uppercase text-left">
            CINEMA
          </span>
        </div>
      )}
    </Link>
  );
};
