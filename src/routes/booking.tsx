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
  User,
  Phone,
  Mail,
  Users,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatCurrency, formatDate, generateTicketNumber, generatePNR } from "@/lib/booking-utils";
import { buildWhatsAppUrl } from "@/lib/contact";
import { MultiServiceTypeCards, ServiceType } from "@/components/booking/MultiServiceTypeCards";
import { CabBookingForm } from "@/components/booking/CabBookingForm";
import { TrainBookingForm } from "@/components/booking/TrainBookingForm";
import { BusBookingForm } from "@/components/booking/BusBookingForm";
import { FlightBookingForm } from "@/components/booking/FlightBookingForm";
import { TourBookingForm } from "@/components/booking/TourBookingForm";
import { calculateCabFare, FareCalculationResult } from "@/lib/fare-engine";
import { downloadTicketCopyPDF } from "@/lib/ticket-copy-pdf";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Journey — Fortune Tourism" },
      {
        name: "description",
        content:
          "Book cabs, trains, buses, flights or tour packages with instant ticket copy download. Professional South India travel booking by Fortune Tourism.",
      },
    ],
  }),
  component: BookingPage,
});

const SERVICE_LABELS: Record<ServiceType, string> = {
  CAB: "Cab Booking",
  TRAIN: "Train Booking",
  BUS: "Bus Booking",
  FLIGHT: "Flight Booking",
  TOUR: "Tour Package",
};

const SERVICE_TO_TOUR_TYPE: Record<ServiceType, string> = {
  CAB: "LOCAL / OUTSTATION CAB",
  TRAIN: "TRAIN JOURNEY",
  BUS: "BUS TRAVEL",
  FLIGHT: "FLIGHT BOOKING",
  TOUR: "HOLIDAY TOUR PACKAGE",
};

const VEHICLE_NAMES: Record<string, string> = {
  hatchback: "Hatchback (Swift / Tiago / WagonR)",
  sedan: "MARUTI SUZUKI CIAZ / SEDAN",
  suv: "Maruti Ertiga / Carens (6 Seater)",
  innova: "Toyota Innova Crysta (7 Seater)",
  tempo: "Tempo Traveller (12–17 Seater)",
};

