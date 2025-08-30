import { nanoid } from "nanoid";

export type Contact = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  timezone?: string;
};



export type ContactsSlice = {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id">) => boolean; // return success/fail
};

export const createContactsSlice = (set: any, get: any): ContactsSlice => ({
  contacts: [],
  addContact: (contact) => {
    const { contacts } = get();

    // check for duplicates by email OR phone
    const exists = contacts.some(
      (c: { email: string; phone: string; }) => (contact.email && c.email === contact.email) ||
             (contact.phone && c.phone === contact.phone)
    );

    if (exists) {
      return false; // ❌ duplicate, not added
    }

    set((state: any) => ({
      contacts: [...state.contacts, { ...contact, id: nanoid() }],
    }));

    return true; // ✅ success
  },
});
