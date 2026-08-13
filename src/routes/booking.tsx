import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plane, Bus, TrainFront, ShieldCheck, Clock, Award, PhoneCall, Sparkles, HelpCircle } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FlightBookingPanel } from "@/components/booking/FlightBookingPanel";
import { BusBookingPanel } from "@/components/booking/BusBookingPanel";
import { TrainBookingPanel } from "@/components/booking/TrainBookingPanel";
import { BookingSearchResultsModal, type BookingSearchPayload } from "@/components/booking/BookingSearchResultsModal";
import { CONTACT } from "@/lib/contact";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      {
        title: "Book Flights, Buses & Trains Online — Fortune Tourism",
      },
      {
        name: "description",
        content:
          "Fast, reliable online booking for domestic & international flights, intercity luxury buses, and IRCTC train tickets from Fortune Tourism Bengaluru.",
      },
    ],
  }),
  component: BookingPage,
});

function BookingPage() {
  const [activeCategory, setActiveCategory] = useState<"flight" | "bus" | "train">("flight");
  const [searchPayload, setSearchPayload] = useState<BookingSearchPayload | null>(null);

  return (
    <SiteLayout>
      {/* Page Hero Header */}
      <section className="bg-gradient-to-b from-[#f7f1e7] to-[#F8F2E7] py-12 md:py-16 border-b border-[#E8E1D5]">
        <div className="container-fortune space-y-4 text-center max-w-4xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D3B2A] px-4 py-1.5 text-xs font-semibold text-white shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Unified Travel Booking Desk
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#0D3B2A] tracking-tight">
            Book Flights, Buses & Train Tickets Online
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Search live fares, check seat availability, and book tickets instantly across India with Fortune Tourism.
          </p>

          {/* 3 Main Interactive Category Tabs (Specs Item 3) */}
          <div className="pt-6 max-w-3xl mx-auto">
            <div className="grid grid-cols-3 gap-3 p-2 bg-white/80 rounded-3xl border border-[#E8E1D5] shadow-lg backdrop-blur-md">
              {[
                {
                  key: "flight",
                  label: "Flight Booking",
                  icon: Plane,
                  badgeColor: "bg-sky-500 text-white",
                  accentColor: "text-sky-500",
                },
                {
                  key: "bus",
                  label: "Bus Booking",
                  icon: Bus,
                  badgeColor: "bg-orange-500 text-white",
                  accentColor: "text-orange-500",
                },
                {
                  key: "train",
                  label: "Train Booking",
                  icon: TrainFront,
                  badgeColor: "bg-amber-500 text-slate-950",
                  accentColor: "text-amber-500",
                },
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveCategory(tab.key as any)}
                    className={`py-3.5 px-3 md:px-6 rounded-2xl font-heading font-bold text-xs md:text-sm flex flex-col sm:flex-row items-center justify-center gap-2 transition-all duration-300 ${
                      isSelected
                        ? "bg-[#0b132b] text-white shadow-xl scale-[1.03] ring-2 ring-amber-400/50"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    <Icon className={`h-4 w-4 md:h-5 md:w-5 ${isSelected ? "text-amber-400" : tab.accentColor}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Booking Panel Area */}
      <section className="py-10 md:py-14 bg-[#F8F2E7]">
        <div className="container-fortune max-w-6xl">
          <div className="transition-all duration-300 animate-fadeIn">
            {activeCategory === "flight" && (
              <FlightBookingPanel onSearch={(payload) => setSearchPayload(payload)} />
            )}
            {activeCategory === "bus" && (
              <BusBookingPanel onSearch={(payload) => setSearchPayload(payload)} />
            )}
            {activeCategory === "train" && (
              <TrainBookingPanel onSearch={(payload) => setSearchPayload(payload)} />
            )}
          </div>

          {/* Trust Highlights Section */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: "Instant PNR & Confirmation", desc: "Verifiable ticket bookings issued directly." },
              { icon: Clock, title: "24 × 7 Customer Support", desc: "Instant phone & WhatsApp ticket assistance." },
              { icon: Award, title: "Zero Hidden Fees", desc: "Transparent fare pricing with written breakdown." },
              { icon: Sparkles, title: "Instant Refund Guarantee", desc: "Easy cancellation & quick refund processing." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-3xl bg-white border border-[#E8E1D5] shadow-sm flex items-start gap-3 hover:-translate-y-1 transition duration-200"
                >
                  <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-800 shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking FAQs */}
          <div className="mt-14 p-6 md:p-8 rounded-3xl bg-white border border-[#E8E1D5] shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <HelpCircle className="h-5 w-5 text-emerald-700" />
              <h3 className="font-heading text-xl font-bold text-slate-900">
                Frequently Asked Booking Questions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">How do I receive my e-ticket?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Your official e-ticket, PNR number, and seat details are instantly dispatched to your WhatsApp number and email after confirmation.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Can I book group train or flight tickets?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Yes, our dedicated travel desk handles group reservations for up to 50+ passengers with customized billing.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">What if my flight or train is delayed?</h4>
                <p className="text-slate-600 leading-relaxed">
                  We monitor live flight and train PNR status to update connected cab pickups automatically without delay fees.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">How does &ldquo;Use Current Location&rdquo; work?</h4>
                <p className="text-slate-600 leading-relaxed">
                  Clicking the current location button uses browser GPS to automatically find your nearest city or station for quick booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Search Results Modal */}
      <BookingSearchResultsModal
        payload={searchPayload}
        onClose={() => setSearchPayload(null)}
      />
    </SiteLayout>
  );
}
