import { Request, Response } from "express";
import { prisma } from "@subtrack/db";
import { subDays, startOfDay, startOfWeek, startOfMonth, format } from "date-fns";

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      subscriptionStatus: true,
      gmailConnected: true,
      onboardingDone: true,
      createdAt: true,
      trialStartedAt: true,
      trialEndsAt: true,
      _count: { select: { subscriptions: true, pushDevices: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json(users);
}

export async function getOverview(_req: Request, res: Response) {
  const now = new Date();

  const [
    totalUsers,
    trialUsers,
    activeUsers,
    expiredUsers,
    cancelledUsers,
    newToday,
    newThisWeek,
    newThisMonth,
    gmailConnected,
    totalSubs,
    activeSubs,
    manualSubs,
    gmailSubs,
    categoryBreakdown,
    notifPending,
    notifSent,
    notifFailed,
    pushDevices,
    activeSubAmounts,
    last7DaysUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionStatus: "trial" } }),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.user.count({ where: { subscriptionStatus: "expired" } }),
    prisma.user.count({ where: { subscriptionStatus: "cancelled" } }),
    prisma.user.count({ where: { createdAt: { gte: startOfDay(now) } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfWeek(now) } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth(now) } } }),
    prisma.user.count({ where: { gmailConnected: true } }),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { isActive: true } }),
    prisma.subscription.count({ where: { source: "manual" } }),
    prisma.subscription.count({ where: { source: "gmail" } }),
    prisma.subscription.groupBy({ by: ["category"], _count: { id: true } }),
    prisma.notification.count({ where: { status: "pending" } }),
    prisma.notification.count({ where: { status: "sent" } }),
    prisma.notification.count({ where: { status: "failed" } }),
    prisma.pushDevice.count(),
    prisma.subscription.findMany({
      where: { isActive: true },
      select: { amount: true, billingCycle: true },
    }),
    prisma.user.findMany({
      where: { createdAt: { gte: subDays(now, 6) } },
      select: { createdAt: true },
    }),
  ]);

  // MRR calculation
  const mrr = activeSubAmounts.reduce((sum, s) => {
    const amt = Number(s.amount);
    if (s.billingCycle === "yearly") return sum + amt / 12;
    if (s.billingCycle === "weekly") return sum + amt * 4.33;
    return sum + amt;
  }, 0);

  // 7-day signup sparkline
  const signupMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    signupMap[format(subDays(now, i), "MMM d")] = 0;
  }
  last7DaysUsers.forEach((u) => {
    const key = format(u.createdAt, "MMM d");
    if (key in signupMap) signupMap[key]++;
  });
  const recentSignups = Object.entries(signupMap).map(([date, count]) => ({ date, count }));

  res.json({
    totalUsers,
    usersByStatus: { trial: trialUsers, active: activeUsers, expired: expiredUsers, cancelled: cancelledUsers },
    newUsersToday: newToday,
    newUsersThisWeek: newThisWeek,
    newUsersThisMonth: newThisMonth,
    gmailConnected,
    totalSubscriptions: totalSubs,
    activeSubscriptions: activeSubs,
    subscriptionsBySource: { manual: manualSubs, gmail: gmailSubs },
    subscriptionsByCategory: categoryBreakdown.map((c) => ({ category: c.category, count: c._count.id })),
    mrr: Math.round(mrr),
    notificationStats: { pending: notifPending, sent: notifSent, failed: notifFailed },
    pushDevices,
    recentSignups,
  });
}

export async function getAllSubscriptions(_req: Request, res: Response) {
  const subs = await prisma.subscription.findMany({
    select: {
      id: true,
      serviceName: true,
      category: true,
      amount: true,
      currency: true,
      billingCycle: true,
      renewalDate: true,
      source: true,
      isActive: true,
      createdAt: true,
      user: { select: { email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  res.json(subs);
}

export async function getAllNotifications(_req: Request, res: Response) {
  const notifs = await prisma.notification.findMany({
    select: {
      id: true,
      notificationType: true,
      status: true,
      sentAt: true,
      createdAt: true,
      reminderDays: true,
      subscription: { select: { serviceName: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json(notifs);
}

export async function getLogs(_req: Request, res: Response) {
  const logs = await prisma.gmailSyncLog.findMany({
    select: {
      id: true,
      syncedAt: true,
      emailsScanned: true,
      subscriptionsFound: true,
      status: true,
      errorMessage: true,
      user: { select: { email: true } },
    },
    orderBy: { syncedAt: "desc" },
    take: 200,
  });
  res.json(logs);
}

// kept for backward compat
export async function getAnalytics(_req: Request, res: Response) {
  const [totalUsers, activeUsers, totalSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.subscription.count({ where: { isActive: true } }),
  ]);
  res.json({ totalUsers, activeUsers, totalSubscriptions });
}
