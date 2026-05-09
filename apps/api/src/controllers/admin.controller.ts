import { Request, Response } from "express";
import { prisma } from "@subtrack/db";

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      subscriptionStatus: true,
      gmailConnected: true,
      createdAt: true,
      trialEndsAt: true,
      _count: { select: { subscriptions: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json(users);
}

export async function getAnalytics(_req: Request, res: Response) {
  const [totalUsers, activeUsers, totalSubscriptions] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.subscription.count({ where: { isActive: true } }),
  ]);

  res.json({ totalUsers, activeUsers, totalSubscriptions });
}

export async function getLogs(_req: Request, res: Response) {
  const logs = await prisma.gmailSyncLog.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { syncedAt: "desc" },
    take: 100,
  });
  res.json(logs);
}
