import { useState } from "react";
import { Plane, TrainFront, Bus, Car, Luggage, ArrowLeftRight, Calendar, Users, X, Check, Search } from "lucide-react";
import { toast } from "sonner";
import { FlightSearchSection } from "@/components/home/FlightSearchSection";
import { BusSearchSection } from "@/components/home/BusSearchSection";

export function FrontEndTravelBookingSection() {
  const [activeTab, setActiveTab] = useState<"flight" | "bus" | "train" | "car" | "package">("flight");

  // Train Search state
  const [trainFrom, setTrainFrom] = useState("Bengaluru (SBC)");
  const [trainTo, setTrainTo] = useState("Chennai (MAS)");
  const [trainDate, setTrainDate] = useState("2026-08-13");
  const [trainClass, setTrainClass] = useState("3AC");

  // Car Search state
  const [carFrom, setCarFrom] = useState("Bengaluru");
  const [carTo, setCarTo] = useState("Mysuru");
  const [carDate, setCarDate] = useState("2026-08-13");
  const [carVehicle, setCarVehicle] = useState("Innova Crysta");

  // Package Search state
  const [pkgDestination, setPkgDestination] = useState("Coorg");
  const [pkgDuration, setPkgDuration] = useState("3 Days · 2 Nights");
  const [pkgDate, setPkgDate] = useState("2026-08-15");

  const handleTrainSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Train booking search submitted for ${trainFrom} to ${trainTo} [${trainClass}] on ${trainDate}.`);
  };

  const handleCarSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Car rental search submitted for ${carVehicle} (${carFrom} to ${carTo}) on ${carDate}.`);
  };

  const handlePackageSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Tour package search submitted for ${pkgDestination} (${pkgDuration}) on ${pkgDate}.`);
  };

  return (
    <section className="my-8 mx-4 md:mx-8 space-y-4">
      {/* Front-End Main Tab Bar */}
      <div className="bg-[#0b132b] p-3 rounded-3xl shadow-xl flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto border border-slate-800">
        {[
          { key: "flight", label: "Book Flights", icon: Plane, color: "text-sky-400" },
          { key: "bus", label: "Book Buses", icon: Bus, color: "text-orange-400" },
          { key: "train", label: "Book Trains", icon: TrainFront, color: "text-amber-400" },
          { key: "car", label: "Book Cabs & Cars", icon: Car, color: "text-emerald-400" },
          { key: "package", label: "Tour Packages", icon: Luggage, color: "text-purple-400" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                isSelected
                  ? "bg-white text-slate-900 shadow-lg scale-105"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-slate-900" : tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="animate-fadeIn">
        {activeTab === "flight" && <FlightSearchSection />}

        {activeTab === "bus" && <BusSearchSection />}

        {activeTab === "train" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <TrainFront className="h-6 w-6 text-amber-600" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Book Train Tickets Online
              </h3>
            </div>

            <form onSubmit={handleTrainSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* From & To */}
              <div className="md:col-span-6 flex items-center bg-white rounded-2xl p-1.5 border border-slate-300 shadow-sm text-slate-900">
                <div className="flex-1 px-3 py-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">From Station</span>
                  <input
                    type="text"
                    value={trainFrom}
                    onChange={(e) => setTrainFrom(e.target.value)}
                    placeholder="Origin Station"
                    className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const tmp = trainFrom;
                    setTrainFrom(trainTo);
                    setTrainTo(tmp);
                  }}
                  className="px-2 text-amber-600 hover:scale-110 transition"
                  title="Swap"
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </button>
                <div className="flex-1 px-3 py-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">To Station</span>
                  <input
                    type="text"
                    value={trainTo}
                    onChange={(e) => setTrainTo(e.target.value)}
                    placeholder="Destination Station"
                    className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="md:col-span-3 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Travel Date</span>
                <input
                  type="date"
                  value={trainDate}
                  onChange={(e) => setTrainDate(e.target.value)}
                  className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
                />
              </div>

              {/* Class Selection */}
              <div className="md:col-span-3 bg-white rounded-2xl p-2 border border-slate-300 shadow-sm flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Class</span>
                  <select
                    value={trainClass}
                    onChange={(e) => setTrainClass(e.target.value)}
                    className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                  >
                    {["1AC", "2AC", "3AC", "SL", "CC", "EC", "2S"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 shadow"
                >
                  Search Trains
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "car" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <Car className="h-6 w-6 text-emerald-600" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Book Chauffeur-Driven Car & Cab Rentals
              </h3>
            </div>

            <form onSubmit={handleCarSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 flex items-center bg-white rounded-2xl p-1.5 border border-slate-300 shadow-sm text-slate-900">
                <div className="flex-1 px-3 py-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Pickup City</span>
                  <input
                    type="text"
                    value={carFrom}
                    onChange={(e) => setCarFrom(e.target.value)}
                    placeholder="Pickup location"
                    className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <div className="flex-1 px-3 py-2 border-l border-slate-200">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Drop City</span>
                  <input
                    type="text"
                    value={carTo}
                    onChange={(e) => setCarTo(e.target.value)}
                    placeholder="Drop location"
                    className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              <div className="md:col-span-3 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Travel Date</span>
                <input
                  type="date"
                  value={carDate}
                  onChange={(e) => setCarDate(e.target.value)}
                  className="w-full font-semibold text-slate-900 text-sm focus:outline-none bg-transparent"
                />
              </div>

              <div className="md:col-span-4 bg-white rounded-2xl p-2 border border-slate-300 shadow-sm flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Vehicle Type</span>
                  <select
                    value={carVehicle}
                    onChange={(e) => setCarVehicle(e.target.value)}
                    className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                  >
                    {["Sedan", "Ertiga", "Innova", "Innova Crysta", "Tempo Traveller"].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow"
                >
                  Book Cab
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "package" && (
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4 border-b pb-3">
              <Luggage className="h-6 w-6 text-purple-600" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Book South India Tour Packages
              </h3>
            </div>

            <form onSubmit={handlePackageSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-4 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Destination</span>
                <select
                  value={pkgDestination}
                  onChange={(e) => setPkgDestination(e.target.value)}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                >
                  {["Coorg", "Mysuru", "Ooty", "Munnar", "Chikmagalur", "Pondicherry", "Alleppey", "Tirupati", "Wayanad"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4 bg-white rounded-2xl p-2.5 border border-slate-300 shadow-sm">
                <span className="block text-[10px] font-bold text-slate-400 uppercase">Duration</span>
                <select
                  value={pkgDuration}
                  onChange={(e) => setPkgDuration(e.target.value)}
                  className="w-full font-bold text-slate-900 text-xs bg-transparent focus:outline-none"
                >
                  {["1 Day Tour", "2 Days · 1 Night", "3 Days · 2 Nights", "4 Days · 3 Nights", "5 Days · 4 Nights"].map((dur) => (
                    <option key={dur} value={dur}>
                      {dur}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4 bg-white rounded-2xl p-2 border border-slate-300 shadow-sm flex items-center gap-2">
                <div className="flex-1">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Travel Date</span>
                  <input
                    type="date"
                    value={pkgDate}
                    onChange={(e) => setPkgDate(e.target.value)}
                    className="w-full font-semibold text-slate-900 text-xs bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl text-xs hover:bg-purple-700 shadow"
                >
                  Search Packages
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
