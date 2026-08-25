import React from "react";
import { Car, TrainFront, Bus, Plane, Palmtree, CheckCircle2 } from "lucide-react";

export type ServiceType = "CAB" | "TRAIN" | "BUS" | "FLIGHT" | "TOUR";

interface MultiServiceTypeCardsProps {
  selectedService: ServiceType;
  onSelect: (service: ServiceType) => void;
}

const SERVICES: {
  id: ServiceType;
  name: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgGradient: string;
  borderColor: string;
  description: string;
  highlight: string;
}[] = [
  {
    id: "CAB",
    name: "Cab Booking",
    badge: "Instant Confirmation",
    icon: Car,
    color: "text-emerald-400",
    bgGradient: "from-emerald-950/40 to-slate-900",
    borderColor: "border-emerald-500/50",
    description: "Local hourly rentals, airport transfers, outstation one-way & round trips.",
    highlight: "Transparent km/hr fare with live breakdown",
  },
  {
    id: "TRAIN",
    name: "Train Booking",
    badge: "Assisted IRCTC",
    icon: TrainFront,
    color: "text-amber-400",
    bgGradient: "from-amber-950/40 to-slate-900",
    borderColor: "border-amber-500/50",
    description: "IRCTC train ticket booking assistance with tatkal & berth preferences.",
    highlight: "Multi-passenger & quota support",
  },
  {
    id: "BUS",
    name: "Bus Booking",
    badge: "Multi-Operator",
    icon: Bus,
    color: "text-orange-400",
    bgGradient: "from-orange-950/40 to-slate-900",
    borderColor: "border-orange-500/50",
    description: "AC Sleeper, Non-AC Seater, Volvo bus ticket booking assistance.",
    highlight: "Boarding point & seat selection",
  },
  {
    id: "FLIGHT",
    name: "Flight Booking",
    badge: "Best Airfares",
    icon: Plane,
    color: "text-sky-400",
    bgGradient: "from-sky-950/40 to-slate-900",
    borderColor: "border-sky-500/50",
    description: "Domestic & international flights with round-trip and multi-city search.",
    highlight: "Airline & cabin class options",
  },
  {
    id: "TOUR",
    name: "Tour Packages",
    badge: "All-Inclusive",
    icon: Palmtree,
    color: "text-purple-400",
    bgGradient: "from-purple-950/40 to-slate-900",
    borderColor: "border-purple-500/50",
    description: "Curated holiday itineraries across South India with hotel & cab.",
    highlight: "Custom multi-destination route builder",
  },
];

export function MultiServiceTypeCards({ selectedService, onSelect }: MultiServiceTypeCardsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
          What would you like to book?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Select a service to load its tailored booking form with live fare calculation.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const isSelected = selectedService === s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              className={`relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? `bg-gradient-to-b ${s.bgGradient} ${s.borderColor} ring-2 ring-amber-500/40 shadow-xl shadow-amber-500/5 scale-[1.02]`
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40"
              }`}
            >
              {/* Active checkmark badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-slate-800/80 shadow-md " + s.color
                        : "bg-slate-800/50 text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-100 text-sm sm:text-base leading-tight">
                    {s.name}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-slate-300">
                  {s.badge}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider ${
                    isSelected ? "text-amber-400" : "text-slate-500 group-hover:text-slate-400"
                  }`}
                >
                  {isSelected ? "Selected" : "Choose →"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
