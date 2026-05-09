"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { GmailSyncButton } from "@/components/subscriptions/GmailSyncButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["All", "AI", "OTT", "SaaS", "Cloud", "Productivity", "Other"];

export default function SubscriptionsPage() {
  const { data: subs, isLoading } = useSubscriptions();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = subs?.filter((s) => {
    const matchesSearch = s.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || s.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <div className="flex items-center gap-3">
          <GmailSyncButton isConnected={true} />
          <Link href="/subscriptions/new">
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              Add
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          className="pl-9"
          placeholder="Search subscriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? "bg-teal text-white border-teal"
                : "bg-white text-gray-600 border-gray-200 hover:border-teal"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoader />
      ) : !filtered?.length ? (
        <EmptyState
          message={search || category !== "All" ? "No subscriptions match your filter." : "No subscriptions yet. Add your first one."}
          ctaLabel={!search && category === "All" ? "+ Add subscription" : undefined}
          ctaHref={!search && category === "All" ? "/subscriptions/new" : undefined}
        />
      ) : (
        <div className="bg-white rounded-card border border-gray-100 divide-y divide-gray-50">
          {filtered.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  );
}
