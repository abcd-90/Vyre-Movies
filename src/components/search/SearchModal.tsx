import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Star, Clock, ArrowRight } from 'lucide-react';
import { searchMedia } from '../../lib/providers/tmdb';
import type { NormalizedMedia } from '../../types/media';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_SEARCHES = ['Oppenheimer', 'Arcane', 'Interstellar', 'The Last of Us', 'Dune'];
const RECENT_SEARCHES_KEY = 'vyre_recent_searches';

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<NormalizedMedia[]>([]);
  const [tv, setTv] = useState<NormalizedMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setTv([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchMedia(query);
        setMovies(results.movies);
        setTv(results.tv);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const addRecentSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const updated = [searchTerm, ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSelectMedia = (media: NormalizedMedia) => {
    addRecentSearch(media.title);
    onClose();
    if (media.type === 'movie') {
      navigate(`/movie/${media.id}`);
    } else {
      navigate(`/tv/${media.id}`);
    }
  };

  const handleSearchTermClick = (term: string) => {
    setQuery(term);
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div
        className="w-full max-w-3xl bg-[#111419] border border-[#292F37] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-6 py-4 border-b border-[#292F37] gap-4 bg-[#171B21]">
          <Search className="w-5 h-5 text-[#9BA3AE]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, genres..."
            className="flex-1 bg-transparent text-[#F4F5F7] placeholder-[#626A75] text-lg outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#9BA3AE] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-1 text-xs font-mono font-semibold text-[#626A75] bg-[#0B0D10] border border-[#292F37] rounded-md">
            ESC
          </span>
          <button
            onClick={onClose}
            className="text-sm font-semibold text-[#9BA3AE] hover:text-white transition-colors ml-2"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#D6FF3F] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!query && !loading && (
            <div className="space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#9BA3AE] flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </h4>
                    <button
                      onClick={handleClearRecent}
                      className="text-xs text-[#626A75] hover:text-[#9BA3AE] transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, i) => (
                      <button
                        key={i}
                        onClick={() => handleSearchTermClick(term)}
                        className="px-3 py-1.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/50 rounded-lg text-sm text-[#F4F5F7] transition-all flex items-center gap-1.5"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9BA3AE] mb-3">
                  Suggested Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_SEARCHES.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSearchTermClick(term)}
                      className="px-3.5 py-1.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F] hover:text-[#D6FF3F] rounded-lg text-sm text-[#9BA3AE] transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!loading && query && (
            <div className="space-y-6">
              {movies.length === 0 && tv.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#9BA3AE] text-base font-medium">No results found for "{query}"</p>
                  <p className="text-[#626A75] text-sm mt-1">Try checking for spelling errors or searching another title.</p>
                </div>
              ) : (
                <>
                  {movies.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#9BA3AE] mb-3 flex items-center gap-2">
                        <Film className="w-4 h-4 text-[#D6FF3F]" /> Movies ({movies.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {movies.map((media) => (
                          <div
                            key={`movie-${media.id}`}
                            onClick={() => handleSelectMedia(media)}
                            className="flex items-center gap-3.5 p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/60 rounded-xl cursor-pointer group transition-all duration-200"
                          >
                            <ImageWithFallback
                              src={media.poster || ''}
                              alt={media.title}
                              className="w-12 h-16 object-cover rounded-md bg-[#0B0D10]"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-semibold text-[#F4F5F7] group-hover:text-[#D6FF3F] transition-colors truncate">
                                {media.title}
                              </h5>
                              <div className="flex items-center gap-2 text-xs text-[#9BA3AE] mt-1">
                                <span>{media.year}</span>
                                <span>•</span>
                                <span className="flex items-center text-[#D6FF3F] gap-0.5">
                                  <Star className="w-3 h-3 fill-[#D6FF3F]" /> {media.rating}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#626A75] group-hover:text-[#D6FF3F] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tv.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#9BA3AE] mb-3 flex items-center gap-2">
                        <Tv className="w-4 h-4 text-[#D6FF3F]" /> TV Shows ({tv.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {tv.map((media) => (
                          <div
                            key={`tv-${media.id}`}
                            onClick={() => handleSelectMedia(media)}
                            className="flex items-center gap-3.5 p-2.5 bg-[#171B21] border border-[#292F37] hover:border-[#D6FF3F]/60 rounded-xl cursor-pointer group transition-all duration-200"
                          >
                            <ImageWithFallback
                              src={media.poster || ''}
                              alt={media.title}
                              className="w-12 h-16 object-cover rounded-md bg-[#0B0D10]"
                              loading="lazy"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="text-sm font-semibold text-[#F4F5F7] group-hover:text-[#D6FF3F] transition-colors truncate">
                                {media.title}
                              </h5>
                              <div className="flex items-center gap-2 text-xs text-[#9BA3AE] mt-1">
                                <span>{media.year}</span>
                                <span>•</span>
                                <span className="flex items-center text-[#D6FF3F] gap-0.5">
                                  <Star className="w-3 h-3 fill-[#D6FF3F]" /> {media.rating}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-[#626A75] group-hover:text-[#D6FF3F] group-hover:translate-x-1 transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
