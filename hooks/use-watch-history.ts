"use client";

import { useEffect, useState, useCallback } from "react";
import { WatchHistoryItem, WATCH_HISTORY_KEY } from "@/types/history";
import { saveWatchProgress, removeWatchProgress } from "@/app/actions/history";

export function useWatchHistory() {
  const [history, setHistory] = useState<WatchHistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(WATCH_HISTORY_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveHistory = useCallback(async (item: Omit<WatchHistoryItem, "updatedAt">) => {
    try {
      const username = localStorage.getItem("username");
      if (!username) return; // Cannot save without username

      const newItem: WatchHistoryItem = { ...item, updatedAt: Date.now() };
      
      // Optimistic update (Local Storage)
      setHistory((prev) => {
        const filtered = prev.filter((i) => i.movieSlug !== item.movieSlug);
        const updated = [newItem, ...filtered].slice(0, 10);
        localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });

      // Server Sync (DB)
      await saveWatchProgress({
        username,
        movieSlug: item.movieSlug,
        movieTitle: item.movieTitle,
        posterUrl: item.posterUrl,
        episodeSlug: item.episodeSlug,
        episodeName: item.episodeName,
        currentTime: item.currentTime,
        duration: item.duration
      });
    } catch (e) {
      console.error("Failed to save history", e);
    }
  }, []);

  const removeFromHistory = useCallback(async (movieSlug: string) => {
     try {
      const username = localStorage.getItem("username");
      if (!username) return;

      // Optimistic update
      setHistory((prev) => {
        const updated = prev.filter((i) => i.movieSlug !== movieSlug);
        localStorage.setItem(WATCH_HISTORY_KEY, JSON.stringify(updated));
        return updated;
      });

      // Server Sync
      await removeWatchProgress(username, movieSlug);
    } catch (e) {
      console.error("Failed to remove from history", e);
    }
  }, []);

  return { history, isLoaded, saveHistory, removeFromHistory };
}
