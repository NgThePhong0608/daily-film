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
  console.log("Setting up Feedback DB...");

  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        username TEXT,
        email TEXT,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        page_path TEXT,
        status TEXT NOT NULL DEFAULT 'new',
        created_at INTEGER NOT NULL
      );
    `);
    console.log("✅ Created table: feedback");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at
      ON feedback(created_at DESC);
    `);
    console.log("✅ Created index: idx_feedback_created_at");

    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_feedback_status_created_at
      ON feedback(status, created_at DESC);
    `);
    console.log("✅ Created index: idx_feedback_status_created_at");
  } catch (err) {
    console.error("Error setting up DB:", err);
    process.exit(1);
  }
}

main();
