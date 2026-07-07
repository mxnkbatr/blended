import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";

config({ path: ".env.local" });
config();

const sql = readFileSync(
  join(process.cwd(), "supabase", "grant-admin-phones.sql"),
  "utf8",
);

async function main() {
  const connectionString =
    process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";

  if (!connectionString) {
    throw new Error("DIRECT_URL or DATABASE_URL required.");
  }

  const client = new pg.Client({ connectionString });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log("Bootstrap admin phones applied (99918122, 88668612).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
