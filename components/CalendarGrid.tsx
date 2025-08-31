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
    isAfter,
    isBefore,
    startOfDay,
} from "date-fns";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { Search, X, Calendar } from "lucide-react";

export default function CalendarWithSidebar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const appointments = useStore((s) => s.appointments);
    const contacts = useStore((s) => s.contacts);

    const today = new Date();

    // Get appointments for the current month (from today onward)
    const monthlyAppointments = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);

        return appointments.filter(appt => {
            const apptDate = new Date(appt.start);
            return isAfter(apptDate, startOfDay(today)) &&
                isBefore(apptDate, monthEnd) ||
                isSameDay(apptDate, today);
        }).sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    }, [appointments, currentMonth, today]);

    // Filter appointments based on search term
    const filteredAppointments = useMemo(() => {
        if (!searchTerm.trim()) return monthlyAppointments;

        return monthlyAppointments.filter(appt =>
            appt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contacts.some(contact =>
                contact.id === appt.contactId &&
                contact.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [monthlyAppointments, contacts, searchTerm]);

    // Calendar grid logic
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => setCurrentMonth(new Date());
    const clearSearch = () => setSearchTerm("");

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const dayAppointments = appointments.filter((appt) =>
                isSameDay(new Date(appt.start), day)
            );

            const isCurrentDay = isSameDay(day, today);
            const isOtherMonth = !isSameMonth(day, monthStart);

            days.push(
                <div
                    key={day.toISOString()}
                    className={cn(
                        "border p-2 h-32 relative transition-colors",
                        isOtherMonth && "bg-muted/30 text-muted-foreground",
                        isCurrentDay && "bg-primary/90 border-primary/50 ring-2 ring-primary/20"
                    )}
                >
                    <div className={cn(
                        "text-xs font-semibold mb-1 inline-flex items-center justify-center size-6 rounded-full",
                        isCurrentDay && "bg-secondary text-secondary-foreground"
                    )}>
                        {format(day, "d")}
                    </div>

                    <div className="space-y-1 mt-1">
                        {dayAppointments.map((appt) => {
                            const contact = contacts.find((c) => c.id === appt.contactId);
                            return (
                                <Card
                                    key={appt.id}
                                    className={cn(
                                        "p-1 text-xs truncate cursor-pointer transition-colors",
                                        isCurrentDay
                                            ? "bg-secondary border-primary/30 hover:bg-gray-400/30 hover:font-white"
                                            : "bg-secondary/50 hover:bg-secondary/80"
                                    )}
                                >
                                    <span className="font-medium">{appt.title}</span>
                                    {contact && (
                                        <span className="block text-[10px] ">
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
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className="w-80 border-r bg-muted/20 p-4 flex flex-col">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-primary mb-2">Positify</h1>
                    <p className="text-sm text-muted-foreground">
                        {format(currentMonth, "MMMM yyyy")}
                    </p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search meetings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-10"
                        />
                        {searchTerm && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                                onClick={clearSearch}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <h2 className="font-semibold">Upcoming Meetings</h2>
                        <span className="ml-auto text-sm text-muted-foreground">
                            {filteredAppointments.length}
                        </span>
                    </div>

                    <ScrollArea className="h-[calc(100vh-250px)]">
                        <div className="space-y-2">
                            {filteredAppointments.length === 0 ? (
                                <div className="text-center text-muted-foreground text-sm py-8">
                                    {searchTerm ? "No matching meetings found" : "No upcoming meetings"}
                                </div>
                            ) : (
                                filteredAppointments.map((appt) => {
                                    const contact = contacts.find((c) => c.id === appt.contactId);
                                    return (
                                        <Card key={appt.id} className="p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-medium text-sm">{appt.title}</span>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {format(new Date(appt.start), "h:mm a")}
                                                </span>
                                            </div>
                                            {contact && (
                                                <div className="text-xs text-muted-foreground">
                                                    with {contact.name}
                                                </div>
                                            )}
                                            <div className="text-xs text-muted-foreground mt-1">
                                                {format(new Date(appt.start), "EEE, MMM d")}
                                            </div>
                                        </Card>
                                    );
                                })
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Main Calendar */}
            <div className="flex-1 p-6 overflow-auto">
                <div className="space-y-4">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={prevMonth}>
                                ←
                            </Button>
                            <Button variant="outline" size="icon" onClick={nextMonth}>
                                →
                            </Button>
                        </div>
                        <h2 className="text-2xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
                        <Button variant="secondary" onClick={goToToday}>
                            Today
                        </Button>
                    </div>

                    {/* Search results info */}
                    {searchTerm && (
                        <div className="text-sm text-muted-foreground">
                            Showing {filteredAppointments.length} meeting{filteredAppointments.length !== 1 ? 's' : ''} for "{searchTerm}"
                        </div>
                    )}

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 bg-muted text-sm font-medium text-center rounded-t-lg">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="p-2">
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="rounded-b-lg overflow-hidden">
                        {rows}
                    </div>
                </div>
            </div>
        </div>
    );
}