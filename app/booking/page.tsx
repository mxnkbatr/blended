import { BookingSystem } from "@/components/BookingSystem";

export const metadata = {
  title: "Цаг авах",
  description: "Blended babershop — цаг захиалга",
};

export default function BookingPage() {
  return (
    <main className="mx-auto w-full max-w-md px-4 py-8 sm:px-6 md:max-w-6xl md:py-10 lg:py-24">
      <p className="text-[10px] uppercase tracking-[0.32em] text-zinc-600">
        Booking
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-normal tracking-[0.08em] text-white sm:text-5xl">
        Цаг авах
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500">
        Baber сонгож, өдөр болон цагаа сонгоно уу. Баталгаажуулахад нэр, утас
        шаардлагатай.
      </p>
      <div className="mt-8">
        <BookingSystem />
      </div>
    </main>
  );
}
