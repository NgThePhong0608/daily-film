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
  console.log("Setting up movie_views table...");

  try {
    // Create movie_views table
    // Stores aggregated view counts
    await db.execute(`
      CREATE TABLE IF NOT EXISTS movie_views (
        movie_slug TEXT PRIMARY KEY,
        view_count INTEGER DEFAULT 0,
        updated_at INTEGER
      );
    `);
    console.log("✅ Created table: movie_views");

  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
