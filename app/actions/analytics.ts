"use server";

import { db } from "@/lib/db";
import { getMovieDetail } from "@/lib/ophim";

/**
 * Log a movie event (play / finish)
 */
export async function logMovieEvent(username: string, movieSlug: string, eventType: "play" | "finish") {
  try {
    if (!username) return { success: false };

    // Simple dedupe by hour using username
    // const eventId = `${username}-${movieSlug}-${eventType}-${new Date().toISOString().slice(0, 13)}`; 

    await db.execute({
      sql: `INSERT INTO movie_events (id, movie_slug, event_type, created_at) VALUES (?, ?, ?, ?)`,
      args: [crypto.randomUUID(), movieSlug, eventType, Date.now()]
    });

    // Increment view count for "play" events (or both? Let's count "play" as a view)
    if (eventType === "play") {
       await db.execute({
          sql: `
            INSERT INTO movie_views (movie_slug, view_count, updated_at)
            VALUES (?, 1, ?)
            ON CONFLICT(movie_slug) DO UPDATE SET
            view_count = view_count + 1,
            updated_at = excluded.updated_at
          `,
          args: [movieSlug, Date.now()]
       });
    }

    return { success: true };
  } catch (error) {
    console.error("logMovieEvent error:", error);
    return { success: false };
  }
}

export interface TrendingMovie {
  movieSlug: string;
  score: number;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  movieData?: any; // Populated from API
}

/**
 * Get trending movies based on window
 * window: 'day' (24h) | 'week' (7d)
 */
export async function getTrendingMovies(_window: 'day' | 'week' = 'day') {
  try {
    void _window; // Suppress unused variable warning
    // const now = Date.now();
    // const windowMs = window === 'day' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    // const since = now - windowMs;

    // Aggregation Query from movie_views (Much faster)
    // Note: This is now "All Time Popular" effectively.
    // If we wanted "Trending" (recent), we'd need a time-decay or daily table.
    // For now, "Faster top 10" implies using the pre-aggregated counter.
    const result = await db.execute({
      sql: `
        SELECT movie_slug, view_count as score
        FROM movie_views
        ORDER BY view_count DESC
        LIMIT 10
      `,
      args: []
    });

    const trendingList: TrendingMovie[] = result.rows.map(row => ({
      movieSlug: row.movie_slug as string,
      score: row.score as number
    }));

    if (trendingList.length === 0) return [];

    // Enrich with Movie Data from API
    // We fetch details for each slug. In a real app, we might have a movie cache DB.
    // Here we use the existing API wrapper.
    const enrichedList = await Promise.all(
      trendingList.map(async (item) => {
        try {
            // Optimally, getLatestMovies or search might be faster if we could filter by slugs,
            // but the API doesn't support 'get by multiple slugs'.
            // So we fetch detail.
            const data = await getMovieDetail(item.movieSlug);
            return {
                ...item,
                movieData: data?.movie || null
            };
        } catch {
            return { ...item, movieData: null };
        }
      })
    );

    // Filter out ones that failed to load
    return enrichedList.filter(item => item.movieData !== null);

  } catch (error) {
    console.error("getTrendingMovies error:", error);
    return [];
  }
}
