import { useState } from "react";
import { Plane, TrainFront, Bus, Car, Route, Timer, ClipboardCheck, ArrowRight } from "lucide-react";
import { ResourceManager } from "@/components/business/ResourceManager";
import { BUSINESS_RESOURCES } from "@/lib/business-schema";
import { TourPackageTicketCopySection } from "@/components/packages/TourPackageTicketCopySection";

type SectorKey = "flight_bookings" | "train_bookings" | "bus_bookings" | "cab_bookings" | "package_trips" | "hourly_bookings";

const SECTORS: { key: SectorKey; label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  {
    key: "flight_bookings",
    label: "Flight Sector Booking",
    description: "Offline flight tickets, PNR, infant details, DOB, and airline details",
    icon: Plane,
    color: "from-blue-500 to-indigo-600",
  },
  {
    key: "train_bookings",
    label: "Train Sector Booking",
    description: "Offline railway PNR, berth, DOB, infant & passenger records",
    icon: TrainFront,
    color: "from-amber-500 to-orange-600",
  },
  {
    key: "bus_bookings",
    label: "Bus Sector Booking",
    description: "Offline bus tickets, operator, seat number, DOB & PNR",
    icon: Bus,
    color: "from-emerald-500 to-teal-600",
  },
  {
    key: "cab_bookings",
    label: "Cab Sector Booking",
    description: "Chauffeur cab bookings, driver assignment & passenger details",
    icon: Car,
    color: "from-purple-500 to-violet-600",
  },
  {
    key: "package_trips",
    label: "Tour Package Booking",
    description: "Multi-day tour package offline bookings with run KM billing",
    icon: Route,
    color: "from-rose-500 to-pink-600",
  },
  {
    key: "hourly_bookings",
    label: "Hourly Rental Booking",
    description: "Local city hourly packages, taxi number & boarding details",
    icon: Timer,
    color: "from-cyan-500 to-blue-600",
  },
];

export function OfflineSectorBookingHub() {
  const [selectedSector, setSelectedSector] = useState<SectorKey>("flight_bookings");

  const currentResource = BUSINESS_RESOURCES[selectedSector];

  return (
    <div className="space-y-8">
      {/* Sector Selection Grid Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <ClipboardCheck className="h-5 w-5" />
              </span>
              <h2 className="font-heading text-xl font-bold text-slate-900">
                Offline Booking Hub (All Travel Sectors)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any travel sector below to manage offline bookings, add passenger details, DOB, infant info, and issue ticket vouchers.
            </p>
          </div>
        </div>

        {/* Sector Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SECTORS.map((sec) => {
            const Icon = sec.icon;
            const isSelected = selectedSector === sec.key;
            return (
              <button
                key={sec.key}
                onClick={() => setSelectedSector(sec.key)}
                className={`p-3 rounded-2xl text-left transition flex flex-col justify-between border ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-400/20"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-xl text-white bg-gradient-to-br ${sec.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  {isSelected && <ArrowRight className="h-3.5 w-3.5 text-amber-400" />}
                </div>
                <div className="mt-3">
                  <h4 className="font-bold text-xs leading-tight">{sec.label}</h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Sector Resource Manager */}
      {selectedSector === "package_trips" && (
        <div className="space-y-6">
          <TourPackageTicketCopySection />
        </div>
      )}

      {currentResource && (
        <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
          <ResourceManager resource={currentResource} />
        </div>
      )}
    </div>
  );
}
