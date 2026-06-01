"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface RatingStats {
  average: number;
  total: number;
}

/**
 * Get aggregated rating for a movie
 */
export async function getMovieRating(movieSlug: string): Promise<RatingStats> {
  try {
    const result = await db.execute({
      sql: "SELECT average, total FROM movie_rating_stats WHERE movie_slug = ?",
      args: [movieSlug],
    });

    if (result.rows.length === 0) {
      return { average: 0, total: 0 };
    }

    return {
      average: result.rows[0].average as number,
      total: result.rows[0].total as number,
    };
  } catch (error) {
    console.error("Error fetching rating:", error);
    return { average: 0, total: 0 };
  }
}

/**
 * Get specific user's rating for a movie
 */
export async function getUserMovieRating(movieSlug: string, username: string): Promise<number | null> {
  try {
    const result = await db.execute({
      sql: "SELECT stars FROM ratings WHERE movie_slug = ? AND username = ?",
      args: [movieSlug, username],
    });

    if (result.rows.length > 0) {
      return result.rows[0].stars as number;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
}

/**
 * Rate a movie
 */
export async function rateMovie(movieSlug: string, username: string, stars: number) {
  if (stars < 1 || stars > 5) {
    return { error: "Đánh giá không hợp lệ (1-5 sao)" };
  }

  try {
    // 1. Check if user exists
    const userCheck = await db.execute({
      sql: "SELECT username FROM users WHERE username = ?",
      args: [username],
    });

    if (userCheck.rows.length === 0) {
      return { error: "Người dùng không tồn tại" };
    }

    // 2. Upsert Rating
    const now = Date.now();
    const id = crypto.randomUUID();

    await db.execute({
      sql: `
        INSERT INTO ratings (id, movie_slug, username, stars, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(movie_slug, username) DO UPDATE SET
          stars = excluded.stars,
          updated_at = excluded.updated_at
      `,
      args: [id, movieSlug, username, stars, now, now],
    });

    // 3. Recalculate Stats (Atomic-ish via transaction logic usually, but here sequential)
    // Fetch fresh stats from ratings table
    const statsResult = await db.execute({
      sql: `SELECT AVG(stars) as avg_stars, COUNT(*) as total_votes FROM ratings WHERE movie_slug = ?`,
      args: [movieSlug],
    });

    const newAvg = statsResult.rows[0].avg_stars as number || 0;
    const newTotal = statsResult.rows[0].total_votes as number || 0;

    // 4. Update Stats Table
    await db.execute({
      sql: `
        INSERT INTO movie_rating_stats (movie_slug, average, total, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(movie_slug) DO UPDATE SET
          average = excluded.average,
          total = excluded.total,
          updated_at = excluded.updated_at
      `,
      args: [movieSlug, newAvg, newTotal, now],
    });

    revalidatePath(`/phim/${movieSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error rating movie:", error);
    return { error: "Lỗi hệ thống" };
  }
}

export interface RatedMovie {
  movieSlug: string;
  average: number;
  total: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  movieData?: any;
}

/**
 * Get Top Rated Movies (All Time)
 */
export async function getTopRatedMovies(limit = 10): Promise<RatedMovie[]> {
  try {
    // 1. Fetch top stats
    // Sort by Average DESC, then Total DESC (to break ties with popularity)
    const resultNoThreshold = await db.execute({
        sql: `
          SELECT movie_slug, average, total
          FROM movie_rating_stats
          ORDER BY average DESC, total DESC
          LIMIT ?
        `,
        args: [limit],
    });

    const ratedList = resultNoThreshold.rows.map(row => ({
      movieSlug: row.movie_slug as string,
      average: row.average as number,
      total: row.total as number,
    }));

    if (ratedList.length === 0) return [];

    // 2. Enrich with Movie Data
    // We need import { getMovieDetail } from "@/lib/ophim";
    // But this file doesn't import it yet.
    
    const { getMovieDetail } = await import("@/lib/ophim");

    const enrichedList = await Promise.all(
        ratedList.map(async (item) => {
          try {
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

    return enrichedList.filter(item => item.movieData !== null);

  } catch (error) {
    console.error("Error fetching top rated:", error);
    return [];
  }
}
