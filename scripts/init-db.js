/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_TOKEN;

if (!url) {
  console.error("Missing TURSO_DATABASE_URL");
  process.exit(1);
}

const db = createClient({
  url,
  authToken,
});

async function main() {
  console.log("Initializing database...");

  try {
    // 1. Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL
      )
    `);
    console.log("✓ Table 'users' ready");

    // 2. Create watch_progress table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS watch_progress (
        user_id TEXT NOT NULL,
        movie_slug TEXT NOT NULL,
        episode_slug TEXT NOT NULL,
        current_time INTEGER DEFAULT 0,
        updated_at INTEGER NOT NULL,
        movie_title TEXT,
        poster_url TEXT,
        episode_name TEXT,
        duration INTEGER,
        PRIMARY KEY (user_id, movie_slug),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    // Index for faster queries
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_watch_progress_user 
      ON watch_progress(user_id, updated_at DESC)
    `);

    console.log("✓ Table 'watch_progress' ready");

  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    console.log("Done.");
  }
}

main();
