"use client";

import { useState } from "react";
import { useCategoryBreakdown, useAISuggestions, useInsightSummary } from "@/hooks/useDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InsightsPage() {
  const { data: summary } = useInsightSummary();
  const { data: categories } = useCategoryBreakdown();
  const { data: suggestions } = useAISuggestions();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [asking, setAsking] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    try {
      const { data } = await api.post("/insights/ask", { question });
      setAnswer(data.answer);
    } catch {
      setAnswer("I couldn't answer that right now. Please try again.");
    } finally {
      setAsking(false);
    }
  }

  const chartData = categories?.map((c) => ({
    name: getCategoryLabel(c.category),
    amount: c.total,
  })) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monthly spend</p>
            <p className="text-2xl font-bold">{formatCurrency(summary?.monthlyTotal ?? 0, summary?.currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Yearly projection</p>
            <p className="text-2xl font-bold">{formatCurrency(summary?.yearlyTotal ?? 0, summary?.currency)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Active subscriptions</p>
            <p className="text-2xl font-bold">{summary?.totalSubscriptions ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Spend by category</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="amount" fill="#0D9E75" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {suggestions && suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles size={16} className="text-teal" />
              AI Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {suggestions.map((s, i) => (
              <div key={i} className="p-3 bg-teal-50 rounded-lg">
                <p className="text-sm text-gray-700">{s.message}</p>
                {s.action && <p className="text-xs text-teal font-medium mt-1">→ {s.action}</p>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles size={16} className="text-teal" />
            Ask AI
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <form onSubmit={handleAsk} className="flex gap-2">
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What renews this week? What&apos;s my most expensive category?"
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={asking}>
              {asking ? "..." : "Ask"}
            </Button>
          </form>
          {answer && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">{answer}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
