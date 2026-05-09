"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscriptions";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { PageLoader } from "@/components/shared/LoadingSpinner";

export default function EditSubscriptionPage({ params }: { params: { id: string } }) {
  const { data: sub, isLoading } = useSubscription(params.id);

  if (isLoading) return <PageLoader />;
  if (!sub) return <div className="text-center py-16 text-gray-500">Subscription not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/subscriptions/${params.id}`} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">Edit Subscription</h1>
      </div>
      <SubscriptionForm existing={sub} />
    </div>
  );
}
