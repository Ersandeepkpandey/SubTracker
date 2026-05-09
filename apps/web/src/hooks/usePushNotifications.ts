"use client";

import { useState } from "react";
import api from "@/lib/api";

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function subscribe() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return { success: false, error: "Push not supported in this browser" };
    }

    setIsLoading(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setIsSubscribed(true);
        setIsLoading(false);
        return { success: true };
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      const json = sub.toJSON();
      await api.post("/notifications/push/subscribe", {
        endpoint: json.endpoint,
        keys: json.keys,
      });

      setIsSubscribed(true);
      return { success: true };
    } catch (err) {
      return { success: false, error: String(err) };
    } finally {
      setIsLoading(false);
    }
  }

  return { isSubscribed, isLoading, subscribe };
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
