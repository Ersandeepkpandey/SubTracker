"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Mail, Bell, CheckCircle, Loader2, Sparkles } from "lucide-react";

type Step = "connect-gmail" | "found-subscriptions" | "notifications";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("connect-gmail");
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncedCount, setSyncedCount] = useState<number | null>(null);

  const completeOnboarding = useMutation({
    mutationFn: async () => api.patch("/user/me", { onboardingDone: true }),
    onSuccess: () => router.push("/dashboard"),
  });

  const enablePush = useMutation({
    mutationFn: async () => {
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey,
      });
      const json = sub.toJSON();
      await api.post("/notifications/push/subscribe", {
        endpoint: json.endpoint,
        keys: json.keys,
      });
    },
  });

  async function handleConnectGmail() {
    setIsConnecting(true);
    try {
      await api.post("/gmail/connect");
      const res = await api.post("/gmail/sync");
      setSyncedCount(res.data?.found ?? 0);
      setStep("found-subscriptions");
    } catch {
      // still advance even if sync fails
      setSyncedCount(0);
      setStep("found-subscriptions");
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleEnableNotifications() {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        await Notification.requestPermission();
        await enablePush.mutateAsync();
      } catch {
        // ignore permission denial
      }
    }
    completeOnboarding.mutate();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex gap-1.5">
            {(["connect-gmail", "found-subscriptions", "notifications"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? "w-8 bg-teal" : i < ["connect-gmail", "found-subscriptions", "notifications"].indexOf(step) ? "w-4 bg-teal/40" : "w-4 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {step === "connect-gmail" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto">
              <Mail size={28} className="text-teal" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Connect Gmail</h1>
              <p className="text-gray-500 text-sm mt-2">
                SubTrack scans your Gmail headers (never email body) to automatically detect subscriptions.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handleConnectGmail}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Scanning emails…
                  </>
                ) : (
                  <>
                    <Mail size={16} className="mr-2" />
                    Connect Gmail
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-400"
                onClick={() => setStep("found-subscriptions")}
                disabled={isConnecting}
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {step === "found-subscriptions" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles size={28} className="text-teal" />
            </div>
            <div>
              {syncedCount !== null && syncedCount > 0 ? (
                <>
                  <h1 className="text-2xl font-bold text-text-primary">
                    Found {syncedCount} subscription{syncedCount !== 1 ? "s" : ""}
                  </h1>
                  <p className="text-gray-500 text-sm mt-2">
                    We detected these from your email history. Review and edit them in your dashboard.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-text-primary">You&apos;re all set</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Add your subscriptions manually from the dashboard, or connect Gmail to auto-detect them.
                  </p>
                </>
              )}
            </div>
            <Button className="w-full" onClick={() => setStep("notifications")}>
              Continue
            </Button>
          </div>
        )}

        {step === "notifications" && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center mx-auto">
              <Bell size={28} className="text-teal" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Never miss a renewal</h1>
              <p className="text-gray-500 text-sm mt-2">
                Get browser notifications 3 days and 1 day before each subscription renews.
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
              {["3 days before renewal", "1 day before renewal", "On renewal day"].map((label) => (
                <div key={label} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-teal shrink-0" />
                  <span className="text-sm text-gray-700">{label}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <Button
                className="w-full"
                onClick={handleEnableNotifications}
                disabled={completeOnboarding.isPending || enablePush.isPending}
              >
                {completeOnboarding.isPending ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Bell size={16} className="mr-2" />
                )}
                Turn on notifications
              </Button>
              <Button
                variant="ghost"
                className="w-full text-gray-400"
                onClick={() => completeOnboarding.mutate()}
                disabled={completeOnboarding.isPending}
              >
                Maybe later
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
