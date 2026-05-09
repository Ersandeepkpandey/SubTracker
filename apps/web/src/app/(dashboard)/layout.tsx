import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { prisma } from "@subtrack/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { trialEndsAt: true, subscriptionStatus: true, onboardingDone: true },
  });

  if (user && !user.onboardingDone) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main className="ml-0 md:ml-60 pt-14 min-h-screen">
        <div className="max-w-content mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
