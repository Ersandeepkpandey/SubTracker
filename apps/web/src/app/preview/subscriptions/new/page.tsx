"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["ai", "ott", "saas", "cloud", "productivity", "other"];
const BILLING_CYCLES = ["monthly", "yearly", "weekly", "custom"];
const POPULAR = ["Netflix", "Spotify", "ChatGPT", "Claude Pro", "Cursor", "GitHub Copilot", "Adobe CC", "Figma", "Notion", "Hotstar"];

export default function PreviewAddSubscription() {
  const [form, setForm] = useState({ serviceName: "", amount: "", currency: "INR", billingCycle: "monthly", renewalDate: "", category: "other" });
  const [saved, setSaved] = useState(false);

  function set(f: keyof typeof form, v: string) { setForm((p) => ({ ...p, [f]: v })); }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-bold mb-2">Subscription saved!</h2>
        <p className="text-gray-500 text-sm mb-6">In the real app this would be saved to your database.</p>
        <Link href="/preview/subscriptions"><Button variant="outline">Back to subscriptions</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/preview/subscriptions" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={18} className="text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold">Add Subscription</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setSaved(true); }} className="space-y-6 max-w-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Service name</label>
          <Input value={form.serviceName} onChange={(e) => set("serviceName", e.target.value)} placeholder="e.g. Netflix" list="popular" />
          <datalist id="popular">{POPULAR.map((s) => <option key={s} value={s} />)}</datalist>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
            <Input type="number" min="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="799" />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
            <select value={form.currency} onChange={(e) => set("currency", e.target.value)} className="h-11 w-full rounded-input border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal">
              {["INR", "USD", "EUR", "GBP"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Billing cycle</label>
          <div className="flex gap-2 flex-wrap">
            {BILLING_CYCLES.map((c) => (
              <button key={c} type="button" onClick={() => set("billingCycle", c)} className={`px-4 py-2 rounded-input text-sm font-medium border transition-colors ${form.billingCycle === c ? "bg-teal text-white border-teal" : "bg-white text-gray-600 border-gray-200 hover:border-teal"}`}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Renewal date</label>
          <Input type="date" value={form.renewalDate} onChange={(e) => set("renewalDate", e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => set("category", cat)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${form.category === cat ? "bg-teal text-white border-teal" : "bg-white text-gray-600 border-gray-200 hover:border-teal"}`}>
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">Save Subscription</Button>
      </form>
    </div>
  );
}
