"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { getMovieDetail } from "@/lib/movie-api";
import { Movie } from "@/types/movie";

const MAX_PLAYLIST_NAME_LENGTH = 80;

export interface PlaylistSummary {
  id: string;
  name: string;
  itemCount: number;
  createdAt: number;
  updatedAt: number;
}

export interface PlaylistMovieMembership extends PlaylistSummary {
  hasMovie: boolean;
}

function normalizePlaylistName(name: string) {
  return name.trim();
}

function validatePlaylistName(name: string) {
  const normalized = normalizePlaylistName(name);

  if (
    normalized.length < 1 ||
    normalized.length > MAX_PLAYLIST_NAME_LENGTH
  ) {
    return null;
  }

  return normalized;
}

async function ensureUser(username: string) {
  await db.execute({
    sql: "INSERT OR IGNORE INTO users (username, created_at) VALUES (?, ?)",
    args: [username, Date.now()],
  });
}

async function getOwnedPlaylistId(username: string, playlistId: string) {
  const result = await db.execute({
    sql: "SELECT id FROM playlists WHERE id = ? AND user_id = ?",
    args: [playlistId, username],
  });

  return result.rows[0]?.id as string | undefined;
}

export async function getUserPlaylists(
  username: string,
): Promise<PlaylistSummary[]> {
  try {
    if (!username) return [];

    const result = await db.execute({
      sql: `
        SELECT
          p.id,
          p.name,
          p.created_at,
          p.updated_at,
          COUNT(pi.id) AS item_count
        FROM playlists p
        LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.updated_at DESC, p.created_at DESC
      `,
      args: [username],
    });

    return result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      itemCount: Number(row.item_count || 0),
      createdAt: row.created_at as number,
      updatedAt: row.updated_at as number,
    }));
  } catch (error) {
    console.error("getUserPlaylists error:", error);
    return [];
  }
}

export async function getPlaylistsForMovie(
  username: string,
  movieSlug: string,
): Promise<PlaylistMovieMembership[]> {
  try {
    if (!username || !movieSlug) return [];

    const result = await db.execute({
      sql: `
        SELECT
          p.id,
          p.name,
          p.created_at,
          p.updated_at,
          COUNT(all_items.id) AS item_count,
          MAX(CASE WHEN selected_item.id IS NULL THEN 0 ELSE 1 END) AS has_movie
        FROM playlists p
        LEFT JOIN playlist_items all_items ON all_items.playlist_id = p.id
        LEFT JOIN playlist_items selected_item
          ON selected_item.playlist_id = p.id
          AND selected_item.movie_slug = ?
        WHERE p.user_id = ?
        GROUP BY p.id
        ORDER BY p.updated_at DESC, p.created_at DESC
      `,
      args: [movieSlug, username],
    });

    return result.rows.map((row) => ({
      id: row.id as string,
      name: row.name as string,
      itemCount: Number(row.item_count || 0),
      createdAt: row.created_at as number,
      updatedAt: row.updated_at as number,
      hasMovie: Boolean(row.has_movie),
    }));
  } catch (error) {
    console.error("getPlaylistsForMovie error:", error);
    return [];
  }
}

