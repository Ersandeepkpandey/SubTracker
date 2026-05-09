"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { format, parseISO, isToday, isYesterday, differenceInDays } from "date-fns";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";

interface Notification {
  id: string;
  reminderDays: number;
  notificationType: string;
  sentAt: string;
  subscription: { serviceName: string; serviceLogoUrl: string | null };
  subscriptionId: string;
}

function groupByDate(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {};
  for (const n of notifications) {
    if (!n.sentAt) continue;
    const date = n.sentAt.split("T")[0];
    groups[date] = groups[date] || [];
    groups[date].push(n);
  }
  return groups;
}

function dateLabel(dateStr: string) {
  const d = parseISO(dateStr);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  const days = differenceInDays(new Date(), d);
  if (days < 7) return `${days} days ago`;
  return format(d, "dd MMM yyyy");
}

export default function NotificationsPage() {
  const { data, isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await api.get("/notifications");
      return data;
    },
  });

  if (isLoading) return <PageLoader />;

  const groups = groupByDate(data ?? []);
  const dates = Object.keys(groups).sort((a, b) => (a > b ? -1 : 1));

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {dates.length === 0 ? (
        <EmptyState message="You're all caught up. No new alerts." />
      ) : (
        <div className="space-y-6">
          {dates.map((date) => (
            <div key={date}>
              <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">{dateLabel(date)}</h2>
              <div className="space-y-2">
                {groups[date].map((n) => (
                  <Link
                    key={n.id}
                    href={`/subscriptions/${n.subscriptionId}`}
                    className="flex items-center justify-between p-4 bg-white rounded-card border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-sm">{n.subscription.serviceName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {n.reminderDays === 0
                          ? "Renewed today"
                          : n.reminderDays === 1
                          ? "Renews tomorrow"
                          : `Renews in ${n.reminderDays} days`}
                        {" · "}
                        {n.notificationType}
                      </p>
                    </div>
                    <span className="text-xs text-teal font-medium">View →</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
