import { Response } from "express";
import { prisma } from "@subtrack/db";
import { AuthRequest } from "../middleware/auth.middleware";
import { generateInsights, askSubscriptionQuestion } from "../services/ai.service";

export async function getSummary(req: AuthRequest, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { userId: req.userId!, isActive: true },
  });

  let monthlyTotal = 0;
  for (const sub of subs) {
    const amount = Number(sub.amount);
    if (sub.billingCycle === "monthly") monthlyTotal += amount;
    else if (sub.billingCycle === "yearly") monthlyTotal += amount / 12;
    else if (sub.billingCycle === "weekly") monthlyTotal += amount * 4.33;
  }

  res.json({
    monthlyTotal: Math.round(monthlyTotal * 100) / 100,
    yearlyTotal: Math.round(monthlyTotal * 12 * 100) / 100,
    totalSubscriptions: subs.length,
    currency: subs[0]?.currency ?? "INR",
  });
}

export async function getCategories(req: AuthRequest, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { userId: req.userId!, isActive: true },
    select: { category: true, amount: true, billingCycle: true },
  });

  const breakdown: Record<string, number> = {};
  for (const sub of subs) {
    const amount = Number(sub.amount);
    const monthly =
      sub.billingCycle === "yearly"
        ? amount / 12
        : sub.billingCycle === "weekly"
        ? amount * 4.33
        : amount;
    breakdown[sub.category] = (breakdown[sub.category] || 0) + monthly;
  }

  res.json(
    Object.entries(breakdown).map(([category, total]) => ({
      category,
      total: Math.round(total * 100) / 100,
    }))
  );
}

export async function getSuggestions(req: AuthRequest, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { userId: req.userId!, isActive: true },
  });

  const suggestions = await generateInsights(subs);
  res.json(suggestions);
}

export async function askAI(req: AuthRequest, res: Response) {
  const { question } = req.body;
  if (!question || typeof question !== "string") {
    res.status(400).json({ error: "question is required" });
    return;
  }

  const subs = await prisma.subscription.findMany({
    where: { userId: req.userId!, isActive: true },
  });

  const answer = await askSubscriptionQuestion(question, subs);
  res.json({ answer });
}
