"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store/useStore"; // ✅ slice-based store
import { toast } from "sonner"; // ✅ Sonner for notifications

export default function AddContactModal() {
  const addContact = useStore((s) => s.addContact);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("");

  const handleSave = () => {
    if (!name) {
      toast.error("Name is required");
      return;
    }

    const success = addContact({
      name,
      email,
      phone,
      timezone,
    });

    if (!success) {
      toast.error("A contact with this email or phone already exists.");
      return;
    }

    toast.success(`${name} has been added successfully.`);

    // reset form
    setName("");
    setEmail("");
    setPhone("");
    setTimezone("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Add Contact
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
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
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <Label>Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">America/New_York</SelectItem>
                <SelectItem value="Europe/London">Europe/London</SelectItem>
                <SelectItem value="Asia/Karachi">Asia/Karachi</SelectItem>
                <SelectItem value="Asia/Dubai">Asia/Dubai</SelectItem>
              </SelectContent>
            </Select>
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
