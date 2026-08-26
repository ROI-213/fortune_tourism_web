import { useState, useCallback, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Printer,
  Download,
  MessageCircle,
  Copy,
  Check,
  Zap,
  CreditCard,
  CheckCircle2,
  Car,
  TrainFront,
  Bus,
  Plane,
  Palmtree,
  User,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { generateTicketNumber, generatePNR } from "@/lib/booking-utils";
import { buildWhatsAppUrl } from "@/lib/contact";
import { downloadTicketCopyPDF } from "@/lib/ticket-copy-pdf";
import { MultiServiceTypeCards } from "@/components/booking/MultiServiceTypeCards";
import { CabSearchExplore, CabSearchData, AvailableCab } from "@/components/booking/CabSearchExplore";
import { TrainBookingForm } from "@/components/booking/TrainBookingForm";
import { BusBookingForm } from "@/components/booking/BusBookingForm";
import { FlightBookingForm } from "@/components/booking/FlightBookingForm";
import { TourBookingForm } from "@/components/booking/TourBookingForm";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Cabs, Trains, Buses & Flights — Fortune Tourism" },
      {
        name: "description",
        content:
          "Explore outstation, local hourly, and airport cabs with instant price comparison and official ticket copy download. South India's trusted travel partner.",
      },
    ],
  }),
  component: BookingPage,
});

type ServiceCategory = "CAB" | "TRAIN" | "BUS" | "FLIGHT" | "TOUR";

