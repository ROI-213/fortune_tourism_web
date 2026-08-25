import { Car, Bus, TrainFront, Plane } from "lucide-react";

interface BookingTypeCardsProps {
  selectedType: string | null;
  onSelect: (type: string) => void;
}

const TYPES = [
  {
    id: "TAXI",
    title: "Taxi",
    desc: "Book a taxi for local, outstation, airport or transfer travel.",
    icon: Car,
  },
  {
    id: "BUS",
    title: "Bus",
    desc: "Request bus ticket booking assistance.",
    icon: Bus,
  },
  {
    id: "TRAIN",
    title: "Train",
    desc: "Request train ticket booking assistance.",
    icon: TrainFront,
  },
  {
    id: "FLIGHT",
    title: "Flight",
    desc: "Request flight ticket booking assistance.",
    icon: Plane,
  },
];

export function BookingTypeCards({ selectedType, onSelect }: BookingTypeCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {TYPES.map((t) => {
        const Icon = t.icon;
        const isSelected = selectedType === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onSelect(t.id)}
            className={`relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
              isSelected
                ? "border-[#0E6B50] bg-emerald-50/50 shadow-md"
                : "border-slate-100 bg-white hover:border-emerald-200"
            }`}
          >
            <div
              className={`p-4 rounded-full mb-4 transition-colors ${
                isSelected ? "bg-[#0E6B50] text-white" : "bg-slate-100 text-slate-500"
              }`}
            >
              <Icon className="h-8 w-8" />
            </div>
            <h3 className={`text-lg font-bold font-heading mb-2 ${isSelected ? "text-[#0B1F3A]" : "text-slate-700"}`}>
              {t.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">{t.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
