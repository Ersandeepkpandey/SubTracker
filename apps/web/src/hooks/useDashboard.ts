import { useQuery } from "@tanstack/react-query";
import api, { type InsightSummary, type CategoryBreakdown, type Subscription } from "@/lib/api";

export function useInsightSummary() {
  return useQuery<InsightSummary>({
    queryKey: ["insights", "summary"],
    queryFn: async () => {
      const { data } = await api.get("/insights/summary");
      return data;
    },
  });
}

export function useCategoryBreakdown() {
  return useQuery<CategoryBreakdown[]>({
    queryKey: ["insights", "categories"],
    queryFn: async () => {
      const { data } = await api.get("/insights/categories");
      return data;
    },
  });
}

export function useUpcomingRenewals() {
  return useQuery<Subscription[]>({
    queryKey: ["notifications", "upcoming"],
    queryFn: async () => {
      const { data } = await api.get("/notifications/upcoming");
      return data;
    },
  });
}

export function useAISuggestions() {
  return useQuery<Array<{ type: string; message: string; action: string | null }>>({
    queryKey: ["insights", "suggestions"],
    queryFn: async () => {
      const { data } = await api.get("/insights/suggestions");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
