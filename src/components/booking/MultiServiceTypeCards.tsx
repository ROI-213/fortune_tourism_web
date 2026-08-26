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
  iconBg: string;
  iconColor: string;
  description: string;
  highlight: string;
}[] = [
  {
    id: "CAB",
    name: "Cab Booking",
    badge: "Instant Confirm",
    icon: Car,
    iconBg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-700",
    description: "Local hourly rentals, airport transfers, outstation one-way & round trips.",
    highlight: "Transparent km/hr fare with live breakdown",
  },
  {
    id: "TRAIN",
    name: "Train Booking",
    badge: "Assisted IRCTC",
    icon: TrainFront,
    iconBg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-700",
    description: "IRCTC train ticket booking assistance with tatkal & berth preferences.",
    highlight: "Multi-passenger & quota support",
  },
  {
    id: "BUS",
    name: "Bus Booking",
    badge: "Multi-Operator",
    icon: Bus,
    iconBg: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-700",
    description: "AC Sleeper, Non-AC Seater, Volvo bus ticket booking assistance.",
    highlight: "Boarding point & seat selection",
  },
  {
    id: "FLIGHT",
    name: "Flight Booking",
    badge: "Best Airfares",
    icon: Plane,
    iconBg: "bg-sky-50 border-sky-200",
    iconColor: "text-sky-700",
    description: "Domestic & international flights with round-trip and multi-city search.",
    highlight: "Airline & cabin class options",
  },
  {
    id: "TOUR",
    name: "Tour Packages",
    badge: "All-Inclusive",
    icon: Palmtree,
    iconBg: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-700",
    description: "Curated holiday itineraries across South India with hotel & cab.",
    highlight: "Custom multi-destination route builder",
  },
];

export function MultiServiceTypeCards({ selectedService, onSelect }: MultiServiceTypeCardsProps) {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          What would you like to book?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
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
              className={`relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between group overflow-hidden ${
                isSelected
                  ? "bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/30 shadow-md scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs"
              }`}
            >
              {/* Active checkmark badge */}
              {isSelected && (
                <div className="absolute top-2.5 right-2.5">
                  <CheckCircle2 className="w-5 h-5 text-amber-600 fill-amber-100" />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-white shadow-xs " + s.iconColor + " border-amber-200"
                        : s.iconBg + " " + s.iconColor
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <div className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight">
                    {s.name}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600">
                  {s.badge}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isSelected ? "text-amber-700" : "text-slate-400 group-hover:text-slate-600"
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
