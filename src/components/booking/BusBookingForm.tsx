import React from "react";
import { Bus, Calendar, AlertCircle, Plus, Trash2, Users } from "lucide-react";

interface BusPassenger { name: string; age: string; gender: string; }

interface BusBookingFormProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const BUS_TYPES = ["AC Sleeper", "Non-AC Sleeper", "AC Seater", "Non-AC Seater", "Volvo AC", "Other"];

export function BusBookingForm({ formData, onChange, errors }: BusBookingFormProps) {
  const passengers: BusPassenger[] = formData.passengers || [
    { name: "", age: "", gender: "Male" },
  ];

  const addPassenger = () =>
    onChange("passengers", [...passengers, { name: "", age: "", gender: "Male" }]);

  const removePassenger = (i: number) => {
    if (passengers.length <= 1) return;
    onChange("passengers", passengers.filter((_, idx) => idx !== i));
  };

  const updatePassenger = (i: number, field: keyof BusPassenger, val: string) => {
    onChange("passengers", passengers.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 bg-orange-500/10 border border-orange-500/30 rounded-2xl p-4">
        <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
        <div className="text-sm text-orange-200/90 leading-relaxed">
          <strong className="text-orange-300">Booking Assistance:</strong> Bus ticket fare &
          availability will be confirmed by our team. Final ticket & boarding pass will be
          shared after booking.
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Bus className="w-4 h-4 text-orange-400" /> Bus Journey Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">From (Boarding City) *</label>
            <input
              type="text"
              placeholder="e.g. Bengaluru — Majestic"
              value={formData.from_location || ""}
              onChange={(e) => onChange("from_location", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
            {errors.from_location && <p className="text-xs text-red-400 mt-1">{errors.from_location}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">To (Destination) *</label>
            <input
              type="text"
              placeholder="e.g. Hyderabad — Jubilee Bus Stand"
              value={formData.destination || ""}
              onChange={(e) => onChange("destination", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
            {errors.destination && <p className="text-xs text-red-400 mt-1">{errors.destination}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-400" /> Journey Date *
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
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Departure Time</label>
            <input
              type="time"
              value={formData.time || ""}
              onChange={(e) => onChange("time", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Bus Operator</label>
            <input
              type="text"
              placeholder="e.g. VRL / KSRTC / SRS / Any"
              value={formData.preferred_operator || ""}
              onChange={(e) => onChange("preferred_operator", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Bus Type */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2">Bus Type / Seat Preference</label>
          <div className="flex flex-wrap gap-2">
            {BUS_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange("bus_type", t)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-all ${
                  formData.bus_type === t
                    ? "bg-amber-500 text-slate-950 border-amber-400"
                    : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Boarding Point Preference</label>
            <input
              type="text"
              placeholder="e.g. Majestic / Shivajinagar"
              value={formData.boarding_point || ""}
              onChange={(e) => onChange("boarding_point", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Dropping Point Preference</label>
            <input
              type="text"
              placeholder="e.g. Jubilee Bus Stand / Hi-Tech City"
              value={formData.dropping_point || ""}
              onChange={(e) => onChange("dropping_point", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Passengers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" /> Passenger Details ({passengers.length})
          </h3>
          <button
            type="button"
            onClick={addPassenger}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Add Passenger
          </button>
        </div>

        {passengers.map((p, idx) => (
          <div key={idx} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400">Passenger {idx + 1}</span>
              {passengers.length > 1 && (
                <button type="button" onClick={() => removePassenger(idx)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={p.name}
                  onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Age</label>
                <input
                  type="number" min="1" max="120" placeholder="Age"
                  value={p.age}
                  onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gender</label>
                <select value={p.gender} onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500">
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
