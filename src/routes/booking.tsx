import { useState, useCallback, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User,
  CheckCircle2,
  Shield,
  ArrowLeft,
  ArrowRight,
  FileText,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  Users,
  MapPin,
  Sparkles,
  Download,
  Home,
  IndianRupee,
  Zap,
  Copy,
  Check,
  QrCode,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatCurrency, formatDate } from "@/lib/booking-utils";
import { buildWhatsAppUrl } from "@/lib/contact";
import { MultiServiceTypeCards, ServiceType } from "@/components/booking/MultiServiceTypeCards";
import { CabBookingForm } from "@/components/booking/CabBookingForm";
import { TrainBookingForm } from "@/components/booking/TrainBookingForm";
import { BusBookingForm } from "@/components/booking/BusBookingForm";
import { FlightBookingForm } from "@/components/booking/FlightBookingForm";
import { TourBookingForm } from "@/components/booking/TourBookingForm";
import { LiveFareSummaryCard } from "@/components/booking/LiveFareSummaryCard";
import { calculateCabFare, FareCalculationResult } from "@/lib/fare-engine";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Trip — Fortune Tourism" },
      {
        name: "description",
        content:
          "Book cabs, trains, buses, flights or tour packages with transparent live fare calculation. Professional South India travel booking by Fortune Tourism.",
      },
    ],
  }),
  component: BookingPage,
});

const STEPS = [
  { id: 0, label: "Service" },
  { id: 1, label: "Customer" },
  { id: 2, label: "Journey" },
  { id: 3, label: "Fare & Pay" },
  { id: 4, label: "Confirm" },
];

const SERVICE_LABELS: Record<ServiceType, string> = {
  CAB: "Cab Booking",
  TRAIN: "Train Booking",
  BUS: "Bus Booking",
  FLIGHT: "Flight Booking",
  TOUR: "Tour Package",
};

const STATUS_BY_SERVICE: Record<ServiceType, string> = {
  CAB: "PENDING CONFIRMATION",
  TRAIN: "BOOKING REQUESTED",
  BUS: "BOOKING REQUESTED",
  FLIGHT: "BOOKING REQUESTED",
  TOUR: "ENQUIRY RECEIVED",
};

