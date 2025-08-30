"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalendarStore } from "@/store/useCalendarStore";

export default function AddContactModal() {
  const { addContact } = useCalendarStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("");

  const handleSave = () => {
    if (!name) return;

    addContact({
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      timezone,
    });

    // reset form
    setName("");
    setEmail("");
    setPhone("");
    setTimezone("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">+ Add Contact</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <Label>Timezone</Label>
            <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Contact</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
