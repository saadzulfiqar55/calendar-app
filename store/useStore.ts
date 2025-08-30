import { create } from "zustand";
import { ContactsSlice, createContactsSlice } from "./contactsSlice";
import { AppointmentsSlice, createAppointmentsSlice } from "./appointmentsSlice";
import { UISlice, createUISlice } from "./uiSlice";

export const useStore = create<ContactsSlice & AppointmentsSlice & UISlice>()(
  (set, get) => ({
    ...createContactsSlice(set, get),
    ...createAppointmentsSlice(set, get),
    ...createUISlice(set, get),
  })
);
