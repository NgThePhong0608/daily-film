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
  console.log("Setting up User Engagement DB...");

  try {
    // Create favorites table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS favorites (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        movie_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, movie_slug)
      );
    `);
    console.log("✅ Created table: favorites");

    // Create follows table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS follows (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        movie_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, movie_slug)
      );
    `);
    console.log("✅ Created table: follows");

  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
