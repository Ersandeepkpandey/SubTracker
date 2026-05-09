"use client";

import { useCategoryBreakdown } from "@/hooks/useDashboard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency, getCategoryLabel } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function CategoryBreakdown() {
  const { data } = useCategoryBreakdown();

  if (!data?.length) return null;

  const sorted = [...data].sort((a, b) => b.total - a.total);
  const max = sorted[0]?.total || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spend by category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {sorted.map(({ category, total }) => (
            <div key={category}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{getCategoryLabel(category)}</span>
                <span className="text-gray-500">{formatCurrency(total)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all"
                  style={{ width: `${(total / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
