export const MOCK_SUBSCRIPTIONS = [
  { id: "1", serviceName: "Netflix", category: "ott", amount: 799, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(3), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/netflix.com", cancelUrl: "https://netflix.com/cancel", notes: null },
  { id: "2", serviceName: "Claude Pro", category: "ai", amount: 1700, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(5), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/anthropic.com", cancelUrl: null, notes: null },
  { id: "3", serviceName: "Spotify", category: "ott", amount: 119, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(8), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/spotify.com", cancelUrl: "https://spotify.com/account/subscription", notes: null },
  { id: "4", serviceName: "GitHub Copilot", category: "ai", amount: 830, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(12), isActive: true, source: "manual", serviceLogoUrl: "https://logo.clearbit.com/github.com", cancelUrl: null, notes: null },
  { id: "5", serviceName: "Figma", category: "saas", amount: 1250, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(18), isActive: true, source: "manual", serviceLogoUrl: "https://logo.clearbit.com/figma.com", cancelUrl: null, notes: "Team plan" },
  { id: "6", serviceName: "Adobe CC", category: "productivity", amount: 4230, currency: "INR", billingCycle: "yearly", renewalDate: daysFromNow(45), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/adobe.com", cancelUrl: "https://account.adobe.com/plans", notes: null },
  { id: "7", serviceName: "Notion", category: "productivity", amount: 800, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(22), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/notion.so", cancelUrl: null, notes: null },
  { id: "8", serviceName: "Vercel", category: "cloud", amount: 1700, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(30), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/vercel.com", cancelUrl: null, notes: null },
  { id: "9", serviceName: "Cursor", category: "ai", amount: 1650, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(14), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/cursor.sh", cancelUrl: null, notes: null },
  { id: "10", serviceName: "Hotstar", category: "ott", amount: 299, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(6), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/hotstar.com", cancelUrl: null, notes: null },
  { id: "11", serviceName: "AWS", category: "cloud", amount: 2100, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(28), isActive: true, source: "gmail", serviceLogoUrl: "https://logo.clearbit.com/aws.amazon.com", cancelUrl: null, notes: null },
  { id: "12", serviceName: "Grammarly", category: "productivity", amount: 750, currency: "INR", billingCycle: "monthly", renewalDate: daysFromNow(35), isActive: true, source: "manual", serviceLogoUrl: "https://logo.clearbit.com/grammarly.com", cancelUrl: null, notes: null },
];

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export const MOCK_SUMMARY = {
  monthlyTotal: 10478,
  yearlyTotal: 125736,
  totalSubscriptions: 12,
  currency: "INR",
};

export const MOCK_CATEGORIES = [
  { category: "ai", total: 4180 },
  { category: "ott", total: 1217 },
  { category: "cloud", total: 3800 },
  { category: "productivity", total: 2152.5 },
  { category: "saas", total: 1250 },
];

export const MOCK_SUGGESTIONS = [
  { type: "spend_summary", message: "You spend ₹10,478/month — ₹1,25,736/year on subscriptions.", action: null },
  { type: "category_breakdown", message: "39% of your spend is on AI tools (Claude, Cursor, Copilot).", action: null },
  { type: "recommendation", message: "Switching Adobe CC to a yearly plan would save ₹2,400.", action: "Consider yearly plan" },
  { type: "recommendation", message: "You could save ₹1,800/year by bundling Hotstar + Disney+.", action: "Review OTT plan" },
];

export const MOCK_NOTIFICATIONS = [
  { id: "n1", reminderDays: 3, notificationType: "email", sentAt: new Date().toISOString(), subscriptionId: "1", subscription: { serviceName: "Netflix", serviceLogoUrl: "https://logo.clearbit.com/netflix.com" } },
  { id: "n2", reminderDays: 1, notificationType: "push", sentAt: new Date(Date.now() - 86400000).toISOString(), subscriptionId: "3", subscription: { serviceName: "Spotify", serviceLogoUrl: null } },
  { id: "n3", reminderDays: 0, notificationType: "email", sentAt: new Date(Date.now() - 86400000 * 3).toISOString(), subscriptionId: "4", subscription: { serviceName: "GitHub Copilot", serviceLogoUrl: null } },
];
