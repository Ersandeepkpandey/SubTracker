"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, Activity, Mail, CheckCircle, XCircle } from "lucide-react";

type Analytics = {
  totalUsers: number;
  activeUsers: number;
  totalSubscriptions: number;
};

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  subscriptionStatus: string;
  gmailConnected: boolean;
  createdAt: string;
  trialEndsAt: string | null;
  _count: { subscriptions: number };
};

type SyncLog = {
  id: string;
  userId: string;
  syncedAt: string;
  subscriptionsFound: number;
  status: string;
  error: string | null;
  user: { email: string };
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  trial: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-600",
};

export function AdminDashboard({
  analytics,
  users,
  logs,
}: {
  analytics: Analytics;
  users: AdminUser[];
  logs: SyncLog[];
}) {
  const [tab, setTab] = useState<"users" | "logs">("users");
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const filteredLogs = logs.filter((l) =>
    l.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total users</p>
              <p className="text-2xl font-bold">{analytics.totalUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CreditCard size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Active users</p>
              <p className="text-2xl font-bold">{analytics.activeUsers}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
              <Activity size={18} className="text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total subscriptions</p>
              <p className="text-2xl font-bold">{analytics.totalSubscriptions}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex gap-1 border border-gray-100 rounded-lg p-1 w-fit">
              <button
                onClick={() => setTab("users")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  tab === "users" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setTab("logs")}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  tab === "logs" ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Gmail Logs ({logs.length})
              </button>
            </div>
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 w-full sm:w-56 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {tab === "users" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">User</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">Status</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">Gmail</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">Subs</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400 text-sm">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50/50">
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{u.name ?? "—"}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[u.subscriptionStatus] ?? "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {u.subscriptionStatus}
                          </span>
                          {u.subscriptionStatus === "trial" && u.trialEndsAt && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              ends {new Date(u.trialEndsAt).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          {u.gmailConnected ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-gray-300" />
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-medium">{u._count.subscriptions}</span>
                        </td>
                        <td className="py-3 text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">User</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">Synced at</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-gray-400 uppercase">Found</th>
                    <th className="text-left py-2 text-xs font-medium text-gray-400 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-400 text-sm">
                        No sync logs found
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((l) => (
                      <tr key={l.id} className="hover:bg-gray-50/50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            <Mail size={14} className="text-gray-400 shrink-0" />
                            <span className="text-gray-700">{l.user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">
                          {new Date(l.syncedAt).toLocaleString()}
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-medium">{l.subscriptionsFound}</span>
                        </td>
                        <td className="py-3">
                          {l.status === "success" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <CheckCircle size={11} /> success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              <XCircle size={11} /> {l.status}
                            </span>
                          )}
                          {l.error && (
                            <p className="text-xs text-red-400 mt-0.5 max-w-xs truncate" title={l.error}>
                              {l.error}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
