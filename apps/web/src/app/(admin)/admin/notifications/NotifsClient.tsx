"use client";

import { useState, useMemo } from "react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import type { AdminNotif } from "@/types/admin";

const STATUS_STYLES: Record<string, { icon: React.ElementType; cls: string; label: string }> = {
  sent:    { icon: CheckCircle, cls: "bg-emerald-50 text-emerald-700 ring-emerald-200", label: "sent" },
  pending: { icon: Clock,       cls: "bg-amber-50 text-amber-700 ring-amber-200",       label: "pending" },
  failed:  { icon: XCircle,     cls: "bg-red-50 text-red-600 ring-red-200",             label: "failed" },
};

export function NotifsClient({ notifications }: { notifications: AdminNotif[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return notifications.filter((n) =>
      (n.user.email.toLowerCase().includes(q) || n.subscription.serviceName.toLowerCase().includes(q)) &&
      (statusFilter === "all" || n.status === statusFilter) &&
      (typeFilter === "all" || n.notificationType === typeFilter)
    );
  }, [notifications, search, statusFilter, typeFilter]);

  const sent = notifications.filter((n) => n.status === "sent").length;
  const pending = notifications.filter((n) => n.status === "pending").length;
  const failed = notifications.filter((n) => n.status === "failed").length;

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
          <CheckCircle size={13} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">{sent} sent</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
          <Clock size={13} className="text-amber-600" />
          <span className="text-xs font-semibold text-amber-700">{pending} pending</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
          <XCircle size={13} className="text-red-500" />
          <span className="text-xs font-semibold text-red-600">{failed} failed</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by user or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none text-slate-700"
        >
          <option value="all">All statuses</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none text-slate-700"
        >
          <option value="all">All types</option>
          <option value="push">Push</option>
          <option value="email">Email</option>
        </select>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} records</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {["User", "Service", "Type", "Reminder", "Status", "Sent at", "Created"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400 text-sm">No notifications found</td></tr>
              ) : (
                filtered.map((n) => {
                  const s = STATUS_STYLES[n.status] ?? STATUS_STYLES.pending;
                  const StatusIcon = s.icon;
                  return (
                    <tr key={n.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-600 text-xs">{n.user.email}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-900">{n.subscription.serviceName}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.notificationType === "push" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                          {n.notificationType}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">{n.reminderDays}d before</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ${s.cls}`}>
                          <StatusIcon size={11} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {n.sentAt ? new Date(n.sentAt).toLocaleString() : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
