"use client";

import { useSession } from "next-auth/react";
import { differenceInDays, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function TrialBanner({ trialEndsAt }: { trialEndsAt: string }) {
  const daysLeft = differenceInDays(parseISO(trialEndsAt), new Date());

  if (daysLeft > 5) return null;

  async function handleUpgrade() {
    const { data } = await api.post("/stripe/checkout");
    window.location.href = data.url;
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-sm">
      <span className="text-amber-800">
        {daysLeft <= 0
          ? "Your trial has ended. Subscribe to keep reminders active."
          : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left in your trial.`}
      </span>
      <Button size="sm" onClick={handleUpgrade} className="ml-4 h-8 text-xs">
        Subscribe — ₹299/month
      </Button>
    </div>
  );
}
