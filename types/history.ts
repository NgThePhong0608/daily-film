export interface WatchHistoryItem {
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  currentTime: number; // In seconds
  duration?: number;
  updatedAt: number; // Timestamp
}

export const WATCH_HISTORY_KEY = 'daily-film-history';
