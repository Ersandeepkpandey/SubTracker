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
  if (!res.ok) throw new Error(`Admin fetch failed: ${path}`);
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

  const [analytics, users, logs] = await Promise.all([
    fetchAdmin<{ totalUsers: number; activeUsers: number; totalSubscriptions: number }>("/admin/analytics"),
    fetchAdmin<Array<{
      id: string;
      name: string | null;
      email: string;
      subscriptionStatus: string;
      gmailConnected: boolean;
      createdAt: string;
      trialEndsAt: string | null;
      _count: { subscriptions: number };
    }>>("/admin/users"),
    fetchAdmin<Array<{
      id: string;
      userId: string;
      syncedAt: string;
      subscriptionsFound: number;
      status: string;
      error: string | null;
      user: { email: string };
    }>>("/admin/logs"),
  ]);

  return <AdminDashboard analytics={analytics} users={users} logs={logs} />;
}
