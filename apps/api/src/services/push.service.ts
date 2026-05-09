import webpush from "web-push";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:admin@subtrack.app",
  process.env.VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || ""
);

interface PushDevice {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export async function sendPushNotification(
  device: PushDevice,
  title: string,
  body: string,
  url?: string
) {
  try {
    await webpush.sendNotification(
      {
        endpoint: device.endpoint,
        keys: { p256dh: device.p256dh, auth: device.auth },
      },
      JSON.stringify({ title, body, url })
    );
    return true;
  } catch (error: unknown) {
    // 410 Gone = subscription expired, caller should delete it
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      (error as { statusCode: number }).statusCode === 410
    ) {
      return "expired";
    }
    return false;
  }
}
