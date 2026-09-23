import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { TrendingPage } from './pages/TrendingPage';
import { GenrePage } from './pages/GenrePage';
import { MovieDetailsPage } from './pages/MovieDetailsPage';
import { TVDetailsPage } from './pages/TVDetailsPage';
import { MovieWatchPage } from './pages/MovieWatchPage';
import { TVWatchPage } from './pages/TVWatchPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SettingsPage } from './pages/SettingsPage';
import { initSecurityProtection } from './lib/security';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export function App() {
  useEffect(() => {
    initSecurityProtection();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#0B0D10] text-[#F4F5F7] flex flex-col font-sans select-none">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/tv" element={<TVShowsPage />} />
            <Route path="/trending" element={<TrendingPage />} />
            <Route path="/genre/:slug" element={<GenrePage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
            <Route path="/tv/:id" element={<TVDetailsPage />} />
            <Route path="/watch/movie/:id" element={<MovieWatchPage />} />
            <Route path="/watch/tv/:id/:season/:episode" element={<TVWatchPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
