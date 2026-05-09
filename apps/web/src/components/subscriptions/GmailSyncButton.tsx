"use client";

import { useState } from "react";
import { RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function GmailSyncButton({ isConnected }: { isConnected: boolean }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ emailsScanned: number; subscriptionsFound: number } | null>(null);
  const qc = useQueryClient();

  async function handleSync() {
    setSyncing(true);
    setResult(null);
    try {
      const { data } = await api.post("/gmail/sync");
      setResult(data);
      qc.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch {
      // error handled silently
    } finally {
      setSyncing(false);
    }
  }

  if (!isConnected) {
    return (
      <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
        <Mail size={14} className="mr-1.5" />
        Connect Gmail
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {result && (
        <span className="text-xs text-gray-500">
          Found {result.subscriptionsFound} new ({result.emailsScanned} emails scanned)
        </span>
      )}
      <Button variant="outline" size="sm" onClick={handleSync} disabled={syncing}>
        <RefreshCw size={14} className={`mr-1.5 ${syncing ? "animate-spin" : ""}`} />
        {syncing ? "Syncing..." : "Sync Gmail"}
      </Button>
    </div>
  );
}
