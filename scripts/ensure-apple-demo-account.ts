/**
 * Ensure Apple App Store review demo account exists with known password.
 * Usage: npx tsx scripts/ensure-apple-demo-account.ts
 */
import { config } from "dotenv";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { phoneToAuthEmail } from "../lib/auth/phone";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const DEMO_PHONE = "99918122";
const DEMO_PASSWORD = "Kaneki8838";
const DEMO_NAME = "Apple Review";

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL / SUPABASE_SECRET_KEY");
  }

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const email = phoneToAuthEmail(DEMO_PHONE);

  const listed = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (listed.error) throw listed.error;

  const existing = listed.data.users.find(
    (u) =>
      u.email === email ||
      u.user_metadata?.phone === DEMO_PHONE ||
      u.phone === `+976${DEMO_PHONE}`,
  );

  let userId: string;

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        ...existing.user_metadata,
        full_name: DEMO_NAME,
        phone: DEMO_PHONE,
      },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("Updated existing demo user:", email);
  } else {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: DEMO_NAME, phone: DEMO_PHONE },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log("Created demo user:", email);
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      id: userId,
      full_name: DEMO_NAME,
      phone: DEMO_PHONE,
      role: "admin",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (profileError) throw profileError;

  // Verify password works with anon key
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (anon) {
    const client = createClient(url, anon);
    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password: DEMO_PASSWORD,
    });
    if (signInError) {
      throw new Error(`Sign-in verify failed: ${signInError.message}`);
    }
    await client.auth.signOut();
    console.log("Sign-in verified OK");
  }

  console.log("\nApp Store Connect demo credentials:");
  console.log(`  Username (phone): ${DEMO_PHONE}`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log(`  Auth email: ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
