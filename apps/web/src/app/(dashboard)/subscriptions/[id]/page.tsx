"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, ExternalLink } from "lucide-react";
import { useSubscription, useDeleteSubscription, useUpdateSubscription } from "@/hooks/useSubscriptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/LoadingSpinner";
import { formatCurrency, daysUntil, getRenewalStatus, formatDate, getServiceLogoUrl, getCategoryLabel } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  const { data: sub, isLoading } = useSubscription(params.id);
  const deleteSub = useDeleteSubscription();
  const updateSub = useUpdateSubscription();
  const router = useRouter();

  if (isLoading) return <PageLoader />;
  if (!sub) return <div className="text-center py-16 text-gray-500">Subscription not found.</div>;

  const days = daysUntil(sub.renewalDate);
  const status = getRenewalStatus(days);
  const logoUrl = sub.serviceLogoUrl || getServiceLogoUrl(sub.serviceName);

  async function handleDelete() {
    if (!confirm(`Are you sure you want to remove ${sub!.serviceName}? This cannot be undone.`)) return;
    await deleteSub.mutateAsync(sub!.id);
    router.push("/subscriptions");
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/subscriptions" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <Link href={`/subscriptions/${sub.id}/edit`}>
          <Button variant="outline" size="sm">
            <Edit size={14} className="mr-1.5" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-card border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <Image src={logoUrl} alt={sub.serviceName} width={48} height={48} className="object-contain" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">{sub.serviceName[0]}</span>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">{sub.serviceName}</h1>
            <p className="text-sm text-gray-500">{getCategoryLabel(sub.category)} · {sub.billingCycle}</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-50 pt-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Amount</span>
            <span className="font-semibold">{formatCurrency(Number(sub.amount), sub.currency)}/{sub.billingCycle === "monthly" ? "mo" : "yr"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Next renewal</span>
            <div className="text-right">
              <span className="font-medium">{formatDate(sub.renewalDate)}</span>
              <Badge
                variant={status === "active" ? "active" : status === "warning" ? "warning" : "danger"}
                className="ml-2"
              >
                {days < 0 ? "Overdue" : days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status</span>
            <div className="flex items-center gap-2">
              <Badge variant={sub.isActive ? "active" : "default"}>
                {sub.isActive ? "Active" : "Paused"}
              </Badge>
              <button
                onClick={() => updateSub.mutate({ id: sub.id, data: { isActive: !sub.isActive } })}
                disabled={updateSub.isPending}
                className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors disabled:opacity-50"
              >
                {sub.isActive ? "Pause" : "Resume"}
              </button>
            </div>
          </div>
          {sub.notes && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Notes</span>
              <span className="text-sm text-gray-700 max-w-[60%] text-right">{sub.notes}</span>
            </div>
          )}
        </div>
      </div>

      {sub.cancelUrl && (
        <a href={sub.cancelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full p-4 bg-white rounded-card border border-gray-100 hover:bg-gray-50 transition-colors">
          <span className="font-medium text-sm">Cancel this subscription</span>
          <ExternalLink size={16} className="text-gray-400" />
        </a>
      )}

      <button
        onClick={handleDelete}
        className="w-full text-sm text-red-500 hover:text-red-700 py-2 transition-colors"
        disabled={deleteSub.isPending}
      >
        Remove from SubTrack
      </button>
    </div>
  );
}
