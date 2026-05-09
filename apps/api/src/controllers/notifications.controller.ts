import { Response } from "express";
import { z } from "zod";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { addDays, startOfDay } from "../lib/date";

const prefsSchema = z.object({
  remind3Day: z.boolean().optional(),
  remind1Day: z.boolean().optional(),
  remindRenewalDay: z.boolean().optional(),
  emailReminders: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
});

export async function listNotifications(req: AuthRequest, res: Response) {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.userId!, status: "sent" },
    include: { subscription: { select: { serviceName: true, serviceLogoUrl: true } } },
    orderBy: { sentAt: "desc" },
    take: 50,
  });
  res.json(notifications);
}

export async function updatePreferences(req: AuthRequest, res: Response) {
  const parsed = prefsSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { notifPrefs: true },
  });

  const existing = (user?.notifPrefs as Record<string, boolean>) ?? {};
  const updated = { ...existing, ...parsed.data };

  await prisma.user.update({
    where: { id: req.userId! },
    data: { notifPrefs: updated },
  });

  res.json({ updated: true, prefs: updated });
}

export async function getPreferences(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { notifPrefs: true },
  });

  const defaults = {
    remind3Day: true,
    remind1Day: true,
    remindRenewalDay: true,
    emailReminders: true,
    pushNotifications: false,
  };

  res.json({ ...defaults, ...((user?.notifPrefs as object) ?? {}) });
}

export async function getUpcoming(req: AuthRequest, res: Response) {
  const today = startOfDay(new Date());
  const in7Days = addDays(today, 7);

  const upcoming = await prisma.subscription.findMany({
    where: {
      userId: req.userId!,
      isActive: true,
      renewalDate: { gte: today, lte: in7Days },
    },
    orderBy: { renewalDate: "asc" },
  });
  res.json(upcoming);
}

export async function subscribePush(req: AuthRequest, res: Response) {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    res.status(400).json({ error: "Invalid push subscription" });
    return;
  }

  await prisma.pushDevice.upsert({
    where: { endpoint },
    create: {
      userId: req.userId!,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
    },
    update: { userId: req.userId!, p256dh: keys.p256dh, auth: keys.auth },
  });

  await prisma.user.update({
    where: { id: req.userId! },
    data: {
      notifPrefs: {
        ...((await prisma.user.findUnique({ where: { id: req.userId! }, select: { notifPrefs: true } }))?.notifPrefs as object ?? {}),
        pushNotifications: true,
      },
    },
  });

  res.status(201).json({ subscribed: true });
}

export async function unsubscribePush(req: AuthRequest, res: Response) {
  const { endpoint } = req.body;
  if (!endpoint) {
    res.status(400).json({ error: "endpoint is required" });
    return;
  }

  await prisma.pushDevice.deleteMany({
    where: { userId: req.userId!, endpoint },
  });
  res.json({ unsubscribed: true });
}
