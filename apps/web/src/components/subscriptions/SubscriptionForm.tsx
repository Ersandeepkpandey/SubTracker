"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateSubscription, useUpdateSubscription } from "@/hooks/useSubscriptions";
import type { Subscription } from "@/lib/api";

const CATEGORIES = ["ai", "ott", "saas", "cloud", "productivity", "other"] as const;
const BILLING_CYCLES = ["monthly", "yearly", "weekly", "custom"] as const;
const POPULAR_SERVICES = ["Netflix", "Spotify", "ChatGPT", "Claude Pro", "Cursor", "GitHub Copilot", "Adobe CC", "Figma", "Notion", "Hotstar", "Amazon Prime", "AWS"];

interface SubscriptionFormProps {
  existing?: Subscription;
}

export function SubscriptionForm({ existing }: SubscriptionFormProps) {
  const router = useRouter();
  const create = useCreateSubscription();
  const update = useUpdateSubscription();

  const [form, setForm] = useState({
    serviceName: existing?.serviceName ?? "",
    amount: existing ? String(existing.amount) : "",
    currency: existing?.currency ?? "INR",
    billingCycle: existing?.billingCycle ?? "monthly",
    renewalDate: existing?.renewalDate ? existing.renewalDate.split("T")[0] : "",
    category: existing?.category ?? "other",
    notes: existing?.notes ?? "",
    cancelUrl: existing?.cancelUrl ?? "",
  });

  const [error, setError] = useState("");
  const isPending = create.isPending || update.isPending;

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.serviceName || !form.amount || !form.renewalDate) {
      setError("Service name, amount, and renewal date are required.");
      return;
    }

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
    };

    try {
      if (existing) {
        await update.mutateAsync({ id: existing.id, data: payload });
      } else {
        await create.mutateAsync(payload);
      }
      router.push("/subscriptions");
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Service name</label>
        <Input
          value={form.serviceName}
          onChange={(e) => set("serviceName", e.target.value)}
          placeholder="e.g. Netflix"
          list="popular-services"
        />
        <datalist id="popular-services">
          {POPULAR_SERVICES.map((s) => <option key={s} value={s} />)}
        </datalist>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="799"
          />
        </div>
        <div className="w-24">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
          <select
            value={form.currency}
            onChange={(e) => set("currency", e.target.value)}
            className="h-11 w-full rounded-input border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal"
          >
            {["INR", "USD", "EUR", "GBP"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Billing cycle</label>
        <div className="flex gap-2">
          {BILLING_CYCLES.map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => set("billingCycle", cycle)}
              className={`px-4 py-2 rounded-input text-sm font-medium border transition-colors ${
                form.billingCycle === cycle
                  ? "bg-teal text-white border-teal"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal"
              }`}
            >
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Renewal date</label>
        <Input
          type="date"
          value={form.renewalDate}
          onChange={(e) => set("renewalDate", e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => set("category", cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                form.category === cat
                  ? "bg-teal text-white border-teal"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal"
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Cancellation URL <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <Input
          type="url"
          value={form.cancelUrl}
          onChange={(e) => set("cancelUrl", e.target.value)}
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={2}
          placeholder="Any additional notes..."
          className="flex w-full rounded-input border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Saving..." : existing ? "Update Subscription" : "Save Subscription"}
      </Button>
    </form>
  );
}
