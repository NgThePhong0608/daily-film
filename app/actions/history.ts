"use server";

import { db } from "@/lib/db";
import { WatchHistoryItem } from "@/types/history";
import { revalidatePath } from "next/cache";

// Type matches payload from Player
export interface WatchProgressInput {
  username: string; // Added username
  movieSlug: string;
  movieTitle: string;
  posterUrl: string;
  episodeSlug: string;
  episodeName: string;
  currentTime: number;
  duration?: number;
}

export async function saveWatchProgress(data: WatchProgressInput) {
  try {
    const { username } = data;
    if (!username) return { success: false };
    
    // Ensure user exists (idempotent ignore)
    // We expect user to be registered at /welcome, but safer to check/insert if missing?
    // Actually, simple constraint: INSERT OR IGNORE if we strictly trusting client.
    await db.execute({
        sql: `INSERT OR IGNORE INTO users (username, created_at) VALUES (?, ?)`,
        args: [username, Date.now()]
    });

    const now = Date.now();
    
    // If finished (progress > 95%), remove it?
    if (data.duration && data.duration > 0 && (data.currentTime / data.duration) >= 0.95) {
        await removeWatchProgress(username, data.movieSlug);
        return { success: true, removed: true };
    }

    await db.execute({
      sql: `
        INSERT INTO watch_progress (
          user_id, movie_slug, episode_slug, current_time, updated_at,
          movie_title, poster_url, episode_name, duration
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id, movie_slug) DO UPDATE SET
          episode_slug = excluded.episode_slug,
          current_time = excluded.current_time,
          updated_at = excluded.updated_at,
          episode_name = excluded.episode_name
      `,
      args: [
        username,
        data.movieSlug,
        data.episodeSlug,
        data.currentTime,
        now,
        data.movieTitle,
        data.posterUrl,
        data.episodeName,
        data.duration || 0
      ]
    });

    revalidatePath("/"); // Update home page
    return { success: true };
  } catch (error) {
    console.error("saveWatchProgress error:", error);
    return { success: false };
  }
}

export async function getContinueWatching(username: string) {
  try {
    if (!username) return [];
    
    const result = await db.execute({
      sql: `
        SELECT movie_slug, movie_title, poster_url, episode_slug, episode_name, current_time, updated_at, duration
        FROM watch_progress
        WHERE user_id = ?
        ORDER BY updated_at DESC
        LIMIT 10
      `,
      args: [username]
    });

    return result.rows.map(row => ({
      movieSlug: row.movie_slug as string,
      movieTitle: row.movie_title as string,
      posterUrl: row.poster_url as string,
      episodeSlug: row.episode_slug as string,
      episodeName: row.episode_name as string,
      currentTime: row.current_time as number,
      updatedAt: row.updated_at as number,
      duration: row.duration as number
    })) as WatchHistoryItem[];

  } catch (error) {
    console.error("getContinueWatching error:", error);
    return [];
  }
}

export async function removeWatchProgress(username: string, movieSlug: string) {
    try {
        if (!username) return { success: true };
        await db.execute({
            sql: "DELETE FROM watch_progress WHERE user_id = ? AND movie_slug = ?",
            args: [username, movieSlug]
        });
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("removeWatchProgress error:", error);
        return { success: false };
    }
}
