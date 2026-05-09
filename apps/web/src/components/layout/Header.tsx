"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-end px-6 fixed top-0 left-60 right-0 z-10">
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="p-2 hover:bg-gray-50 rounded-lg">
          <Bell size={18} className="text-gray-500" />
        </Link>
        <Link href="/settings" className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={28}
              height={28}
              className="rounded-full"
            />
          ) : (
            <div className="w-7 h-7 bg-teal rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <span className="text-sm font-medium text-gray-700 hidden md:block">
            {session?.user?.name?.split(" ")[0]}
          </span>
        </Link>
      </div>
    </header>
  );
}
