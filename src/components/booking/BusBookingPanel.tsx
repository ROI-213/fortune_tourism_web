import { useState } from "react";
import { Bus, ArrowLeftRight, Calendar, Users, Check, Search } from "lucide-react";
import { LocationSearchInput } from "@/components/booking/LocationSearchInput";
import { type BookingSearchPayload } from "@/components/booking/BookingSearchResultsModal";

interface BusBookingPanelProps {
  onSearch: (payload: BookingSearchPayload) => void;
}

export function BusBookingPanel({ onSearch }: BusBookingPanelProps) {
  const [from, setFrom] = useState("Rajajinagar, Bengaluru, Karnataka");
  const [to, setTo] = useState("Mysuru / Mysore");
  const [journeyDate, setJourneyDate] = useState("2026-08-14");
  const [passengers, setPassengers] = useState(1);

  // Seat Type (Optional) checkboxes (per Attached Image 2)
  const [seater, setSeater] = useState(false);
  const [sleeper, setSleeper] = useState(true);
  const [acOnly, setAcOnly] = useState(true);

  // Errors state
  const [errors, setErrors] = useState<{ from?: string; to?: string; journeyDate?: string }>({});

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { from?: string; to?: string; journeyDate?: string } = {};

    if (!from.trim()) newErrors.from = "Please select origin location";
    if (!to.trim()) newErrors.to = "Please select destination location";
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      newErrors.to = "Origin and destination cannot be identical";
    }
    if (!journeyDate) newErrors.journeyDate = "Please select journey date";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const seatTypes: string[] = [];
    if (seater) seatTypes.push("Seater");
    if (sleeper) seatTypes.push("Sleeper");
    if (acOnly) seatTypes.push("AC Only");

    onSearch({
      category: "bus",
      from,
      to,
      departureDate: journeyDate,
      passengers,
      seatType: seatTypes,
    });
  };

  return (
    <div className="bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
      {/* Header & One Way Radio (Attached Image 2 style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Bus className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900">
              Book Bus Tickets Online
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Choose intercity luxury AC sleepers, KSRTC, & private express buses.
          </p>
        </div>

        {/* One Way Radio */}
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50/80 rounded-2xl border border-orange-200 text-orange-950 font-bold text-xs">
          <span className="w-4 h-4 rounded-full border-4 border-orange-500 bg-white" />
          <span>One Way</span>
        </div>
      </div>

      {/* Main Search Panel Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* From & To Inputs with Swap */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-2">
            <LocationSearchInput
              label="From"
              placeholder="Origin (e.g. Rajajinagar, Majestic...)"
              value={from}
              onChange={(val) => {
                setFrom(val);
                if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
              }}
              filterType="bus"
              icon={Bus}
              error={errors.from}
            />

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="z-10 p-3 rounded-full bg-slate-100 text-slate-700 border border-slate-300 hover:border-orange-500 hover:bg-orange-50 shadow-md hover:scale-110 transition shrink-0 my-1 sm:my-0 sm:mt-5"
              title="Swap origin and destination"
            >
              <ArrowLeftRight className="h-4 w-4 text-orange-600" />
            </button>

            <LocationSearchInput
              label="Where to?"
              placeholder="Destination City / Area"
              value={to}
              onChange={(val) => {
                setTo(val);
                if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
              }}
              filterType="bus"
              icon={Bus}
              error={errors.to}
            />
          </div>

          {/* Journey Date Picker */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Journey Date
            </label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => {
                  setJourneyDate(e.target.value);
                  if (errors.journeyDate) setErrors((prev) => ({ ...prev, journeyDate: undefined }));
                }}
                className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
              />
            </div>
            {errors.journeyDate && (
              <span className="block text-[10px] font-medium text-red-500 mt-1">{errors.journeyDate}</span>
            )}
          </div>

          {/* Passengers Selection */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
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
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Passenger" : "Passengers"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seat Type (Optional) Checkboxes (Attached Image 2 style) */}
        <div className="space-y-2 border-t pt-4">
          <span className="block text-xs font-bold text-slate-500">Seat Type (Optional)</span>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={seater}
                onChange={(e) => setSeater(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span>Seater</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sleeper}
                onChange={(e) => setSleeper(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span>Sleeper</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acOnly}
                onChange={(e) => setAcOnly(e.target.checked)}
                className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-slate-300"
              />
              <span>Show AC Buses only</span>
            </label>
          </div>
        </div>

        {/* Submit CTA Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-heading font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Buses
          </button>
        </div>
      </form>
    </div>
  );
}
