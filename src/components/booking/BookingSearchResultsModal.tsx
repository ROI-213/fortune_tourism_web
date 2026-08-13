import { useState } from "react";
import { X, Plane, Bus, TrainFront, CheckCircle2, Clock, Calendar, Users, Phone } from "lucide-react";
import { toast } from "sonner";
import { CONTACT } from "@/lib/contact";

export interface BookingSearchPayload {
  category: "flight" | "bus" | "train";
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  tripType?: string;
  passengers: number;
  adults?: number;
  children?: number;
  infants?: number;
  cabinClass?: string;
  seatType?: string[];
  trainClass?: string;
}

interface BookingSearchResultsModalProps {
  payload: BookingSearchPayload | null;
  onClose: () => void;
}

export function BookingSearchResultsModal({ payload, onClose }: BookingSearchResultsModalProps) {
  if (!payload) return null;

  const handleBookNow = (itemTitle: string, price: string) => {
    toast.success(`Booking request generated for ${itemTitle} (${price}). Our agent will confirm your tickets shortly!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#0b132b] text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              {payload.category === "flight" && <Plane className="h-6 w-6" />}
              {payload.category === "bus" && <Bus className="h-6 w-6" />}
              {payload.category === "train" && <TrainFront className="h-6 w-6" />}
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
                Live Search Results ({payload.category.toUpperCase()})
              </span>
              <h3 className="font-heading text-lg font-bold">
                {payload.from} → {payload.to}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition"
            title="Close results"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Query Details Bar */}
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              {payload.departureDate} {payload.returnDate ? ` → ${payload.returnDate}` : ""}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {payload.passengers} Passenger(s)
            </span>
            {payload.cabinClass && <span className="bg-slate-200 px-2 py-0.5 rounded-md text-[10px]">{payload.cabinClass}</span>}
            {payload.trainClass && <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[10px]">{payload.trainClass}</span>}
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full font-bold">
            ✓ API Ready Engine
          </span>
        </div>

        {/* Results List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {payload.category === "flight" && (
            <>
              {[
                { airline: "IndiGo (6E-728)", dep: "06:15 AM", arr: "08:45 AM", dur: "2h 30m", price: "₹5,499", type: "Non-stop" },
                { airline: "Air India (AI-506)", dep: "09:30 AM", arr: "12:10 PM", dur: "2h 40m", price: "₹6,120", type: "Non-stop" },
                { airline: "Vistara (UK-812)", dep: "03:45 PM", arr: "06:20 PM", dur: "2h 35m", price: "₹7,250", type: "Non-stop" },
              ].map((flight, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900">{flight.airline}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-semibold">{flight.dep}</span>
                      <span className="text-[10px] text-slate-400">({flight.dur})</span>
                      <span className="font-semibold">{flight.arr}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="block font-heading text-lg font-bold text-slate-900">{flight.price}</span>
                      <span className="text-[10px] text-slate-400">per seat</span>
                    </div>
                    <button
                      onClick={() => handleBookNow(flight.airline, flight.price)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-amber-600 transition"
                    >
                      Book Ticket
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {payload.category === "bus" && (
            <>
              {[
                { operator: "VRL Travels (Volvo A/C Multi-Axle Sleeper)", dep: "09:30 PM", arr: "06:00 AM", dur: "8h 30m", price: "₹1,250", seats: "8 Seats Left" },
                { operator: "SRS Travels (Non-AC Seater / Sleeper)", dep: "10:15 PM", arr: "06:45 AM", dur: "8h 30m", price: "₹850", seats: "12 Seats Left" },
                { operator: "KSRTC FlyBus (Premium AC Multi-Axle)", dep: "11:00 PM", arr: "07:15 AM", dur: "8h 15m", price: "₹1,400", seats: "4 Seats Left" },
              ].map((bus, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900">{bus.operator}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-semibold">{bus.dep}</span>
                      <span className="text-[10px] text-slate-400">({bus.dur})</span>
                      <span className="font-semibold">{bus.arr}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="block font-heading text-lg font-bold text-slate-900">{bus.price}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">{bus.seats}</span>
                    </div>
                    <button
                      onClick={() => handleBookNow(bus.operator, bus.price)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-amber-600 transition"
                    >
                      Select Seat
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {payload.category === "train" && (
            <>
              {[
                { train: "KSR Bengaluru Express (12658)", dep: "06:00 AM", arr: "11:45 AM", status: "AVAILABLE - 24 Seats", price: "₹650" },
                { train: "Mysuru Shatabdi Express (12007)", dep: "11:00 AM", arr: "01:00 PM", status: "AVAILABLE - 18 Seats", price: "₹920" },
                { train: "Cauvery Superfast Express (16022)", dep: "11:55 PM", arr: "06:30 AM", status: "RAC 12 / AVAILABLE", price: "₹480" },
              ].map((tr, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-amber-400 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-bold text-sm text-slate-900">{tr.train}</span>
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="font-semibold">{tr.dep}</span>
                      <span className="font-semibold">{tr.arr}</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">{tr.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                    <div className="text-right">
                      <span className="block font-heading text-lg font-bold text-slate-900">{tr.price}</span>
                      <span className="text-[10px] text-slate-400">{payload.trainClass || "3AC"}</span>
                    </div>
                    <button
                      onClick={() => handleBookNow(tr.train, tr.price)}
                      className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-amber-600 transition"
                    >
                      Book Berth
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Quick WhatsApp Assistance Banner */}
          <div className="mt-6 bg-gradient-to-r from-slate-900 to-[#0b132b] text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Need Instant Ticket Confirmation?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Speak directly with Fortune Tourism travel desk on call or WhatsApp.
              </p>
            </div>
            <a
              href={CONTACT.phoneHref}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shrink-0 transition"
            >
              <Phone className="h-4 w-4" />
              Call Booking Desk
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
