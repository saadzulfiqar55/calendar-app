import { create } from "zustand";

type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  timezone?: string;
};

type Appointment = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  contactId?: string;
  status: "confirmed" | "pending" | "cancelled";
};

type CalendarState = {
  contacts: Contact[];
  appointments: Appointment[];
  addContact: (contact: Contact) => void;
  addAppointment: (appointment: Appointment) => void;
};

export const useCalendarStore = create<CalendarState>((set) => ({
  contacts: [],
  appointments: [],
  addContact: (contact) =>
    set((state) => ({ contacts: [...state.contacts, contact] })),
  addAppointment: (appointment) =>
    set((state) => ({ appointments: [...state.appointments, appointment] })),
}));
