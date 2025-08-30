import CalendarGrid from "@/components/CalendarGrid";
import BookAppointmentModal from "@/components/BookAppointmentModal";

export default function Home() {
  return (
    <main className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Calendar</h1>
        <BookAppointmentModal />
      </div>
      <CalendarGrid />
    </main>
  );
}
