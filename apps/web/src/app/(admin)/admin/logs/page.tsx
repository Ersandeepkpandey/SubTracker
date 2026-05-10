import { fetchAdmin } from "@/lib/adminFetch";
import type { SyncLog } from "@/types/admin";
import { PageHeader } from "../page";
import { LogsClient } from "./LogsClient";

export default async function AdminLogsPage() {
  const logs = await fetchAdmin<SyncLog[]>("/admin/logs");
  return (
    <>
      <PageHeader title="Gmail Sync Logs" sub={`${logs.length} sync events recorded`} />
      <LogsClient logs={logs} />
    </>
  );
}
