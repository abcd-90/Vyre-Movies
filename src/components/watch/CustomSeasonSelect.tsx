import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CustomSeasonSelectProps {
  totalSeasons: number;
  currentSeason: number;
  onSelectSeason: (seasonNum: number) => void;
}

export const CustomSeasonSelect: React.FC<CustomSeasonSelectProps> = ({
  totalSeasons,
  currentSeason,
  onSelectSeason,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const seasonsArray = Array.from({ length: Math.max(1, totalSeasons) }, (_, i) => i + 1);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/60 text-[#F4F5F7] rounded-xl text-xs font-extrabold tracking-wider uppercase transition-all duration-200 shadow-sm focus:outline-none"
      >
        <span className="text-[#D6FF3F]">SEASON {String(currentSeason).padStart(2, '0')}</span>
        <ChevronDown className={`w-4 h-4 text-[#9BA3AE] transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#D6FF3F]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-[#111419] border border-[#292F37] rounded-xl shadow-2xl py-1.5 z-30 animate-in fade-in zoom-in-95 duration-150 max-h-60 overflow-y-auto no-scrollbar">
          {seasonsArray.map((seasonNum) => {
            const isSelected = seasonNum === currentSeason;
            return (
              <button
                key={seasonNum}
                onClick={() => {
                  onSelectSeason(seasonNum);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-xs font-bold flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-[#171B21] text-[#D6FF3F]'
                    : 'text-[#9BA3AE] hover:text-[#F4F5F7] hover:bg-[#171B21]/60'
                }`}
              >
                <span>Season {String(seasonNum).padStart(2, '0')}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D6FF3F]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
