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
  console.log("Setting up Comments DB...");

  try {
    // Create comments table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        movie_slug TEXT NOT NULL,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: comments");

    // Index for fetching comments by movie
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_comments_movie_slug 
      ON comments(movie_slug, created_at DESC);
    `);
    console.log("✅ Created index: idx_comments_movie_slug");

    // Index for user history (optional but good)
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_comments_username
      ON comments(username, created_at DESC);
    `);
    console.log("✅ Created index: idx_comments_username");

  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
