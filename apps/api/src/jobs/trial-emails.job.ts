import { prisma } from "@subtrack/db";
import { sendTrialConversionEmail } from "../services/email.service";
import { startOfDay, addDays } from "../lib/date";

const TRIAL_EMAIL_DAYS = [1, 7, 12, 14] as const;

export async function runTrialEmailsJob() {
  console.log("[cron] Running trial conversion emails job");
  const today = startOfDay(new Date());

  for (const day of TRIAL_EMAIL_DAYS) {
    const targetStart = addDays(today, -day);
    const targetEnd = addDays(targetStart, 1);

    const users = await prisma.user.findMany({
      where: {
        subscriptionStatus: "trial",
        trialStartedAt: { gte: targetStart, lt: targetEnd },
      },
      select: {
        id: true,
        email: true,
        name: true,
        _count: { select: { subscriptions: { where: { isActive: true } } } },
        subscriptions: {
          where: { isActive: true },
          select: { amount: true, billingCycle: true, currency: true },
        },
      },
    });

    for (const user of users) {
      let monthlyTotal = 0;
      for (const sub of user.subscriptions) {
        const amount = Number(sub.amount);
        if (sub.billingCycle === "monthly") monthlyTotal += amount;
        else if (sub.billingCycle === "yearly") monthlyTotal += amount / 12;
        else if (sub.billingCycle === "weekly") monthlyTotal += amount * 4.33;
      }

      try {
        await sendTrialConversionEmail(
          user.email,
          user.name || "there",
          day as 1 | 7 | 12 | 14,
          {
            subscriptionCount: user._count.subscriptions,
            monthlySpend: Math.round(monthlyTotal),
            currency: user.subscriptions[0]?.currency ?? "INR",
          }
        );
        console.log(`[cron] Sent day-${day} trial email to ${user.email}`);
      } catch (err) {
        console.error(`[cron] Trial email failed for ${user.email}:`, err);
      }
    }

    console.log(`[cron] Trial day-${day}: processed ${users.length} users`);
  }
}
