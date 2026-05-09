import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use(async (config) => {
  try {
    const res = await fetch("/api/auth/token");
    if (res.ok) {
      const { token } = await res.json();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // no token, request proceeds unauthenticated
  }
  return config;
});

export default api;

export type Subscription = {
  id: string;
  serviceName: string;
  serviceLogoUrl: string | null;
  category: string;
  amount: number;
  currency: string;
  billingCycle: string;
  renewalDate: string;
  source: string;
  cancelUrl: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
};

export type InsightSummary = {
  monthlyTotal: number;
  yearlyTotal: number;
  totalSubscriptions: number;
  currency: string;
};

export type CategoryBreakdown = {
  category: string;
  total: number;
};
