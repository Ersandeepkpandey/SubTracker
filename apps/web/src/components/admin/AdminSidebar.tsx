"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, Users, CreditCard, Mail, Bell,
  ArrowLeft, ShieldCheck, LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/logs", label: "Gmail Logs", icon: Mail },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function AdminSidebar({
  adminName,
  adminEmail,
  adminImage,
}: {
  adminName: string | null;
  adminEmail: string;
  adminImage: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-slate-950 flex flex-col fixed left-0 top-0 z-20 border-r border-slate-800">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-white text-base">SubTrack</p>
            <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-2">Menu</p>
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-slate-800 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
              )}
            >
              <Icon size={16} className={isActive ? "text-teal-400" : ""} />
              {label}
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-3 space-y-0.5 border-t border-slate-800 pt-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-all"
        >
          <ArrowLeft size={16} />
          Back to app
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-500 hover:text-red-400 hover:bg-slate-800/50 transition-all"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>

      {/* Admin user */}
      <div className="px-4 py-3 border-t border-slate-800 flex items-center gap-3">
        {adminImage ? (
          <Image src={adminImage} alt="" width={32} height={32} className="rounded-full ring-2 ring-slate-700" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold">
            {(adminName ?? adminEmail)[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">{adminName ?? "Admin"}</p>
          <p className="text-[11px] text-slate-500 truncate">{adminEmail}</p>
        </div>
      </div>
    </aside>
  );
}