function BookingPage() {
  // Step 0: Search & Explore Vehicles / Services
  // Step 1: Passenger Details & Payment Selection
  // Step 2: Official Ticket Copy Voucher & PDF Download
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("CAB");
  const [step, setStep] = useState(0);

  const [selectedCab, setSelectedCab] = useState<AvailableCab | null>(null);
  const [selectedFuelType, setSelectedFuelType] = useState<string>("Diesel");
  const [hasLuggageCarrier, setHasLuggageCarrier] = useState<boolean>(false);
  const [cabSearchInfo, setCabSearchInfo] = useState<CabSearchData | null>(null);

  const [ticketNumber, setTicketNumber] = useState(() => generateTicketNumber());
  const [pnrNumber, setPnrNumber] = useState(() => generatePNR());
  const [upiCopied, setUpiCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for non-cab or passenger info
  const [formData, setFormData] = useState<any>({
    name: "FORTUNE GROUP",
    phone: "9845003000",
    email: "",
    pickup_address: "",
    adults: 2,
    children: 0,
    infants: 0,
    advance_option: 100, // 100 or 0
    utr_ref: "",
    notes: "",
    // Train
    from_station: "",
    to_station: "",
    date: "",
    time: "07:00",
    travel_class: "3A",
    quota: "General",
    // Bus
    from_location: "",
    destination: "",
    boarding_point: "",
    dropping_point: "",
    bus_type: "AC Sleeper",
    preferred_operator: "",
    // Flight
    flight_trip_type: "One Way",
    cabin_class: "Economy",
    from_airport: "",
    to_airport: "",
    return_date: "",
    // Tour
    package_slug: "",
    package_title: "",
    tour_trip_type: "Round Trip",
    hotel_tier: "Standard",
    number_of_days: 2,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const onChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  }, []);

  // When a user selects a cab in the Explore Cabs section
  const handleSelectCar = (
    cab: AvailableCab,
    search: CabSearchData,
    fuel: string,
    withLuggage: boolean
  ) => {
    setSelectedCab(cab);
    setCabSearchInfo(search);
    setSelectedFuelType(fuel);
    setHasLuggageCarrier(withLuggage);
    setStep(1);
    window.scrollTo({ top: 80, behavior: "smooth" });
  };

  // Today formatted as DD-MM-YYYY
  const todayFormatted = useMemo(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  // Format departure date
  const departureDateFormatted = useMemo(() => {
    const rawDate = cabSearchInfo?.pickupDate || formData.date || new Date().toISOString().split("T")[0];
    const [y, m, d] = rawDate.split("-");
    const rawTime = (cabSearchInfo?.pickupTime || formData.time || "07:00").replace(":", ".");
    return `${d}-${m}-${y}.${rawTime}`;
  }, [cabSearchInfo, formData.date, formData.time]);

  // Derived locations
  const fromLocation = useMemo(() => {
    if (activeCategory === "CAB" && cabSearchInfo) {
      if (cabSearchInfo.tab === "AIRPORT" && cabSearchInfo.airportTripType === "Pickup from Airport") {
        return cabSearchInfo.airportName.split(",")[0].toUpperCase();
      }
      return (cabSearchInfo.from || "BANGALORE").toUpperCase();
    }
    return (
      formData.pickup ||
      formData.from_location ||
      formData.from_station ||
      formData.from_airport ||
      "BANGALORE"
    ).toUpperCase();
  }, [activeCategory, cabSearchInfo, formData]);

  const toLocation = useMemo(() => {
    if (activeCategory === "CAB" && cabSearchInfo) {
      if (cabSearchInfo.tab === "LOCAL") {
        return cabSearchInfo.localPackage === "8hr_80km"
          ? "BANGALORE LOCAL (8 HRS / 80 KM)"
          : cabSearchInfo.localPackage === "12hr_120km"
          ? "BANGALORE LOCAL (12 HRS / 120 KM)"
          : "BANGALORE LOCAL (4 HRS / 40 KM)";
      }
      if (cabSearchInfo.tab === "AIRPORT" && cabSearchInfo.airportTripType === "Drop to Airport") {
        return cabSearchInfo.airportName.split(",")[0].toUpperCase();
      }
      return (cabSearchInfo.to || "MYSORE").toUpperCase();
    }
    return (
      formData.destination ||
      formData.to_station ||
      formData.to_airport ||
      "MYSORE"
    ).toUpperCase();
  }, [activeCategory, cabSearchInfo, formData]);

  const tourTypeDisplay = useMemo(() => {
    if (activeCategory === "CAB" && cabSearchInfo) {
      if (cabSearchInfo.tab === "LOCAL") {
        return cabSearchInfo.localPackage === "8hr_80km"
          ? "LOCAL (8 HRS / 80 KM)"
          : cabSearchInfo.localPackage === "12hr_120km"
          ? "LOCAL (12 HRS / 120 KM)"
          : "LOCAL (4 HRS / 40 KM)";
      }
      return cabSearchInfo.tab;
    }
    if (activeCategory === "TRAIN") return "TRAIN JOURNEY";
    if (activeCategory === "BUS") return "BUS TRAVEL";
    if (activeCategory === "FLIGHT") return "FLIGHT BOOKING";
    if (activeCategory === "TOUR") return "HOLIDAY TOUR PACKAGE";
    return "CAB JOURNEY";
  }, [activeCategory, cabSearchInfo]);

  const tripTypeDisplay = useMemo(() => {
    if (activeCategory === "CAB" && cabSearchInfo) {
      return cabSearchInfo.tab;
    }
    if (formData.trip_type) return formData.trip_type.toUpperCase();
    if (formData.flight_trip_type) return formData.flight_trip_type.toUpperCase();
    return "ONE WAY";
  }, [activeCategory, cabSearchInfo, formData]);

  const vehicleOrTravelMode = useMemo(() => {
    if (activeCategory === "CAB" && selectedCab) {
      return `${selectedCab.name.toUpperCase()} (${selectedFuelType})${hasLuggageCarrier ? " + CARRIER" : ""}`;
    }
    if (activeCategory === "TRAIN") return `TRAIN (${formData.travel_class || "3A"})`;
    if (activeCategory === "BUS") return `${formData.bus_type || "AC SLEEPER"} BUS`;
    if (activeCategory === "FLIGHT") return `FLIGHT (${formData.cabin_class || "ECONOMY"})`;
    if (activeCategory === "TOUR") return formData.package_title || "TOUR PACKAGE";
    return "MARUTI SUZUKI CIAZ / SEDAN";
  }, [activeCategory, selectedCab, selectedFuelType, hasLuggageCarrier, formData]);

  const boardingPointDisplay = useMemo(() => {
    return (
      formData.pickup_address ||
      fromLocation ||
      "BANGALORE"
    ).toUpperCase();
  }, [formData.pickup_address, fromLocation]);

  const copyUPI = () => {
    navigator.clipboard.writeText("fortunetourism@okaxis");
    setUpiCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setUpiCopied(false), 2000);
  };

  const validatePassengerDetails = () => {
    const e: Record<string, string> = {};
    if (!formData.name?.trim()) e.name = "Passenger name is required.";
    if (!formData.phone?.trim() || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ""))) {
      e.phone = "Enter a valid 10-digit mobile number.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit and Generate Ticket
  const handleConfirmAndGenerateTicket = async () => {
    if (!validatePassengerDetails()) {
      toast.error("Please enter passenger name and mobile number.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, any> = {
        name: formData.name || "FORTUNE GROUP",
        phone: (formData.phone || "9845003000").replace(/\s+/g, ""),
        email: formData.email || null,
        service: activeCategory === "CAB" ? "Taxi" : activeCategory,
        booking_type: activeCategory,
        pickup: fromLocation,
        destination: toLocation,
        date: cabSearchInfo?.pickupDate || formData.date || new Date().toISOString().split("T")[0],
        time: cabSearchInfo?.pickupTime || formData.time || "07:00",
        passengers: String(selectedCab?.seats || 4),
        trip_type: tripTypeDisplay,
        car_type: vehicleOrTravelMode,
        train_class: formData.travel_class || null,
        train_preference: formData.preferred_train || null,
        bus_operator: formData.preferred_operator || null,
        bus_type: formData.bus_type || null,
        flight_number: null,
        return_date: cabSearchInfo?.returnDate || formData.return_date || null,
        notes: [
          `Ticket No: ${ticketNumber}`,
          `PNR: ${pnrNumber}`,
          `Vehicle: ${vehicleOrTravelMode}`,
          `Fare: ₹${(selectedCab?.discountedPrice || 1783) + (hasLuggageCarrier ? 149 : 0)}`,
          `Payment: ${formData.advance_option === 100 ? "₹100 Advance Paid" : "Zero Advance"}`,
          formData.pickup_address && `Landmark: ${formData.pickup_address}`,
          formData.utr_ref && `UTR: ${formData.utr_ref}`,
          formData.notes,
        ]
          .filter(Boolean)
          .join(" | "),
        client_token: `FT-CAB-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || "Failed to submit booking.");
      }

      setStep(2);
      toast.success("Booking confirmed! Your official ticket copy is generated below.");
      window.scrollTo({ top: 80, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "An error occurred while confirming booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    downloadTicketCopyPDF({
      ticketNumber,
      pnrNumber,
      bookingDate: todayFormatted,
      passengerName: formData.name || "FORTUNE GROUP",
      passengerPhone: formData.phone || "9845003000",
      tourType: tourTypeDisplay,
      fromLocation,
      toLocation,
      departureOn: departureDateFormatted,
      tripType: tripTypeDisplay,
      vehicleOrMode: vehicleOrTravelMode,
      boardingPoint: boardingPointDisplay,
    });
    toast.success("Ticket PDF downloaded successfully!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <SiteLayout>
      {/* Printable CSS block for Ticket Copy */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body * {
            visibility: hidden !important;
          }
          .ticket-copy-print-area, .ticket-copy-print-area * {
            visibility: visible !important;
          }
          .ticket-copy-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-slate-50 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* STEP 0: Service Category Cards (What would you like to book?) */}
          {step === 0 && (
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <MultiServiceTypeCards
                selectedService={activeCategory}
                onSelect={(cat) => setActiveCategory(cat as ServiceCategory)}
              />
            </div>
          )}

          {/* STEP 0: CAB SEARCH & CAR EXPLORE SCREEN (When Cab Booking is active) */}
          {step === 0 && activeCategory === "CAB" && (
            <CabSearchExplore onSelectCar={handleSelectCar} />
          )}

          {/* OTHER SERVICES (Train, Bus, Flight, Tour) */}
          {step === 0 && activeCategory !== "CAB" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
                {activeCategory === "TRAIN" && "IRCTC Train Ticket Booking"}
                {activeCategory === "BUS" && "Bus Ticket Booking Assistance"}
                {activeCategory === "FLIGHT" && "Domestic & International Flight Booking"}
                {activeCategory === "TOUR" && "Holiday Tour Packages"}
              </h2>

              <div className="space-y-4">
                {activeCategory === "TRAIN" && (
                  <TrainBookingForm formData={formData} onChange={onChange} errors={errors} />
                )}
                {activeCategory === "BUS" && (
                  <BusBookingForm formData={formData} onChange={onChange} errors={errors} />
                )}
                {activeCategory === "FLIGHT" && (
                  <FlightBookingForm formData={formData} onChange={onChange} errors={errors} />
                )}
                {activeCategory === "TOUR" && (
                  <TourBookingForm formData={formData} onChange={onChange} errors={errors} />
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    window.scrollTo({ top: 80, behavior: "smooth" });
                  }}
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white font-black px-8 py-3 rounded-xl uppercase text-sm shadow-md transition-all"
                >
                  Continue to Booking →
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: PASSENGER DETAILS & PAYMENT (After clicking SELECT CAR) */}
          {step === 1 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-300">
              {/* Header & Back Button */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold">
                    <Car className="w-5 h-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-lg">
                      Passenger & Booking Details
                    </h2>
                    <p className="text-xs text-slate-500">
                      Enter passenger details and confirm your vehicle reservation
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Modify Selection
                </button>
              </div>

              {/* Selected Car & Route Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Selected Vehicle & Route
                  </div>
                  <div className="font-black text-slate-900 text-base sm:text-lg">
                    {selectedCab ? selectedCab.name : vehicleOrTravelMode} ({selectedFuelType})
                    {hasLuggageCarrier && " + Luggage Carrier"}
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {fromLocation} → {toLocation} · {departureDateFormatted} · {tripTypeDisplay}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs text-slate-500 font-medium">Total Fare</div>
                  <div className="text-2xl font-black text-[#00a2d2]">
                    ₹{((selectedCab?.discountedPrice || 1783) + (hasLuggageCarrier ? 149 : 0)).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Passenger Inputs */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-600" /> Passenger Information
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Passenger Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={formData.name}
                      onChange={(e) => onChange("name", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                    {errors.name && <p className="text-xs text-red-600 font-medium mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      value={formData.phone}
                      onChange={(e) => onChange("phone", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                    {errors.phone && <p className="text-xs text-red-600 font-medium mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Pickup Address / Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 302, Green Glen Layout, Bellandur"
                      value={formData.pickup_address}
                      onChange={(e) => onChange("pickup_address", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@example.com"
                      value={formData.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-600" /> Payment Preference
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => onChange("advance_option", 100)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.advance_option === 100
                        ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/40 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-900 text-sm sm:text-base">⚡ Pay ₹100 Advance</span>
                      <span className="bg-[#f97316] text-white font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Instant vehicle lock with priority driver dispatch.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange("advance_option", 0)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      formData.advance_option === 0
                        ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/40 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-slate-900 text-sm sm:text-base">Zero Advance</span>
                      <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Pay ₹0 Today
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Pay full amount directly upon boarding.
                    </p>
                  </button>
                </div>

                {/* UPI QR if ₹100 Advance is selected */}
                {formData.advance_option === 100 && (
                  <div className="bg-gradient-to-b from-amber-50/60 to-white border border-amber-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Pay ₹100 Token Advance via UPI
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0 text-center">
                        <div className="w-32 h-32 flex items-center justify-center mx-auto">
                          <img
                            src="https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=fortunetourism@okaxis%26pn=Fortune%20Tourism%26am=100%26tn=Token%20Advance&size=128x128&format=png"
                            alt="UPI QR Code"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="text-center text-[10px] font-bold text-slate-800 mt-1">Scan · Pay ₹100</div>
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between shadow-xs">
                          <div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase">UPI ID</div>
                            <div className="font-black text-slate-900 text-sm">fortunetourism@okaxis</div>
                          </div>
                          <button
                            type="button"
                            onClick={copyUPI}
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                          >
                            {upiCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            {upiCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "GPay", link: "tez://upi/pay?pa=fortunetourism@okaxis&pn=Fortune+Tourism&am=100&tn=Token+Advance" },
                            { name: "PhonePe", link: "phonepe://pay?pa=fortunetourism@okaxis&pn=Fortune+Tourism&am=100" },
                            { name: "Paytm", link: "paytmmp://upi/pay?pa=fortunetourism@okaxis&pn=Fortune+Tourism&am=100" },
                            { name: "Any UPI App", link: "upi://pay?pa=fortunetourism@okaxis&pn=Fortune%20Tourism&am=100&tn=Token%20Advance" },
                          ].map((app) => (
                            <a
                              key={app.name}
                              href={app.link}
                              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all shadow-xs"
                            >
                              {app.name}
                            </a>
                          ))}
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            UTR / Transaction ID (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. 423589124012"
                            value={formData.utr_ref || ""}
                            onChange={(e) => onChange("utr_ref", e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Confirm Button */}
              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Cars
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndGenerateTicket}
                  disabled={isSubmitting}
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white font-black px-8 py-3.5 rounded-xl uppercase tracking-wider text-sm shadow-md transition-all hover:scale-105 disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating Ticket...
                    </>
                  ) : (
                    <>
                      Confirm Booking & Generate Ticket <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: OFFICIAL TICKET COPY VOUCHER & PDF DOWNLOAD (Exact Spreadsheet Format) */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Success Banner */}
              <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Booking Confirmed Successfully!
                      </h2>
                      <p className="text-xs text-slate-500">
                        Your official Ticket Copy is generated below. You can download PDF or print it.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-black rounded-xl text-xs shadow-md transition-all"
                    >
                      <Download className="h-4 w-4" /> Download PDF Ticket
                    </button>

                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition-all"
                    >
                      <Printer className="h-4 w-4 text-amber-400" /> Print
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <span>
                      <strong className="text-slate-500 uppercase text-[10px]">Ticket No:</strong>{" "}
                      <span className="font-mono font-black text-amber-700 text-sm">{ticketNumber}</span>
                    </span>
                    <span>
                      <strong className="text-slate-500 uppercase text-[10px]">PNR:</strong>{" "}
                      <span className="font-mono font-black text-slate-900 text-sm">{pnrNumber}</span>
                    </span>
                  </div>

                  <a
                    href={buildWhatsAppUrl(
                      `Hello Fortune Tourism! I have booked my cab.\n\n*Ticket No:* ${ticketNumber}\n*PNR:* ${pnrNumber}\n*Passenger:* ${formData.name || "FORTUNE GROUP"}\n*Phone:* ${formData.phone || "9845003000"}\n*From:* ${fromLocation}\n*To:* ${toLocation}\n*Date:* ${departureDateFormatted}\n*Vehicle:* ${vehicleOrTravelMode}\n\nPlease confirm driver assignment.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* TICKET COPY VOUCHER CONTAINER (Exact Spreadsheet Layout) */}
              <div className="ticket-copy-print-area bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-md space-y-4">
                <div className="space-y-1 text-slate-900 font-sans text-xs">
                  <div className="text-slate-600 font-medium text-xs">
                    This copy For Passengers Who Travelling
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-1 font-bold text-sm">
                    <div className="text-slate-950 font-black tracking-wide text-base">
                      Ticket Copy For Your Journey
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      BOOKING DATE : <span className="font-extrabold text-slate-950">{todayFormatted}</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Table Grid (Exact 4-Row Spreadsheet Structure) */}
                <div className="overflow-x-auto border-2 border-slate-900">
                  <table className="w-full text-xs text-left border-collapse font-sans">
                    <tbody>
                      {/* Row 1: Passenger Name | Passenger Phone No. | Tour Type */}
                      <tr className="border-b border-slate-900 divide-x divide-slate-900">
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 w-36 whitespace-nowrap">
                          Passenger Name:
                        </td>
                        <td className="p-2.5 font-black text-slate-900 uppercase">
                          {formData.name || "FORTUNE GROUP"}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 w-40 whitespace-nowrap">
                          Passenger Phone No.:
                        </td>
                        <td className="p-2.5 font-bold text-slate-900">
                          {formData.phone || "9845003000"}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 w-28 whitespace-nowrap">
                          Tour Type
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 uppercase">
                          {tourTypeDisplay}
                        </td>
                      </tr>

                      {/* Row 2: FROM | TO */}
                      <tr className="border-b border-slate-900 divide-x divide-slate-900">
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          FROM
                        </td>
                        <td colSpan={2} className="p-2.5 font-black text-slate-900 uppercase">
                          {fromLocation}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          TO:
                        </td>
                        <td colSpan={2} className="p-2.5 font-black text-slate-900 uppercase">
                          {toLocation}
                        </td>
                      </tr>

                      {/* Row 3: Ticket Number | PNR Number | Departure On */}
                      <tr className="border-b border-slate-900 divide-x divide-slate-900">
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          Ticket Number:
                        </td>
                        <td className="p-2.5 font-black font-mono text-slate-900">
                          {ticketNumber}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          PNR Number:
                        </td>
                        <td className="p-2.5 font-black font-mono text-slate-900">
                          {pnrNumber}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          Departure On:
                        </td>
                        <td className="p-2.5 font-bold text-slate-900">
                          {departureDateFormatted}
                        </td>
                      </tr>

                      {/* Row 4: Trip Type | Type Of Car:/bus/Flight | Boarding point */}
                      <tr className="divide-x divide-slate-900">
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          Trip Type:
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 uppercase">
                          {tripTypeDisplay}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          Type Of Car:/bus/Flight
                        </td>
                        <td className="p-2.5 font-black text-slate-900 uppercase">
                          {vehicleOrTravelMode}
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 whitespace-nowrap">
                          Boarding point:
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 uppercase">
                          {boardingPointDisplay}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Terms and conditions footnote */}
                <div className="border border-slate-300 rounded-xl p-3 text-[11px] text-slate-600 space-y-1">
                  <div className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
                    Terms & Instructions
                  </div>
                  <div>1. Please carry this ticket copy / SMS during your journey.</div>
                  <div>2. Driver & vehicle assignment details will be shared prior to departure.</div>
                  <div>3. 24/7 Helpline & Support: +91 9740463404 | Fortune Tourism Bangalore.</div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(0);
                    setSelectedCab(null);
                    setCabSearchInfo(null);
                    setTicketNumber(generateTicketNumber());
                    setPnrNumber(generatePNR());
                    setFormData({
                      name: "FORTUNE GROUP",
                      phone: "9845003000",
                      email: "",
                      pickup_address: "",
                      adults: 2,
                    });
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Book Another Journey
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white font-black px-6 py-3 rounded-xl shadow-md transition-all text-xs"
                  >
                    <Download className="w-4 h-4" /> Download Ticket (PDF)
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs"
                  >
                    <Printer className="w-4 h-4 text-amber-400" /> Print Ticket Copy
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </SiteLayout>
  );
}
