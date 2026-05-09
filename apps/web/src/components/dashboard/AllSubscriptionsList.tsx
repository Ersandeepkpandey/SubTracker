"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { SubscriptionCard } from "@/components/subscriptions/SubscriptionCard";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AllSubscriptionsList() {
  const { data: subs, isLoading } = useSubscriptions();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
            <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            All subscriptions
            {subs && subs.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({subs.length})</span>
            )}
          </CardTitle>
          <Link href="/subscriptions/new">
            <Button size="sm" variant="outline" className="h-8 text-xs">
              <Plus size={13} className="mr-1" />
              Add
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {!subs?.length ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-400 text-sm mb-4">No subscriptions yet. Add one to get started.</p>
            <Link href="/subscriptions/new">
              <Button size="sm">+ Add subscription</Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {subs.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
