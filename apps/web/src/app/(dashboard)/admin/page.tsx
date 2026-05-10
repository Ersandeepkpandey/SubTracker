import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@subtrack/db";
import { AdminDashboard } from "./AdminDashboard";

async function fetchAdmin<T>(path: string): Promise<T> {
  const base = process.env.API_INTERNAL_URL ?? "http://localhost:4000/api";
  const res = await fetch(`${base}${path}`, {
    headers: { "x-admin-key": process.env.ADMIN_SECRET ?? "" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Admin fetch failed ${res.status}: ${path}`);
  return res.json();
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { isAdmin: true },
  });
  if (!user?.isAdmin) redirect("/dashboard");

  const [overview, users, subscriptions, logs, notifications] = await Promise.all([
    fetchAdmin<OverviewData>("/admin/overview"),
    fetchAdmin<AdminUser[]>("/admin/users"),
    fetchAdmin<AdminSub[]>("/admin/subscriptions"),
    fetchAdmin<SyncLog[]>("/admin/logs"),
    fetchAdmin<AdminNotif[]>("/admin/notifications"),
  ]);

  return (
    <AdminDashboard
      overview={overview}
      users={users}
      subscriptions={subscriptions}
      logs={logs}
      notifications={notifications}
    />
  );
}

// ── shared types (re-exported to client) ──────────────────────────────────────

export type OverviewData = {
  totalUsers: number;
  usersByStatus: { trial: number; active: number; expired: number; cancelled: number };
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  gmailConnected: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  subscriptionsBySource: { manual: number; gmail: number };
  subscriptionsByCategory: Array<{ category: string; count: number }>;
  mrr: number;
  notificationStats: { pending: number; sent: number; failed: number };
  pushDevices: number;
  recentSignups: Array<{ date: string; count: number }>;
};

export type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  subscriptionStatus: string;
  gmailConnected: boolean;
  onboardingDone: boolean;
  createdAt: string;
  trialStartedAt: string | null;
  trialEndsAt: string | null;
  _count: { subscriptions: number; pushDevices: number };
};

export type AdminSub = {
  id: string;
  serviceName: string;
  category: string;
  amount: string;
  currency: string;
  billingCycle: string;
  renewalDate: string;
  source: string;
  isActive: boolean;
  createdAt: string;
  user: { email: string; name: string | null };
};

export type SyncLog = {
  id: string;
  syncedAt: string;
  emailsScanned: number;
  subscriptionsFound: number;
  status: string;
  errorMessage: string | null;
  user: { email: string };
};

export type AdminNotif = {
  id: string;
  notificationType: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
  reminderDays: number;
  subscription: { serviceName: string };
  user: { email: string };
};
