"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CreditCard, Plus, BarChart2, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/subscriptions", label: "Subs", icon: CreditCard },
  { href: "/subscriptions/new", label: "Add", icon: Plus, isFab: true },
  { href: "/insights", label: "Insights", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-2 md:hidden z-10">
      {navItems.map(({ href, label, icon: Icon, isFab }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        if (isFab) {
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center -mt-6"
            >
              <div className="w-14 h-14 bg-teal rounded-full flex items-center justify-center shadow-lg">
                <Icon size={24} className="text-white" />
              </div>
              <span className="text-xs text-gray-400 mt-1">{label}</span>
            </Link>
          );
        }
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-1",
              isActive ? "text-teal" : "text-gray-400"
            )}
          >
            <Icon size={20} />
            <span className="text-xs">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