function BookingPage() {
  // Step 0: Client & Journey Details, Step 1: Payment, Step 2: Official Ticket Copy Voucher
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [ticketNumber, setTicketNumber] = useState(() => generateTicketNumber());
  const [pnrNumber, setPnrNumber] = useState(() => generatePNR());
  const [upiCopied, setUpiCopied] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    adults: 2,
    children: 0,
    infants: 0,
    pickup: "",
    destination: "",
    date: "",
    time: "10:45",
    notes: "",
    trip_type: "Local",
    vehicle_slug: "sedan",
    local_package: "4hr_40km",
    advance_option: 100, // 100 or 0
    utr_ref: "",
    // Cab
    airport_type: "Airport Drop",
    sightseeing_package: "Bangalore Sightseeing",
    itinerary_places: ["Bangalore", "Mysore Palace", "Chamundi Hills", "Return to Bangalore"],
    // Train
    from_station: "",
    to_station: "",
    travel_class: "3A",
    quota: "General",
    // Bus
    from_location: "",
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<any>(null);
  const [fareResult, setFareResult] = useState<FareCalculationResult>(() =>
    calculateCabFare({ vehicleSlug: "sedan", tripType: "Local", localPackage: "4hr_40km", advanceAmount: 100 })
  );

  const onChange = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const n = { ...prev };
      delete n[field];
      return n;
    });
  }, []);

  // Today's date automatically in DD-MM-YYYY
  const todayFormatted = useMemo(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  // Format departure date & time e.g. "14-07-2026.10.45"
  const departureFormatted = useMemo(() => {
    if (!formData.date) return todayFormatted + ".10.45";
    const [y, m, d] = formData.date.split("-");
    const timeStr = formData.time ? formData.time.replace(":", ".") : "10.45";
    return `${d}-${m}-${y}.${timeStr}`;
  }, [formData.date, formData.time, todayFormatted]);

  // Derived Pickup & Drop points
  const fromLocation =
    formData.pickup ||
    formData.from_location ||
    formData.from_station ||
    formData.from_airport ||
    "BANGALORE";

  const toLocation =
    formData.destination ||
    formData.to_station ||
    formData.to_airport ||
    "BANGALORE";

  const vehicleOrTravelMode = useMemo(() => {
    if (serviceType === "CAB") {
      return VEHICLE_NAMES[formData.vehicle_slug] || "MARUTI SUZUKI CIAZ / SEDAN";
    }
    if (serviceType === "TRAIN") {
      return `TRAIN (${formData.travel_class || "3A"}) ${formData.preferred_train || ""}`.trim();
    }
    if (serviceType === "BUS") {
      return `${formData.bus_type || "AC SLEEPER"} ${formData.preferred_operator || "BUS"}`.trim();
    }
    if (serviceType === "FLIGHT") {
      return `FLIGHT (${formData.cabin_class || "ECONOMY"})`;
    }
    if (serviceType === "TOUR") {
      return formData.package_title || "CUSTOM TOUR PACKAGE";
    }
    return "MARUTI SUZUKI CIAZ / SEDAN";
  }, [serviceType, formData]);

  const tourTypeDisplay = useMemo(() => {
    if (serviceType === "CAB") {
      return (formData.trip_type || "LOCAL TRIP").toUpperCase();
    }
    return serviceType ? SERVICE_TO_TOUR_TYPE[serviceType] : "LOCAL TRIP";
  }, [serviceType, formData.trip_type]);

  const tripTypeDisplay = useMemo(() => {
    if (formData.trip_type) return formData.trip_type.toUpperCase();
    if (formData.flight_trip_type) return formData.flight_trip_type.toUpperCase();
    if (formData.tour_trip_type) return formData.tour_trip_type.toUpperCase();
    return "PACKAGE";
  }, [formData]);

  const boardingPointDisplay = useMemo(() => {
    return (
      formData.boarding_point ||
      formData.pickup ||
      formData.from_airport ||
      formData.from_station ||
      "BANGALORE AIRPORT"
    ).toUpperCase();
  }, [formData]);

  const copyUPI = () => {
    navigator.clipboard.writeText("fortunetourism@okaxis");
    setUpiCopied(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setUpiCopied(false), 2000);
  };

  // Validate Step 0 (Journey details)
  const validateClientAndJourney = (): boolean => {
    if (!serviceType) {
      toast.error("Please select what you would like to book first.");
      return false;
    }

    const e: Record<string, string> = {};

    if (serviceType === "CAB") {
      if (formData.trip_type !== "Local") {
        if (!formData.date) e.date = "Travel date is required.";
        if (!formData.pickup?.trim()) e.pickup = "Pickup location is required.";
        if (!formData.destination?.trim()) e.destination = "Drop location is required.";
      }
    } else {
      if (!formData.date) e.date = "Travel date is required.";
    }

    if (serviceType === "TRAIN") {
      if (!formData.from_station?.trim()) e.from_station = "Departure station is required.";
      if (!formData.to_station?.trim()) e.to_station = "Destination station is required.";
    }
    if (serviceType === "BUS") {
      if (!formData.from_location?.trim()) e.from_location = "Boarding city is required.";
      if (!formData.destination?.trim()) e.destination = "Destination is required.";
    }
    if (serviceType === "FLIGHT") {
      if (!formData.from_airport?.trim()) e.from_airport = "Departure airport is required.";
      if (!formData.to_airport?.trim()) e.to_airport = "Destination airport is required.";
    }
    if (serviceType === "TOUR" && !formData.package_slug) {
      e.package_slug = "Please select a tour package.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGoToPayment = () => {
    if (validateClientAndJourney()) {
      setStep(1);
      window.scrollTo({ top: 80, behavior: "smooth" });
    } else {
      toast.error("Please fill required client and journey details.");
    }
  };

  const handleConfirmAndGenerateTicket = async () => {
    setIsSubmitting(true);

    try {
      const serviceToCategory: Record<ServiceType, string> = {
        CAB: "Taxi",
        TRAIN: "Train",
        BUS: "Bus Booking",
        FLIGHT: "Flight",
        TOUR: "Tour Package",
      };

      const payload: Record<string, any> = {
        name: formData.name || "FORTUNE GROUP",
        phone: (formData.phone || "9845003000").replace(/\s+/g, ""),
        email: formData.email || null,
        service: serviceToCategory[serviceType],
        booking_type: serviceType,
        pickup: fromLocation,
        destination: toLocation,
        date: formData.date,
        time: formData.time || null,
        passengers: String(Number(formData.adults || 1) + Number(formData.children || 0)),
        trip_type: tripTypeDisplay,
        car_type: vehicleOrTravelMode,
        train_class: formData.travel_class || null,
        train_preference: formData.preferred_train || null,
        bus_operator: formData.preferred_operator || null,
        bus_type: formData.bus_type || null,
        flight_number: null,
        return_date: formData.return_date || null,
        notes: [
          `Ticket No: ${ticketNumber}`,
          `PNR: ${pnrNumber}`,
          `Payment: ${formData.advance_option === 100 ? "₹100 Advance Paid" : "Zero Advance"}`,
          formData.utr_ref && `UTR: ${formData.utr_ref}`,
          formData.notes,
        ]
          .filter(Boolean)
          .join(" | "),
        client_token: `FT-BKG-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
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

      setBookingResult({
        ...data,
        booking_reference: data.booking_reference || ticketNumber,
        ticket_number: ticketNumber,
        pnr_number: pnrNumber,
      });

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
      departureOn: departureFormatted,
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

      <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* STEP 0 — Service Selection & Tailored Journey Form */}
          {step === 0 && (
            <div className="space-y-6">
              {/* Service Selection Cards */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <MultiServiceTypeCards
                  selectedService={serviceType}
                  onSelect={(type) => {
                    setServiceType(type);
                    setErrors({});
                  }}
                />
              </div>

              {/* Show Tailored Journey Form ONLY after clicking/selecting a service */}
              {serviceType && (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                      {SERVICE_LABELS[serviceType]}
                    </span>
                    <span className="text-slate-500 text-xs font-medium">Select Route & Travel Schedule</span>
                  </div>

                  {/* Journey Schedule Inputs */}
                  <div className="space-y-4">
                    {serviceType === "CAB" && (
                      <CabBookingForm
                        formData={formData}
                        onChange={onChange}
                        onFareCalculated={setFareResult}
                        errors={errors}
                      />
                    )}
                    {serviceType === "TRAIN" && (
                      <TrainBookingForm formData={formData} onChange={onChange} errors={errors} />
                    )}
                    {serviceType === "BUS" && (
                      <BusBookingForm formData={formData} onChange={onChange} errors={errors} />
                    )}
                    {serviceType === "FLIGHT" && (
                      <FlightBookingForm formData={formData} onChange={onChange} errors={errors} />
                    )}
                    {serviceType === "TOUR" && (
                      <TourBookingForm
                        formData={formData}
                        onChange={onChange}
                        onFareCalculated={setFareResult}
                        errors={errors}
                      />
                    )}
                  </div>

                  {/* Continue to Payment Button */}
                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleGoToPayment}
                      className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all text-sm"
                    >
                      Continue to Payment <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 1 — Payment Selection & UPI QR Screen */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-lg">Choose Payment Option</h2>
                      <p className="text-xs text-slate-500">Select advance token or pay later on travel</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Edit Route
                  </button>
                </div>

                {/* Payment Option Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => onChange("advance_option", 100)}
                    className={`p-5 rounded-2xl border text-left transition-all relative ${
                      formData.advance_option === 100
                        ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/40 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-base">⚡ Pay ₹100 Advance</span>
                      <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                        Priority Confirmation
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Instant vehicle & driver lock with booking confirmation ticket.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChange("advance_option", 0)}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      formData.advance_option === 0
                        ? "bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/40 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-slate-900 text-base">Zero Advance</span>
                      <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full">
                        Pay ₹0 Today
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Submit booking request now and pay total fare upon travel pickup.
                    </p>
                  </button>
                </div>

                {/* UPI QR & App Links when ₹100 is selected */}
                {formData.advance_option === 100 && (
                  <div className="bg-gradient-to-b from-amber-50/60 to-white border border-amber-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-600" />
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Pay ₹100 Token Advance via UPI
                      </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* QR Code */}
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

                      {/* UPI Details */}
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

                        {/* UPI App Links */}
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

                        {/* UTR Input */}
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            UTR / Transaction ID (Optional — enter after paying)
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

                {/* Confirm & Generate Ticket Button */}
                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Route
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmAndGenerateTicket}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all text-sm disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
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
            </div>
          )}

          {/* STEP 2 — Official Ticket Copy Voucher & Download Format (Generated After Client Fills Details & Confirms) */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Success & Actions Banner */}
              <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Booking Confirmed!
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
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shadow-md transition-all"
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
                      `Hello Fortune Tourism! I have booked my journey.\n\n*Ticket No:* ${ticketNumber}\n*PNR:* ${pnrNumber}\n*Passenger:* ${formData.name || "FORTUNE GROUP"}\n*Phone:* ${formData.phone || "9845003000"}\n*From:* ${fromLocation}\n*To:* ${toLocation}\n*Date:* ${departureFormatted}\n*Service:* ${SERVICE_LABELS[serviceType]}\n\nPlease confirm driver and vehicle assignment.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
                  >
                    <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                  </a>
                </div>
              </div>

              {/* TICKET COPY VOUCHER CONTAINER (Exact Spreadsheet Format from Image) */}
              <div className="ticket-copy-print-area bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-md space-y-4">
                {/* Header Lines */}
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
                          {departureFormatted}
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
                    setTicketNumber(generateTicketNumber());
                    setPnrNumber(generatePNR());
                    setFormData({
                      name: "",
                      phone: "",
                      email: "",
                      adults: 2,
                      pickup: "",
                      destination: "",
                      date: "",
                      time: "10:45",
                      notes: "",
                      trip_type: "Local",
                      vehicle_slug: "sedan",
                    });
                    setBookingResult(null);
                  }}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                >
                  Book Another Journey
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl shadow-md transition-all text-xs"
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
