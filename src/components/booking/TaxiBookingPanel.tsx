import { useState } from "react";
import { CarTaxiFront, MapPin, ArrowLeftRight, Calendar, Clock, Users, Search } from "lucide-react";
import { LocationSearchInput } from "@/components/booking/LocationSearchInput";
import { type BookingSearchPayload } from "@/components/booking/BookingSearchResultsModal";

interface TaxiBookingPanelProps {
  onSearch: (payload: BookingSearchPayload) => void;
}

const TAXI_VEHICLES = [
  { name: "Hatchback", seats: 4, hint: "Swift · i20 · Altroz" },
  { name: "Sedan", seats: 4, hint: "Dzire · Aura · Amaze" },
  { name: "SUV / MUV", seats: 6, hint: "Ertiga · Rumion · Carens" },
  { name: "Innova", seats: 7, hint: "Toyota Innova" },
  { name: "Innova Crysta", seats: 7, hint: "Premium Crysta" },
  { name: "Tempo Traveller", seats: 12, hint: "9 / 12 / 17 Seater" },
];

const TRIP_TYPES = [
  { key: "local", label: "LOCAL" },
  { key: "airport", label: "AIRPORT" },
  { key: "one-way", label: "ONE WAY" },
  { key: "outstation", label: "OUTSTATION" },
] as const;

export function TaxiBookingPanel({ onSearch }: TaxiBookingPanelProps) {
  const [tripType, setTripType] = useState<(typeof TRIP_TYPES)[number]["key"]>("local");
  const [from, setFrom] = useState("Rajajinagar, Bengaluru, Karnataka");
  const [to, setTo] = useState("Kempegowda International Airport (BLR)");
  const [pickupDate, setPickupDate] = useState("2026-08-15");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [vehicleType, setVehicleType] = useState("Sedan");
  const [passengers, setPassengers] = useState(2);

  // Errors state
  const [errors, setErrors] = useState<{ from?: string; to?: string; pickupDate?: string }>({});

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { from?: string; to?: string; pickupDate?: string } = {};

    if (!from.trim()) newErrors.from = "Please select pickup location";
    if (!to.trim()) newErrors.to = "Please select drop location";
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      newErrors.to = "Pickup and drop cannot be identical";
    }
    if (!pickupDate) newErrors.pickupDate = "Please select pickup date";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSearch({
      category: "taxi",
      from,
      to,
      departureDate: pickupDate,
      tripType,
      passengers,
      vehicleType,
      pickupTime,
    });
  };

  return (
    <div className="bg-[#111827] text-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden">
      {/* Background Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-lime-500/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Trip Type Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-lime-500/20 text-lime-400">
              <CarTaxiFront className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
              Book a Taxi / Cab Online
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Local city rides, airport transfers, one-way drops & outstation cabs at transparent
            fares.
          </p>
        </div>

        {/* Trip Type Selector */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 flex items-center gap-1 self-stretch sm:self-auto flex-wrap sm:flex-nowrap">
          {TRIP_TYPES.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setTripType(type.key)}
              className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 ${
                tripType === type.key
                  ? "bg-lime-400 text-slate-950 shadow-md scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Panel Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Pickup & Drop Inputs with Swap */}
          <div className="lg:col-span-5 relative flex flex-col sm:flex-row items-center gap-2">
            <LocationSearchInput
              label="Pickup From ?"
              placeholder="Pickup location / area"
              value={from}
              onChange={(val) => {
                setFrom(val);
                if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
              }}
              filterType="taxi"
              icon={MapPin}
              error={errors.from}
            />

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="z-10 p-3 rounded-full bg-white text-slate-900 border border-slate-300 hover:border-lime-500 hover:bg-lime-50 shadow-lg hover:scale-110 transition shrink-0 my-1 sm:my-0 sm:mt-5"
              title="Swap pickup and drop location"
            >
              <ArrowLeftRight className="h-4 w-4 text-lime-600" />
            </button>

            <LocationSearchInput
              label="Drop At ?"
              placeholder="Drop location / area"
              value={to}
              onChange={(val) => {
                setTo(val);
                if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
              }}
              filterType="taxi"
              icon={MapPin}
              error={errors.to}
            />
          </div>

          {/* Pickup Date & Time */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <div className="flex-1 bg-white rounded-2xl p-2.5 border border-slate-300 text-slate-900 shadow-sm">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Pickup Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => {
                    setPickupDate(e.target.value);
                    if (errors.pickupDate)
                      setErrors((prev) => ({ ...prev, pickupDate: undefined }));
                  }}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                />
              </div>
              {errors.pickupDate && (
                <span className="block text-[10px] font-medium text-red-500 mt-1">
                  {errors.pickupDate}
                </span>
              )}
            </div>

            <div className="flex-1 bg-white rounded-2xl p-2.5 border border-slate-300 text-slate-900 shadow-sm">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Pickup Time
              </label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Vehicle & Passengers */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Vehicle
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none cursor-pointer"
              >
                {TAXI_VEHICLES.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.seats} Seats)
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Passengers
              </label>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                <select
                  value={passengers}
                  onChange={(e) => setPassengers(Number(e.target.value))}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Passenger" : "Passengers"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Vehicle Hint */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
          <span className="text-slate-500 font-bold uppercase tracking-wide">Selected:</span>
          {TAXI_VEHICLES.filter((v) => v.name === vehicleType).map((v) => (
            <span
              key={v.name}
              className="px-3 py-1.5 rounded-full bg-lime-400/10 text-lime-300 border border-lime-400/30 font-semibold"
            >
              {v.name} · {v.hint}
            </span>
          ))}
          <span className="ml-auto bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3 py-1.5 rounded-full font-semibold">
            Live Fare Engine
          </span>
        </div>

        {/* Submit CTA Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-500 hover:to-lime-600 text-slate-950 font-heading font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Cabs
          </button>
        </div>
      </form>
    </div>
  );
}
