"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: subs } = useSubscriptions();

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDow = startOfMonth(currentMonth).getDay();

  function getSubsForDay(day: Date) {
    return subs?.filter((s) => isSameDay(parseISO(s.renewalDate), day)) ?? [];
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={18} />
          </button>
          <span className="font-semibold w-36 text-center">{format(currentMonth, "MMMM yyyy")}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-card border border-gray-100 p-4">
        <div className="grid grid-cols-7 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDow }).map((_, i) => <div key={`empty-${i}`} />)}
          {days.map((day) => {
            const daySubs = getSubsForDay(day);
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[60px] p-1 rounded-lg ${isToday ? "bg-teal-50 border border-teal" : "hover:bg-gray-50"}`}
              >
                <span className={`text-xs font-medium ${isToday ? "text-teal" : "text-gray-600"}`}>
                  {format(day, "d")}
                </span>
                {daySubs.map((sub) => (
                  <Link key={sub.id} href={`/subscriptions/${sub.id}`}>
                    <div className="mt-0.5 px-1 py-0.5 bg-teal text-white rounded text-xs truncate">
                      {sub.serviceName}
                    </div>
                  </Link>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold text-sm text-gray-500">This month&apos;s renewals</h2>
        {days.flatMap(getSubsForDay).length === 0 ? (
          <p className="text-gray-400 text-sm py-4 text-center">No renewals this month. Enjoy the quiet.</p>
        ) : (
          days.flatMap((day) => getSubsForDay(day).map((sub) => (
            <Link key={sub.id} href={`/subscriptions/${sub.id}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50">
              <div>
                <span className="font-medium text-sm">{sub.serviceName}</span>
                <span className="text-xs text-gray-400 ml-2">{format(parseISO(sub.renewalDate), "dd MMM")}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(Number(sub.amount), sub.currency)}</span>
            </Link>
          )))
        )}
      </div>
    </div>
  );
}
