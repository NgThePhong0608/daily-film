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
  console.log("Setting up Ratings DB...");

  try {
    // 1. Ratings Table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ratings (
        id TEXT PRIMARY KEY,
        movie_slug TEXT NOT NULL,
        username TEXT NOT NULL,
        stars INTEGER NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL,
        UNIQUE(movie_slug, username)
      );
    `);
    console.log("✅ Created table: ratings");

    // Indexes for ratings
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_ratings_movie_slug 
      ON ratings(movie_slug);
    `);
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_ratings_username 
      ON ratings(username);
    `);
    console.log("✅ Created indexes for ratings");

    // 2. Movie Rating Stats Table (Optimization)
    await db.execute(`
      CREATE TABLE IF NOT EXISTS movie_rating_stats (
        movie_slug TEXT PRIMARY KEY,
        average REAL NOT NULL DEFAULT 0,
        total INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: movie_rating_stats");

  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
