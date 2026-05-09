import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";

export default function NewSubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/subscriptions" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">Add Subscription</h1>
      </div>
      <SubscriptionForm />
    </div>
  );
}
