"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, CreditCard, Activity, Mail, CheckCircle, XCircle,
  Bell, Smartphone, TrendingUp, Calendar, AlertCircle,
  ShieldCheck, LayoutDashboard, RefreshCw, ChevronDown, ChevronUp,
} from "lucide-react";
import type { OverviewData, AdminUser, AdminSub, SyncLog, AdminNotif } from "./page";

// ── helpers ───────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  trial: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-600",
  cancelled: "bg-gray-100 text-gray-500",
  sent: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-red-600",
  success: "bg-green-100 text-green-700",
};

const PIE_COLORS = ["#f59e0b", "#0D9E75", "#ef4444", "#6b7280"];
const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI", ott: "OTT", saas: "SaaS", cloud: "Cloud", productivity: "Productivity", other: "Other",
};

function Badge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[status] ?? "bg-gray-100 text-gray-500"}`}>
      {label ?? status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, sub, color = "blue" }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  const bg: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-500",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg[color]}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide truncate">{label}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</h2>;
}

// ── nav ───────────────────────────────────────────────────────────────────────

type Tab = "overview" | "users" | "subscriptions" | "logs" | "notifications";

const NAV: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Users", icon: Users },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "logs", label: "Gmail Logs", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
];

// ── main ──────────────────────────────────────────────────────────────────────

export function AdminDashboard({ overview, users, subscriptions, logs, notifications }: {
  overview: OverviewData;
  users: AdminUser[];
  subscriptions: AdminSub[];
  logs: SyncLog[];
  notifications: AdminNotif[];
}) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
          <ShieldCheck size={16} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight">Admin Dashboard</h1>
          <p className="text-xs text-gray-400">{users.length} users · {subscriptions.length} subscriptions tracked</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 border border-gray-100 rounded-xl p-1 w-fit bg-gray-50 overflow-x-auto">
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
              tab === id ? "bg-white text-gray-900 shadow-sm font-medium" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && <OverviewTab overview={overview} />}
      {tab === "users" && <UsersTab users={users} />}
      {tab === "subscriptions" && <SubscriptionsTab subscriptions={subscriptions} />}
      {tab === "logs" && <LogsTab logs={logs} />}
      {tab === "notifications" && <NotificationsTab notifications={notifications} />}
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────

function OverviewTab({ overview: o }: { overview: OverviewData }) {
  const pieData = [
    { name: "Trial", value: o.usersByStatus.trial },
    { name: "Active", value: o.usersByStatus.active },
    { name: "Expired", value: o.usersByStatus.expired },
    { name: "Cancelled", value: o.usersByStatus.cancelled },
  ].filter((d) => d.value > 0);

  const categoryData = o.subscriptionsByCategory.map((c) => ({
    name: CATEGORY_LABELS[c.category] ?? c.category,
    count: c.count,
  }));

  return (
    <div className="space-y-6">
      {/* Key metrics */}
      <div>
        <SectionHeader>Users</SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total users" value={o.totalUsers} color="blue" />
          <StatCard icon={CheckCircle} label="Paid (active)" value={o.usersByStatus.active} color="green" />
          <StatCard icon={Activity} label="On trial" value={o.usersByStatus.trial} color="amber" />
          <StatCard icon={Mail} label="Gmail connected" value={o.gmailConnected} sub={`${Math.round((o.gmailConnected / (o.totalUsers || 1)) * 100)}% of users`} color="teal" />
        </div>
      </div>

      <div>
        <SectionHeader>Growth</SectionHeader>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={TrendingUp} label="New today" value={o.newUsersToday} color="purple" />
          <StatCard icon={TrendingUp} label="New this week" value={o.newUsersThisWeek} color="purple" />
          <StatCard icon={TrendingUp} label="New this month" value={o.newUsersThisMonth} color="purple" />
        </div>
      </div>

      <div>
        <SectionHeader>Subscriptions & Revenue</SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={CreditCard} label="Total subs" value={o.totalSubscriptions} color="blue" />
          <StatCard icon={CheckCircle} label="Active subs" value={o.activeSubscriptions} color="green" />
          <StatCard icon={TrendingUp} label="Est. MRR" value={`₹${o.mrr.toLocaleString()}`} color="teal" />
          <StatCard icon={Smartphone} label="Push devices" value={o.pushDevices} color="purple" />
        </div>
      </div>

      <div>
        <SectionHeader>Notifications</SectionHeader>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={CheckCircle} label="Sent" value={o.notificationStats.sent} color="green" />
          <StatCard icon={Bell} label="Pending" value={o.notificationStats.pending} color="amber" />
          <StatCard icon={AlertCircle} label="Failed" value={o.notificationStats.failed} color="red" />
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Signups chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-semibold mb-4">New signups — last 7 days</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={o.recentSignups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0D9E75" radius={[4, 4, 0, 0]} name="Signups" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User status pie */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-semibold mb-2">Users by status</p>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 mt-8 text-center">No data yet</p>
          )}
        </div>
      </div>

      {/* Category breakdown */}
      {categoryData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-sm font-semibold mb-4">Subscriptions by category</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Source breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase mb-1">Manual subs</p>
          <p className="text-2xl font-bold">{o.subscriptionsBySource.manual}</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-400 rounded-full"
              style={{ width: `${(o.subscriptionsBySource.manual / (o.totalSubscriptions || 1)) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-400 uppercase mb-1">Gmail-detected subs</p>
          <p className="text-2xl font-bold">{o.subscriptionsBySource.gmail}</p>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full"
              style={{ width: `${(o.subscriptionsBySource.gmail / (o.totalSubscriptions || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────

function UsersTab({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"createdAt" | "subscriptions">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = users.filter((u) => {
      const q = search.toLowerCase();
      return (
        u.email.toLowerCase().includes(q) ||
        (u.name ?? "").toLowerCase().includes(q)
      );
    });
    if (statusFilter !== "all") list = list.filter((u) => u.subscriptionStatus === statusFilter);
    list = [...list].sort((a, b) => {
      let av: number, bv: number;
      if (sortKey === "subscriptions") {
        av = a._count.subscriptions; bv = b._count.subscriptions;
      } else {
        av = new Date(a.createdAt).getTime(); bv = new Date(b.createdAt).getTime();
      }
      return sortDir === "desc" ? bv - av : av - bv;
    });
    return list;
  }, [users, search, statusFilter, sortKey, sortDir]);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const SortIcon = ({ k }: { k: typeof sortKey }) =>
    sortKey === k ? (sortDir === "desc" ? <ChevronDown size={12} /> : <ChevronUp size={12} />) : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none bg-white"
        >
          <option value="all">All statuses</option>
          <option value="trial">Trial</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <p className="text-xs text-gray-400">{filtered.length} users</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Gmail</th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase cursor-pointer select-none"
                  onClick={() => toggleSort("subscriptions")}
                >
                  <span className="flex items-center gap-1">Subs <SortIcon k="subscriptions" /></span>
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Push</th>
                <th
                  className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase cursor-pointer select-none"
                  onClick={() => toggleSort("createdAt")}
                >
                  <span className="flex items-center gap-1">Joined <SortIcon k="createdAt" /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">No users found</td></tr>
              ) : (
                filtered.map((u) => (
                  <>
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50/60 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === u.id ? null : u.id)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {u.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={u.image} alt="" className="w-7 h-7 rounded-full object-cover" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
                              {(u.name ?? u.email)[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900 leading-tight">{u.name ?? "—"}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={u.subscriptionStatus} />
                        {!u.onboardingDone && (
                          <span className="ml-1 text-xs text-gray-400">(onboarding)</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {u.gmailConnected
                          ? <CheckCircle size={16} className="text-green-500" />
                          : <XCircle size={16} className="text-gray-200" />}
                      </td>
                      <td className="px-4 py-3 font-medium">{u._count.subscriptions}</td>
                      <td className="px-4 py-3 text-gray-500">{u._count.pushDevices}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                    {expandedId === u.id && (
                      <tr key={`${u.id}-detail`} className="bg-gray-50/80">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <p className="text-gray-400 mb-0.5">User ID</p>
                              <p className="font-mono text-gray-600 break-all">{u.id}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5">Trial started</p>
                              <p className="text-gray-700">{u.trialStartedAt ? new Date(u.trialStartedAt).toLocaleDateString() : "—"}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5">Trial ends</p>
                              <p className="text-gray-700">{u.trialEndsAt ? new Date(u.trialEndsAt).toLocaleDateString() : "—"}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-0.5">Onboarding</p>
                              <p className="text-gray-700">{u.onboardingDone ? "Complete" : "Pending"}</p>
                            </div>
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

// ── Subscriptions ─────────────────────────────────────────────────────────────

function SubscriptionsTab({ subscriptions }: { subscriptions: AdminSub[] }) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      const q = search.toLowerCase();
      const matchQ = s.serviceName.toLowerCase().includes(q) || s.user.email.toLowerCase().includes(q);
      const matchSource = sourceFilter === "all" || s.source === sourceFilter;
      const matchActive = activeFilter === "all" || (activeFilter === "active" ? s.isActive : !s.isActive);
      return matchQ && matchSource && matchActive;
    });
  }, [subscriptions, search, sourceFilter, activeFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by service or user email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          <option value="all">All sources</option>
          <option value="manual">Manual</option>
          <option value="gmail">Gmail</option>
        </select>
        <select
          value={activeFilter}
          onChange={(e) => setActiveFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
        </select>
      </div>
      <p className="text-xs text-gray-400">{filtered.length} subscriptions</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Cycle</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Renews</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Source</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-400 text-sm">No subscriptions found</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 font-medium text-gray-900">{s.serviceName}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.user.email}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[s.category] ?? s.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {s.currency} {Number(s.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{s.billingCycle}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.renewalDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.source === "gmail" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-500"}`}>
                        {s.source}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.isActive
                        ? <CheckCircle size={15} className="text-green-500" />
                        : <XCircle size={15} className="text-gray-300" />}
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

// ── Gmail Logs ────────────────────────────────────────────────────────────────

function LogsTab({ logs }: { logs: SyncLog[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchQ = l.user.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || l.status === statusFilter;
      return matchQ && matchStatus;
    });
  }, [logs, search, statusFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          <option value="all">All</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <p className="text-xs text-gray-400">{filtered.length} log entries</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Synced at</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Emails scanned</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Subs found</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">No logs found</td></tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <Mail size={13} className="text-gray-400 shrink-0" />
                        {l.user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(l.syncedAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-600">{l.emailsScanned}</td>
                    <td className="px-4 py-3 font-medium">{l.subscriptionsFound}</td>
                    <td className="px-4 py-3">
                      <Badge status={l.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-red-400 max-w-xs truncate" title={l.errorMessage ?? ""}>
                      {l.errorMessage ?? "—"}
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

// ── Notifications ─────────────────────────────────────────────────────────────

function NotificationsTab({ notifications }: { notifications: AdminNotif[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const q = search.toLowerCase();
      const matchQ = n.user.email.toLowerCase().includes(q) || n.subscription.serviceName.toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || n.status === statusFilter;
      const matchType = typeFilter === "all" || n.notificationType === typeFilter;
      return matchQ && matchStatus && matchType;
    });
  }, [notifications, search, statusFilter, typeFilter]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by user or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          <option value="all">All statuses</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none"
        >
          <option value="all">All types</option>
          <option value="push">Push</option>
          <option value="email">Email</option>
        </select>
      </div>
      <p className="text-xs text-gray-400">{filtered.length} notifications</p>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">User</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Service</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Reminder</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Sent at</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-gray-400 text-sm">No notifications found</td></tr>
              ) : (
                filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3 text-gray-700 text-xs">{n.user.email}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{n.subscription.serviceName}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${n.notificationType === "push" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
                        {n.notificationType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{n.reminderDays}d before</td>
                    <td className="px-4 py-3"><Badge status={n.status} /></td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {n.sentAt ? new Date(n.sentAt).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(n.createdAt).toLocaleDateString()}
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
