"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCalendarStore } from "@/store/useCalendarStore";
import AddContactModal from "./AddContactModal";

export default function BookAppointmentModal() {
    const { addAppointment, contacts } = useCalendarStore();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [status, setStatus] = useState("confirmed");
    const [contactId, setContactId] = useState("");

    const handleSave = () => {
        if (!title || !date || !time) return;

        const start = new Date(`${date}T${time}`);
        const end = new Date(start.getTime() + 30 * 60000); // 30min slot

        addAppointment({
            id: crypto.randomUUID(),
            title,
            description,
            start,
            end,
            contactId,
            status: status as "confirmed" | "pending" | "cancelled",
        });

        // reset
        setTitle("");
        setDescription("");
        setDate("");
        setTime("");
        setContactId("");
        setStatus("confirmed");
    };

    return (
        <Dialog>
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
                                <Select onValueChange={setStatus} defaultValue={status}>
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
                                            {contacts.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name} ({c.email || c.phone || "no info"})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <AddContactModal />
                                </div>
                            </div>


                            <div>
                                <Label>Internal Notes</Label>
                                <Textarea placeholder="Add internal note" />
                            </div>
                        </div>
                    </TabsContent>

                    {/* Blocked Off Time Tab */}
                    <TabsContent value="blocked" className="mt-4">
                        <p className="text-sm text-muted-foreground">
                            Here you can block off time (to be implemented later).
                        </p>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSave}>Book Appointment</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
