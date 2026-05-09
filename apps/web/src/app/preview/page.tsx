import { MOCK_SUMMARY, MOCK_SUBSCRIPTIONS, MOCK_CATEGORIES, MOCK_SUGGESTIONS } from "@/lib/mock-data";
import { formatCurrency, daysUntil, getRenewalStatus, getCategoryLabel } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PreviewDashboard() {
  const upcoming = MOCK_SUBSCRIPTIONS
    .filter((s) => daysUntil(s.renewalDate) <= 7)
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  const max = Math.max(...MOCK_CATEGORIES.map((c) => c.total));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Good morning, Rohan</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here&apos;s your subscription overview</p>
        </div>
        <Link href="/preview/subscriptions/new">
          <Button size="sm">
            <Plus size={16} className="mr-1.5" />
            Add
          </Button>
        </Link>
      </div>

      {/* Spend summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monthly</p>
            <p className="text-3xl font-bold">{formatCurrency(MOCK_SUMMARY.monthlyTotal)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Yearly</p>
            <p className="text-2xl font-bold">{formatCurrency(MOCK_SUMMARY.yearlyTotal)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming renewals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Renewing soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {upcoming.map((sub) => {
            const days = daysUntil(sub.renewalDate);
            const status = getRenewalStatus(days);
            return (
              <Link key={sub.id} href={`/preview/subscriptions/${sub.id}`} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{sub.serviceName}</p>
                  <Badge variant={status === "active" ? "active" : status === "warning" ? "warning" : "danger"} className="mt-1">
                    {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
                  </Badge>
                </div>
                <span className="font-semibold text-sm">{formatCurrency(sub.amount)}</span>
              </Link>
            );
          })}
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spend by category</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {[...MOCK_CATEGORIES].sort((a, b) => b.total - a.total).map(({ category, total }) => (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{getCategoryLabel(category)}</span>
                <span className="text-gray-500">{formatCurrency(total)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal rounded-full" style={{ width: `${(total / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-teal" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {MOCK_SUGGESTIONS.map((s, i) => (
            <div key={i} className="p-3 bg-teal-50 rounded-lg">
              <p className="text-sm text-gray-700">{s.message}</p>
              {s.action && <p className="text-xs text-teal font-medium mt-1">→ {s.action}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
