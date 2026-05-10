"use client";

import { useState, useMemo } from "react";
import { Mail, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import type { SyncLog } from "@/types/admin";

export function LogsClient({ logs }: { logs: SyncLog[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      return (
        l.user.email.toLowerCase().includes(search.toLowerCase()) &&
        (statusFilter === "all" || l.status === statusFilter)
      );
    });
  }, [logs, search, statusFilter]);

  const successCount = logs.filter((l) => l.status === "success").length;
  const failedCount = logs.filter((l) => l.status === "failed").length;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
          <CheckCircle size={14} className="text-emerald-600" />
          <span className="text-xs font-semibold text-emerald-700">{successCount} successful</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
          <AlertCircle size={14} className="text-red-500" />
          <span className="text-xs font-semibold text-red-600">{failedCount} failed</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 placeholder:text-slate-400"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white focus:outline-none text-slate-700"
        >
          <option value="all">All</option>
          <option value="success">Success only</option>
          <option value="failed">Failed only</option>
        </select>
      </div>

      <p className="text-xs text-slate-400">{filtered.length} entries</p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                {["User", "Synced at", "Emails scanned", "Subs found", "Status", "Error"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">No logs found</td></tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Mail size={13} className="text-slate-400 shrink-0" />
                        <span className="text-slate-700">{l.user.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                      {new Date(l.syncedAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{l.emailsScanned}</td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900">{l.subscriptionsFound}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      {l.status === "success" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircle size={11} /> success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 ring-1 ring-red-200">
                          <XCircle size={11} /> failed
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-red-400 max-w-xs">
                      {l.errorMessage ? (
                        <span title={l.errorMessage} className="truncate block max-w-[200px]">{l.errorMessage}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
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
