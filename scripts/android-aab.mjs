import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const androidDir = path.join(root, "android");
const keyProps = path.join(androidDir, "key.properties");
const aabSrc = path.join(
  androidDir,
  "app",
  "build",
  "outputs",
  "bundle",
  "release",
  "app-release.aab",
);
const outDir = path.join(root, "dist-aab");
const aabDest = path.join(outDir, "Achira-1.0.2.aab");

if (!existsSync(keyProps)) {
  console.error(
    "Missing android/key.properties. Create release keystore first.",
  );
  process.exit(1);
}

const javaHome =
  process.env.JAVA_HOME_21 ||
  "C:\\Program Files\\Android\\Android Studio\\jbr";

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  PATH: `${path.join(javaHome, "bin")}${path.delimiter}${process.env.PATH ?? ""}`,
};

const isWin = process.platform === "win32";
const gradlew = isWin ? "gradlew.bat" : "./gradlew";

console.log("Building signed release AAB with JDK 17...");
const build = spawnSync(gradlew, ["bundleRelease", "--stacktrace"], {
  cwd: androidDir,
  env,
  stdio: "inherit",
  shell: isWin,
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(aabSrc)) {
  console.error("AAB not found at", aabSrc);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(aabSrc, aabDest);
console.log("\nSigned AAB ready:");
console.log(aabDest);
