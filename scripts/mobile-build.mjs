import { spawnSync } from "node:child_process";
import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(root);
const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, "app", "_api_mobile_backup");
const nextCache = path.join(root, ".next");

function hideApi() {
  if (!existsSync(apiDir)) return;
  if (existsSync(apiBackup)) {
    rmSync(apiBackup, { recursive: true, force: true });
  }
  cpSync(apiDir, apiBackup, { recursive: true });
  rmSync(apiDir, { recursive: true, force: true });
}

function restoreApi() {
  if (existsSync(apiDir) || !existsSync(apiBackup)) return;
  cpSync(apiBackup, apiDir, { recursive: true });
  rmSync(apiBackup, { recursive: true, force: true });
}

try {
  if (existsSync(nextCache)) {
    rmSync(nextCache, { recursive: true, force: true });
  }
  hideApi();
} catch (error) {
  console.error(
    "\nMobile build: could not move app/api aside. Stop `npm run dev` and retry.\n",
  );
  throw error;
}

if (!process.env.NEXT_PUBLIC_APP_URL) {
  console.warn(
    "\nWarning: NEXT_PUBLIC_APP_URL is not set. Capacitor API calls need a deployed host (e.g. https://blended-phi.vercel.app).\n",
  );
}

const prisma = spawnSync("npx", ["prisma", "generate"], {
  cwd: root,
  stdio: "inherit",
  shell: true,
});
if (prisma.status !== 0) {
  restoreApi();
  process.exit(prisma.status ?? 1);
}

const build = spawnSync(
  "npx",
  ["cross-env", "MOBILE_BUILD=1", "next", "build"],
  { cwd: root, stdio: "inherit", shell: true },
);

restoreApi();
process.exit(build.status ?? 1);
