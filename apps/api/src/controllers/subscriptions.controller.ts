import { Response } from "express";
import { z } from "zod";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "../middleware/auth.middleware";

const createSchema = z.object({
  serviceName: z.string().min(1).max(255),
  serviceLogoUrl: z.string().url().optional(),
  category: z.enum(["ai", "ott", "saas", "cloud", "productivity", "other"]).default("other"),
  amount: z.number().positive(),
  currency: z.string().length(3).default("INR"),
  billingCycle: z.enum(["weekly", "monthly", "yearly", "custom"]).default("monthly"),
  renewalDate: z.string().refine((d) => !isNaN(Date.parse(d))),
  cancelUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

export async function listSubscriptions(req: AuthRequest, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { userId: req.userId!, isActive: true },
    orderBy: { renewalDate: "asc" },
  });
  res.json(subs);
}

export async function createSubscription(req: AuthRequest, res: Response) {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const sub = await prisma.subscription.create({
    data: {
      ...parsed.data,
      renewalDate: new Date(parsed.data.renewalDate),
      userId: req.userId!,
      amount: parsed.data.amount,
    },
  });
  res.status(201).json(sub);
}

export async function getSubscription(req: AuthRequest, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!sub) {
    res.status(404).json({ error: "Subscription not found" });
    return;
  }
  res.json(sub);
}

export async function updateSubscription(req: AuthRequest, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!sub) {
    res.status(404).json({ error: "Subscription not found" });
    return;
  }

  const updateSchema = createSchema.partial();
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const updated = await prisma.subscription.update({
    where: { id: req.params.id },
    data: {
      ...parsed.data,
      renewalDate: parsed.data.renewalDate
        ? new Date(parsed.data.renewalDate)
        : undefined,
    },
  });
  res.json(updated);
}

export async function deleteSubscription(req: AuthRequest, res: Response) {
  const sub = await prisma.subscription.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!sub) {
    res.status(404).json({ error: "Subscription not found" });
    return;
  }

  await prisma.subscription.update({
    where: { id: req.params.id },
    data: { isActive: false },
  });
  res.status(204).send();
}
