import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { type Subscription } from "@/lib/api";

export function useSubscriptions() {
  return useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data } = await api.get("/subscriptions");
      return data;
    },
  });
}

export function useSubscription(id: string) {
  return useQuery<Subscription>({
    queryKey: ["subscriptions", id],
    queryFn: async () => {
      const { data } = await api.get(`/subscriptions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Subscription>) => {
      const res = await api.post("/subscriptions", data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

export function useUpdateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Subscription> }) => {
      const res = await api.patch(`/subscriptions/${id}`, data);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}

export function useDeleteSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/subscriptions/${id}`);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });
}
