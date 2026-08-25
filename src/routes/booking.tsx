import { useState, useCallback } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  User,
  CheckCircle2,
  Shield,
  ArrowLeft,
  ArrowRight,
  Route as RouteIcon,
  FileText,
  Calendar,
  MessageCircle,
  CreditCard,
  QrCode,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  IndianRupee,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatDateTime, formatCurrency } from "@/lib/booking-utils";
import { buildWhatsAppUrl } from "@/lib/contact";
import { BookingTypeCards } from "@/components/booking/BookingTypeCards";
import { BookingFormFields } from "@/components/booking/BookingFormFields";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book Your Trip — Fortune Tourism" },
      {
        name: "description",
        content:
          "Professional travel booking with Fortune Tourism. Book car rentals, tour packages, airport transfers and more across South India.",
      },
    ],
  }),
  component: BookingPage,
});

const STEPS = [
  { id: 0, label: "Booking Type", icon: RouteIcon },
  { id: 1, label: "Details", icon: User },
  { id: 2, label: "Review & Payment", icon: FileText },
  { id: 3, label: "Confirmation", icon: CheckCircle2 },
];

function BookingPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    booking_type: "",
    name: "",
    phone: "",
    email: "",
    passengers: "1",
    trip_type: "",
    car_type: "",
    pickup: "",
    destination: "",
    date: "",
    time: "",
    return_date: "",
    bus_operator: "",
    bus_type: "",
    train_preference: "",
    train_class: "",
    airline: "",
    cabin_class: "",
    notes: "",
  });
  
  // Payment states
  const [advanceOption, setAdvanceOption] = useState<"advance_100" | "zero_advance">("advance_100");
  const [paymentMethod, setPaymentMethod] = useState<string>("UPI_QR");
  const [paymentRef, setPaymentRef] = useState<string>("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [advancePaidAmount, setAdvancePaidAmount] = useState<number>(0);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [enquiryRef, setEnquiryRef] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const upiId = "fortunetourism@okaxis";

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    toast.success("UPI ID copied to clipboard!");
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const update = useCallback(
    (field: string, value: any) => {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    },
    [errors],
  );

  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = "Full name is required";
    if (!formData.phone?.trim()) errs.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, "").slice(-10)))
      errs.phone = "Enter a valid 10-digit Indian mobile number";
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Enter a valid email address";

    if (!formData.passengers) errs.passengers = "Number of passengers is required";
    if (!formData.date) errs.date = "Travel date is required";
    
    if (formData.booking_type === "FLIGHT" && formData.trip_type === "Round Trip" && !formData.return_date) {
      errs.return_date = "Return date is required";
    }

    if (!formData.pickup?.trim()) {
      if (formData.booking_type === "TRAIN") errs.pickup = "From Station is required";
      else if (formData.booking_type === "FLIGHT") errs.pickup = "From Airport is required";
      else errs.pickup = "Pickup location is required";
    }
    if (!formData.destination?.trim()) {
      if (formData.booking_type === "TRAIN") errs.destination = "To Station is required";
      else if (formData.booking_type === "FLIGHT") errs.destination = "To Airport is required";
      else errs.destination = "Destination is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !formData.booking_type) {
      toast.error("Please select a booking type");
      return;
    }
    if (step === 1 && !validateStep1()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmitEnquiry = async () => {
    setProcessingPayment(true);
    try {
      const serviceMap: Record<string, string> = {
        TAXI: "Taxi",
        BUS: "Bus Booking",
        TRAIN: "Train",
        FLIGHT: "Flight"
      };

      const isAdvance = advanceOption === "advance_100";
      const advanceAmount = isAdvance ? 100 : 0;

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: `+91 ${formData.phone}`,
          email: formData.email || null,
          service: serviceMap[formData.booking_type] || "Taxi",
          booking_type: formData.booking_type,
          pickup: formData.pickup || null,
          destination: formData.destination || null,
          date: formData.date || null,
          time: formData.time || null,
          passengers: String(formData.passengers),
          trip_type: formData.trip_type || null,
          car_type: formData.car_type || null,
          train_class: formData.train_class || null,
          train_preference: formData.train_preference || null,
          bus_operator: formData.bus_operator || null,
          bus_type: formData.bus_type || null,
          flight_number: formData.airline || null,
          notes: [
            formData.cabin_class ? `Cabin: ${formData.cabin_class}` : "",
            isAdvance ? `Paid ₹100 Advance via ${paymentMethod} (${paymentRef || "Instant Token"})` : "Zero Advance Booking",
            formData.notes
          ].filter(Boolean).join(" | ") || null,
          advance_amount: advanceAmount,
          payment_method: isAdvance ? paymentMethod : "NONE",
          payment_ref: isAdvance ? (paymentRef || `UPI-${Date.now().toString().slice(-6)}`) : null,
          client_token: typeof crypto !== "undefined" && "randomUUID" in crypto
              ? crypto.randomUUID()
              : `tok-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          return_date: formData.return_date || null
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to submit enquiry");

      setEnquiryRef(data.booking_reference || data.enquiry?.booking_reference || data.enquiry?.enquiry_number || String(data.enquiry?.id || ""));
      setAdvancePaidAmount(advanceAmount);
      setStep(3);
      toast.success(isAdvance ? "₹100 Advance Paid & Booking Submitted!" : "Enquiry submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Submission failed. Please try again.");
    } finally {
      setProcessingPayment(false);
    }
  };

  /* ──────────── CONFIRMATION VIEW (STEP 3) ──────────── */
  if (step === 3 && enquiryRef) {
    const isTaxi = formData.booking_type === "TAXI";
    
    return (
      <SiteLayout>
        <section className="py-8 md:py-16 bg-gradient-to-br from-emerald-50 via-white to-amber-50 min-h-screen">
          <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200 mb-4">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#0B1F3A] tracking-tight">
                {advancePaidAmount > 0 ? "Booking Confirmed with Advance!" : "Enquiry Submitted!"}
              </h1>
              <p className="text-slate-500 mt-2">
                {advancePaidAmount > 0 
                  ? "Your ₹100 token advance has been recorded. Our operations team is allocating your travel details."
                  : isTaxi 
                    ? "We will confirm your taxi availability and booking details."
                    : "Your travel request has been received. Our team will arrange the booking and share the confirmed ticket once available."}
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="relative bg-gradient-to-r from-[#0B1F3A] via-[#0D3B2A] to-[#0E6B50] p-6 md:p-8 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-2 right-2 w-32 h-32 border-2 border-white rounded-full" />
                  <div className="absolute bottom-2 left-2 w-20 h-20 border-2 border-white rounded-full" />
                </div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-emerald-200/80 text-xs uppercase tracking-wider font-semibold">
                      Fortune Tourism
                    </p>
                    <h2 className="font-heading text-xl md:text-2xl font-bold mt-1">
                      {advancePaidAmount > 0 ? "Advance Booking Receipt" : "Enquiry Confirmation"}
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1 mt-1 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-100 text-xs font-bold">
                    <CheckCircle2 className="h-3 w-3" /> {advancePaidAmount > 0 ? "Advance Paid" : "Received"}
                  </span>
                </div>
              </div>

              <div className="p-5 md:p-8 space-y-5">
                <div className="rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/60 p-6 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Your Booking Reference
                  </p>
                  <p className="mt-2 font-heading text-4xl font-bold tracking-[0.15em] text-[#0B1F3A]">
                    {enquiryRef}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Quote this reference in any communication with our team.
                  </p>
                </div>

                {/* Advance payment banner if paid */}
                {advancePaidAmount > 0 && (
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-100 uppercase tracking-wider font-semibold">Advance Received</p>
                        <p className="font-heading font-bold text-lg">₹100 Token Advance Paid</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur">
                      Priority Dispatch
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-blue-100">
                         <User className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                        Passenger
                      </span>
                    </div>
                    <p className="font-heading font-bold text-slate-900">{formData.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">+91 {formData.phone}</p>
                    <p className="text-xs text-slate-500">{formData.passengers} member(s)</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/30 border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 rounded-lg bg-emerald-100">
                        <RouteIcon className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">
                        Route
                      </span>
                    </div>
                    <p className="font-heading font-bold text-slate-900">
                      {formData.pickup || "—"} → {formData.destination || "—"}
                    </p>
                    {formData.trip_type && (
                      <p className="text-xs text-slate-500 mt-0.5">{formData.trip_type}</p>
                    )}
                  </div>
                </div>

                {formData.date && (
                  <div className="flex items-center justify-center gap-3 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-bold text-amber-900">
                      {formatDateTime(
                        formData.date + (formData.time ? `T${formData.time}:00` : ""),
                      )}
                    </span>
                  </div>
                )}

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 text-sm text-slate-600 space-y-1.5">
                  <p className="font-semibold text-slate-800">What happens next?</p>
                  <p>1. Our team reviews availability and prepares your final travel voucher.</p>
                  <p>2. Driver details / e-ticket will be shared on WhatsApp & email.</p>
                  <p>3. Balance amount can be paid before or at the time of boarding.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={buildWhatsAppUrl({
                      service: `Booking ${enquiryRef} - ${formData.booking_type}`,
                      pickup: formData.pickup,
                      date: formData.date,
                      name: formData.name,
                      phone: formData.phone,
                      notes: `Booking Ref: ${enquiryRef} | Advance: ${advancePaidAmount > 0 ? "₹100 Paid" : "Zero Advance"}`,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
                  </a>
                  <Link
                    to="/"
                    className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-[#0E6B50] transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="min-h-screen bg-gradient-to-br from-[#F8F2E7] via-white to-emerald-50/30">
        <div className="bg-gradient-to-r from-[#0B1F3A] to-[#0E6B50] text-white py-6 md:py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="p-2 rounded-xl bg-white/10 backdrop-blur">
                <Shield className="h-5 w-5 text-amber-400" />
              </span>
              <div>
                <p className="text-xs text-emerald-200/80 uppercase tracking-wider font-semibold">
                  Fortune Tourism
                </p>
                <h1 className="font-heading text-xl md:text-2xl font-bold">Plan Your Journey</h1>
              </div>
            </div>
            <p className="text-sm text-emerald-100/70 max-w-lg">
              Book chauffeur-driven taxis, bus tickets, train reservations, or flights with instant assistance.
            </p>
          </div>
        </div>

        {/* Wizard Progress Bar */}
        <div className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3.5">
            <div className="flex items-center justify-between gap-2">
              {STEPS.map((s, idx) => {
                const Icon = s.icon;
                const isActive = step === s.id;
                const isCompleted = step > s.id;
                return (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-emerald-500 text-white shadow-md"
                            : isActive
                              ? "bg-[#0B1F3A] text-white shadow-md ring-2 ring-[#0B1F3A]/20"
                              : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                      </div>
                      <span className={`text-[10px] font-bold hidden sm:block ${isActive ? "text-[#0B1F3A]" : "text-slate-400"}`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-emerald-400" : "bg-slate-200"}`} />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
          {step === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E6B50]">Step 1 of 3</p>
                <h2 className="mt-1 font-heading text-2xl md:text-3xl font-bold text-[#0B1F3A]">What are you booking for?</h2>
              </div>
              <BookingTypeCards 
                selectedType={formData.booking_type}
                onSelect={(type) => update("booking_type", type)}
              />
              <button
                onClick={handleNext}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#0E6B50] text-white font-heading font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
              >
                Continue to Details <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E6B50]">Step 2 of 3</p>
                <h2 className="mt-1 font-heading text-2xl md:text-3xl font-bold text-[#0B1F3A]">Customer & Journey Details</h2>
              </div>
              
              <BookingFormFields
                bookingType={formData.booking_type}
                formData={formData}
                onChange={update}
                errors={errors}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-400 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#0E6B50] text-white font-heading font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  Review & Payment Options <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0E6B50]">
                  Step 3 of 3
                </p>
                <h2 className="mt-1 font-heading text-2xl md:text-3xl font-bold text-[#0B1F3A]">
                  Review & Payment Options
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose your advance booking option and submit your travel request.
                </p>
              </div>

              {/* Trip Summary Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-xs text-slate-400">Name</p>
                      <p className="font-semibold text-slate-900">{formData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="font-semibold text-slate-900">+91 {formData.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="font-semibold text-slate-900">{formData.email || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Passengers</p>
                      <p className="font-semibold text-slate-900">{formData.passengers}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 pb-2 border-b">
                    Travel Details
                  </h3>
                  <div className="grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-xs text-slate-400">Service Type</p>
                      <p className="font-semibold text-slate-900">{formData.booking_type}</p>
                    </div>
                    {formData.trip_type && (
                      <div>
                        <p className="text-xs text-slate-400">Trip Type</p>
                        <p className="font-semibold text-slate-900">{formData.trip_type}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-slate-400">From</p>
                      <p className="font-semibold text-slate-900">{formData.pickup}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">To</p>
                      <p className="font-semibold text-slate-900">{formData.destination}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Date</p>
                      <p className="font-semibold text-slate-900">{formData.date}</p>
                    </div>
                    {formData.return_date && (
                      <div>
                        <p className="text-xs text-slate-400">Return Date</p>
                        <p className="font-semibold text-slate-900">{formData.return_date}</p>
                      </div>
                    )}
                    {formData.time && (
                      <div>
                        <p className="text-xs text-slate-400">Time</p>
                        <p className="font-semibold text-slate-900">{formData.time}</p>
                      </div>
                    )}
                  </div>
                  {formData.notes && (
                    <div className="mt-4">
                      <p className="text-xs text-slate-400">Notes / Requests</p>
                      <p className="font-medium text-sm text-slate-800 mt-1">{formData.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advance Payment Options (₹100 Advance vs Zero Advance) */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <h3 className="font-heading text-lg font-bold text-[#0B1F3A]">
                      Select Booking Advance Option
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose how you would like to confirm your booking reservation.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* OPTION 1: ₹100 Token Advance */}
                  <div
                    onClick={() => setAdvanceOption("advance_100")}
                    className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      advanceOption === "advance_100"
                        ? "border-[#0E6B50] bg-emerald-50/40 shadow-md ring-2 ring-[#0E6B50]/10"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <Zap className="h-3 w-3 text-emerald-600" /> RECOMMENDED
                      </span>
                    </div>

                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                          advanceOption === "advance_100"
                            ? "border-[#0E6B50] bg-[#0E6B50]"
                            : "border-slate-300"
                        }`}
                      >
                        {advanceOption === "advance_100" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-slate-900 text-base">
                          Pay ₹100 Token Advance
                        </p>
                        <p className="text-xs text-[#0E6B50] font-semibold mt-0.5">
                          Instant Priority Confirmation
                        </p>
                        <ul className="text-xs text-slate-500 mt-2 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            Guaranteed cab/seat reservation lock
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            Deducted from final total journey cost
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            100% refundable on cancellation
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* OPTION 2: Zero Advance */}
                  <div
                    onClick={() => setAdvanceOption("zero_advance")}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                      advanceOption === "zero_advance"
                        ? "border-[#0B1F3A] bg-slate-50/70 shadow-md ring-2 ring-[#0B1F3A]/10"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                          advanceOption === "zero_advance"
                            ? "border-[#0B1F3A] bg-[#0B1F3A]"
                            : "border-slate-300"
                        }`}
                      >
                        {advanceOption === "zero_advance" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-heading font-bold text-slate-900 text-base">
                          Zero Advance (Pay Later)
                        </p>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          ₹0 Due Today
                        </p>
                        <ul className="text-xs text-slate-500 mt-2 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                            Submit request for price quote & itinerary
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                            Pay remaining balance before trip departure
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                            Confirmation subject to final seat availability
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ₹100 Payment Gateway / UPI QR Section (shown when ₹100 selected) */}
                {advanceOption === "advance_100" && (
                  <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 p-5 md:p-6 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                      <div>
                        <p className="text-xs uppercase tracking-wider font-bold text-emerald-800">
                          Token Advance Amount
                        </p>
                        <p className="font-heading text-2xl font-bold text-[#0E6B50]">
                          ₹100 <span className="text-xs font-normal text-slate-500">only</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Secure Payment
                        </span>
                      </div>
                    </div>

                    {/* UPI Apps / Methods */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                        Choose Payment Method
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: "UPI_QR", label: "Scan UPI QR", icon: QrCode },
                          { id: "GPAY", label: "Google Pay", icon: CreditCard },
                          { id: "PHONEPE", label: "PhonePe", icon: CreditCard },
                          { id: "PAYTM", label: "Paytm / UPI", icon: CreditCard },
                        ].map((m) => {
                          const Icon = m.icon;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setPaymentMethod(m.id)}
                              className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                                paymentMethod === m.id
                                  ? "border-[#0E6B50] bg-emerald-600 text-white shadow-sm"
                                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* QR Code & UPI Details Box */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                      <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm flex-shrink-0 text-center">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi%3A%2F%2Fpay%3Fpa%3Dfortunetourism%40okaxis%26pn%3DFortune%2520Tourism%26am%3D100%26cu%3DINR%26tn%3DToken%2520Advance"
                          alt="Scan & Pay ₹100 UPI QR"
                          className="w-28 h-28 mx-auto"
                        />
                        <span className="text-[10px] text-slate-400 mt-1 block">Scan with any UPI App</span>
                      </div>

                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <p className="text-xs font-semibold text-slate-700">
                          Scan the QR code or pay to official Fortune Tourism UPI:
                        </p>
                        
                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                          <span className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 border text-[#0B1F3A]">
                            {upiId}
                          </span>
                          <button
                            type="button"
                            onClick={copyUpiId}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                          >
                            {copiedUpi ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                            {copiedUpi ? "Copied" : "Copy"}
                          </button>
                        </div>

                        {/* Direct Pay Link for mobile devices */}
                        <div className="pt-1">
                          <a
                            href={`upi://pay?pa=${upiId}&pn=Fortune%20Tourism&am=100&cu=INR&tn=Token%20Booking`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                          >
                            <Zap className="h-3.5 w-3.5 text-emerald-600" /> Click here to open UPI App on Mobile
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Optional UTR reference input */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1">
                        UPI Reference / UTR Number <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 423987654321 or GPay Transaction ID"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0E6B50] bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={processingPayment}
                  className="flex-1 py-4 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-slate-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit Details
                </button>
                <button
                  onClick={handleSubmitEnquiry}
                  disabled={processingPayment}
                  className="flex-[2] py-4 px-6 rounded-2xl bg-gradient-to-r from-[#0B1F3A] to-[#0E6B50] text-white font-heading font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processingPayment ? (
                    "Processing..."
                  ) : advanceOption === "advance_100" ? (
                    <>
                      <IndianRupee className="h-5 w-5" /> Pay ₹100 & Confirm Booking
                    </>
                  ) : (
                    <>
                      Submit Enquiry (₹0 Due Now) <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
