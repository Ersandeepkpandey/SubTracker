import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@subtrack/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { isAdmin: true, name: true, email: true, image: true },
  });
  if (!user?.isAdmin) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar
        adminName={user.name}
        adminEmail={user.email}
        adminImage={user.image}
      />
      <main className="md:ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
