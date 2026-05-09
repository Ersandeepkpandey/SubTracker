"use client";

import { useState } from "react";
import { MOCK_SUMMARY, MOCK_CATEGORIES, MOCK_SUGGESTIONS } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Sparkles } from "lucide-react";

const MOCK_ANSWERS: Record<string, string> = {
  default: "You spend ₹10,478/month across 12 active subscriptions. Your biggest category is AI tools at ₹4,180/month.",
  week: "3 subscriptions renew this week: Netflix (3 days, ₹799), Hotstar (6 days, ₹299), and Claude Pro (5 days, ₹1,700).",
  expensive: "Your most expensive subscription is Adobe CC at ₹4,230/year (₹352/month), followed by AWS at ₹2,100/month.",
  cancel: "Consider cancelling Grammarly (₹750/month) — you also have Notion which covers writing. You could save ₹9,000/year.",
  ai: "You spend ₹4,180/month on AI tools: Cursor (₹1,650), Claude Pro (₹1,700), and GitHub Copilot (₹830).",
};

export default function PreviewInsightsPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const chartData = MOCK_CATEGORIES.map((c) => ({
    name: getCategoryLabel(c.category),
    amount: c.total,
  }));

  function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    const q = question.toLowerCase();
    if (q.includes("week")) setAnswer(MOCK_ANSWERS.week);
    else if (q.includes("expensive") || q.includes("cost")) setAnswer(MOCK_ANSWERS.expensive);
    else if (q.includes("cancel")) setAnswer(MOCK_ANSWERS.cancel);
    else if (q.includes("ai")) setAnswer(MOCK_ANSWERS.ai);
    else setAnswer(MOCK_ANSWERS.default);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-5"><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Monthly spend</p><p className="text-2xl font-bold">{formatCurrency(MOCK_SUMMARY.monthlyTotal)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Yearly projection</p><p className="text-2xl font-bold">{formatCurrency(MOCK_SUMMARY.yearlyTotal)}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Active subscriptions</p><p className="text-2xl font-bold">{MOCK_SUMMARY.totalSubscriptions}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Spend by category</CardTitle></CardHeader>
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

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles size={16} className="text-teal" />AI Suggestions</CardTitle></CardHeader>
        <CardContent className="pt-0 space-y-3">
          {MOCK_SUGGESTIONS.map((s, i) => (
            <div key={i} className="p-3 bg-teal-50 rounded-lg">
              <p className="text-sm text-gray-700">{s.message}</p>
              {s.action && <p className="text-xs text-teal font-medium mt-1">→ {s.action}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Sparkles size={16} className="text-teal" />Ask AI</CardTitle></CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-xs text-gray-400">Try: "What renews this week?", "What&apos;s most expensive?", "What should I cancel?", "How much on AI?"</p>
          <form onSubmit={handleAsk} className="flex gap-2">
            <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask about your subscriptions..." className="flex-1" />
            <Button type="submit" size="sm">Ask</Button>
          </form>
          {answer && <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">{answer}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
