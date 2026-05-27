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
  console.log("Setting up Playlists DB...");

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: playlists");

    await db.execute(`
      CREATE TABLE IF NOT EXISTS playlist_items (
        id TEXT PRIMARY KEY,
        playlist_id TEXT NOT NULL,
        movie_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(playlist_id, movie_slug)
      );
    `);
    console.log("✅ Created table: playlist_items");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_playlists_user_updated
      ON playlists(user_id, updated_at DESC);
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_created
      ON playlist_items(playlist_id, created_at DESC);
    `);

    console.log("✅ Created playlist indexes");
  } catch (err) {
    console.error("Error setting up playlists DB:", err);
    process.exit(1);
  }
}

main();
