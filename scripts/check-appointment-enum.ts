import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local" });

async function main() {
  const c = new pg.Client({ connectionString: process.env.DIRECT_URL });
  await c.connect();
  const r = await c.query(`
    SELECT t.typname, e.enumlabel
    FROM pg_type t
    JOIN pg_enum e ON e.enumtypid = t.oid
    WHERE t.typname ILIKE '%appointment%'
    ORDER BY t.typname, e.enumsortorder
  `);
  console.log(r.rows);
  await c.end();
}

main().catch(console.error);
