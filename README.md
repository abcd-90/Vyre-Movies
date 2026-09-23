# VYRE — Premium Movie & TV Platform

**Discover. Press Play.**

VYRE is a high-end, cinematic movie & TV discovery and playback application engineered with an original visual identity.

---

## ✨ Features

- **Cinematic Visual Identity**: Obsidian dark theme (`#0B0D10` base, `#111419` carbon, `#171B21` surface) with acid lime accents (`#D6FF3F`).
- **TMDB Metadata Integration**: Live fetching for Movies, TV Series, Cast lists, Recommendations, Genres, and Search.
- **APIPLAYER Embed Provider**: Canonical playback URL generation for movies (`/watch/movie/:id`) and TV shows (`/watch/tv/:id/:season/:episode`).
- **Debounced Instant Search**: Keyboard shortcut (`Ctrl+K` / `⌘K`) with suggested terms and grouped results.
- **Regional & Language Filters**: Dedicated support for **Bollywood (Hindi)**, **Punjabi**, **Hollywood**, **K-Drama**, **Anime**, etc.
- **Watchlist & Watch History**: Persistent local storage for saving titles and resuming play.
- **Security & Protection**: Built-in anti-scraping module (disabled DevTools shortcuts, context menu lock, hidden source maps, and stripped debug logs).

---

## 🛠 Local Setup & Running

### Option 1: Double-Click Launcher (Windows)
Double-click [`Open-VYRE.bat`](./Open-VYRE.bat) to launch the dev server and open `http://localhost:3000` in your browser.

### Option 2: Command Line
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables (.env.local)
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_PLAYER_BASE_URL=https://apiplayer.ru

# 3. Start local dev server
npm run dev -- --port 3000
```

---

## 🚀 Deploying to Vercel

1. Push this repository to **GitHub**.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Add the following **Environment Variables**:
   - `VITE_TMDB_API_KEY`
   - `VITE_PLAYER_BASE_URL`: `https://apiplayer.ru`
4. Click **Deploy**. SPA rewrites are pre-configured in [`vercel.json`](./vercel.json).
