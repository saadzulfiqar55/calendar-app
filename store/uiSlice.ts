export type UISlice = {
  openAddContact: boolean;
  openBookAppointment: boolean;
  setOpenAddContact: (value: boolean) => void;
  setOpenBookAppointment: (value: boolean) => void;
};

export const createUISlice = (
  set: any,
  get: any
): UISlice => ({
  openAddContact: false,
  openBookAppointment: false,
  setOpenAddContact: (value) => set(() => ({ openAddContact: value })),
  setOpenBookAppointment: (value) =>
    set(() => ({ openBookAppointment: value })),
});
