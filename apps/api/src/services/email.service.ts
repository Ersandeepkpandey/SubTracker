import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "reminders@subtrack.app";
const WEB_URL = process.env.WEB_URL || "https://subtrack.app";

interface RenewalEmailData {
  to: string;
  userName: string;
  serviceName: string;
  amount: number;
  currency: string;
  daysUntilRenewal: number;
  subscriptionId: string;
}

export async function sendRenewalReminderEmail(data: RenewalEmailData) {
  const { to, userName, serviceName, amount, currency, daysUntilRenewal, subscriptionId } = data;

  const subject =
    daysUntilRenewal === 0
      ? `${serviceName} renewed today — ${currency} ${amount} charged`
      : daysUntilRenewal === 1
      ? `${serviceName} renews tomorrow — ${currency} ${amount}`
      : `${serviceName} renews in ${daysUntilRenewal} days — ${currency} ${amount}`;

  const body =
    daysUntilRenewal === 0
      ? `Your ${serviceName} subscription renewed today. ${currency} ${amount} has been charged.`
      : `Your ${serviceName} subscription renews in ${daysUntilRenewal} day${daysUntilRenewal > 1 ? "s" : ""}. ${currency} ${amount} will be charged.`;

  await resend.emails.send({
    from: FROM,
    to,
    subject,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1A1A1A;">
  <h2 style="color: #0D9E75; margin-bottom: 8px;">SubTrack</h2>
  <p>Hi ${userName},</p>
  <p>${body}</p>
  <p>
    <a href="${WEB_URL}/subscriptions/${subscriptionId}"
       style="display: inline-block; background: #0D9E75; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
      View in SubTrack
    </a>
  </p>
  <p style="color: #888; font-size: 12px; margin-top: 32px;">
    You're receiving this because you have renewal reminders enabled.<br>
    <a href="${WEB_URL}/settings" style="color: #888;">Manage notification preferences</a>
  </p>
</body>
</html>`,
  });
}

export async function sendTrialConversionEmail(
  to: string,
  userName: string,
  day: 1 | 7 | 12 | 14,
  stats: { subscriptionCount: number; monthlySpend: number; currency: string }
) {
  const subjects: Record<number, string> = {
    1: `SubTrack found ${stats.subscriptionCount} subscriptions. You're spending ${stats.currency} ${stats.monthlySpend}/month.`,
    7: "Your trial is halfway done. Here's what we've saved you from.",
    12: "2 days left on your SubTrack trial.",
    14: "Your trial ended. Your data is safe.",
  };

  const bodies: Record<number, string> = {
    1: `We found ${stats.subscriptionCount} subscriptions totalling ${stats.currency} ${stats.monthlySpend}/month. We'll remind you before every renewal.`,
    7: `You're 7 days into your trial. We've been watching your ${stats.subscriptionCount} subscriptions and will warn you before any charge surprises you.`,
    12: `Your trial ends in 2 days. Subscribe for ${stats.currency === "INR" ? "₹299/month" : "$4.99/month"} to keep your reminders active.`,
    14: `Your trial has ended. Your subscription data is safe — subscribe to continue getting renewal reminders.`,
  };

  await resend.emails.send({
    from: FROM,
    to,
    subject: subjects[day],
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; color: #1A1A1A;">
  <h2 style="color: #0D9E75;">SubTrack</h2>
  <p>Hi ${userName},</p>
  <p>${bodies[day]}</p>
  <p>
    <a href="${WEB_URL}/settings"
       style="display: inline-block; background: #0D9E75; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
      ${day === 14 || day === 12 ? "Subscribe Now" : "View Dashboard"}
    </a>
  </p>
</body>
</html>`,
  });
}
