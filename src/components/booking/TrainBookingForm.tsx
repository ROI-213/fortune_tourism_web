import React, { useState } from "react";
import {
  TrainFront,
  Calendar,
  Users,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from "lucide-react";

interface Passenger {
  name: string;
  age: string;
  gender: string;
  berth_preference: string;
}

interface TrainBookingFormProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

const CLASS_OPTIONS = ["1A", "2A", "3A", "3E", "SL", "CC", "2S", "Other"];
const QUOTA_OPTIONS = ["General", "Tatkal", "Ladies", "Senior Citizen", "Other"];
const BERTH_OPTIONS = ["Lower", "Middle", "Upper", "Side Lower", "Side Upper", "No Preference"];

export function TrainBookingForm({ formData, onChange, errors }: TrainBookingFormProps) {
  const passengers: Passenger[] = formData.passengers || [
    { name: "", age: "", gender: "Male", berth_preference: "No Preference" },
  ];

  const addPassenger = () => {
    onChange("passengers", [
      ...passengers,
      { name: "", age: "", gender: "Male", berth_preference: "No Preference" },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    onChange(
      "passengers",
      passengers.filter((_, i) => i !== index)
    );
  };

  const updatePassenger = (index: number, field: keyof Passenger, value: string) => {
    const updated = passengers.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    onChange("passengers", updated);
    onChange("passengers", updated);
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300">Booking Assistance Service:</strong> Our team
          will search IRCTC availability and confirm your train ticket. Final fare &amp; PNR
          will be shared after reservation.
        </div>
      </div>

      {/* Journey Details */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <TrainFront className="w-4 h-4 text-amber-400" /> Train Journey Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">From Station *</label>
            <input
              type="text"
              placeholder="e.g. Bangalore City (SBC)"
              value={formData.from_station || ""}
              onChange={(e) => onChange("from_station", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.from_station && <p className="text-xs text-red-400 mt-1">{errors.from_station}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">To Station *</label>
            <input
              type="text"
              placeholder="e.g. Chennai Central (MAS)"
              value={formData.to_station || ""}
              onChange={(e) => onChange("to_station", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.to_station && <p className="text-xs text-red-400 mt-1">{errors.to_station}</p>}
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
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Train</label>
            <input
              type="text"
              placeholder="e.g. Shatabdi / Rajdhani / Any"
              value={formData.preferred_train || ""}
              onChange={(e) => onChange("preferred_train", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Preferred Time</label>
            <input
              type="time"
              value={formData.time || ""}
              onChange={(e) => onChange("time", e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Class *</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CLASS_OPTIONS.map((cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() => onChange("travel_class", cls)}
                  className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                    formData.travel_class === cls
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
            {errors.travel_class && <p className="text-xs text-red-400 mt-1">{errors.travel_class}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Quota</label>
            <div className="grid grid-cols-3 gap-1.5">
              {QUOTA_OPTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => onChange("quota", q)}
                  className={`py-2 rounded-xl font-bold text-xs border transition-all ${
                    (formData.quota || "General") === q
                      ? "bg-amber-500 text-slate-950 border-amber-400"
                      : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Passenger Details */}
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

        <div className="space-y-3">
          {passengers.map((p, idx) => (
            <div
              key={idx}
              className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">Passenger {idx + 1}</span>
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="As per Aadhaar / ID"
                    value={p.name}
                    onChange={(e) => updatePassenger(idx, "name", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Age *</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Age"
                    value={p.age}
                    onChange={(e) => updatePassenger(idx, "age", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gender *</label>
                  <select
                    value={p.gender}
                    onChange={(e) => updatePassenger(idx, "gender", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Berth Preference</label>
                <div className="flex flex-wrap gap-1.5">
                  {BERTH_OPTIONS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updatePassenger(idx, "berth_preference", b)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                        p.berth_preference === b
                          ? "bg-amber-500 text-slate-950 border-amber-400"
                          : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
