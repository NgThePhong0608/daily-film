/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_TOKEN;

if (!url) {
  console.error("Missing TURSO_DATABASE_URL");
  process.exit(1);
}

const db = createClient({ url, authToken });

async function main() {
  console.log("Setting up Trending System DB...");

  try {
    // Create movie_events table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS movie_events (
        id TEXT PRIMARY KEY,
        movie_slug TEXT NOT NULL,
        event_type TEXT NOT NULL, -- 'play' | 'finish'
        created_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: movie_events");

    // Create index for performance
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_events_slug_time ON movie_events(movie_slug, created_at);
    `);
    console.log("✅ Created index: idx_events_slug_time");

  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
