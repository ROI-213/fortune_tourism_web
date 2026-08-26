import React, { useEffect } from "react";
import {
  Car,
  Navigation,
  Compass,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { LocationSearchInput } from "./LocationSearchInput";
import { DEFAULT_CAB_RATES, calculateCabFare, FareCalculationResult } from "@/lib/fare-engine";

interface CabBookingFormProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  onFareCalculated: (result: FareCalculationResult) => void;
  errors: Record<string, string>;
}

export function CabBookingForm({
  formData,
  onChange,
  onFareCalculated,
  errors,
}: CabBookingFormProps) {
  const tripType = formData.trip_type || "Local";
  const localPackage = formData.local_package || "4hr_40km";
  const vehicleSlug = formData.vehicle_slug || "sedan";
  const airportType = formData.airport_type || "Airport Drop";
  const sightseeingPkg = formData.sightseeing_package || "Bangalore Sightseeing";

  // Multi-destination places for Round Trip
  const itineraryPlaces: string[] = formData.itinerary_places || [
    "Bangalore",
    "Mysore Palace",
    "Chamundi Hills",
    "Return to Bangalore",
  ];

  const addItineraryPlace = () => {
    const updated = [...itineraryPlaces, "New Destination"];
    onChange("itinerary_places", updated);
  };

  const updateItineraryPlace = (index: number, val: string) => {
    const updated = [...itineraryPlaces];
    updated[index] = val;
    onChange("itinerary_places", updated);
  };

  const removeItineraryPlace = (index: number) => {
    if (itineraryPlaces.length <= 2) return;
    const updated = itineraryPlaces.filter((_, i) => i !== index);
    onChange("itinerary_places", updated);
  };

  // Recalculate fare whenever any cab parameter changes
  useEffect(() => {
    const result = calculateCabFare({
      vehicleSlug,
      tripType: tripType as any,
      localPackage: localPackage as any,
      airportType: airportType as any,
      sightseeingPackage: sightseeingPkg,
      estimatedKm: Number(formData.estimated_km || 0),
      extraHours: Number(formData.extra_hours || 0),
      days: Number(formData.number_of_days || 1),
      isNightTravel: Boolean(formData.is_night_travel),
      advanceAmount: formData.advance_option === 0 ? 0 : 100,
    });

    onFareCalculated(result);
  }, [
    tripType,
    localPackage,
    vehicleSlug,
    airportType,
    sightseeingPkg,
    formData.estimated_km,
    formData.extra_hours,
    formData.number_of_days,
    formData.is_night_travel,
    formData.advance_option,
  ]);

  return (
    <div className="space-y-6">
      {/* 1. Trip Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-amber-600" /> Trip Type *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { id: "Local", label: "Local Hourly" },
            { id: "Airport Transfer", label: "Airport Transfer" },
            { id: "Outstation", label: "Outstation Trip" },
            { id: "One Way", label: "One Way Drop" },
            { id: "Round Trip", label: "Multi-City Round" },
            { id: "Sightseeing", label: "Sightseeing" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange("trip_type", t.id)}
              className={`px-3 py-2.5 rounded-xl font-bold text-xs transition-all border text-center ${
                tripType === t.id
                  ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-extrabold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Trip Type-Specific Fields */}
      {/* LOCAL HOURLY PACKAGES */}
      {tripType === "Local" && (
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Select Local Rental Package *
          </label>
          <select
            value={localPackage}
            onChange={(e) => onChange("local_package", e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none shadow-xs cursor-pointer"
          >
            <option value="4hr_40km">4 Hours / 40 KM (Short City Errands)</option>
            <option value="8hr_80km">8 Hours / 80 KM (Full Day City Travel & Shopping)</option>
            <option value="12hr_120km">12 Hours / 120 KM (Extended Day Rental)</option>
          </select>
        </div>
      )}

      {/* AIRPORT TRANSFER */}
      {tripType === "Airport Transfer" && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["Airport Drop", "Airport Pickup"].map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChange("airport_type", mode)}
                className={`py-2 px-3 rounded-xl font-bold text-xs border text-center transition-all ${
                  airportType === mode
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {mode === "Airport Drop" ? "🚗 City → Airport Drop" : "✈️ Airport Pickup → City"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Airport
              </label>
              <select
                value={formData.airport_name || "Kempegowda Int'l Airport (BLR)"}
                onChange={(e) => onChange("airport_name", e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
              >
                <option>Kempegowda Int'l Airport (BLR), Bengaluru</option>
                <option>Mysuru Airport (MYQ)</option>
                <option>Mangaluru Int'l Airport (IXE)</option>
                <option>Chennai Int'l Airport (MAA)</option>
              </select>
            </div>

            {airportType === "Airport Pickup" ? (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Flight Number & Arrival Time (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 6E-204 · 04:30 PM"
                  value={formData.flight_arrival_info || ""}
                  onChange={(e) => onChange("flight_arrival_info", e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SIGHTSEEING PACKAGES */}
      {tripType === "Sightseeing" && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Sightseeing Circuit
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              "Bangalore Sightseeing",
              "Mysore Palace & Hills",
              "Coorg Heritage Tour",
              "Custom Sightseeing",
            ].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange("sightseeing_package", c)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                  sightseeingPkg === c
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-xs"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ROUND TRIP MULTI-DESTINATION BUILDER */}
      {tripType === "Round Trip" && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-600" /> Multi-Destination Itinerary Route
            </span>
            <button
              type="button"
              onClick={addItineraryPlace}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 bg-amber-100/70 px-2.5 py-1 rounded-lg border border-amber-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add Place
            </button>
          </div>

          <div className="space-y-2">
            {itineraryPlaces.map((place, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] font-extrabold text-slate-700 shrink-0">
                  {idx + 1}
                </div>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => updateItineraryPlace(idx, e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                />
                {itineraryPlaces.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeItineraryPlace(idx)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Visual Route Flow */}
          <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex flex-wrap items-center gap-1.5">
            <span className="font-bold text-slate-700">Route Flow:</span>
            {itineraryPlaces.map((p, idx) => (
              <React.Fragment key={idx}>
                <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-amber-800 font-semibold shadow-2xs">
                  {p}
                </span>
                {idx < itineraryPlaces.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* 3. Pickup & Drop Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup Location *
          </label>
          <LocationSearchInput
            value={formData.pickup || ""}
            onChange={(val) => onChange("pickup", val)}
            placeholder="e.g. Indiranagar, Bengaluru or Hotel Name"
            error={errors.pickup}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-red-600" /> Drop / Destination *
          </label>
          <LocationSearchInput
            value={formData.destination || ""}
            onChange={(val) => onChange("destination", val)}
            placeholder="e.g. Kempegowda Airport or Mysore Palace"
            error={errors.destination}
          />
        </div>
      </div>

      {/* 4. Travel Date, Return Date & Pickup Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
            <Calendar className="w-3.5 h-3.5 text-amber-600" /> Travel Date *
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.date || ""}
            onChange={(e) => onChange("date", e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
          {errors.date && <p className="text-xs text-red-600 font-medium mt-1">{errors.date}</p>}
        </div>

        {(tripType === "Round Trip" || tripType === "Outstation") && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" /> Return Date (If round trip)
            </label>
            <input
              type="date"
              min={formData.date || new Date().toISOString().split("T")[0]}
              value={formData.return_date || ""}
              onChange={(e) => onChange("return_date", e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> Pickup Time *
          </label>
          <input
            type="time"
            value={formData.time || "09:00"}
            onChange={(e) => onChange("time", e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
          />
        </div>
      </div>

      {/* 5. Select Vehicle Fleet */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Car className="w-3.5 h-3.5 text-amber-600" /> Select Vehicle Fleet *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { id: "hatchback", name: "Hatchback", desc: "Swift / WagonR (4 Seats)" },
            { id: "sedan", name: "Prime Sedan", desc: "Dzire / Etios (4 Seats)" },
            { id: "suv", name: "Ertiga / SUV", desc: "Maruti Ertiga (6 Seats)" },
            { id: "innova", name: "Innova Crysta", desc: "Innova Crysta (7 Seats)" },
            { id: "tempo", name: "Tempo Traveller", desc: "Force (12–17 Seats)" },
          ].map((v) => {
            const isSelected = (formData.vehicle_slug || "sedan") === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onChange("vehicle_slug", v.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-amber-500 text-slate-950 border-amber-500 shadow-sm ring-2 ring-amber-500/30 font-bold"
                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50"
                }`}
              >
                <div className="font-extrabold text-xs">{v.name}</div>
                <div className={`text-[10px] mt-0.5 ${isSelected ? "text-slate-950 font-semibold" : "text-slate-500"}`}>
                  {v.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
