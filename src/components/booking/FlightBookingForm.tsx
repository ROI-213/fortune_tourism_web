import React from "react";
import { Plane, Calendar, AlertCircle, Plus, Trash2 } from "lucide-react";

interface FlightPassenger {
  name: string;
  dob: string;
  gender: string;
  passport_number?: string;
  passport_expiry?: string;
  nationality?: string;
}

interface FlightBookingFormProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const CABIN_CLASSES = ["Economy", "Premium Economy", "Business", "First Class"];
const AIRPORTS = [
  "Kempegowda Int'l Airport (BLR), Bengaluru",
  "Chhatrapati Shivaji Int'l Airport (BOM), Mumbai",
  "Indira Gandhi Int'l Airport (DEL), Delhi",
  "Chennai Int'l Airport (MAA)",
  "Rajiv Gandhi Int'l Airport (HYD), Hyderabad",
  "Cochin Int'l Airport (COK)",
  "Mangaluru Int'l Airport (IXE)",
  "Mysuru Airport (MYQ)",
  "Other (specify in notes)",
];

export function FlightBookingForm({ formData, onChange, errors }: FlightBookingFormProps) {
  const tripType = formData.flight_trip_type || "One Way";
  const isInternational = Boolean(formData.is_international);

  const adults: FlightPassenger[] = formData.adult_passengers || [
    { name: "", dob: "", gender: "Male" },
  ];
  const children: FlightPassenger[] = formData.child_passengers || [];
  const infants: FlightPassenger[] = formData.infant_passengers || [];

  const addPassenger = (type: "adult" | "child" | "infant") => {
    const key = `${type}_passengers`;
    const arr = formData[key] || [];
    onChange(key, [...arr, { name: "", dob: "", gender: "Male" }]);
  };

  const removePassenger = (type: "adult" | "child" | "infant", idx: number) => {
    const key = `${type}_passengers`;
    const arr: FlightPassenger[] = formData[key] || [];
    if (type === "adult" && arr.length <= 1) return;
    onChange(key, arr.filter((_, i) => i !== idx));
  };

  const updatePassenger = (
    type: "adult" | "child" | "infant",
    idx: number,
    field: keyof FlightPassenger,
    val: string
  ) => {
    const key = `${type}_passengers`;
    const arr: FlightPassenger[] = formData[key] || [];
    onChange(key, arr.map((p, i) => (i === idx ? { ...p, [field]: val } : p)));
  };

  const PassengerBlock = ({
    type,
    passengers,
    label,
    minAge,
    maxAge,
    canAddMore = true,
  }: {
    type: "adult" | "child" | "infant";
    passengers: FlightPassenger[];
    label: string;
    minAge?: string;
    maxAge?: string;
    canAddMore?: boolean;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {label} ({passengers.length}){minAge && <span className="font-normal text-slate-500 ml-1">({minAge}–{maxAge} yrs)</span>}
        </span>
        {canAddMore && (
          <button
            type="button"
            onClick={() => addPassenger(type)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20"
          >
            <Plus className="w-3 h-3" /> Add {label}
          </button>
        )}
      </div>

      {passengers.map((p, idx) => (
        <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400">{label} {idx + 1}</span>
            {(type !== "adult" || passengers.length > 1) && (
              <button type="button" onClick={() => removePassenger(type, idx)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name *</label>
              <input
                type="text"
                placeholder="As in ID / Passport"
                value={p.name}
                onChange={(e) => updatePassenger(type, idx, "name", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Date of Birth</label>
              <input
                type="date"
                value={p.dob}
                onChange={(e) => updatePassenger(type, idx, "dob", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gender *</label>
              <select
                value={p.gender}
                onChange={(e) => updatePassenger(type, idx, "gender", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
              >
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
          </div>

          {isInternational && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/60">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Passport Number</label>
                <input
                  type="text"
                  placeholder="e.g. N1234567"
                  value={p.passport_number || ""}
                  onChange={(e) => updatePassenger(type, idx, "passport_number", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Passport Expiry</label>
                <input
                  type="date"
                  value={p.passport_expiry || ""}
                  onChange={(e) => updatePassenger(type, idx, "passport_expiry", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Nationality</label>
                <input
                  type="text"
                  placeholder="e.g. Indian"
                  value={p.nationality || ""}
                  onChange={(e) => updatePassenger(type, idx, "nationality", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-sky-500/10 border border-sky-500/30 rounded-2xl p-4">
        <AlertCircle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-sm text-sky-200/90 leading-relaxed">
          <strong className="text-sky-300">Flight Booking Assistance:</strong> Our team will
          search the best airfares and share flight options with pricing. Final booking
          confirmed upon payment.
        </div>
      </div>

      {/* Trip Type & International Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Trip Type *</label>
          <div className="flex gap-2">
            {["One Way", "Round Trip", "Multi City"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange("flight_trip_type", t)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all ${
                  tripType === t
                    ? "bg-amber-500 text-slate-950 border-amber-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 w-full">
            <input
              type="checkbox"
              checked={isInternational}
              onChange={(e) => onChange("is_international", e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
            <div>
              <div className="text-sm font-bold text-slate-200">International Flight</div>
              <div className="text-[11px] text-slate-400">Enable passport & visa fields</div>
            </div>
          </label>
        </div>
      </div>

      {/* Flight Details */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Plane className="w-4 h-4 text-sky-400" /> Flight Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">From Airport *</label>
            <select
              value={formData.from_airport || ""}
              onChange={(e) => onChange("from_airport", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Select Departure Airport --</option>
              {AIRPORTS.map((a) => <option key={a}>{a}</option>)}
            </select>
            {errors.from_airport && <p className="text-xs text-red-400 mt-1">{errors.from_airport}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">To Airport *</label>
            <select
              value={formData.to_airport || ""}
              onChange={(e) => onChange("to_airport", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Select Arrival Airport --</option>
              {AIRPORTS.map((a) => <option key={a}>{a}</option>)}
            </select>
            {errors.to_airport && <p className="text-xs text-red-400 mt-1">{errors.to_airport}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> Departure Date *
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={formData.date || ""}
              onChange={(e) => onChange("date", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
            {errors.date && <p className="text-xs text-red-400 mt-1">{errors.date}</p>}
          </div>
          {tripType === "Round Trip" && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Return Date</label>
              <input
                type="date"
                min={formData.date || new Date().toISOString().split("T")[0]}
                value={formData.return_date || ""}
                onChange={(e) => onChange("return_date", e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Departure Time</label>
            <select
              value={formData.preferred_time || ""}
              onChange={(e) => onChange("preferred_time", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Any Time --</option>
              <option>Early Morning (00:00–06:00)</option>
              <option>Morning (06:00–12:00)</option>
              <option>Afternoon (12:00–18:00)</option>
              <option>Evening / Night (18:00–24:00)</option>
            </select>
          </div>
        </div>

        {/* Cabin Class & Airline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-2">Cabin Class</label>
            <div className="grid grid-cols-2 gap-2">
              {CABIN_CLASSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange("cabin_class", c)}
                  className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                    (formData.cabin_class || "Economy") === c
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Airline (Optional)</label>
            <input
              type="text"
              placeholder="e.g. IndiGo / Air India / Any"
              value={formData.preferred_airline || ""}
              onChange={(e) => onChange("preferred_airline", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div className="space-y-5">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Passenger Details</h3>
        <PassengerBlock type="adult" passengers={adults} label="Adult" minAge="12" maxAge="100+" />
        <PassengerBlock type="child" passengers={children} label="Child" minAge="2" maxAge="11" />
        <PassengerBlock type="infant" passengers={infants} label="Infant" minAge="0" maxAge="2" canAddMore={infants.length < adults.length} />
      </div>
    </div>
  );
}
