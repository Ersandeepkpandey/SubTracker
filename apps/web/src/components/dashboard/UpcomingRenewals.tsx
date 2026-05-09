"use client";

import Link from "next/link";
import { useUpcomingRenewals } from "@/hooks/useDashboard";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, daysUntil, getRenewalStatus } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function UpcomingRenewals() {
  const { data: upcoming, isLoading } = useUpcomingRenewals();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Renewing soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!upcoming?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Renewing soon</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {upcoming.map((sub) => {
          const days = daysUntil(sub.renewalDate);
          const status = getRenewalStatus(days);
          return (
            <Link
              key={sub.id}
              href={`/subscriptions/${sub.id}`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{sub.serviceName}</p>
                <Badge variant={status === "active" ? "default" : status === "warning" ? "warning" : "danger"} className="mt-1">
                  {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                </Badge>
              </div>
              <span className="font-semibold text-sm">
                {formatCurrency(Number(sub.amount), sub.currency)}
              </span>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
