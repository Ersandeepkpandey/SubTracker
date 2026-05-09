"use client";

import { useSession, signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { differenceInDays, parseISO } from "date-fns";
import Image from "next/image";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { isSubscribed, subscribe, isLoading: pushLoading } = usePushNotifications();

  const { data: gmailStatus } = useQuery({
    queryKey: ["gmail", "status"],
    queryFn: async () => {
      const { data } = await api.get("/gmail/status");
      return data as { connected: boolean; lastSync: string | null };
    },
  });

  const { data: userProfile } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const { data } = await api.get("/user/me");
      return data as {
        subscriptionStatus: string;
        trialDaysRemaining: number | null;
        trialEndsAt: string | null;
      };
    },
  });

  async function handleUpgrade() {
    const { data } = await api.post("/stripe/checkout");
    window.location.href = data.url;
  }

  async function handleManagePlan() {
    const { data } = await api.post("/stripe/portal");
    window.location.href = data.url;
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you sure you want to delete your account? All your data will be permanently deleted. This cannot be undone.")) return;
    // TODO: call delete account API
    await signOut({ callbackUrl: "/" });
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">Settings</h1>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Account</h2>
        <div className="bg-white rounded-card border border-gray-100 divide-y divide-gray-50">
          <div className="flex items-center gap-4 p-4">
            {session?.user?.image && (
              <Image src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full" />
            )}
            <div>
              <p className="font-medium text-sm">{session?.user?.name}</p>
              <p className="text-xs text-gray-400">{session?.user?.email}</p>
            </div>
          </div>
          <div className="p-4">
            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-gray-600 hover:text-red-600 transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Connected accounts</h2>
        <div className="bg-white rounded-card border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-sm">Gmail</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {gmailStatus?.connected ? (
                <span className="text-green-600">● Connected{gmailStatus.lastSync ? ` · Last synced ${new Date(gmailStatus.lastSync).toLocaleDateString()}` : ""}</span>
              ) : (
                <span className="text-gray-400">Not connected</span>
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => api.delete("/gmail/disconnect")}>
            {gmailStatus?.connected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Notifications</h2>
        <div className="bg-white rounded-card border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">Push notifications</p>
              <p className="text-xs text-gray-400 mt-0.5">Get renewal alerts in your browser</p>
            </div>
            {isSubscribed ? (
              <span className="text-xs text-green-600 font-medium">● Enabled</span>
            ) : (
              <Button variant="outline" size="sm" onClick={subscribe} disabled={pushLoading}>
                Enable
              </Button>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Plan</h2>
        <div className="bg-white rounded-card border border-gray-100 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">SubTrack Pro</p>
              {userProfile?.subscriptionStatus === "trial" ? (
                <p className="text-xs mt-0.5">
                  {userProfile.trialDaysRemaining !== null && userProfile.trialDaysRemaining > 0 ? (
                    <span className="text-amber-600 font-medium">{userProfile.trialDaysRemaining} days left in trial</span>
                  ) : (
                    <span className="text-red-500 font-medium">Trial expired</span>
                  )}
                  <span className="text-gray-400"> · ₹299/month or ₹2,499/year</span>
                </p>
              ) : userProfile?.subscriptionStatus === "active" ? (
                <p className="text-xs text-green-600 mt-0.5 font-medium">● Active</p>
              ) : (
                <p className="text-xs text-gray-400 mt-0.5">₹299/month or ₹2,499/year</p>
              )}
            </div>
            {userProfile?.subscriptionStatus === "active" ? (
              <Button size="sm" onClick={handleManagePlan}>Manage</Button>
            ) : (
              <Button size="sm" onClick={handleUpgrade}>Upgrade</Button>
            )}
          </div>
          {userProfile?.subscriptionStatus !== "active" && (
            <Button variant="outline" className="w-full" onClick={handleUpgrade}>
              Upgrade to Pro
            </Button>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">Danger zone</h2>
        <div className="bg-white rounded-card border border-red-100 p-4">
          <button onClick={handleDeleteAccount} className="text-sm text-red-600 hover:text-red-700 transition-colors">
            Delete account
          </button>
          <p className="text-xs text-gray-400 mt-1">Permanently delete your account and all subscription data.</p>
        </div>
      </section>
    </div>
  );
}
