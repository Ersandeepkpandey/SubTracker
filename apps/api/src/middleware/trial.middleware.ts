import { Response, NextFunction } from "express";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "./auth.middleware";

export async function trialMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { subscriptionStatus: true, trialEndsAt: true },
  });

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  if (user.subscriptionStatus === "active") {
    next();
    return;
  }

  if (
    user.subscriptionStatus === "trial" &&
    user.trialEndsAt &&
    user.trialEndsAt > new Date()
  ) {
    next();
    return;
  }

  res.status(402).json({
    error: "Trial expired",
    message: "Your 14-day trial has ended. Subscribe to continue.",
  });
}
