import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_TOKEN;

if (!url) {
  throw new Error("Missing TURSO_DATABASE_URL environment variable");
}

/* 
 * Create a shared client instance.
 * Note: serverless environments might need a new client per request if not reusing connection.
 * But for Vercel/Next.js edge/serverless, creating it outside the handler usually works for reuse 
 * if the container is warm.
 */
export const db = createClient({
  url,
  authToken,
});
