import { google } from "googleapis";
import { prisma } from "@subtrack/db";
import { detectSubscriptionsWithAI } from "./ai.service";

const SUBSCRIPTION_KEYWORDS = [
  "receipt", "invoice", "subscription", "renewal", "payment confirmation",
  "billing", "charged", "your plan", "trial ending", "auto-renew",
];

const KNOWN_SENDERS: Record<string, string> = {
  "netflix.com": "Netflix",
  "spotify.com": "Spotify",
  "hotstar.com": "Disney+ Hotstar",
  "primevideo.com": "Amazon Prime Video",
  "openai.com": "ChatGPT",
  "anthropic.com": "Claude Pro",
  "cursor.sh": "Cursor",
  "github.com": "GitHub",
  "figma.com": "Figma",
  "notion.so": "Notion",
  "adobe.com": "Adobe CC",
  "vercel.com": "Vercel",
  "aws.amazon.com": "AWS",
  "cloud.google.com": "Google Cloud",
  "midjourney.com": "Midjourney",
  "grammarly.com": "Grammarly",
  "canva.com": "Canva",
  "loom.com": "Loom",
  "slack.com": "Slack",
  "linear.app": "Linear",
};

function getDomain(email: string): string {
  const match = email.match(/@([^>]+)/);
  return match ? match[1].toLowerCase() : "";
}

function isSubscriptionEmail(subject: string, from: string): boolean {
  const lower = subject.toLowerCase();
  if (SUBSCRIPTION_KEYWORDS.some((kw) => lower.includes(kw))) return true;
  const domain = getDomain(from);
  if (Object.keys(KNOWN_SENDERS).some((d) => domain.includes(d))) return true;
  return false;
}

export async function syncUserGmail(
  userId: string,
  tokens: { accessToken: string; refreshToken: string }
) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });

  const gmail = google.gmail({ version: "v1", auth });

  let emailsScanned = 0;
  let subscriptionsFound = 0;

  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 200,
      q: "subject:(receipt OR invoice OR subscription OR renewal OR billing) newer_than:90d",
    });

    const messages = listRes.data.messages || [];
    emailsScanned = messages.length;

    const emailSnippets: Array<{ from: string; subject: string; date: string }> = [];

    for (const msg of messages.slice(0, 100)) {
      try {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = detail.data.payload?.headers || [];
        const from = headers.find((h) => h.name === "From")?.value || "";
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";

        if (isSubscriptionEmail(subject, from)) {
          emailSnippets.push({ from, subject, date });
        }
      } catch {
        // skip individual email errors
      }
    }

    if (emailSnippets.length > 0) {
      const detected = await detectSubscriptionsWithAI(emailSnippets);

      for (const item of detected) {
        try {
          await prisma.subscription.upsert({
            where: {
              // use a composite to avoid creating duplicates
              // fall back to create if no match
              id: `gmail-${userId}-${item.serviceName.toLowerCase().replace(/\s/g, "-")}`,
            },
            create: {
              id: `gmail-${userId}-${item.serviceName.toLowerCase().replace(/\s/g, "-")}`,
              userId,
              serviceName: item.serviceName,
              amount: item.amount,
              currency: item.currency || "INR",
              billingCycle: item.billingCycle || "monthly",
              renewalDate: item.nextRenewal ? new Date(item.nextRenewal) : new Date(),
              category: item.category || "other",
              source: "gmail",
            },
            update: {
              amount: item.amount,
              renewalDate: item.nextRenewal ? new Date(item.nextRenewal) : undefined,
            },
          });
          subscriptionsFound++;
        } catch {
          // skip upsert errors for individual items
        }
      }
    }

    await prisma.gmailSyncLog.create({
      data: {
        userId,
        emailsScanned,
        subscriptionsFound,
        status: "success",
      },
    });

    return { emailsScanned, subscriptionsFound };
  } catch (error) {
    await prisma.gmailSyncLog.create({
      data: {
        userId,
        emailsScanned,
        subscriptionsFound,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });
    throw error;
  }
}
