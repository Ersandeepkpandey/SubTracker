import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MOCK_SUBSCRIPTIONS } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, daysUntil, getRenewalStatus, formatDate, getCategoryLabel } from "@/lib/utils";
import { notFound } from "next/navigation";

export default function PreviewSubscriptionDetail({ params }: { params: { id: string } }) {
  const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === params.id);
  if (!sub) notFound();

  const days = daysUntil(sub.renewalDate);
  const status = getRenewalStatus(days);

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/preview/subscriptions" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <Button variant="outline" size="sm">Edit</Button>
      </div>

      <div className="bg-white rounded-card border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden">
            {sub.serviceLogoUrl ? (
              <Image src={sub.serviceLogoUrl} alt={sub.serviceName} width={48} height={48} className="object-contain" />
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
            <span className="font-semibold">{formatCurrency(sub.amount)}/{sub.billingCycle === "monthly" ? "mo" : "yr"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Next renewal</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{formatDate(sub.renewalDate)}</span>
              <Badge variant={status === "active" ? "active" : status === "warning" ? "warning" : "danger"}>
                {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days} days`}
              </Badge>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status</span>
            <Badge variant="active">Active</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Source</span>
            <span className="text-sm text-gray-600 capitalize">{sub.source}</span>
          </div>
          {sub.notes && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Notes</span>
              <span className="text-sm text-gray-700">{sub.notes}</span>
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

      <button className="w-full text-sm text-red-500 hover:text-red-700 py-2 transition-colors">
        Remove from SubTrack
      </button>
    </div>
  );
}
