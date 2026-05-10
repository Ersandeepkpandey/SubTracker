import { fetchAdmin } from "@/lib/adminFetch";
import type { OverviewData } from "@/types/admin";
import { OverviewClient } from "./OverviewClient";

export default async function AdminOverviewPage() {
  const overview = await fetchAdmin<OverviewData>("/admin/overview");
  return (
    <>
      <PageHeader title="Overview" sub="Platform health at a glance" />
      <OverviewClient overview={overview} />
    </>
  );
}

export function PageHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
      {sub && <p className="text-sm text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}
