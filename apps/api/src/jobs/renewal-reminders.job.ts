import { prisma } from "@subtrack/db";
import { sendRenewalReminderEmail } from "../services/email.service";
import { sendPushNotification } from "../services/push.service";
import { addDays, startOfDay } from "../lib/date";

const REMINDER_DAYS = [3, 1, 0];

export async function runRenewalRemindersJob() {
  console.log("[cron] Running renewal reminders job");
  const today = startOfDay(new Date());

  for (const days of REMINDER_DAYS) {
    const targetDate = addDays(today, days);
    const targetDateStr = targetDate.toISOString().split("T")[0];

    const subscriptions = await prisma.subscription.findMany({
      where: {
        isActive: true,
        renewalDate: {
          gte: targetDate,
          lt: addDays(targetDate, 1),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            subscriptionStatus: true,
            trialEndsAt: true,
            pushDevices: true,
          },
        },
      },
    });

    for (const sub of subscriptions) {
      const user = sub.user;

      // Only notify active/trial users
      const isEligible =
        user.subscriptionStatus === "active" ||
        (user.subscriptionStatus === "trial" &&
          user.trialEndsAt &&
          user.trialEndsAt > new Date());

      if (!isEligible) continue;

      // Email notification
      const emailAlreadySent = await prisma.notification.findFirst({
        where: {
          subscriptionId: sub.id,
          reminderDays: days,
          renewalDateRef: targetDate,
          notificationType: "email",
        },
      });

      if (!emailAlreadySent) {
        try {
          await sendRenewalReminderEmail({
            to: user.email,
            userName: user.name || "there",
            serviceName: sub.serviceName,
            amount: Number(sub.amount),
            currency: sub.currency,
            daysUntilRenewal: days,
            subscriptionId: sub.id,
          });

          await prisma.notification.create({
            data: {
              userId: user.id,
              subscriptionId: sub.id,
              reminderDays: days,
              notificationType: "email",
              status: "sent",
              sentAt: new Date(),
              renewalDateRef: targetDate,
            },
          });
        } catch (err) {
          console.error(`[cron] Email failed for ${sub.serviceName}: ${err}`);
          await prisma.notification.create({
            data: {
              userId: user.id,
              subscriptionId: sub.id,
              reminderDays: days,
              notificationType: "email",
              status: "failed",
              renewalDateRef: targetDate,
            },
          });
        }
      }

      // Push notifications
      for (const device of user.pushDevices) {
        const pushAlreadySent = await prisma.notification.findFirst({
          where: {
            subscriptionId: sub.id,
            reminderDays: days,
            renewalDateRef: targetDate,
            notificationType: "push",
          },
        });

        if (pushAlreadySent) continue;

        const title = "Renewal alert";
        const body =
          days === 0
            ? `${sub.serviceName} renewed today — ${sub.currency} ${sub.amount}`
            : `${sub.serviceName} renews in ${days} day${days > 1 ? "s" : ""} — ${sub.currency} ${sub.amount}`;

        const result = await sendPushNotification(
          { endpoint: device.endpoint, p256dh: device.p256dh, auth: device.auth },
          title,
          body,
          `/subscriptions/${sub.id}`
        );

        if (result === "expired") {
          await prisma.pushDevice.delete({ where: { endpoint: device.endpoint } });
          continue;
        }

        await prisma.notification.create({
          data: {
            userId: user.id,
            subscriptionId: sub.id,
            reminderDays: days,
            notificationType: "push",
            status: result ? "sent" : "failed",
            sentAt: result ? new Date() : undefined,
            renewalDateRef: targetDate,
          },
        });
      }
    }

    console.log(`[cron] Processed ${subscriptions.length} subscriptions for D-${days} (${targetDateStr})`);
  }
}
