"use server";

import { db } from "@/lib/db";

/**
 * Register a new username
 */
export async function registerUsername(username: string) {
  try {
    const normalized = username.trim();
    
    if (normalized.length < 3 || normalized.length > 50) {
        return { error: "Tên người dùng phải từ 3-50 ký tự" };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(normalized)) {
        return { error: "Chỉ cho phép chữ, số và dấu gạch dưới" };
    }

    // Check if exists
    const existing = await db.execute({
        sql: "SELECT username FROM users WHERE username = ?",
        args: [normalized]
    });
    
    if (existing.rows.length === 0) {
        await db.execute({
            sql: "INSERT INTO users (username, created_at) VALUES (?, ?)",
            args: [normalized, Date.now()]
        });
    }

    return { success: true, username: normalized };
  } catch (error) {
    console.error("registerUsername error:", error);
    return { error: "Lỗi máy chủ" };
  }
}

/**
 * Check if username exists (Login/Resume)
 */
export async function checkUsername(username: string) {
    try {
        const result = await db.execute({
            sql: "SELECT username FROM users WHERE username = ?",
            args: [username]
        });
        return { exists: result.rows.length > 0 };
    } catch {
        return { exists: false };
    }
}

/**
 * Toggle Favorite for a movie
 */
export async function toggleFavorite(username: string, movieSlug: string) {
  try {
    if (!username) return { error: true };
    
    // Check if exists
    const existing = await db.execute({
      sql: "SELECT id FROM favorites WHERE user_id = ? AND movie_slug = ?",
      args: [username, movieSlug]
    });
    
    if (existing.rows.length > 0) {
      // Remove
      await db.execute({
          sql: "DELETE FROM favorites WHERE user_id = ? AND movie_slug = ?",
          args: [username, movieSlug]
      });
      return { isFavorite: false };
    } else {
      // Add
      await db.execute({
          sql: "INSERT INTO favorites (id, user_id, movie_slug, created_at) VALUES (?, ?, ?, ?)",
          args: [crypto.randomUUID(), username, movieSlug, Date.now()]
      });
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return { error: true };
  }
}

/**
 * Toggle Follow for a movie
 */
export async function toggleFollow(username: string, movieSlug: string) {
  try {
    if (!username) return { error: true };

    const existing = await db.execute({
      sql: "SELECT id FROM follows WHERE user_id = ? AND movie_slug = ?",
      args: [username, movieSlug]
    });
    
    if (existing.rows.length > 0) {
      // Unfollow
      await db.execute({
          sql: "DELETE FROM follows WHERE user_id = ? AND movie_slug = ?",
          args: [username, movieSlug]
      });
      return { isFollowed: false };
    } else {
      // Follow
      await db.execute({
          sql: "INSERT INTO follows (id, user_id, movie_slug, created_at) VALUES (?, ?, ?, ?)",
          args: [crypto.randomUUID(), username, movieSlug, Date.now()]
      });
      return { isFollowed: true };
    }
  } catch (error) {
    console.error("toggleFollow error:", error);
    return { error: true };
  }
}

/**
 * Get User Stats for a movie (isFavorite, isFollowed)
 */
export async function getUserStats(username: string, movieSlug: string) {
  try {
    if (!username) return { isFavorite: false, isFollowed: false };

    const [favResult, followResult] = await Promise.all([
      db.execute({
        sql: "SELECT id FROM favorites WHERE user_id = ? AND movie_slug = ?",
        args: [username, movieSlug]
      }),
      db.execute({
        sql: "SELECT id FROM follows WHERE user_id = ? AND movie_slug = ?",
        args: [username, movieSlug]
      })
    ]);

    return {
      isFavorite: favResult.rows.length > 0,
      isFollowed: followResult.rows.length > 0
    };
  } catch (error) {
    console.error("getUserStats error:", error);
    return { isFavorite: false, isFollowed: false };
  }
}

import { getMovieDetail } from "@/lib/ophim";

/**
 * Get User's Library with full details (for Client Pages)
 */
export async function getUserLibraryWithDetails(username: string) {
  try {
    if (!username) return { favorites: [], follows: [] };

    const { favorites: favSlugs, follows: followSlugs } = await getUserLibrary(username);

    const [favorites, follows] = await Promise.all([
      Promise.all(favSlugs.map(slug => getMovieDetail(slug).then(res => res?.movie || null))),
      Promise.all(followSlugs.map(slug => getMovieDetail(slug).then(res => res?.movie || null)))
    ]);

    return {
      favorites: favorites.filter(m => m !== null),
      follows: follows.filter(m => m !== null)
    };
  } catch (error) {
    console.error("getUserLibraryWithDetails error:", error);
    return { favorites: [], follows: [] };
  }
}

/**
 * Get User's Library (slugs only)
 */
export async function getUserLibrary(username: string) {
  try {
    if (!username) return { favorites: [], follows: [] };

    const [favResult, followResult] = await Promise.all([
      db.execute({
        sql: "SELECT movie_slug FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
        args: [username]
      }),
      db.execute({
        sql: "SELECT movie_slug FROM follows WHERE user_id = ? ORDER BY created_at DESC",
        args: [username]
      })
    ]);

    return {
      favorites: favResult.rows.map(r => r.movie_slug as string),
      follows: followResult.rows.map(r => r.movie_slug as string)
    };
  } catch (error) {
    console.error("getUserLibrary error:", error);
    return { favorites: [], follows: [] };
  }
}
