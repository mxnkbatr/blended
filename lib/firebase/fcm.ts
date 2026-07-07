import { getFirebaseAdmin } from "@/lib/firebase/admin";
import {
  fetchAllValidFcmTokens,
  isFcmRegistrationToken,
  removeInvalidPushTokens,
} from "@/lib/supabase/push-tokens";

export const PUSH_CHANNEL_ID = "achira_push";
export const PUSH_TOPIC_ALL = "all-users";

function toStringData(data?: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(data ?? {}).map(([key, value]) => [key, String(value)]),
  );
}

function buildPushPayload({
  title,
  body,
  imageUrl,
  data,
}: {
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
}) {
  const stringData = toStringData(data);

  return {
    notification: {
      title,
      body,
      ...(imageUrl ? { imageUrl } : {}),
    },
    data: stringData,
    android: {
      priority: "high" as const,
      notification: {
        channelId: PUSH_CHANNEL_ID,
        sound: "default",
        priority: "high" as const,
        defaultSound: true,
        defaultVibrateTimings: true,
        visibility: "public" as const,
      },
    },
    apns: {
      headers: {
        "apns-priority": "10",
        "apns-push-type": "alert",
        "apns-topic": "mn.achira.artist",
      },
      payload: {
        aps: {
          alert: { title, body },
          sound: "default",
          badge: 1,
          "mutable-content": imageUrl ? 1 : 0,
        },
      },
    },
  };
}

async function sendMulticastBatched(
  messaging: import("firebase-admin/messaging").Messaging,
  tokens: string[],
  payload: ReturnType<typeof buildPushPayload>,
) {
  const batchSize = 500;
  let successCount = 0;
  let failureCount = 0;
  const invalidTokens: string[] = [];

  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize);
    const response = await messaging.sendEachForMulticast({
      ...payload,
      tokens: batch,
    });

    successCount += response.successCount;
    failureCount += response.failureCount;

    response.responses.forEach((resp, idx) => {
      if (resp.success) return;
      const code = resp.error?.code;
      if (
        code === "messaging/invalid-registration-token" ||
        code === "messaging/registration-token-not-registered"
      ) {
        const token = batch[idx];
        if (token) invalidTokens.push(token);
      }
    });
  }

  if (invalidTokens.length > 0) {
    await removeInvalidPushTokens(invalidTokens);
  }

  return { successCount, failureCount, tokenCount: tokens.length };
}

export async function subscribeTokenToTopic(
  token: string,
  topic: string,
): Promise<void> {
  const app = await getFirebaseAdmin();
  if (!app) return;

  const { getMessaging } = await import("firebase-admin/messaging");
  const messaging = getMessaging(app);
  await messaging.subscribeToTopic([token], topic);
}

export async function sendPushToAllUsers({
  title,
  body,
  imageUrl,
  data,
}: {
  title: string;
  body: string;
  imageUrl?: string;
  data?: Record<string, string>;
}) {
  const app = await getFirebaseAdmin();
  if (!app) {
    console.warn("[fcm] Firebase admin not configured");
    return null;
  }

  const { getMessaging } = await import("firebase-admin/messaging");
  const messaging = getMessaging(app);
  const payload = buildPushPayload({ title, body, imageUrl, data });

  let topicId: string | undefined;
  try {
    topicId = await messaging.send({ ...payload, topic: PUSH_TOPIC_ALL });
  } catch (err) {
    console.error("[fcm] topic send error:", err);
  }

  const tokens = (await fetchAllValidFcmTokens()).filter(isFcmRegistrationToken);
  let multicast = { successCount: 0, failureCount: 0, tokenCount: 0 };

  if (tokens.length > 0) {
    multicast = await sendMulticastBatched(messaging, tokens, payload);
  }

  return { topicId, multicast };
}
