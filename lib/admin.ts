import { cookies } from "next/headers";
import { createHash } from "node:crypto";

const ADMIN_COOKIE_NAME = "daily_film_admin_feedback";

function getAdminPassword() {
  return process.env.ADMIN_FEEDBACK_PASSWORD?.trim() ?? "";
}

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isAdminConfigured() {
  return getAdminPassword().length > 0;
}

export async function isAdminAuthenticated() {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  return cookieValue === hashValue(adminPassword);
}

export async function createAdminSession() {
  const adminPassword = getAdminPassword();

  if (!adminPassword) {
    throw new Error("Missing ADMIN_FEEDBACK_PASSWORD environment variable");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, hashValue(adminPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
