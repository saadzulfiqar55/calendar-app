"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCalendarStore } from "@/store/useCalendarStore";

export default function CalendarGrid() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { appointments, contacts } = useCalendarStore();

  // get grid dates
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const today = () => setCurrentMonth(new Date());

  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const dayAppointments = appointments.filter((appt) =>
        isSameDay(new Date(appt.start), day)
      );

      days.push(
        <div
          key={day.toISOString()}
          className={`border p-2 h-32 relative ${
            !isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-400" : ""
          }`}
        >
          <div className="text-xs font-semibold">{format(day, "d")}</div>

          <div className="space-y-1 mt-1">
            {dayAppointments.map((appt) => {
              const contact = contacts.find((c) => c.id === appt.contactId);
              return (
                <Card
                  key={appt.id}
                  className="p-1 text-xs bg-blue-100 truncate"
                >
                  <span className="font-medium">{appt.title}</span>
                  {contact && (
                    <span className="block text-[10px] text-gray-600">
                      {contact.name}
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day.toISOString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={prevMonth}>
          ←
        </Button>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <Button variant="outline" onClick={nextMonth}>
          →
        </Button>
        <Button variant="secondary" onClick={today}>
          Today
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 bg-gray-100 text-sm font-medium text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="p-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div>{rows}</div>
    </div>
  );
}
