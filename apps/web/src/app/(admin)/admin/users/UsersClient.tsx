"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { CheckCircle, XCircle, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import type { AdminUser } from "@/types/admin";

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  trial: "bg-amber-50 text-amber-700 ring-amber-200",
  expired: "bg-red-50 text-red-600 ring-red-200",
  cancelled: "bg-slate-100 text-slate-500 ring-slate-200",
};

function diffDays(date: string) {
  return Math.max(0, Math.round((new Date(date).getTime() - Date.now()) / 86400000));
}

export function UsersClient({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sortKey, setSortKey] = useState<"createdAt" | "subscriptions">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase();
      return (u.email + (u.name ?? "")).toLowerCase().includes(q);
    });
    if (status !== "all") list = list.filter((u) => u.subscriptionStatus === status);
    return [...list].sort((a, b) => {
      const av = sortKey === "subscriptions" ? a._count.subscriptions : new Date(a.createdAt).getTime();
      const bv = sortKey === "subscriptions" ? b._count.subscriptions : new Date(b.createdAt).getTime();
      return sortDir === "desc" ? bv - av : av - bv;
    });
  }, [users, search, status, sortKey, sortDir]);

  function toggleSort(k: typeof sortKey) {
    if (sortKey === k) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(k); setSortDir("desc"); }
  }

  const SortIcon = ({ k }: { k: typeof sortKey }) =>
    sortKey !== k ? null : sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />;

  // Summary counts
  const counts = useMemo(() => ({
    trial: users.filter((u) => u.subscriptionStatus === "trial").length,
    active: users.filter((u) => u.subscriptionStatus === "active").length,
    expired: users.filter((u) => u.subscriptionStatus === "expired").length,
  }), [users]);

  return (
    <div className="space-y-4">
      {/* Summary pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { label: "Active", count: counts.active, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
          { label: "Trial", count: counts.trial, color: "bg-amber-50 text-amber-700 border-amber-200" },
          { label: "Expired", count: counts.expired, color: "bg-red-50 text-red-600 border-red-200" },
        ].map(({ label, count, color }) => (
          <div key={label} className={`px-3 py-1 rounded-full border text-xs font-semibold ${color}`}>
            {count} {label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-400"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none text-slate-700"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} of {users.length} users</p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">User</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Gmail</th>
                <th
                  className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700"
                  onClick={() => toggleSort("subscriptions")}
                >
                  <span className="flex items-center gap-1">Subs <SortIcon k="subscriptions" /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Push</th>
                <th
                  className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-700"
                  onClick={() => toggleSort("createdAt")}
                >
                  <span className="flex items-center gap-1">Joined <SortIcon k="createdAt" /></span>
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">No users found</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <>
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/60 cursor-pointer transition-colors"
                      onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <Image src={u.image} alt="" width={34} height={34} className="rounded-full ring-2 ring-slate-100" />
                          ) : (
                            <div className="w-[34px] h-[34px] rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                              {(u.name ?? u.email)[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">{u.name ?? "—"}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${STATUS_STYLES[u.subscriptionStatus] ?? STATUS_STYLES.cancelled}`}>
                          {u.subscriptionStatus}
                        </span>
                        {!u.onboardingDone && (
                          <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">no onboarding</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {u.gmailConnected
                          ? <CheckCircle size={16} className="text-emerald-500" />
                          : <XCircle size={16} className="text-slate-200" />}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-semibold text-slate-900">{u._count.subscriptions}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{u._count.pushDevices}</td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <ChevronRight size={14} className={`text-slate-300 transition-transform ${expanded === u.id ? "rotate-90" : ""}`} />
                      </td>
                    </tr>
                    {expanded === u.id && (
                      <tr key={`${u.id}-exp`} className="bg-slate-50/80">
                        <td colSpan={7} className="px-5 py-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                              { label: "User ID", value: u.id, mono: true },
                              { label: "Trial started", value: u.trialStartedAt ? new Date(u.trialStartedAt).toLocaleDateString() : "—" },
                              { label: "Trial ends", value: u.trialEndsAt ? `${new Date(u.trialEndsAt).toLocaleDateString()} (${diffDays(u.trialEndsAt)}d left)` : "—" },
                              { label: "Onboarding", value: u.onboardingDone ? "✓ Complete" : "⏳ Pending" },
                            ].map(({ label, value, mono }) => (
                              <div key={label}>
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                                <p className={`text-xs text-slate-700 ${mono ? "font-mono break-all" : ""}`}>{value}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
