import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../lib/prisma";

config({ path: ".env.local" });
config();

async function main() {
  const sql = readFileSync(join(__dirname, "../supabase/rls.sql"), "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    await prisma.$executeRawUnsafe(`${statement};`);
  }

  console.log("RLS policies applied.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
