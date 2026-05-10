import { fetchAdmin } from "@/lib/adminFetch";
import type { AdminUser } from "@/types/admin";
import { PageHeader } from "../page";
import { UsersClient } from "./UsersClient";

export default async function AdminUsersPage() {
  const users = await fetchAdmin<AdminUser[]>("/admin/users");
  return (
    <>
      <PageHeader title="Users" sub={`${users.length} registered accounts`} />
      <UsersClient users={users} />
    </>
  );
}
