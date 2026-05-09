import { Response } from "express";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { differenceInDays } from "date-fns";

export async function updateMe(req: AuthRequest, res: Response) {
  const { onboardingDone } = req.body as { onboardingDone?: boolean };
  const updated = await prisma.user.update({
    where: { id: req.userId! },
    data: { ...(onboardingDone !== undefined && { onboardingDone }) },
    select: { id: true, onboardingDone: true },
  });
  res.json(updated);
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      subscriptionStatus: true,
      trialStartedAt: true,
      trialEndsAt: true,
      onboardingDone: true,
      notifPrefs: true,
    },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const trialDaysRemaining =
    user.trialEndsAt ? Math.max(0, differenceInDays(user.trialEndsAt, new Date())) : null;

  res.json({ ...user, trialDaysRemaining });
}
