"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, daysUntil, getRenewalStatus, formatDate } from "@/lib/utils";

const CATEGORIES = ["All", "AI", "OTT", "SaaS", "Cloud", "Productivity", "Other"];

export default function PreviewSubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = MOCK_SUBSCRIPTIONS.filter((s) => {
    const matchesSearch = s.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || s.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <div className="flex items-center gap-3">
          <button className="text-sm text-teal border border-teal px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
            Sync Gmail
          </button>
          <Link href="/preview/subscriptions/new">
            <Button size="sm">
              <Plus size={16} className="mr-1.5" />
              Add
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input className="pl-9" placeholder="Search subscriptions..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${category === cat ? "bg-teal text-white border-teal" : "bg-white text-gray-600 border-gray-200 hover:border-teal"}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-card border border-gray-100 divide-y divide-gray-50">
        {filtered.map((sub) => {
          const days = daysUntil(sub.renewalDate);
          const status = getRenewalStatus(days);
          return (
            <Link key={sub.id} href={`/preview/subscriptions/${sub.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {sub.serviceLogoUrl ? (
                  <Image src={sub.serviceLogoUrl} alt={sub.serviceName} width={32} height={32} className="object-contain" />
                ) : (
                  <span className="text-lg font-bold text-gray-400">{sub.serviceName[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{sub.serviceName}</p>
                <p className="text-xs text-gray-400">{formatDate(sub.renewalDate)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm">{formatCurrency(sub.amount)}</p>
                <Badge variant={status === "active" ? "active" : status === "warning" ? "warning" : "danger"} className="mt-1">
                  {days <= 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                </Badge>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
