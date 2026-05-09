import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import Link from "next/link";

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="font-bold text-lg text-text-primary">SubTrack</span>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {[
            { href: "/preview", label: "Dashboard" },
            { href: "/preview/subscriptions", label: "Subscriptions" },
            { href: "/preview/calendar", label: "Calendar" },
            { href: "/preview/insights", label: "Insights" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="fixed top-0 left-0 right-0 md:left-60 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 z-10">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 bg-teal rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="font-bold text-base">SubTrack</span>
        </div>
        <div className="hidden md:block" />
        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">Preview mode</span>
          <div className="flex items-center gap-2 px-2 py-1 rounded-lg">
            <div className="w-7 h-7 bg-teal rounded-full flex items-center justify-center text-white text-xs font-semibold">R</div>
            <span className="text-sm font-medium text-gray-700 hidden md:block">Rohan</span>
          </div>
        </div>
      </div>

      <main className="ml-0 md:ml-60 pt-14 min-h-screen">
        <div className="max-w-content mx-auto px-4 md:px-6 py-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-2 md:hidden z-10">
        {[
          { href: "/preview", label: "Home" },
          { href: "/preview/subscriptions", label: "Subs" },
          { href: "/preview/insights", label: "Insights" },
        ].map(({ href, label }) => (
          <Link key={href} href={href} className="flex flex-col items-center gap-1 px-3 py-1 text-gray-400 text-xs">
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
