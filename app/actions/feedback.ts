"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import {
  clearAdminSession,
  createAdminSession,
  isAdminAuthenticated,
  isAdminConfigured,
} from "@/lib/admin";

const FEEDBACK_TYPES = new Set(["bug", "idea", "content", "design", "other"]);
const FEEDBACK_STATUSES = new Set(["new", "reviewed"]);

export interface FeedbackEntry {
  id: string;
  username: string | null;
  email: string | null;
  type: string;
  message: string;
  pagePath: string | null;
  status: string;
  createdAt: number;
}

export interface FeedbackListParams {
  page?: number;
  pageSize?: number;
  sort?: "newest" | "oldest";
  status?: "all" | "new" | "reviewed";
  dateRange?: "all" | "today" | "7d" | "30d";
}

export interface FeedbackListResult {
  entries: FeedbackEntry[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

function buildFeedbackFilters(params: FeedbackListParams) {
  const whereClauses: string[] = [];
  const args: Array<string | number> = [];

  if (params.status && params.status !== "all" && FEEDBACK_STATUSES.has(params.status)) {
    whereClauses.push("status = ?");
    args.push(params.status);
  }

  const now = Date.now();
  if (params.dateRange === "today") {
    whereClauses.push("created_at >= ?");
    args.push(now - 24 * 60 * 60 * 1000);
  } else if (params.dateRange === "7d") {
    whereClauses.push("created_at >= ?");
    args.push(now - 7 * 24 * 60 * 60 * 1000);
  } else if (params.dateRange === "30d") {
    whereClauses.push("created_at >= ?");
    args.push(now - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    whereSql: whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "",
    args,
  };
}

export async function submitFeedback(_prevState: unknown, formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const type = String(formData.get("type") ?? "other").trim().toLowerCase();
  const message = String(formData.get("message") ?? "").trim();
  const pagePath = String(formData.get("pagePath") ?? "").trim();

  if (!FEEDBACK_TYPES.has(type)) {
    return { error: "Loại phản hồi không hợp lệ." };
  }

  if (message.length < 10 || message.length > 1000) {
    return { error: "Nội dung phản hồi phải từ 10 đến 1000 ký tự." };
  }

  if (username.length > 50) {
    return { error: "Tên người dùng không được vượt quá 50 ký tự." };
  }

  if (email.length > 120) {
    return { error: "Email không được vượt quá 120 ký tự." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Email không hợp lệ." };
  }

  try {
    await db.execute({
      sql: `
        INSERT INTO feedback (id, username, email, type, message, page_path, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
      `,
      args: [
        crypto.randomUUID(),
        username || null,
        email || null,
        type,
        message.replace(/<[^>]*>?/gm, ""),
        pagePath || null,
        Date.now(),
      ],
    });

    revalidatePath("/admin/feedback");
    return { success: true };
  } catch (error) {
    console.error("submitFeedback error:", error);
    return { error: "Không thể gửi phản hồi lúc này. Vui lòng thử lại sau." };
  }
}

export async function loginAdmin(_prevState: unknown, formData: FormData) {
  if (!isAdminConfigured()) {
    return { error: "Thiếu ADMIN_FEEDBACK_PASSWORD trong môi trường." };
  }

  const password = String(formData.get("password") ?? "");

  if (password !== process.env.ADMIN_FEEDBACK_PASSWORD) {
    return { error: "Mật khẩu không đúng." };
  }

  await createAdminSession();
  revalidatePath("/admin/feedback");
  redirect("/admin/feedback");
}

export async function logoutAdmin() {
  await clearAdminSession();
  revalidatePath("/admin/feedback");
  redirect("/admin/feedback");
}

export async function getFeedbackEntries({
  page = 1,
  pageSize = 10,
  sort = "newest",
  status = "all",
  dateRange = "all",
}: FeedbackListParams = {}): Promise<FeedbackListResult> {
  if (!(await isAdminAuthenticated())) {
    return {
      entries: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize,
    };
  }

  try {
    const safePage = Number.isInteger(page) && page > 0 ? page : 1;
    const safePageSize = Number.isInteger(pageSize) && pageSize > 0 ? pageSize : 10;
    const safeSort = sort === "oldest" ? "oldest" : "newest";
    const safeStatus = status === "new" || status === "reviewed" ? status : "all";
    const safeDateRange =
      dateRange === "today" || dateRange === "7d" || dateRange === "30d"
        ? dateRange
        : "all";
    const { whereSql, args } = buildFeedbackFilters({
      status: safeStatus,
      dateRange: safeDateRange,
    });

    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM feedback ${whereSql}`,
      args,
    });
    const totalItems = Number(countResult.rows[0]?.total ?? 0);
    const totalPages = totalItems > 0 ? Math.ceil(totalItems / safePageSize) : 1;
    const normalizedPage = Math.min(safePage, totalPages);
    const normalizedOffset = (normalizedPage - 1) * safePageSize;

    const result = await db.execute({
      sql: `
        SELECT id, username, email, type, message, page_path, status, created_at
        FROM feedback
        ${whereSql}
        ORDER BY created_at ${safeSort === "oldest" ? "ASC" : "DESC"}
        LIMIT ? OFFSET ?
      `,
      args: [...args, safePageSize, normalizedOffset],
    });

    return {
      entries: result.rows.map((row) => ({
        id: row.id as string,
        username: (row.username as string | null) ?? null,
        email: (row.email as string | null) ?? null,
        type: row.type as string,
        message: row.message as string,
        pagePath: (row.page_path as string | null) ?? null,
        status: row.status as string,
        createdAt: row.created_at as number,
      })),
      totalItems,
      totalPages,
      currentPage: normalizedPage,
      pageSize: safePageSize,
    };
  } catch (error) {
    console.error("getFeedbackEntries error:", error);
    return {
      entries: [],
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      pageSize,
    };
  }
}

export async function updateFeedbackStatus(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !FEEDBACK_STATUSES.has(status)) {
    return { error: "Invalid request" };
  }

  try {
    await db.execute({
      sql: "UPDATE feedback SET status = ? WHERE id = ?",
      args: [status, id],
    });

    revalidatePath("/admin/feedback");
    return { success: true };
  } catch (error) {
    console.error("updateFeedbackStatus error:", error);
    return { error: "Không thể cập nhật trạng thái." };
  }
}

export async function markFeedbackEntriesReviewed(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { error: "Unauthorized" };
  }

  const ids = formData
    .getAll("ids")
    .map((value) => String(value).trim())
    .filter(Boolean);

  if (ids.length === 0) {
    return { error: "No feedback selected" };
  }

  try {
    const placeholders = ids.map(() => "?").join(", ");
    await db.execute({
      sql: `UPDATE feedback SET status = 'reviewed' WHERE id IN (${placeholders})`,
      args: ids,
    });

    revalidatePath("/admin/feedback");
    return { success: true };
  } catch (error) {
    console.error("markFeedbackEntriesReviewed error:", error);
    return { error: "Không thể cập nhật tất cả phản hồi trong trang này." };
  }
}
