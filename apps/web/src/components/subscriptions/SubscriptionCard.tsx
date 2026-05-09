"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, daysUntil, getRenewalStatus, formatDate, getServiceLogoUrl } from "@/lib/utils";
import type { Subscription } from "@/lib/api";

export function SubscriptionCard({ sub }: { sub: Subscription }) {
  const days = daysUntil(sub.renewalDate);
  const status = getRenewalStatus(days);
  const logoUrl = sub.serviceLogoUrl || getServiceLogoUrl(sub.serviceName);

  return (
    <Link href={`/subscriptions/${sub.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors group">
      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        {logoUrl ? (
          <Image src={logoUrl} alt={sub.serviceName} width={32} height={32} className="object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        ) : (
          <span className="text-lg font-bold text-gray-400">{sub.serviceName[0]}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-text-primary truncate">{sub.serviceName}</p>
        <p className="text-xs text-gray-400">{formatDate(sub.renewalDate)}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="font-semibold text-sm">{formatCurrency(Number(sub.amount), sub.currency)}</p>
        <Badge
          variant={status === "active" ? "active" : status === "warning" ? "warning" : "danger"}
          className="mt-1"
        >
          {days < 0 ? "Overdue" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
        </Badge>
      </div>
    </Link>
  );
}
