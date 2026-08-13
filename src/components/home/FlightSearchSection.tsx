import { useState } from "react";
import { Plane, Calendar, Users, X, ArrowLeftRight, Check, Search } from "lucide-react";
import { toast } from "sonner";

export function FlightSearchSection() {
  const [tripType, setTripType] = useState<"ONE WAY" | "ROUND TRIP" | "MULTI CITY">("ONE WAY");
  const [fromCity, setFromCity] = useState("Bengaluru (BLR)");
  const [toCity, setToCity] = useState("Delhi (DEL)");
  const [departDate, setDepartDate] = useState("2026-08-12");
  const [returnDate, setReturnDate] = useState<string | null>("2026-08-12");
  const [showPassengersPopover, setShowPassengersPopover] = useState(false);

  // Passenger counts
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState("Economy");

  const totalPassengers = adults + children + infants;

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleClearReturnDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReturnDate(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      `Flight search initiated from ${fromCity} to ${toCity} for ${totalPassengers} Passenger(s) [${cabinClass}].`
    );
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 py-12 md:py-20 text-white rounded-3xl my-6 mx-4 md:mx-8 shadow-2xl border border-slate-800">
      {/* Background Airplane/Sky Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-slate-950/80 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Title */}
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
          Book flights and explore the world with us.
        </h2>

        {/* Trip Type Selector Bar */}
        <div className="inline-flex items-center gap-1 rounded-2xl bg-white p-1.5 shadow-lg mb-6 text-slate-800">
          {(["ONE WAY", "ROUND TRIP", "MULTI CITY"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTripType(type);
                if (type === "ROUND TRIP" && !returnDate) {
                  setReturnDate(departDate);
                }
              }}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition ${
                tripType === type
                  ? "bg-[#0b132b] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-100"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Flight Search Form Inputs */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Where From & Where To Input Group */}
          <div className="md:col-span-5 relative flex items-center bg-white rounded-2xl p-1.5 shadow-lg border border-slate-200 text-slate-900">
            {/* Where From */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2">
              <Plane className="h-5 w-5 text-slate-400 shrink-0 transform -rotate-45" />
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</span>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="Where From ?"
                  className="w-full font-bold text-slate-900 text-sm focus:outline-none bg-transparent placeholder-slate-400"
                />
              </div>
            </div>

            {/* Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="z-10 -mx-3 h-9 w-9 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-amber-600 hover:bg-amber-50 hover:scale-105 transition"
              title="Swap Locations"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            {/* Where To */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-2 pl-4">
              <Plane className="h-5 w-5 text-slate-400 shrink-0 transform rotate-45" />
              <div className="flex-1 min-w-0">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">To</span>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  placeholder="Where To ?"
                  className="w-full font-bold text-slate-900 text-sm focus:outline-none bg-transparent placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Dates Input (Departure + Return with X button) */}
          <div className="md:col-span-4 bg-white rounded-2xl p-2.5 shadow-lg border border-slate-200 text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-slate-400 shrink-0 ml-1" />
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Depart</span>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full font-bold text-slate-900 text-xs sm:text-sm focus:outline-none bg-transparent"
                />
              </div>

              {/* Return Date Slot */}
              <div className="flex-1 border-l border-slate-200 pl-2 relative">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Return</span>
                {returnDate ? (
                  <div className="flex items-center justify-between">
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full font-bold text-slate-900 text-xs sm:text-sm focus:outline-none bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleClearReturnDate}
                      className="text-slate-400 hover:text-red-600 p-0.5"
                      title="Clear Return Date"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setReturnDate(departDate)}
                    className="text-xs text-amber-600 font-semibold hover:underline"
                  >
                    + Add Return
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Passenger & Economy Selector */}
          <div className="md:col-span-3 relative">
            <button
              type="button"
              onClick={() => setShowPassengersPopover((prev) => !prev)}
              className="w-full bg-white rounded-2xl p-3 shadow-lg border border-slate-200 text-slate-900 flex items-center justify-between gap-2 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Users className="h-5 w-5 text-slate-400 shrink-0" />
                <div className="text-left truncate">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Travellers</span>
                  <span className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""} | {cabinClass}
                  </span>
                </div>
              </div>
            </button>

            {/* Passenger Popover */}
            {showPassengersPopover && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 text-slate-900 z-50 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-2">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Travellers & Cabin</h4>
                  <button
                    type="button"
                    onClick={() => setShowPassengersPopover(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Adults Counter */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Adults</span>
                    <span className="text-[10px] text-slate-500">12+ years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="h-7 w-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(adults + 1)}
                      className="h-7 w-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children Counter */}
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">Children</span>
                    <span className="text-[10px] text-slate-500">2-12 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="h-7 w-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(children + 1)}
                      className="h-7 w-7 rounded-lg border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Infants Counter (NEW) */}
                <div className="flex items-center justify-between text-xs bg-amber-50 p-2 rounded-xl border border-amber-200">
                  <div>
                    <span className="font-bold text-amber-900 block">Infants</span>
                    <span className="text-[10px] text-amber-700">Under 2 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      className="h-7 w-7 rounded-lg border border-amber-300 bg-white flex items-center justify-center font-bold text-amber-900 hover:bg-amber-100"
                    >
                      -
                    </button>
                    <span className="font-bold w-4 text-center text-amber-900">{infants}</span>
                    <button
                      type="button"
                      onClick={() => setInfants(infants + 1)}
                      className="h-7 w-7 rounded-lg border border-amber-300 bg-white flex items-center justify-center font-bold text-amber-900 hover:bg-amber-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Cabin Class Selection */}
                <div className="pt-2 border-t space-y-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cabin Class</span>
                  <div className="grid grid-cols-2 gap-1.5 text-xs">
                    {["Economy", "Premium Economy", "Business", "First"].map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => setCabinClass(cls)}
                        className={`px-2 py-1 rounded-lg text-left text-[11px] font-semibold transition ${
                          cabinClass === cls
                            ? "bg-[#0b132b] text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cls}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassengersPopover(false)}
                  className="w-full mt-3 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
