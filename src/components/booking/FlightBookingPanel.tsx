import { useState } from "react";
import { Plane, ArrowLeftRight, Calendar, Users, ChevronDown, Plus, Minus, Search } from "lucide-react";
import { LocationSearchInput } from "@/components/booking/LocationSearchInput";
import { type LocationItem } from "@/data/locations";
import { type BookingSearchPayload } from "@/components/booking/BookingSearchResultsModal";

interface FlightBookingPanelProps {
  onSearch: (payload: BookingSearchPayload) => void;
}

export function FlightBookingPanel({ onSearch }: FlightBookingPanelProps) {
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "multi-city">("one-way");
  const [from, setFrom] = useState("Bengaluru (BLR) — Kempegowda International Airport");
  const [to, setTo] = useState("Delhi (DEL) — Indira Gandhi International Airport");
  const [departureDate, setDepartureDate] = useState("2026-08-15");
  const [returnDate, setReturnDate] = useState("2026-08-22");
  
  // Passengers & Class state
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");
  const [showPaxPopover, setShowPaxPopover] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{ from?: string; to?: string; departureDate?: string; returnDate?: string }>({});

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const totalPassengers = adults + children + infants;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { from?: string; to?: string; departureDate?: string; returnDate?: string } = {};

    if (!from.trim()) newErrors.from = "Please select origin airport/city";
    if (!to.trim()) newErrors.to = "Please select destination airport/city";
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      newErrors.to = "Origin and destination cannot be identical";
    }
    if (!departureDate) newErrors.departureDate = "Please select departure date";

    if (tripType === "round-trip" && returnDate && returnDate < departureDate) {
      newErrors.returnDate = "Return date must be after departure date";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSearch({
      category: "flight",
      tripType,
      from,
      to,
      departureDate,
      returnDate: tripType === "round-trip" ? returnDate : undefined,
      passengers: totalPassengers,
      adults,
      children,
      infants,
      cabinClass,
    });
  };

  return (
    <div className="bg-[#0b132b] text-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-6 relative overflow-hidden">
      {/* Background Subtle Gradient & Wing Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Trip Type Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Plane className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-white">
              Book flights and explore the world with us
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search domestic & international flights with instant fare comparison.
          </p>
        </div>

        {/* Trip Type Selector (Attached Image 1 style) */}
        <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 flex items-center gap-1 self-stretch sm:self-auto">
          {[
            { key: "one-way", label: "ONE WAY" },
            { key: "round-trip", label: "ROUND TRIP" },
            { key: "multi-city", label: "MULTI CITY" },
          ].map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setTripType(type.key as any)}
              className={`px-4 py-2 rounded-xl font-bold text-xs tracking-wider transition-all duration-200 ${
                tripType === type.key
                  ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Search Panel Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* From & To Inputs with Swap */}
          <div className="lg:col-span-5 relative flex flex-col sm:flex-row items-center gap-2">
            <LocationSearchInput
              label="Where From ?"
              placeholder="Origin Airport / City"
              value={from}
              onChange={(val) => {
                setFrom(val);
                if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
              }}
              filterType="flight"
              icon={Plane}
              error={errors.from}
            />

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="z-10 p-3 rounded-full bg-white text-slate-900 border border-slate-300 hover:border-amber-500 hover:bg-amber-50 shadow-lg hover:scale-110 transition shrink-0 my-1 sm:my-0 sm:mt-5"
              title="Swap origin and destination"
            >
              <ArrowLeftRight className="h-4 w-4 text-amber-600" />
            </button>

            <LocationSearchInput
              label="Where To ?"
              placeholder="Destination Airport / City"
              value={to}
              onChange={(val) => {
                setTo(val);
                if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
              }}
              filterType="flight"
              icon={Plane}
              error={errors.to}
            />
          </div>

          {/* Departure & Return Date Pickers */}
          <div className="lg:col-span-4 flex items-center gap-2">
            {/* Departure */}
            <div className="flex-1 bg-white rounded-2xl p-2.5 border border-slate-300 text-slate-900 shadow-sm">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Departure Date
              </label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => {
                    setDepartureDate(e.target.value);
                    if (errors.departureDate) setErrors((prev) => ({ ...prev, departureDate: undefined }));
                  }}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                />
              </div>
              {errors.departureDate && (
                <span className="block text-[10px] font-medium text-red-500 mt-1">{errors.departureDate}</span>
              )}
            </div>

            {/* Return Date (Active for Round Trip) */}
            <div
              className={`flex-1 rounded-2xl p-2.5 border transition ${
                tripType === "round-trip"
                  ? "bg-white border-slate-300 text-slate-900 shadow-sm"
                  : "bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-60"
              }`}
            >
              <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Return Date
                </label>
                {tripType === "round-trip" && returnDate && (
                  <button
                    type="button"
                    onClick={() => setReturnDate("")}
                    className="text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="date"
                  disabled={tripType !== "round-trip"}
                  value={returnDate}
                  onChange={(e) => {
                    setReturnDate(e.target.value);
                    if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: undefined }));
                  }}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none disabled:cursor-not-allowed"
                />
              </div>
              {errors.returnDate && (
                <span className="block text-[10px] font-medium text-red-500 mt-1">{errors.returnDate}</span>
              )}
            </div>
          </div>

          {/* Travellers & Class Popover Dropdown */}
          <div className="lg:col-span-3 relative">
            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase mb-1">
              Travellers & Class
            </label>
            <button
              type="button"
              onClick={() => setShowPaxPopover(!showPaxPopover)}
              className="w-full bg-white text-slate-900 p-3 rounded-2xl border border-slate-300 hover:border-amber-500 transition flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Users className="h-4 w-4 text-slate-400 shrink-0" />
                <span className="font-bold text-xs truncate">
                  {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"} | {cabinClass}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
            </button>

            {/* Popover Card */}
            {showPaxPopover && (
              <div className="absolute right-0 top-full mt-2 z-50 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 text-slate-900 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="font-bold text-xs text-slate-900">Select Passengers</span>
                  <button
                    type="button"
                    onClick={() => setShowPaxPopover(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Done
                  </button>
                </div>

                {/* Counters */}
                <div className="space-y-3">
                  {[
                    { label: "Adults (12+ yrs)", value: adults, set: setAdults, min: 1 },
                    { label: "Children (2-12 yrs)", value: children, set: setChildren, min: 0 },
                    { label: "Infants (Under 2 yrs)", value: infants, set: setInfants, min: 0 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between text-xs font-medium">
                      <span>{row.label}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => row.set(Math.max(row.min, row.value - 1))}
                          className="w-7 h-7 rounded-lg bg-slate-100 border text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-bold w-4 text-center">{row.value}</span>
                        <button
                          type="button"
                          onClick={() => row.set(row.value + 1)}
                          className="w-7 h-7 rounded-lg bg-slate-100 border text-slate-700 font-bold flex items-center justify-center hover:bg-slate-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cabin Class Selection */}
                <div className="border-t pt-3 space-y-2">
                  <span className="block font-bold text-xs text-slate-900">Cabin Class</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {["Economy", "Premium Economy", "Business", "First Class"].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setCabinClass(cls)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border text-left transition ${
                          cabinClass === cls
                            ? "bg-slate-900 text-white border-slate-900 shadow"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit CTA Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-heading font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Flights
          </button>
        </div>
      </form>
    </div>
  );
}