function BookingPage() {
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>("CAB");
  const [formData, setFormData] = useState<any>({
    name: "",
    phone: "",
    email: "",
    adults: 2,
    children: 0,
    infants: 0,
    passengers: "2",
    pickup: "",
    destination: "",
    date: "",
    time: "",
    notes: "",
    trip_type: "Local",
    vehicle_slug: "sedan",
    local_package: "4hr_40km",
    advance_option: 100,
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
  const [upiCopied, setUpiCopied] = useState(false);
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

  const isCabOrTour = serviceType === "CAB" || serviceType === "TOUR";
  const isEstimatedQuote = !isCabOrTour;

  // Validate each step
  const validate = (s: number): boolean => {
    const e: Record<string, string> = {};

    if (s === 0 && !serviceType) {
      e.serviceType = "Please select a service type.";
    }

    if (s === 1) {
      if (!formData.name.trim()) e.name = "Full name is required.";
      if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone.replace(/\s+/g, ""))) {
        e.phone = "Enter a valid 10-digit Indian mobile number.";
      }
    }

    if (s === 2) {
      if (!formData.date) e.date = "Travel date is required.";
      if (serviceType === "CAB") {
        if (!formData.pickup?.trim()) e.pickup = "Pickup location is required.";
        if (!formData.destination?.trim()) e.destination = "Drop location is required.";
      }
      if (serviceType === "TRAIN") {
        if (!formData.from_station?.trim()) e.from_station = "Departure station is required.";
        if (!formData.to_station?.trim()) e.to_station = "Destination station is required.";
        if (!formData.travel_class) e.travel_class = "Select a travel class.";
      }
      if (serviceType === "BUS") {
        if (!formData.from_location?.trim()) e.from_location = "Boarding city is required.";
        if (!formData.destination?.trim()) e.destination = "Destination is required.";
      }
      if (serviceType === "FLIGHT") {
        if (!formData.from_airport) e.from_airport = "Departure airport is required.";
        if (!formData.to_airport) e.to_airport = "Destination airport is required.";
      }
      if (serviceType === "TOUR" && !formData.package_slug) {
        e.package_slug = "Please select a tour package.";
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (validate(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    if (!validate(3)) return;
    setIsSubmitting(true);

    try {
      const serviceToCategory: Record<ServiceType, string> = {
        CAB: "Taxi",
        TRAIN: "Train",
        BUS: "Bus Booking",
        FLIGHT: "Flight",
        TOUR: "Tour Package",
      };

      const passengers = formData.adult_passengers || formData.passengers || [];
      const passengerData = Array.isArray(passengers)
        ? passengers
        : [{ name: formData.name, age: "", gender: "" }];

      const fareSnapshot = isCabOrTour ? JSON.stringify(fareResult.snapshot) : null;
      const itinerary =
        formData.itinerary_places?.length
          ? formData.itinerary_places.join(" → ")
          : null;

      const payload: Record<string, any> = {
        name: formData.name,
        phone: formData.phone.replace(/\s+/g, ""),
        email: formData.email || null,
        service: serviceToCategory[serviceType],
        booking_type: serviceType,
        pickup: formData.pickup || formData.from_location || formData.from_station || formData.from_airport || null,
        destination: formData.destination || formData.to_station || formData.to_airport || null,
        date: formData.date,
        time: formData.time || null,
        passengers: String(Number(formData.adults || 1) + Number(formData.children || 0) + Number(formData.infants || 0)),
        trip_type: formData.trip_type || formData.flight_trip_type || formData.tour_trip_type || null,
        car_type: formData.vehicle_slug || null,
        train_class: formData.travel_class || null,
        train_preference: formData.preferred_train || null,
        bus_operator: formData.preferred_operator || null,
        bus_type: formData.bus_type || null,
        flight_number: null,
        return_date: formData.return_date || null,
        notes: [
          formData.notes,
          formData.package_title && `Package: ${formData.package_title}`,
          formData.hotel_tier && `Hotel: ${formData.hotel_tier}`,
          formData.cabin_class && `Cabin: ${formData.cabin_class}`,
          formData.quota && `Quota: ${formData.quota}`,
          formData.boarding_point && `Boarding: ${formData.boarding_point}`,
          itinerary && `Route: ${itinerary}`,
          fareSnapshot && `Fare Snapshot: ${fareSnapshot}`,
        ]
          .filter(Boolean)
          .join(" | ") || null,
        client_token: crypto.randomUUID(),
        advance_amount: formData.advance_option === 100 ? 100 : 0,
        payment_method: "UPI",
        payment_ref: formData.utr_ref || null,
        fare_breakdown: fareSnapshot,
        itinerary,
        package_title: formData.package_title || null,
        hotel_preference: formData.hotel_tier || null,
        adults_count: Number(formData.adults || 1),
        children_count: Number(formData.children || 0),
        infants_count: Number(formData.infants || 0),
        quota: formData.quota || null,
        berth_preference: null,
        cabin_class: formData.cabin_class || null,
        from_airport: formData.from_airport || null,
        to_airport: formData.to_airport || null,
        passenger_details: passengerData,
      };

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Submission failed. Please try again.");
      }

      const data = await res.json();
      setBookingResult({ ...data, service: serviceType, fareResult });
      setStep(4);
    } catch (err: any) {
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText("fortunetourism@okaxis").catch(() => {});
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 3000);
  };

  const whatsappMsg = `Hello Fortune Tourism! My Booking Ref: ${bookingResult?.booking_reference || bookingResult?.enquiry?.enquiry_number || ""} | Service: ${SERVICE_LABELS[serviceType]} | Date: ${formData.date}`;

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
        {/* Hero Header */}
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-bold mb-4">
            <Shield className="w-3.5 h-3.5" />
            Trusted by 10,000+ South India Travellers
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-2">
            Plan Your Journey
          </h1>
          <p className="text-slate-400 text-sm">
            Transparent pricing · Live fare calculation · Instant confirmation
          </p>
        </div>

        {/* Step Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-800 z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 z-0 transition-all duration-500"
              style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-1 z-10">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                    s.id < step
                      ? "bg-amber-500 border-amber-500 text-slate-950"
                      : s.id === step
                      ? "bg-slate-900 border-amber-500 text-amber-400"
                      : "bg-slate-900 border-slate-700 text-slate-500"
                  }`}
                >
                  {s.id < step ? <Check className="w-3.5 h-3.5" /> : s.id + 1}
                </div>
                <span className={`text-[10px] font-bold hidden sm:block ${s.id <= step ? "text-amber-400" : "text-slate-600"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* STEP 0 — Service Selection */}
          {step === 0 && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <MultiServiceTypeCards selectedService={serviceType} onSelect={setServiceType} />
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all"
                >
                  Continue with {SERVICE_LABELS[serviceType]} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 — Customer Details */}
          {step === 1 && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-black text-slate-100 text-lg">Your Details</h2>
                  <p className="text-xs text-slate-400">Contact information for booking confirmation</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => onChange("name", e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-amber-400" /> Mobile Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="10-digit Indian mobile number"
                    value={formData.phone}
                    onChange={(e) => onChange("phone", e.target.value)}
                    maxLength={10}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Optional — for PDF confirmation"
                    value={formData.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                {/* Passenger counts only for non-cab */}
                {serviceType !== "CAB" ? (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> Passengers
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { key: "adults", label: "Adults" },
                        { key: "children", label: "Children" },
                        { key: "infants", label: "Infants" },
                      ].map(({ key, label }) => (
                        <div key={key} className="bg-slate-950/60 border border-slate-800 rounded-xl p-2 text-center">
                          <div className="text-[11px] text-slate-400 mb-1">{label}</div>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onChange(key, Math.max(key === "adults" ? 1 : 0, Number(formData[key] || (key === "adults" ? 2 : 0)) - 1))}
                              className="w-6 h-6 rounded-lg bg-slate-800 text-slate-200 font-bold text-sm flex items-center justify-center"
                            >
                              −
                            </button>
                            <span className="w-5 text-center font-black text-slate-100 text-sm">
                              {formData[key] || (key === "adults" ? 2 : 0)}
                            </span>
                            <button
                              type="button"
                              onClick={() => onChange(key, Number(formData[key] || (key === "adults" ? 2 : 0)) + 1)}
                              className="w-6 h-6 rounded-lg bg-slate-800 text-slate-200 font-bold text-sm flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" /> Number of Passengers
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formData.adults || 2}
                      onChange={(e) => onChange("adults", e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-slate-400" /> Special Requirements / Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Any special requirements, requests or additional information..."
                  value={formData.notes}
                  onChange={(e) => onChange("notes", e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold text-sm px-4 py-2 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                  Continue to Journey Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Journey Details (Service-Specific Forms) */}
          {step === 2 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1">
                    {SERVICE_LABELS[serviceType]}
                  </div>
                  <span className="text-slate-400 text-sm">Journey Details</span>
                </div>

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

                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold text-sm px-4 py-2 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button type="button" onClick={nextStep} className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                    Review Booking & Fare <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Fare Sidebar */}
              <div className="xl:col-span-1">
                <LiveFareSummaryCard
                  fareResult={fareResult}
                  serviceType={serviceType}
                  advanceOption={formData.advance_option === 0 ? 0 : 100}
                  onAdvanceOptionChange={(opt) => onChange("advance_option", opt)}
                />
              </div>
            </div>
          )}

          {/* STEP 3 — Review & Payment */}
          {step === 3 && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="font-black text-slate-100 text-lg">Review Your Booking</h2>
                    <p className="text-xs text-slate-400">Confirm details before submitting</p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-amber-400" /> Customer
                    </div>
                    <div className="text-sm font-bold text-slate-100">{formData.name}</div>
                    <div className="text-xs text-slate-400">{formData.phone}</div>
                    {formData.email && <div className="text-xs text-slate-400">{formData.email}</div>}
                    <div className="text-xs text-slate-400">
                      {Number(formData.adults || 2)} Adults
                      {Number(formData.children || 0) > 0 && `, ${formData.children} Children`}
                      {Number(formData.infants || 0) > 0 && `, ${formData.infants} Infants`}
                    </div>
                  </div>

                  {/* Journey */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Journey
                    </div>
                    <div className="text-xs font-bold text-amber-400">{SERVICE_LABELS[serviceType]}</div>
                    {formData.date && (
                      <div className="text-xs text-slate-300 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formatDate(formData.date)}
                        {formData.time && ` · ${formData.time}`}
                      </div>
                    )}
                    <div className="text-xs text-slate-300">
                      {formData.from_location || formData.from_station || formData.from_airport || formData.pickup || "—"}
                      {(formData.destination || formData.to_station || formData.to_airport) && (
                        <> → {formData.destination || formData.to_station || formData.to_airport}</>
                      )}
                    </div>
                    {formData.trip_type && (
                      <div className="text-xs text-slate-500">{formData.trip_type}</div>
                    )}
                    {formData.package_title && (
                      <div className="text-xs font-semibold text-purple-400">📦 {formData.package_title}</div>
                    )}
                  </div>
                </div>

                {/* UPI Payment Section (when advance is ₹100) */}
                {formData.advance_option === 100 && (
                  <div className="bg-gradient-to-b from-amber-950/30 to-slate-950 border border-amber-500/30 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <div>
                        <h3 className="font-black text-amber-300">Pay ₹100 Token Advance — Instant Priority Confirmation</h3>
                        <p className="text-[11px] text-amber-200/70">Scan UPI QR below or use any UPI app to pay ₹100 now</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      {/* QR Code */}
                      <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0">
                        <div className="w-32 h-32 flex items-center justify-center">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=upi://pay?pa=fortunetourism@okaxis%26pn=Fortune%20Tourism%26am=100%26tn=Token%20Advance&size=128x128&format=png`}
                            alt="UPI QR Code"
                            className="w-full h-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="text-center text-[10px] font-bold text-slate-900 mt-1">Scan · Pay ₹100</div>
                      </div>

                      {/* UPI Details */}
                      <div className="flex-1 space-y-3">
                        <div className="bg-slate-950/80 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-slate-400 font-semibold">UPI ID</div>
                            <div className="font-black text-slate-100 text-sm">fortunetourism@okaxis</div>
                          </div>
                          <button
                            type="button"
                            onClick={copyUPI}
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
                          >
                            {upiCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {upiCopied ? "Copied!" : "Copy"}
                          </button>
                        </div>

                        {/* UPI App Links */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { name: "GPay", link: "tez://upi/pay?pa=fortunetourism@okaxis&pn=Fortune+Tourism&am=100&tn=Token+Advance" },
                            { name: "PhonePe", link: "phonepe://pay?pa=fortunetourism@okaxis&pn=Fortune+Tourism&am=100" },
                            { name: "Paytm", link: "paytmmp://upi/pay?pa=fortunetourism@okaxis&pn=Fortune+Tourism&am=100" },
                            { name: "Any UPI App", link: `upi://pay?pa=fortunetourism@okaxis&pn=Fortune%20Tourism&am=100&tn=Token%20Advance` },
                          ].map((app) => (
                            <a
                              key={app.name}
                              href={app.link}
                              className="text-xs font-bold text-slate-200 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-amber-500/50 hover:bg-slate-700 transition-all"
                            >
                              {app.name}
                            </a>
                          ))}
                        </div>

                        {/* UTR Input */}
                        <div>
                          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                            UTR / Transaction Reference (After payment — optional)
                          </label>
                          <input
                            type="text"
                            placeholder="Enter UPI transaction ID or UTR number"
                            value={formData.utr_ref || ""}
                            onChange={(e) => onChange("utr_ref", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Option Summary */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="font-semibold text-slate-300">Payment Option:</span>
                    <span className="font-black text-amber-400">
                      {formData.advance_option === 100 ? "₹100 Token Advance (Priority)" : "Zero Advance (Pay Later)"}
                    </span>
                  </div>
                  {!isEstimatedQuote && (
                    <>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-400">Total Booking Fare:</span>
                        <span className="font-black text-slate-100 text-lg">{formatCurrency(fareResult.totalFare)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Balance Payable on Travel:</span>
                        <span className="font-bold text-amber-300">
                          {formatCurrency(formData.advance_option === 100
                            ? Math.max(0, fareResult.totalFare - 100)
                            : fareResult.totalFare)}
                        </span>
                      </div>
                    </>
                  )}
                  {isEstimatedQuote && (
                    <p className="text-xs text-slate-400">Final fare will be confirmed by our team after checking availability.</p>
                  )}
                </div>

                <div className="flex justify-between pt-2 border-t border-slate-800">
                  <button type="button" onClick={prevStep} className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-semibold text-sm px-4 py-2 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <><span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" /> Processing...</>
                    ) : formData.advance_option === 100 ? (
                      <>Confirm & Submit Booking (₹100 Paid) <ArrowRight className="w-4 h-4" /></>
                    ) : (
                      <>Submit Booking (₹0 Due Today) <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>

              {/* Fare Summary Sidebar */}
              <div className="xl:col-span-1">
                <LiveFareSummaryCard
                  fareResult={fareResult}
                  serviceType={serviceType}
                  advanceOption={formData.advance_option === 0 ? 0 : 100}
                  onAdvanceOptionChange={(opt) => onChange("advance_option", opt)}
                />
              </div>
            </div>
          )}

          {/* STEP 4 — Confirmation */}
          {step === 4 && bookingResult && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl ${
                    formData.advance_option === 100
                      ? "bg-amber-500 shadow-amber-500/40"
                      : "bg-emerald-500 shadow-emerald-500/40"
                  }`}>
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-100">
                      {serviceType === "CAB" ? "Cab Booking Submitted!" :
                       serviceType === "TOUR" ? "Tour Package Enquiry Submitted!" :
                       "Booking Request Received!"}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {serviceType === "CAB"
                        ? "We will confirm your taxi availability and booking details shortly."
                        : serviceType === "TOUR"
                        ? "Our team will review your tour requirements and call you shortly."
                        : "Your travel request is received. Our team will arrange the booking and share details."}
                    </p>
                  </div>
                </div>

                {/* Reference Number */}
                <div className="bg-slate-950/80 border border-slate-700 rounded-2xl p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Reference</div>
                  <div className="text-3xl font-black text-amber-400 tracking-wider">
                    {bookingResult.booking_reference ||
                     bookingResult.enquiry?.enquiry_number ||
                     bookingResult.enquiry?.id?.toString().slice(-6) || "—"}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-left text-xs">
                    <div>
                      <div className="text-slate-500">Service</div>
                      <div className="font-bold text-slate-200">{SERVICE_LABELS[serviceType]}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Status</div>
                      <div className="font-bold text-amber-300">{STATUS_BY_SERVICE[serviceType]}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Customer</div>
                      <div className="font-bold text-slate-200">{formData.name}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Travel Date</div>
                      <div className="font-bold text-slate-200">{formatDate(formData.date)}</div>
                    </div>
                    {!isEstimatedQuote && (
                      <>
                        <div>
                          <div className="text-slate-500">Total Fare</div>
                          <div className="font-black text-amber-400 text-base">{formatCurrency(fareResult.totalFare)}</div>
                        </div>
                        <div>
                          <div className="text-slate-500">Balance Due</div>
                          <div className="font-black text-slate-200 text-base">
                            {formatCurrency(formData.advance_option === 100 ? Math.max(0, fareResult.totalFare - 100) : fareResult.totalFare)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {formData.advance_option === 100 && (
                    <div className="flex items-center justify-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-xl py-2 px-3 text-amber-400 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> ₹100 Token Advance Paid — Priority Dispatch Activated
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={buildWhatsAppUrl(whatsappMsg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Us
                  </a>
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-3 rounded-xl transition-all text-sm"
                  >
                    <Home className="w-4 h-4" /> Back to Home
                  </Link>
                </div>

                <p className="text-xs text-slate-500">
                  Save your Booking Reference for future queries. Our team will contact you on{" "}
                  <span className="text-slate-300 font-semibold">{formData.phone}</span> within 30 minutes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
