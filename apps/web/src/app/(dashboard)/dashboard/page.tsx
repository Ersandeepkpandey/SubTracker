import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SpendSummaryCard } from "@/components/dashboard/SpendSummaryCard";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { CategoryBreakdown } from "@/components/dashboard/CategoryBreakdown";
import { AllSubscriptionsList } from "@/components/dashboard/AllSubscriptionsList";
import { AISpendCard } from "@/components/dashboard/AISpendCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{greeting}, {firstName}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here&apos;s your subscription overview</p>
        </div>
        <Link href="/subscriptions/new">
          <Button size="sm">
            <Plus size={16} className="mr-1.5" />
            Add
          </Button>
        </Link>
      </div>

      <SpendSummaryCard />
      <AISpendCard />
      <UpcomingRenewals />
      <CategoryBreakdown />
      <AllSubscriptionsList />
    </div>
  );
}
