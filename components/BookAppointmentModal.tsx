"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import AddContactModal from "./AddContactModal";

export default function BookAppointmentModal() {
    const { addAppointment, contacts } = useStore();
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [status, setStatus] = useState("confirmed");
    const [contactId, setContactId] = useState("");
    const [internalNotes, setInternalNotes] = useState("");

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setContactId("");
        setStatus("confirmed");
        setInternalNotes("");
    };

    const handleSave = () => {
        if (!title || !date || !time) {
            toast.error("Please fill in title, date, and time");
            return;
        }

        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + 30 * 60000); // 30min slot

        const appointment = {
            id: crypto.randomUUID(),
            title,
            description,
            start,
            end,
            contactId,
            status: status as "confirmed" | "pending" | "cancelled",
            internalNotes,
        };

        addAppointment(appointment);
        toast.success("Appointment booked successfully!");
        resetForm();
        setOpen(false);
    };

    const handleCancel = () => {
        resetForm();
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>+ Book Appointment</Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-[1100px]">
                <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="appointment">
                    <TabsList>
                        <TabsTrigger value="appointment">Appointment</TabsTrigger>
                        <TabsTrigger value="blocked">Blocked off time</TabsTrigger>
                    </TabsList>

                    {/* Appointment Tab */}
                    <TabsContent value="appointment" className="grid grid-cols-2 gap-4 mt-4">
                        <div className="col-span-1 space-y-4">
                            <div>
                                <Label>Appointment Title</Label>
                                <Input
                                    placeholder="(eg) Appointment with Bob"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Description</Label>
                                <Textarea
                                    placeholder="Add description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Time</Label>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label>Status</Label>
                                <Select onValueChange={setStatus} value={status}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="confirmed">Confirmed</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Contact + Notes */}
                        <div className="col-span-1 space-y-4">
                            <div>
                                <Label>Contact</Label>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <Select onValueChange={setContactId} value={contactId}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select contact" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {contacts.length > 0 ? (
                                                contacts.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.name} ({c.email || c.phone || "no info"})
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="add contact" disabled>
                                                    No contacts available
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <AddContactModal />
                                </div>
                            </div>

                            <div>
                                <Label>Internal Notes</Label>
                                <Textarea 
                                    placeholder="Add internal note" 
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Blocked Off Time Tab */}
                    <TabsContent value="blocked" className="mt-4">
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Block off time when you're unavailable for appointments.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Start Date & Time</Label>
                                    <div className="flex gap-2">
                                        <Input type="date" placeholder="Start date" />
                                        <Input type="time" placeholder="Start time" />
                                    </div>
                                </div>
                                <div>
                                    <Label>End Date & Time</Label>
                                    <div className="flex gap-2">
                                        <Input type="date" placeholder="End date" />
                                        <Input type="time" placeholder="End time" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label>Reason (Optional)</Label>
                                <Input placeholder="e.g., Vacation, Meeting, etc." />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This feature will be fully implemented in a future update.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                    <Button onClick={handleSave}>Book Appointment</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}