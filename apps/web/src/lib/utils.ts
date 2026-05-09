import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "INR"): string {
  if (currency === "INR") return `₹${amount.toLocaleString("en-IN")}`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function daysUntil(dateStr: string): number {
  return differenceInDays(parseISO(dateStr), new Date());
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), "dd MMM yyyy");
}

export function getRenewalStatus(daysLeft: number): "active" | "warning" | "danger" | "overdue" {
  if (daysLeft < 0) return "overdue";
  if (daysLeft <= 1) return "danger";
  if (daysLeft <= 3) return "warning";
  return "active";
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ai: "AI Tools",
    ott: "OTT",
    saas: "SaaS",
    cloud: "Cloud",
    productivity: "Productivity",
    other: "Other",
  };
  return labels[category] || category;
}

export function getServiceLogoUrl(serviceName: string): string {
  const domain = SERVICE_DOMAINS[serviceName.toLowerCase()];
  if (domain) return `https://logo.clearbit.com/${domain}`;
  return "";
}

const SERVICE_DOMAINS: Record<string, string> = {
  netflix: "netflix.com",
  spotify: "spotify.com",
  "amazon prime": "amazon.com",
  hotstar: "hotstar.com",
  youtube: "youtube.com",
  "claude pro": "anthropic.com",
  chatgpt: "openai.com",
  cursor: "cursor.sh",
  "github copilot": "github.com",
  figma: "figma.com",
  notion: "notion.so",
  "adobe cc": "adobe.com",
  vercel: "vercel.com",
  aws: "aws.amazon.com",
  grammarly: "grammarly.com",
  canva: "canva.com",
  slack: "slack.com",
  linear: "linear.app",
  loom: "loom.com",
  midjourney: "midjourney.com",
};
