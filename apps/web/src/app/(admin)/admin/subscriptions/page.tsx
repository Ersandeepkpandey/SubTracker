import { fetchAdmin } from "@/lib/adminFetch";
import type { AdminSub } from "@/types/admin";
import { PageHeader } from "../page";
import { SubsClient } from "./SubsClient";

export default async function AdminSubsPage() {
  const subscriptions = await fetchAdmin<AdminSub[]>("/admin/subscriptions");
  return (
    <>
      <PageHeader title="Subscriptions" sub={`${subscriptions.length} total subscriptions across all users`} />
      <SubsClient subscriptions={subscriptions} />
    </>
  );
}