export async function createPlaylist(username: string, name: string) {
  try {
    const normalizedName = validatePlaylistName(name);
    if (!username || !normalizedName) {
      return { error: "Tên playlist không hợp lệ" };
    }

    await ensureUser(username);

    const now = Date.now();
    const id = crypto.randomUUID();

    await db.execute({
      sql: `
        INSERT INTO playlists (id, user_id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [id, username, normalizedName, now, now],
    });

    revalidatePath("/playlists");

    return {
      playlist: {
        id,
        name: normalizedName,
        itemCount: 0,
        createdAt: now,
        updatedAt: now,
      } satisfies PlaylistSummary,
    };
  } catch (error) {
    console.error("createPlaylist error:", error);
    return { error: "Không thể tạo playlist" };
  }
}

export async function renamePlaylist(
  username: string,
  playlistId: string,
  name: string,
) {
  try {
    const normalizedName = validatePlaylistName(name);
    if (!username || !playlistId || !normalizedName) {
      return { error: "Tên playlist không hợp lệ" };
    }

    const ownedPlaylistId = await getOwnedPlaylistId(username, playlistId);
    if (!ownedPlaylistId) return { error: "Không tìm thấy playlist" };

    const now = Date.now();

    await db.execute({
      sql: "UPDATE playlists SET name = ?, updated_at = ? WHERE id = ?",
      args: [normalizedName, now, playlistId],
    });

    revalidatePath("/playlists");
    revalidatePath(`/playlists/${playlistId}`);

    return { success: true, name: normalizedName, updatedAt: now };
  } catch (error) {
    console.error("renamePlaylist error:", error);
    return { error: "Không thể đổi tên playlist" };
  }
}

export async function deletePlaylist(username: string, playlistId: string) {
  try {
    if (!username || !playlistId) return { error: "Không tìm thấy playlist" };

    const ownedPlaylistId = await getOwnedPlaylistId(username, playlistId);
    if (!ownedPlaylistId) return { error: "Không tìm thấy playlist" };

    await db.execute({
      sql: "DELETE FROM playlist_items WHERE playlist_id = ?",
      args: [playlistId],
    });

    await db.execute({
      sql: "DELETE FROM playlists WHERE id = ? AND user_id = ?",
      args: [playlistId, username],
    });

    revalidatePath("/playlists");
    revalidatePath(`/playlists/${playlistId}`);

    return { success: true };
  } catch (error) {
    console.error("deletePlaylist error:", error);
    return { error: "Không thể xoá playlist" };
  }
}

export async function setMoviePlaylistMembership(
  username: string,
  playlistId: string,
  movieSlug: string,
  shouldInclude: boolean,
) {
  try {
    if (!username || !playlistId || !movieSlug) {
      return { error: "Thông tin playlist không hợp lệ" };
    }

    const ownedPlaylistId = await getOwnedPlaylistId(username, playlistId);
    if (!ownedPlaylistId) return { error: "Không tìm thấy playlist" };

    if (shouldInclude) {
      await db.execute({
        sql: `
          INSERT OR IGNORE INTO playlist_items
            (id, playlist_id, movie_slug, created_at)
          VALUES (?, ?, ?, ?)
        `,
        args: [crypto.randomUUID(), playlistId, movieSlug, Date.now()],
      });
    } else {
      await db.execute({
        sql: "DELETE FROM playlist_items WHERE playlist_id = ? AND movie_slug = ?",
        args: [playlistId, movieSlug],
      });
    }

    const now = Date.now();
    await db.execute({
      sql: "UPDATE playlists SET updated_at = ? WHERE id = ?",
      args: [now, playlistId],
    });

    revalidatePath("/playlists");
    revalidatePath(`/playlists/${playlistId}`);

    return { success: true, updatedAt: now };
  } catch (error) {
    console.error("setMoviePlaylistMembership error:", error);
    return { error: "Không thể cập nhật playlist" };
  }
}

export async function getPlaylistWithMovies(
  username: string,
  playlistId: string,
): Promise<{ playlist: PlaylistSummary | null; movies: Movie[] }> {
  try {
    if (!username || !playlistId) return { playlist: null, movies: [] };

    const playlistResult = await db.execute({
      sql: `
        SELECT
          p.id,
          p.name,
          p.created_at,
          p.updated_at,
          COUNT(pi.id) AS item_count
        FROM playlists p
        LEFT JOIN playlist_items pi ON pi.playlist_id = p.id
        WHERE p.id = ? AND p.user_id = ?
        GROUP BY p.id
      `,
      args: [playlistId, username],
    });

    if (playlistResult.rows.length === 0) {
      return { playlist: null, movies: [] };
    }

    const playlistRow = playlistResult.rows[0];
    const playlist = {
      id: playlistRow.id as string,
      name: playlistRow.name as string,
      itemCount: Number(playlistRow.item_count || 0),
      createdAt: playlistRow.created_at as number,
      updatedAt: playlistRow.updated_at as number,
    };

    const itemsResult = await db.execute({
      sql: `
        SELECT movie_slug
        FROM playlist_items
        WHERE playlist_id = ?
        ORDER BY created_at DESC
      `,
      args: [playlistId],
    });

    const movies = await Promise.all(
      itemsResult.rows.map((row) =>
        getMovieDetail(row.movie_slug as string).then((data) => data?.movie || null),
      ),
    );
    const availableMovies = movies.filter((movie) => movie !== null) as Movie[];

    return {
      playlist,
      movies: availableMovies,
    };
  } catch (error) {
    console.error("getPlaylistWithMovies error:", error);
    return { playlist: null, movies: [] };
  }
}
