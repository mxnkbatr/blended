import type { App } from "firebase-admin/app";

let adminApp: App | null = null;

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY,
  );
}

export async function getFirebaseAdmin() {
  if (typeof window !== "undefined") return null;
  if (!isFirebaseConfigured()) return null;
  if (adminApp) return adminApp;

  const { cert, getApps, initializeApp } = await import("firebase-admin/app");

  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      }),
    });
  } else {
    adminApp = getApps()[0]!;
  }

  return adminApp;
}
