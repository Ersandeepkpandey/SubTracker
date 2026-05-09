"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useInsightSummary } from "@/hooks/useDashboard";
import { formatCurrency } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function SpendSummaryCard() {
  const { data, isLoading } = useInsightSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-3 w-20 bg-gray-100 rounded mb-3" />
              <div className="h-8 w-28 bg-gray-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Monthly
          </p>
          <p className="text-3xl font-bold text-text-primary">
            {formatCurrency(data?.monthlyTotal ?? 0, data?.currency)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Yearly
          </p>
          <p className="text-2xl font-bold text-text-primary">
            {formatCurrency(data?.yearlyTotal ?? 0, data?.currency)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
