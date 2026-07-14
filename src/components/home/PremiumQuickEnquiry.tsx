import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Car,
  MapPin,
  Map as MapIcon,
  Calendar,
  Users,
  User,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Compass,
  Clock,
} from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/site/Header";
import bgAsset from "@/assets/quick-enquiry/southindia-bg.jpg";
import thumbMysuru from "@/assets/pkg-mysuru-palace.jpg";
import thumbOoty from "@/assets/pkg-ooty-real.jpg";
import thumbAlleppey from "@/assets/pkg-alleppey-backwaters.jpg";
import thumbPondi from "@/assets/pkg-pondi-whitetown.jpg";

const SERVICES = [
  "Car Rental",
  "Tour Package",
  "Airport Transfer",
  "Outstation Travel",
  "Corporate Travel",
  "Group Travel",
  "Custom Tour",
] as const;

const DESTINATIONS_BY_STATE: Record<string, string[]> = {
  Karnataka: ["Mysuru", "Coorg", "Chikmagalur", "Hampi", "Gokarna"],
  "Tamil Nadu": ["Ooty", "Kodaikanal", "Chennai", "Mahabalipuram"],
  Kerala: ["Munnar", "Alleppey", "Thekkady", "Wayanad"],
  "Andhra Pradesh": ["Tirupati", "Araku Valley", "Srisailam"],
  Pondicherry: ["White Town", "Auroville", "Paradise Beach"],
};

const CHIP_SUGGESTIONS = [
  "Coorg",
  "Mysuru",
  "Ooty",
  "Munnar",
  "Pondicherry",
  "Wayanad",
  "Tirupati",
];

const THUMBS = [
  { label: "Mysuru Palace", src: thumbMysuru.url, dest: "Mysuru" },
  { label: "Ooty Hills", src: thumbOoty.url, dest: "Ooty" },
  { label: "Alleppey", src: thumbAlleppey.url, dest: "Alleppey" },
  { label: "Puducherry", src: thumbPondi.url, dest: "White Town, Puducherry" },
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().regex(/^[+0-9\s-]{7,15}$/, "Enter a valid phone number"),
  service: z.string().min(1, "Choose a service"),
  pickup: z.string().trim().min(1, "Pickup is required").max(80),
  destination: z.string().trim().min(1, "Destination is required").max(80),
  date: z.string().max(20).optional().or(z.literal("")),
  passengers: z.string().max(3).optional().or(z.literal("")),
  notes: z.string().max(400).optional().or(z.literal("")),
});

type FormState = z.infer<typeof schema>;

const initial: FormState = {
  name: "",
  phone: "",
  service: "Car Rental",
  pickup: "Bengaluru",
  destination: "",
  date: "",
  passengers: "",
  notes: "",
};

