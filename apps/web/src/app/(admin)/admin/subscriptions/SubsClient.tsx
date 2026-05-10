"use client";

import { useState, useMemo } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { AdminSub } from "@/types/admin";

const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI", ott: "OTT", saas: "SaaS", cloud: "Cloud", productivity: "Productivity", other: "Other",
};

const CATEGORY_COLORS: Record<string, string> = {
  ai: "bg-purple-50 text-purple-700",
  ott: "bg-pink-50 text-pink-700",
  saas: "bg-blue-50 text-blue-700",
  cloud: "bg-sky-50 text-sky-700",
  productivity: "bg-green-50 text-green-700",
  other: "bg-slate-100 text-slate-600",
};

export function SubsClient({ subscriptions }: { subscriptions: AdminSub[] }) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const q = search.toLowerCase();
      return (
        (s.serviceName.toLowerCase().includes(q) || s.user.email.toLowerCase().includes(q)) &&
        (source === "all" || s.source === source) &&
        (!activeOnly || s.isActive)
      );
    });
  }, [subscriptions, search, source, activeOnly]);

  const totalMRR = useMemo(() => {
    return filtered.filter((s) => s.isActive).reduce((sum, s) => {
      const amt = Number(s.amount);
      if (s.billingCycle === "yearly") return sum + amt / 12;
      if (s.billingCycle === "weekly") return sum + amt * 4.33;
      return sum + amt;
    }, 0);
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by service or user email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-400"
        />
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none text-slate-700"
        >
          <option value="all">All sources</option>
          <option value="manual">Manual</option>
          <option value="gmail">Gmail</option>
        </select>
        <label className="flex items-center gap-2 px-3 py-2.5 bg-white border border-slate-200 rounded-lg cursor-pointer text-sm text-slate-600">
          <input
            type="checkbox"
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
            className="accent-teal-500"
          />
          Active only
        </label>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">{filtered.length} subscriptions</p>
        {totalMRR > 0 && (
          <p className="text-xs font-semibold text-slate-700">
            Est. MRR from filtered: <span className="text-teal-600">₹{Math.round(totalMRR).toLocaleString()}</span>
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {["Service", "User", "Category", "Amount", "Cycle", "Renews", "Source", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-slate-400 text-sm">No subscriptions found</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{s.serviceName}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{s.user.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[s.category] ?? CATEGORY_COLORS.other}`}>
                        {CATEGORY_LABELS[s.category] ?? s.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                      {s.currency} {Number(s.amount).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 capitalize text-xs">{s.billingCycle}</td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{new Date(s.renewalDate).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.source === "gmail" ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                        {s.source}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {s.isActive
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><CheckCircle size={13} /> Active</span>
                        : <span className="flex items-center gap-1 text-xs text-slate-400"><XCircle size={13} /> Paused</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
