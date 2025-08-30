import { nanoid } from "nanoid";

export type Appointment = {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  contactId?: string;
  status: "confirmed" | "pending" | "cancelled";
};

export type AppointmentsSlice = {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, "id">) => void;
};

export const createAppointmentsSlice = (
  set: any,
  get: any
): AppointmentsSlice => ({
  appointments: [],
  addAppointment: (appointment) =>
    set((state: any) => ({
      appointments: [
        ...state.appointments,
        { ...appointment, id: nanoid() },
      ],
    })),
});