export function PremiumQuickEnquiry() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [destOpen, setDestOpen] = useState(false);

  const update = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setDestination = (d: string) => {
    setForm((f) => ({ ...f, destination: d }));
    setDestOpen(false);
  };

  const filteredDestinations = useMemo(() => {
    const q = form.destination.trim().toLowerCase();
    if (!q) return DESTINATIONS_BY_STATE;
    const filtered: Record<string, string[]> = {};
    for (const [state, list] of Object.entries(DESTINATIONS_BY_STATE)) {
      const matches = list.filter((d) => d.toLowerCase().includes(q));
      if (matches.length) filtered[state] = matches;
    }
    return filtered;
  }, [form.destination]);

  const submit = async (mode: "quote" | "whatsapp") => {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[issue.path[0] as string] = issue.message;
      setErrors(e);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "whatsapp") {
        const url = buildWhatsAppUrl({ ...parsed.data });
        window.open(url, "_blank", "noopener");
      } else {
        await new Promise((r) => setTimeout(r, 700));
        toast.success(
          "Thank you! Your travel request has been received. Our team will contact you shortly.",
        );
        setForm(initial);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-label="Plan your South India journey"
      className="premium-quick-enquiry relative overflow-hidden py-14 md:py-20"
    >
      {/* Background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgAsset})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,56,43,0.92), rgba(5,56,43,0.55) 55%, rgba(255,255,255,0.18))",
        }}
      />

      <div className="mx-auto grid w-[calc(100%-24px)] max-w-[1400px] gap-8 md:w-[calc(100%-40px)] md:grid-cols-[minmax(0,36fr)_minmax(0,64fr)] md:gap-10 lg:gap-14">
        {/* Left: Tourism panel */}
        <div className="flex flex-col justify-center text-white animate-fade-in">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f6d67a]/40 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f6d67a] backdrop-blur">
            <Compass className="h-3 w-3" />
            Plan your South India journey
          </span>
          <h2
            className="mt-4 font-[Playfair_Display,serif] font-bold leading-[1.02]"
            style={{ fontSize: "clamp(30px, 3.4vw, 54px)", letterSpacing: "-0.02em" }}
          >
            Your next journey <br className="hidden md:block" />
            <span className="text-[#f6d67a]">begins here</span>
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/85 md:text-[15px]">
            Tell us your destination and travel requirements. Our team will prepare a
            personalised travel plan and quote for you.
          </p>

          {/* Trust highlights */}
          <ul className="mt-6 flex flex-col gap-2.5 text-[13px] text-white/90">
            <li className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/12 backdrop-blur">
                <MapIcon className="h-4 w-4 text-[#f6d67a]" />
              </span>
              <span>Custom itineraries across Karnataka, Kerala, Tamil Nadu &amp; more</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/12 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-[#f6d67a]" />
              </span>
              <span>Verified vehicles &amp; experienced chauffeurs</span>
            </li>
            <li className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/12 backdrop-blur">
                <Clock className="h-4 w-4 text-[#f6d67a]" />
              </span>
              <span>Quick travel assistance — call or WhatsApp anytime</span>
            </li>
          </ul>

          {/* Route line */}
          <div className="mt-7 hidden md:block" aria-hidden>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              {["Bengaluru", "Mysuru", "Coorg", "Ooty", "Kerala"].map((c, i, arr) => (
                <span key={c} className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f6d67a]" />
                    {c}
                  </span>
                  {i < arr.length - 1 && (
                    <span className="h-px w-6 bg-gradient-to-r from-[#f6d67a]/70 to-transparent" />
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Destination thumbnails strip */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {THUMBS.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setDestination(t.dest)}
                className="group relative overflow-hidden rounded-xl ring-1 ring-white/20 transition hover:ring-[#f6d67a]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f6d67a]"
                aria-label={`Set destination to ${t.label}`}
              >
                <img
                  src={t.src}
                  alt={t.label}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-1 text-center text-[10px] font-semibold uppercase tracking-wider text-white drop-shadow">
                  {t.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Form card */}
        <div className="animate-fade-in">
          <div className="rounded-[26px] border border-[#e9dfc9] bg-[#fffdf8] p-6 shadow-[0_24px_60px_rgba(5,40,30,0.28)] md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#0f6b52]">
                  Plan in a minute
                </p>
                <h3
                  className="mt-1 font-[Playfair_Display,serif] font-bold text-[#12213b]"
                  style={{ fontSize: "clamp(22px, 2.4vw, 34px)", lineHeight: 1.05, letterSpacing: "-0.01em" }}
                >
                  Tell us where you'd like to go
                </h3>
              </div>
              <p className="text-[12px] text-[#58616d]">
                Personalised written quote within 15 minutes during business hours.
              </p>
            </div>

            {/* Chips */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#58616d]">
                Popular:
              </span>
              {CHIP_SUGGESTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setDestination(c)}
                  className="rounded-full border border-[#e9dfc9] bg-white px-2.5 py-1 text-[11px] font-medium text-[#12213b] transition hover:border-[#0f6b52] hover:bg-[#0f6b52]/5 hover:text-[#0f6b52]"
                >
                  {c}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit("quote");
              }}
              className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
              noValidate
            >
              {/* Row 1 */}
              <PremiumField label="Service" icon={<Car className="h-4 w-4" />}>
                <select
                  value={form.service}
                  onChange={update("service")}
                  aria-label="Service"
                  className={selectClass}
                >
                  {SERVICES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </PremiumField>

              <PremiumField label="Pickup" icon={<MapPin className="h-4 w-4" />} error={errors.pickup}>
                <input
                  value={form.pickup}
                  onChange={update("pickup")}
                  placeholder="Bengaluru"
                  aria-label="Pickup location"
                  autoComplete="address-level2"
                  className={inputClass}
                />
              </PremiumField>

              <div className="relative">
                <PremiumField
                  label="Destination"
                  icon={<MapIcon className="h-4 w-4" />}
                  error={errors.destination}
                >
                  <input
                    value={form.destination}
                    onChange={(e) => {
                      update("destination")(e);
                      setDestOpen(true);
                    }}
                    onFocus={() => setDestOpen(true)}
                    onBlur={() => window.setTimeout(() => setDestOpen(false), 150)}
                    placeholder="Coorg, Munnar, Ooty…"
                    aria-label="Destination"
                    aria-expanded={destOpen}
                    aria-autocomplete="list"
                    role="combobox"
                    className={inputClass}
                  />
                </PremiumField>
                {destOpen && Object.keys(filteredDestinations).length > 0 && (
                  <div
                    role="listbox"
                    className="absolute left-0 right-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-xl border border-[#e9dfc9] bg-white p-2 shadow-xl"
                  >
                    {Object.entries(filteredDestinations).map(([state, list]) => (
                      <div key={state} className="mb-2 last:mb-0">
                        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0f6b52]">
                          {state}
                        </p>
                        {list.map((d) => (
                          <button
                            key={d}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setDestination(d)}
                            className="block w-full rounded-md px-2 py-1.5 text-left text-[13px] text-[#12213b] hover:bg-[#0f6b52]/8"
                            role="option"
                            aria-selected={form.destination === d}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <PremiumField label="Travel Date" icon={<Calendar className="h-4 w-4" />}>
                <input
                  type="date"
                  value={form.date}
                  onChange={update("date")}
                  aria-label="Travel date"
                  className={inputClass}
                />
              </PremiumField>

              {/* Row 2 */}
              <PremiumField label="Passengers" icon={<Users className="h-4 w-4" />}>
                <input
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={form.passengers}
                  onChange={update("passengers")}
                  placeholder="4"
                  aria-label="Number of passengers"
                  className={inputClass}
                />
              </PremiumField>

              <PremiumField label="Your Name" icon={<User className="h-4 w-4" />} error={errors.name}>
                <input
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Full name"
                  autoComplete="name"
                  aria-label="Your name"
                  className={inputClass}
                />
              </PremiumField>

              <PremiumField label="Mobile" icon={<Phone className="h-4 w-4" />} error={errors.phone}>
                <input
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={update("phone")}
                  placeholder="+91 …"
                  aria-label="Mobile number"
                  className={inputClass}
                />
              </PremiumField>

              {/* Spacer to keep Row 2 balanced on lg */}
              <div className="hidden lg:block" aria-hidden />

              {/* Row 3 */}
              <PremiumField
                label="Notes (optional)"
                icon={<MessageSquare className="h-4 w-4" />}
                className="sm:col-span-2 lg:col-span-4"
              >
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={update("notes")}
                  placeholder="Trip length, hotel preferences, special requests…"
                  aria-label="Notes"
                  className={inputClass + " resize-y min-h-[92px]"}
                />
              </PremiumField>

              {/* Row 4 */}
              <div className="flex flex-col gap-2 sm:col-span-2 sm:flex-row lg:col-span-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#0a1e35] px-6 text-[14px] font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#0f2b4a] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending…" : "Get My Travel Quote"}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
                <button
                  type="button"
                  onClick={() => submit("whatsapp")}
                  disabled={loading}
                  className="group inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-[#0f6b52] px-6 text-[14px] font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#0b5741] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Continue on WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const inputClass =
  "peer w-full rounded-[13px] border border-[#e2dccb] bg-white pl-10 pr-3 py-3 text-[14px] text-[#12213b] shadow-sm outline-none transition placeholder:text-[#9aa3ae] focus:border-[#0f6b52] focus:ring-[3px] focus:ring-[#0f6b52]/15";

const selectClass =
  "peer w-full appearance-none rounded-[13px] border border-[#e2dccb] bg-white pl-10 pr-8 py-3 text-[14px] text-[#12213b] shadow-sm outline-none transition focus:border-[#0f6b52] focus:ring-[3px] focus:ring-[#0f6b52]/15";

function PremiumField({
  label,
  icon,
  children,
  className,
  error,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#58616d]">
        {label}
      </label>
      <div className="relative">
        <span
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#0f6b52]"
        >
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="mt-1 text-[11px] font-medium text-red-600">{error}</p>}
    </div>
  );
}

export default PremiumQuickEnquiry;