import { useState, useCallback, useMemo } from "react";
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
  Home,
  Printer,
  Car,
  Clock,
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

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Trip — Fortune Tourism" },
      {
        name: "description",
        content:
          "Book cabs, trains, buses, flights or tour packages with instant ticket copy generation. Professional South India travel booking by Fortune Tourism.",
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
  // Step 0: Journey & Passenger Details, Step 1: Ticket Copy Voucher, Step 2: Confirmation
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType>("CAB");
  const [ticketNumber, setTicketNumber] = useState(() => generateTicketNumber());
  const [pnrNumber, setPnrNumber] = useState(() => generatePNR());

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
    time: "10:45",
    notes: "",
    trip_type: "Local",
    vehicle_slug: "sedan",
    local_package: "4hr_40km",
    advance_option: 0,
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
    calculateCabFare({ vehicleSlug: "sedan", tripType: "Local", localPackage: "4hr_40km", advanceAmount: 0 })
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
      return VEHICLE_NAMES[formData.vehicle_slug] || "MARUTI SUZUKI CIAZ";
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
    return "CAR / CAB";
  }, [serviceType, formData]);

  const tourTypeDisplay = useMemo(() => {
    if (serviceType === "CAB") {
      return (formData.trip_type || "LOCAL TRIP").toUpperCase();
    }
    return SERVICE_TO_TOUR_TYPE[serviceType];
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

  // Validation
  const validateForm = (): boolean => {
    const e: Record<string, string> = {};

    if (!formData.date) e.date = "Travel date is required.";

    if (serviceType === "CAB") {
      if (!formData.pickup?.trim()) e.pickup = "Pickup location is required.";
      if (!formData.destination?.trim()) e.destination = "Drop location is required.";
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

  const handleGoToTicket = () => {
    if (validateForm()) {
      setStep(1);
      window.scrollTo({ top: 100, behavior: "smooth" });
    } else {
      toast.error("Please fill all required fields before viewing Ticket Copy.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmitBooking = async () => {
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
        name: formData.name,
        phone: formData.phone.replace(/\s+/g, ""),
        email: formData.email || null,
        service: serviceToCategory[serviceType],
        booking_type: serviceType,
        pickup: fromLocation,
        destination: toLocation,
        date: formData.date,
        time: formData.time || null,
        passengers: String(Number(formData.adults || 1) + Number(formData.children || 0) + Number(formData.infants || 0)),
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
          `Boarding Point: ${boardingPointDisplay}`,
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
      toast.success("Booking registered successfully!");
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "An error occurred while confirming booking.");
    } finally {
      setIsSubmitting(false);
    }
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

          {/* STEP 0 — Service & Journey Details */}
          {step === 0 && (
            <div className="space-y-6">
              {/* Service Selection */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
                <MultiServiceTypeCards
                  selected={serviceType}
                  onSelect={(type) => {
                    setServiceType(type);
                    setErrors({});
                  }}
                />
              </div>

              {/* Journey Form */}
              <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                    {SERVICE_LABELS[serviceType]}
                  </span>
                  <span className="text-slate-500 text-xs font-medium">Select Pickup, Drop & Travel Schedule</span>
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

                {/* Special Notes */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-slate-500" /> Special Requirements / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any special requirements, landmark or additional information..."
                    value={formData.notes}
                    onChange={(e) => onChange("notes", e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none resize-none transition-all"
                  />
                </div>

                {/* Next Step Button */}
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleGoToTicket}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-7 py-3.5 rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all text-sm"
                  >
                    Generate Ticket Copy <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Official Ticket Copy For Your Journey (Matching Attached Spreadsheet Image) */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Action Toolbar */}
              <div className="no-print flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit Journey Details
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow transition-all"
                  >
                    <Printer className="h-4 w-4 text-amber-400" />
                    Print Ticket Copy
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitBooking}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow-md transition-all text-xs disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        Confirm & Register Booking <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* TICKET COPY VOUCHER CONTAINER */}
              <div className="ticket-copy-print-area bg-white border-2 border-slate-900 rounded-2xl p-6 shadow-md space-y-4">
                {/* Header Lines */}
                <div className="space-y-1 text-slate-900 font-sans text-xs">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center font-bold border-b border-slate-300 pb-2 gap-1">
                    <div>
                      Address: <span className="font-semibold">No.256/A next To Narayana Hospital, Health City, Bommasandra Bangalore.560099</span>
                    </div>
                    <div className="whitespace-nowrap font-bold text-slate-900">
                      Phone No: <span className="font-extrabold">+91 9740463404</span>
                    </div>
                  </div>

                  <div className="pt-2 text-slate-600 font-medium text-xs">
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
                        <td className="p-2.5">
                          <input
                            type="text"
                            placeholder="FORTUNE GROUP"
                            value={formData.name}
                            onChange={(e) => onChange("name", e.target.value)}
                            className="w-full font-black text-slate-900 uppercase bg-transparent outline-none border-b border-transparent focus:border-amber-500"
                          />
                        </td>
                        <td className="p-2.5 font-bold text-slate-900 bg-slate-50 w-40 whitespace-nowrap">
                          Passenger Phone No.:
                        </td>
                        <td className="p-2.5">
                          <input
                            type="text"
                            placeholder="9845003000"
                            value={formData.phone}
                            onChange={(e) => onChange("phone", e.target.value)}
                            className="w-full font-bold text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-amber-500"
                          />
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

              {/* Submit Button in Bottom Card */}
              <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-600">
                  Ready to confirm? Click submit to register your journey with Fortune Tourism.
                </div>
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      Submitting Booking...
                    </>
                  ) : (
                    <>
                      Confirm & Submit Booking <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Confirmation / Success */}
          {step === 2 && bookingResult && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 text-center shadow-lg">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900">
                      Booking Registered Successfully!
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      Your travel request has been received. Our team is arranging your booking.
                    </p>
                  </div>
                </div>

                {/* Reference Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Ticket Number
                      </div>
                      <div className="font-mono font-black text-amber-700 text-base">
                        {bookingResult.ticket_number || ticketNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        PNR Number
                      </div>
                      <div className="font-mono font-black text-slate-900 text-base">
                        {bookingResult.pnr_number || pnrNumber}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-700">
                    <span>Passenger: {formData.name}</span>
                    <span>Route: {fromLocation} → {toLocation}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      `Hello Fortune Tourism! I have booked my journey.\n\n*Ticket No:* ${ticketNumber}\n*PNR:* ${pnrNumber}\n*Passenger:* ${formData.name}\n*Phone:* ${formData.phone}\n*From:* ${fromLocation}\n*To:* ${toLocation}\n*Date:* ${departureFormatted}\n*Service:* ${SERVICE_LABELS[serviceType]}\n\nPlease confirm availability and driver assignment.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-xs"
                  >
                    <MessageCircle className="w-4 h-4" /> Share on WhatsApp
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                    }}
                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all text-xs"
                  >
                    <Printer className="w-4 h-4 text-amber-400" /> View & Print Ticket Copy
                  </button>

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
                    className="flex items-center justify-center gap-2 text-slate-700 hover:text-slate-900 font-bold px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-xs"
                  >
                    Book Another Trip
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
