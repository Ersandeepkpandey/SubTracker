import { fetchAdmin } from "@/lib/adminFetch";
import type { AdminNotif } from "@/types/admin";
import { PageHeader } from "../page";
import { NotifsClient } from "./NotifsClient";

export default async function AdminNotifsPage() {
  const notifications = await fetchAdmin<AdminNotif[]>("/admin/notifications");
  return (
    <>
      <PageHeader title="Notifications" sub={`${notifications.length} notification records`} />
      <NotifsClient notifications={notifications} />
    </>
  );
}
