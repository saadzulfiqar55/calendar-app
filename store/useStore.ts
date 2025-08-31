// store/useStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  timezone: string;
  createdAt: Date;
}

export interface Appointment {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  contactId?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  internalNotes?: string;
}

interface CalendarStore {
  // State
  contacts: Contact[];
  appointments: Appointment[];

  // Contact actions
  addContact: (contact: Omit<Contact, 'id'>) => boolean;
  updateContact: (id: string, updatedContact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
  searchContacts: (query: string) => Contact[];

  // Appointment actions
  addAppointment: (appointment: Appointment) => boolean;
  updateAppointment: (id: string, updatedAppointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  getAppointmentsByContact: (contactId: string) => Appointment[];
  getAppointmentsByDate: (date: Date) => Appointment[];
  getAppointmentsByStatus: (status: Appointment['status']) => Appointment[];
  searchAppointments: (query: string) => Appointment[];

  // Utility actions
  clearAllData: () => void;
}

const useStore = create<CalendarStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        contacts: [],
        appointments: [],

        // Contact actions
        addContact: (contact: Omit<Contact, 'id'>) => {
          const { contacts } = get();
          
          // Check for duplicates
          const isDuplicate = contacts.some(existingContact => 
            (contact.email && existingContact.email === contact.email) || 
            (contact.phone && existingContact.phone === contact.phone)
          );

          if (isDuplicate) {
            return false; // Return false to indicate failure
          }

          const newContact: Contact = {
            ...contact,
            id: crypto.randomUUID()
          };

          set((state) => ({
            contacts: [...state.contacts, newContact]
          }));
          
          return true; // Return true to indicate success
        },

        updateContact: (id: string, updatedContact: Partial<Contact>) => {
          set((state) => ({
            contacts: state.contacts.map(contact => 
              contact.id === id ? { ...contact, ...updatedContact } : contact
            )
          }));
        },

        deleteContact: (id: string) => {
          set((state) => ({
            contacts: state.contacts.filter(contact => contact.id !== id),
            // Also remove the contact from appointments
            appointments: state.appointments.map(appointment => 
              appointment.contactId === id 
                ? { ...appointment, contactId: undefined }
                : appointment
            )
          }));
        },

        getContact: (id: string) => {
          const { contacts } = get();
          return contacts.find(contact => contact.id === id);
        },

        // Appointment actions
        addAppointment: (appointment: Appointment) => {
          set((state) => ({
            appointments: [...state.appointments, appointment]
          }));
          return true;
        },

        updateAppointment: (id: string, updatedAppointment: Partial<Appointment>) => {
          set((state) => ({
            appointments: state.appointments.map(appointment => 
              appointment.id === id ? { ...appointment, ...updatedAppointment } : appointment
            )
          }));
        },

        deleteAppointment: (id: string) => {
          set((state) => ({
            appointments: state.appointments.filter(appointment => appointment.id !== id)
          }));
        },

        getAppointment: (id: string) => {
          const { appointments } = get();
          return appointments.find(appointment => appointment.id === id);
        },

        getAppointmentsByContact: (contactId: string) => {
          const { appointments } = get();
          return appointments.filter(appointment => appointment.contactId === contactId);
        },

        getAppointmentsByDate: (date: Date) => {
          const { appointments } = get();
          const dateStr = date.toISOString().split('T')[0];
          return appointments.filter(appointment => {
            const appointmentDate = new Date(appointment.start).toISOString().split('T')[0];
            return appointmentDate === dateStr;
          });
        },

        getAppointmentsByStatus: (status: Appointment['status']) => {
          const { appointments } = get();
          return appointments.filter(appointment => appointment.status === status);
        },

        // Utility actions
        clearAllData: () => {
          set({
            contacts: [],
            appointments: []
          });
        },

        // Search functions
        searchContacts: (query: string) => {
          const { contacts } = get();
          const lowercaseQuery = query.toLowerCase();
          return contacts.filter(contact =>
            contact.name.toLowerCase().includes(lowercaseQuery) ||
            (contact.email && contact.email.toLowerCase().includes(lowercaseQuery)) ||
            (contact.phone && contact.phone.includes(query))
          );
        },

        searchAppointments: (query: string) => {
          const { appointments } = get();
          const lowercaseQuery = query.toLowerCase();
          return appointments.filter(appointment =>
            appointment.title.toLowerCase().includes(lowercaseQuery) ||
            (appointment.description && appointment.description.toLowerCase().includes(lowercaseQuery))
          );
        }
      }),
      {
        name: 'calendar-storage', // unique name for localStorage
        version: 1,
        // Custom serialization to handle Date objects
        // NOTE: Zustand persist does not support 'serialize' and 'deserialize' options.
        // If you need to handle Date objects, you must do it outside of persist or use a custom storage.
      }
    ),
    {
      name: 'calendar-store', // name for devtools
    }
  )
);

export { useStore };