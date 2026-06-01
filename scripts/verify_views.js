/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_TOKEN;
const db = createClient({ url, authToken });

async function verify() {
  const testSlug = "test-movie-slug-123";

  console.log(`Testing view count for ${testSlug}...`);

  // 1. Get initial count
  const initial = await db.execute({
    sql: "SELECT view_count FROM movie_views WHERE movie_slug = ?",
    args: [testSlug]
  });
  const initialCount = initial.rows[0]?.view_count || 0;
  console.log("Initial Count:", initialCount);

  // 2. Simulate Log Event (Manual SQL to mimic the logic, or I should ideally import the function? 
  // Cannot import TS server action in JS script easily. I will replicate the SQL logic to test the DB constraint.)

  console.log("Simulating 'play' event logging...");
  await db.execute({
    sql: `
        INSERT INTO movie_views (movie_slug, view_count, updated_at)
        VALUES (?, 1, ?)
        ON CONFLICT(movie_slug) DO UPDATE SET
        view_count = view_count + 1,
        updated_at = excluded.updated_at
      `,
    args: [testSlug, Date.now()]
  });

  // 3. Get new count
  const final = await db.execute({
    sql: "SELECT view_count FROM movie_views WHERE movie_slug = ?",
    args: [testSlug]
  });
  const finalCount = final.rows[0]?.view_count;
  console.log("Final Count:", finalCount);

  if (finalCount === Number(initialCount) + 1) {
    console.log("✅ SUCCESS: View count incremented!");
  } else {
    console.error("❌ FAILURE: View count mismatch.");
  }
}

verify();
