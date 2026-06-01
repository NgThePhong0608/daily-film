"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface Comment {
  id: string;
  movieSlug: string;
  username: string;
  content: string;
  createdAt: number;
}

const RATE_LIMIT_WINDOW_MS = 30 * 1000; // 30 seconds

/**
 * Get comments for a movie
 */
export async function getMovieComments(movieSlug: string): Promise<Comment[]> {
  try {
    const result = await db.execute({
      sql: `
        SELECT id, movie_slug, username, content, created_at
        FROM comments
        WHERE movie_slug = ?
        ORDER BY created_at DESC
        LIMIT 20
      `,
      args: [movieSlug],
    });

    return result.rows.map((row) => ({
      id: row.id as string,
      movieSlug: row.movie_slug as string,
      username: row.username as string,
      content: row.content as string,
      createdAt: row.created_at as number,
    }));
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

/**
 * Add a new comment
 */
export async function addComment(_prevState: unknown, formData: FormData) {
  const movieSlug = formData.get("movieSlug") as string;
  const username = formData.get("username") as string;
  const content = formData.get("content") as string;

  if (!movieSlug || !username || !content) {
    return { error: "Thiếu thông tin bắt buộc" };
  }

  const cleanContent = content.trim();
  if (cleanContent.length === 0 || cleanContent.length > 500) {
    return { error: "Nội dung phải từ 1 đến 500 ký tự" };
  }

  // 1. Verify username exists in users table (Integrity check)
  const userCheck = await db.execute({
    sql: "SELECT username FROM users WHERE username = ?",
    args: [username],
  });

  if (userCheck.rows.length === 0) {
    return { error: "Người dùng không tồn tại" };
  }

  // 2. Rate Limiting (Anti-spam)
  // Check last comment by this user for this movie
  const lastComment = await db.execute({
    sql: `
      SELECT created_at FROM comments
      WHERE movie_slug = ? AND username = ?
      ORDER BY created_at DESC
      LIMIT 1
    `,
    args: [movieSlug, username],
  });

  if (lastComment.rows.length > 0) {
    const lastTime = lastComment.rows[0].created_at as number;
    if (Date.now() - lastTime < RATE_LIMIT_WINDOW_MS) {
      return { error: "Bạn bình luận quá nhanh. Vui lòng đợi 30 giây." };
    }
  }

  // 3. Insert Comment
  try {
    const id = crypto.randomUUID();
    const createdAt = Date.now();

    // Ideally, sanitize HTML here if not relying solely on React escaping
    // For now, we trust React to escape on render, but preventing storage of Tags is better
    // Simple tag strip:
    const safeContent = cleanContent.replace(/<[^>]*>?/gm, "");

    await db.execute({
      sql: `INSERT INTO comments (id, movie_slug, username, content, created_at) VALUES (?, ?, ?, ?, ?)`,
      args: [id, movieSlug, username, safeContent, createdAt],
    });

    revalidatePath(`/phim/${movieSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Lỗi hệ thống. Vui lòng thử lại sau." };
  }
}
