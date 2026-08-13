import { useState } from "react";
import { Bus, MapPin, Calendar, ArrowLeftRight, Check } from "lucide-react";
import { toast } from "sonner";

export function BusSearchSection() {
  const [tripMode, setTripMode] = useState<"One Way" | "Round Trip">("One Way");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [travelDate, setTravelDate] = useState("2026-08-13");

  // Seat Type (Optional) checkboxes
  const [seater, setSeater] = useState(false);
  const [sleeper, setSleeper] = useState(false);
  const [acOnly, setAcOnly] = useState(false);

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filters = [];
    if (seater) filters.push("Seater");
    if (sleeper) filters.push("Sleeper");
    if (acOnly) filters.push("AC Only");
    const filterText = filters.length ? ` (${filters.join(", ")})` : "";

    toast.success(
      `Bus search submitted: ${fromLocation || "Origin"} to ${toLocation || "Destination"} on ${travelDate}${filterText}.`
    );
  };

  return (
    <section className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl my-6 mx-4 md:mx-8">
      {/* Radio option */}
      <div className="flex items-center gap-2 mb-4">
        <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-slate-900 text-sm">
          <input
            type="radio"
            name="busTripType"
            checked={tripMode === "One Way"}
            onChange={() => setTripMode("One Way")}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-slate-300 accent-orange-600"
          />
          <span>One Way</span>
        </label>
      </div>

      {/* Inputs row */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* From & Where to container */}
          <div className="md:col-span-8 relative flex items-center bg-white rounded-2xl p-1.5 border border-slate-300 shadow-sm text-slate-900 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition">
            {/* From */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2">
              <Bus className="h-5 w-5 text-slate-500 shrink-0" />
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                placeholder="From"
                className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent placeholder-slate-400"
              />
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="z-10 -mx-3 h-9 w-9 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-600 hover:text-orange-600 hover:border-orange-400 transition"
              title="Swap Locations"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            {/* Where to? */}
            <div className="flex-1 flex items-center gap-3 px-3 py-2 pl-4">
              <MapPin className="h-5 w-5 text-slate-500 shrink-0" />
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                placeholder="Where to?"
                className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent placeholder-slate-400"
              />
            </div>
          </div>

          {/* Date Picker */}
          <div className="md:col-span-4 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm text-slate-900 flex items-center gap-3 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition">
            <Calendar className="h-5 w-5 text-slate-500 shrink-0 ml-1" />
            <div className="flex-1">
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
              />
            </div>
          </div>
        </div>

        {/* Seat Type (Optional) checkboxes */}
        <div className="pt-2">
          <span className="block text-xs font-semibold text-slate-500 mb-2">Seat Type (Optional)</span>
          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-slate-700">
            <label className="inline-flex items-center gap-2 cursor-pointer hover:text-slate-950">
              <input
                type="checkbox"
                checked={seater}
                onChange={(e) => setSeater(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 accent-orange-600"
              />
              <span>Seater</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer hover:text-slate-950">
              <input
                type="checkbox"
                checked={sleeper}
                onChange={(e) => setSleeper(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 accent-orange-600"
              />
              <span>Sleeper</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer hover:text-slate-950">
              <input
                type="checkbox"
                checked={acOnly}
                onChange={(e) => setAcOnly(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 accent-orange-600"
              />
              <span>Show AC Buses only</span>
            </label>

            <button
              type="submit"
              className="ml-auto px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs shadow transition"
            >
              Search Buses
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
