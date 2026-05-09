import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api",
});

api.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
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
