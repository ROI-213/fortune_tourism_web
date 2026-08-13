import { useState } from "react";
import { TrainFront, ArrowLeftRight, Calendar, Users, Search } from "lucide-react";
import { LocationSearchInput } from "@/components/booking/LocationSearchInput";
import { type BookingSearchPayload } from "@/components/booking/BookingSearchResultsModal";

interface TrainBookingPanelProps {
  onSearch: (payload: BookingSearchPayload) => void;
}

export function TrainBookingPanel({ onSearch }: TrainBookingPanelProps) {
  const [from, setFrom] = useState("KSR Bengaluru City Junction (SBC)");
  const [to, setTo] = useState("Mysuru Junction (MYS)");
  const [journeyDate, setJourneyDate] = useState("2026-08-15");
  const [trainClass, setTrainClass] = useState("AC 3 Tier");
  const [passengers, setPassengers] = useState(1);

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

    if (!from.trim()) newErrors.from = "Please select origin station";
    if (!to.trim()) newErrors.to = "Please select destination station";
    if (from.trim() && to.trim() && from.trim().toLowerCase() === to.trim().toLowerCase()) {
      newErrors.to = "Origin and destination cannot be identical";
    }
    if (!journeyDate) newErrors.journeyDate = "Please select journey date";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onSearch({
      category: "train",
      from,
      to,
      departureDate: journeyDate,
      trainClass,
      passengers,
    });
  };

  return (
    <div className="bg-white text-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <TrainFront className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-900">
              Book Train Tickets Online (IRCTC Partner Desk)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check train availability, live PNR status, seat berths, & ticket quotas.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-xs">
          IRCTC Ticket Desk
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* From Station & To Station with Swap */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-2">
            <LocationSearchInput
              label="From Station"
              placeholder="Origin Station (e.g. SBC, MYS, MAS...)"
              value={from}
              onChange={(val) => {
                setFrom(val);
                if (errors.from) setErrors((prev) => ({ ...prev, from: undefined }));
              }}
              filterType="train"
              icon={TrainFront}
              error={errors.from}
            />

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="z-10 p-3 rounded-full bg-slate-100 text-slate-700 border border-slate-300 hover:border-amber-500 hover:bg-amber-50 shadow-md hover:scale-110 transition shrink-0 my-1 sm:my-0 sm:mt-5"
              title="Swap origin and destination station"
            >
              <ArrowLeftRight className="h-4 w-4 text-amber-600" />
            </button>

            <LocationSearchInput
              label="To Station"
              placeholder="Destination Station"
              value={to}
              onChange={(val) => {
                setTo(val);
                if (errors.to) setErrors((prev) => ({ ...prev, to: undefined }));
              }}
              filterType="train"
              icon={TrainFront}
              error={errors.to}
            />
          </div>

          {/* Journey Date */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
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

          {/* Class Dropdown */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              Class
            </label>
            <select
              value={trainClass}
              onChange={(e) => setTrainClass(e.target.value)}
              className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none cursor-pointer"
            >
              {[
                "All Classes",
                "Sleeper (SL)",
                "AC 3 Tier (3A)",
                "AC 2 Tier (2A)",
                "AC First Class (1A)",
                "Chair Car (CC)",
                "Executive Chair Car (EC)",
                "General (GN)",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Passengers Selector */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
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

        {/* Submit CTA Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-heading font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-[1.02] transition duration-200 flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search Trains
          </button>
        </div>
      </form>
    </div>
  );
}
