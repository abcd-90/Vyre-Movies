import React from 'react';
import type { CastMember } from '../../types/media';

interface CastCardProps {
  cast: CastMember;
}

export const CastCard: React.FC<CastCardProps> = ({ cast }) => {
  return (
    <div className="flex items-center gap-3 p-2.5 bg-[#171B21] border border-[#292F37] rounded-xl w-[180px] sm:w-[200px] flex-shrink-0">
      <img
        src={cast.profilePath || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
        alt={cast.name}
        className="w-10 h-10 rounded-full object-cover bg-[#0B0D10] border border-[#292F37]"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-[#F4F5F7] truncate">{cast.name}</h4>
        <p className="text-[11px] text-[#9BA3AE] truncate">{cast.character}</p>
      </div>
    </div>
  );
};
