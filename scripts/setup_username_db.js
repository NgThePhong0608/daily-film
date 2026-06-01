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
  console.log("Resetting DB for Username System...");

  try {
    // Drop existing tables
    await db.execute("DROP TABLE IF EXISTS favorites");
    await db.execute("DROP TABLE IF EXISTS follows");
    await db.execute("DROP TABLE IF EXISTS playlist_items");
    await db.execute("DROP TABLE IF EXISTS playlists");
    await db.execute("DROP TABLE IF EXISTS watch_progress");
    await db.execute("DROP TABLE IF EXISTS users");
    console.log("✅ Dropped old tables");

    // Create users table
    await db.execute(`
      CREATE TABLE users (
        username TEXT PRIMARY KEY,
        created_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: users");

    // Recreate other tables with username logic (user_id is now username)
    // Favorites
    await db.execute(`
      CREATE TABLE favorites (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL, 
        movie_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, movie_slug)
      );
    `);
    console.log("✅ Created table: favorites");

    // Follows
    await db.execute(`
      CREATE TABLE follows (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        movie_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(user_id, movie_slug)
      );
    `);
    console.log("✅ Created table: follows");

    // Playlists
    await db.execute(`
      CREATE TABLE playlists (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: playlists");

    await db.execute(`
      CREATE TABLE playlist_items (
        id TEXT PRIMARY KEY,
        playlist_id TEXT NOT NULL,
        movie_slug TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        UNIQUE(playlist_id, movie_slug)
      );
    `);
    console.log("✅ Created table: playlist_items");

    await db.execute(`
      CREATE INDEX idx_playlists_user_updated
      ON playlists(user_id, updated_at DESC);
    `);

    await db.execute(`
      CREATE INDEX idx_playlist_items_playlist_created
      ON playlist_items(playlist_id, created_at DESC);
    `);
    console.log("✅ Created playlist indexes");

    // Watch Progress
    await db.execute(`
      CREATE TABLE watch_progress (
        user_id TEXT NOT NULL, 
        movie_slug TEXT NOT NULL,
        episode_slug TEXT NOT NULL,
        current_time REAL DEFAULT 0,
        updated_at INTEGER,
        movie_title TEXT,
        poster_url TEXT,
        episode_name TEXT,
        duration REAL,
        PRIMARY KEY (user_id, movie_slug)
      );
    `);
    console.log("✅ Created table: watch_progress");

  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
