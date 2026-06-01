import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

const COOKIE_NAME = "guest_session_id";
const COOKIE_DURATION = 60 * 60 * 24 * 365; // 1 year

// Safe for Server Components (Read Only)
export async function getAnonymousId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  return sessionCookie?.value || null;
}

// Use in Server Actions / Route Handlers (Read or Write)
export async function getOrCreateAnonymousId() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (sessionCookie?.value) {
    return sessionCookie.value;
  }

  // Generate new ID
  const newId = uuidv4();
  
  // Set cookie
  cookieStore.set(COOKIE_NAME, newId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_DURATION,
  });

  return newId;
}
