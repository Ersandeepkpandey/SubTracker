"use client";

import { useCategoryBreakdown } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function AISpendCard() {
  const { data: categories } = useCategoryBreakdown();

  const aiCategory = categories?.find((c) => c.category === "ai");
  if (!aiCategory || aiCategory.total === 0) return null;

  const total = categories?.reduce((sum, c) => sum + c.total, 0) ?? 0;
  const pct = total > 0 ? Math.round((aiCategory.total / total) * 100) : 0;

  return (
    <Card className="border-teal/20 bg-teal-50/30">
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal/10 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-teal" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI Tools spend</p>
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(aiCategory.total)}
              <span className="text-sm font-normal text-gray-400">/mo</span>
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-teal">{pct}%</p>
          <p className="text-xs text-gray-400">of total</p>
        </div>
      </CardContent>
    </Card>
  );
}
