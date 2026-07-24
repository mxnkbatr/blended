import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
loadEnvConfig(root);

const apiDir = path.join(root, "app", "api");
const apiBackup = path.join(root, "app", "_api_mobile_backup");
const nextCache = path.join(root, ".next");
const nextMobileCache = path.join(root, ".next-mobile");
const mobileFlag = path.join(root, ".mobile-build");
const outDir = path.join(root, "out");
const isWindows = process.platform === "win32";

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

function clearMobileFlag() {
  if (existsSync(mobileFlag)) {
    rmSync(mobileFlag, { force: true });
  }
}

/** If a custom distDir left static HTML there, copy it to Capacitor webDir. */
function recoverOutFromDistDir() {
  if (existsSync(path.join(outDir, "index.html"))) return true;

  const distExport = path.join(nextMobileCache, "index.html");
  if (existsSync(distExport)) {
    if (existsSync(outDir)) {
      rmSync(outDir, { recursive: true, force: true });
    }
    cpSync(nextMobileCache, outDir, { recursive: true });
    // Strip Next build artifacts that aren't needed in Cap webDir
    for (const junk of ["cache", "server", "types", "diagnostics", "package.json"]) {
      const p = path.join(outDir, junk);
      if (existsSync(p)) rmSync(p, { recursive: true, force: true });
    }
    console.log("Recovered static export from .next-mobile/ → out/");
    return existsSync(path.join(outDir, "index.html"));
  }

  return false;
}

try {
  for (const dir of [nextCache, nextMobileCache, outDir]) {
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
  hideApi();
  writeFileSync(mobileFlag, "1\n", "utf8");
} catch (error) {
  clearMobileFlag();
  console.error(
    "\nMobile build: could not prepare mobile build. Stop `npm run dev` and retry.\n",
  );
  throw error;
}

const requiredPublicEnv = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

const missingPublicEnv = requiredPublicEnv.filter((key) => !process.env[key]);
if (missingPublicEnv.length > 0) {
  console.error(
    "\nMobile build aborted: missing required env vars for native login/API:\n" +
      missingPublicEnv.map((key) => `  - ${key}`).join("\n") +
      "\n\nSet these in Appflow Environment (or .env.local locally), then rebuild.\n",
  );
  restoreApi();
  clearMobileFlag();
  process.exit(1);
}

console.log(
  `Using NEXT_PUBLIC_APP_URL=${process.env.NEXT_PUBLIC_APP_URL}\n` +
    `Using NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`,
);

const prisma = spawnSync("npx", ["prisma", "generate"], {
  cwd: root,
  stdio: "inherit",
  shell: isWindows,
});
if (prisma.status !== 0) {
  restoreApi();
  clearMobileFlag();
  process.exit(prisma.status ?? 1);
}

console.log("Starting next build with MOBILE_BUILD=1 and .mobile-build flag...");

const build = spawnSync("npx", ["next", "build"], {
  cwd: root,
  stdio: "inherit",
  shell: isWindows,
  env: {
    ...process.env,
    MOBILE_BUILD: "1",
  },
});

restoreApi();
clearMobileFlag();

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

recoverOutFromDistDir();

if (!existsSync(path.join(outDir, "index.html"))) {
  console.error(
    "\nMobile build failed: `out/index.html` missing after static export.\n" +
      "Appflow/Capacitor expect web assets at ./out (see capacitor.config webDir).\n",
  );
  try {
    console.error(
      "Root entries:",
      readdirSync(root)
        .filter((name) => !name.startsWith("node_modules"))
        .join(", "),
    );
  } catch {
    // ignore
  }
  process.exit(1);
}

console.log("\nMobile build OK — out/ is ready for Capacitor sync.\n");
process.exit(0);
