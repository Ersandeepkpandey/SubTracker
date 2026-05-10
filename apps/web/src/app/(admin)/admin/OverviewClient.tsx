"use client";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  Users, CreditCard, CheckCircle, Mail, TrendingUp,
  Activity, Bell, AlertCircle, Smartphone,
} from "lucide-react";
import type { OverviewData } from "@/types/admin";

const PIE_COLORS = ["#f59e0b", "#10b981", "#ef4444", "#64748b"];
const CATEGORY_LABELS: Record<string, string> = {
  ai: "AI", ott: "OTT", saas: "SaaS", cloud: "Cloud", productivity: "Productivity", other: "Other",
};

function StatCard({ icon: Icon, label, value, sub, accent = "blue" }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string;
  accent?: "blue" | "green" | "teal" | "amber" | "red" | "purple" | "indigo";
}) {
  const styles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 ring-blue-100",
    green: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    teal: "bg-teal-50 text-teal-600 ring-teal-100",
    amber: "bg-amber-50 text-amber-600 ring-amber-100",
    red: "bg-red-50 text-red-500 ring-red-100",
    purple: "bg-purple-50 text-purple-600 ring-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ring-1 ${styles[accent]}`}>
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{children}</p>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm font-semibold text-slate-700 mb-4">{title}</p>
      {children}
    </div>
  );
}

export function OverviewClient({ overview: o }: { overview: OverviewData }) {
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

  const conversionRate = o.totalUsers > 0
    ? Math.round((o.usersByStatus.active / o.totalUsers) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Users */}
      <section>
        <SectionLabel>Users</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Users} label="Total users" value={o.totalUsers} accent="blue" />
          <StatCard icon={CheckCircle} label="Paid (active)" value={o.usersByStatus.active} sub={`${conversionRate}% conversion`} accent="green" />
          <StatCard icon={Activity} label="On trial" value={o.usersByStatus.trial} accent="amber" />
          <StatCard icon={Mail} label="Gmail connected" value={o.gmailConnected} sub={`${Math.round((o.gmailConnected / (o.totalUsers || 1)) * 100)}% of users`} accent="teal" />
        </div>
      </section>

      {/* Growth */}
      <section>
        <SectionLabel>Growth</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={TrendingUp} label="New today" value={o.newUsersToday} accent="purple" />
          <StatCard icon={TrendingUp} label="New this week" value={o.newUsersThisWeek} accent="purple" />
          <StatCard icon={TrendingUp} label="New this month" value={o.newUsersThisMonth} accent="purple" />
        </div>
      </section>

      {/* Revenue & Subs */}
      <section>
        <SectionLabel>Revenue & Subscriptions</SectionLabel>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={CreditCard} label="Total subs" value={o.totalSubscriptions} accent="blue" />
          <StatCard icon={CheckCircle} label="Active subs" value={o.activeSubscriptions} accent="green" />
          <StatCard icon={TrendingUp} label="Est. MRR" value={`₹${o.mrr.toLocaleString()}`} accent="teal" />
          <StatCard icon={Smartphone} label="Push devices" value={o.pushDevices} accent="indigo" />
        </div>
      </section>

      {/* Notifications */}
      <section>
        <SectionLabel>Notifications</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={CheckCircle} label="Sent" value={o.notificationStats.sent} accent="green" />
          <StatCard icon={Bell} label="Pending" value={o.notificationStats.pending} accent="amber" />
          <StatCard icon={AlertCircle} label="Failed" value={o.notificationStats.failed} accent="red" />
        </div>
      </section>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="New signups — last 7 days">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={o.recentSignups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="count" fill="#0D9E75" radius={[4, 4, 0, 0]} name="Signups" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Users by status">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="45%"
                  innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400 text-center py-10">No data yet</p>
          )}
        </Card>
      </div>

      {/* Category + Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {categoryData.length > 0 && (
          <Card title="Subscriptions by category">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12 }} cursor={{ fill: "#f8fafc" }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        )}

        <Card title="Subscription source">
          <div className="space-y-4 pt-2">
            {[
              { label: "Manual", value: o.subscriptionsBySource.manual, color: "bg-indigo-400" },
              { label: "Gmail detected", value: o.subscriptionsBySource.gmail, color: "bg-teal-500" },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm text-slate-600">{label}</p>
                  <p className="text-sm font-semibold text-slate-900">{value}</p>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all`}
                    style={{ width: `${(value / (o.totalSubscriptions || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
