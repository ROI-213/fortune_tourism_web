import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  MapPin,
  Plane,
  Route as RouteIcon,
  RotateCw,
  Users,
  Briefcase,
  Building2,
  Phone,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
  Clock,
  Snowflake,
  Fuel,
  X,
  Check,
  Info,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { vehicles, type Vehicle, type TripType, type VehicleCategory } from "@/data/vehicles";
import { buildWhatsAppUrl, CONTACT } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/site/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/car-rentals")({
  head: () => ({
    meta: [
      { title: "Car Rentals in Bengaluru | Sedans, SUVs, Innova, Tempo | Fortune Tourism" },
      {
        name: "description",
        content:
          "Book chauffeur-driven hatchbacks, sedans, SUVs, Innova, Innova Crysta, Tempo Traveller and Mini Buses for local Bengaluru, airport transfer, corporate and outstation trips across South India.",
      },
      { property: "og:title", content: "Fortune Tourism Car Rentals — Bengaluru & South India" },
      {
        property: "og:description",
        content: "Clean, professionally driven cars for local, airport, corporate and outstation travel.",
      },
    ],
  }),
  component: CarRentalsPage,
});

const TRIP_TABS: { key: TripType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "Local", label: "Local Rental", icon: MapPin },
  { key: "Outstation", label: "Outstation", icon: RouteIcon },
  { key: "One-Way", label: "One-Way", icon: ArrowRight },
  { key: "Round Trip", label: "Round Trip", icon: RotateCw },
  { key: "Airport", label: "Airport Transfer", icon: Plane },
  { key: "Corporate", label: "Corporate", icon: Building2 },
  { key: "Group Travel", label: "Group Travel", icon: Users },
];

const CATEGORIES: VehicleCategory[] = [
  "Hatchback",
  "Sedan",
  "Premium Sedan",
  "SUV",
  "Innova",
  "Innova Crysta",
  "Tempo Traveller",
  "Mini Bus",
];

const PAX_BUCKETS = [
  { label: "1–4", min: 1, max: 4 },
  { label: "5–6", min: 5, max: 6 },
  { label: "7", min: 7, max: 7 },
  { label: "8–12", min: 8, max: 12 },
  { label: "13–20", min: 13, max: 20 },
  { label: "20+", min: 21, max: 999 },
] as const;

function CarRentalsPage() {
  const [trip, setTrip] = useState<TripType>("Local");
  const [cats, setCats] = useState<VehicleCategory[]>([]);
  const [paxIdx, setPaxIdx] = useState<number | null>(null);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (!v.tripTypes.includes(trip)) return false;
      if (cats.length && !cats.includes(v.category)) return false;
      if (paxIdx !== null) {
        const b = PAX_BUCKETS[paxIdx];
        if (v.seats < b.min || v.seats > b.max) return false;
      }
      return true;
    });
  }, [trip, cats, paxIdx]);

  const toggleCat = (c: VehicleCategory) =>
    setCats((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const toggleCompare = (slug: string) =>
    setCompare((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });

  const clearFilters = () => {
    setCats([]);
    setPaxIdx(null);
  };

  return (
    <SiteLayout>
      <Hero />
      <TripTabs value={trip} onChange={setTrip} />
      <SmartFinder onSuggest={(cat) => setCats(cat ? [cat] : [])} />
      <section className="py-14 md:py-20">
        <div className="container-fortune grid gap-10 lg:grid-cols-[280px_1fr]">
          <FilterSidebar
            cats={cats}
            toggleCat={toggleCat}
            paxIdx={paxIdx}
            setPaxIdx={setPaxIdx}
            count={filtered.length}
            onClear={clearFilters}
          />
          <div>
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-heading text-2xl md:text-3xl">
                {filtered.length} vehicle{filtered.length === 1 ? "" : "s"} for {trip}
              </h2>
              <p className="hidden text-sm text-muted-foreground sm:block">
                Tap Compare on up to 3 vehicles
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No vehicles match your filters. Try clearing filters or choosing a different trip type.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center gap-1 rounded-full border border-[color:var(--color-navy)]/30 px-4 py-2 text-sm"
                >
                  <X className="h-4 w-4" /> Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((v, i) => (
                  <Reveal key={v.slug} delay={i * 60}>
                    <VehicleCard
                      v={v}
                      compared={compare.includes(v.slug)}
                      onToggleCompare={() => toggleCompare(v.slug)}
                    />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* UseCases removed */}
      <Inclusions />
      <WhyUs />
      <FinalCta />

      {compare.length > 0 && (
        <CompareBar
          slugs={compare}
          onRemove={(s) => setCompare((c) => c.filter((x) => x !== s))}
          onClear={() => setCompare([])}
          onOpen={() => setCompareOpen(true)}
        />
      )}
      {compareOpen && (
        <CompareModal slugs={compare} onClose={() => setCompareOpen(false)} />
      )}
    </SiteLayout>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[color:var(--color-navy)] text-[color:var(--color-cream)]">
      <img
        src="/images/fleet/hero-fleet-bengaluru.jpg"
        alt="Fortune Tourism fleet of sedans, SUVs and Tempo Traveller parked on a Bengaluru boulevard"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-navy)] via-[color:var(--color-navy)]/70 to-transparent" />
      <div className="relative container-fortune py-16 md:py-24">
        <nav className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold)]/90">
          <Link to="/" className="hover:text-[color:var(--color-gold)]">Home</Link>
          <span className="mx-2 opacity-60">/</span>
          <span>Car Rentals</span>
        </nav>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl md:text-6xl">
          Car Rentals in Bengaluru
        </h1>
        <p className="mt-4 max-w-2xl text-base opacity-90 md:text-lg">
          Choose clean, comfortable and professionally driven vehicles for local travel,
          airport transfers, outstation trips, corporate travel and group journeys across
          Bengaluru and South India.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#fleet"
            className="rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-semibold text-[color:var(--color-navy)] transition hover:brightness-110"
          >
            Book Your Car
          </a>
          <a
            href={CONTACT.phoneHref}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-cream)]/40 px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-[color:var(--color-cream)]/10"
          >
            <Phone className="h-4 w-4" /> Call Now
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wider opacity-80">
          <li>· Professional Drivers</li>
          <li>· Clean & Sanitised Cars</li>
          <li>· Local and Outstation</li>
          <li>· 24/7 Booking Assistance</li>
        </ul>
      </div>
    </section>
  );
}

/* ---------- Trip Tabs ---------- */

function TripTabs({ value, onChange }: { value: TripType; onChange: (t: TripType) => void }) {
  return (
    <section id="fleet" className="border-b border-border bg-white">
      <div className="container-fortune py-4">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TRIP_TABS.map(({ key, label, icon: Icon }) => {
            const active = key === value;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className={
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-navy)]/40 " +
                  (active
                    ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-[color:var(--color-cream)] shadow-sm"
                    : "border-border text-foreground hover:border-[color:var(--color-navy)]/40")
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Smart Vehicle Finder ---------- */

function SmartFinder({ onSuggest }: { onSuggest: (cat: VehicleCategory | null) => void }) {
  const [pax, setPax] = useState("");
  const [bags, setBags] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(pax || "0", 10);
    const b = parseInt(bags || "0", 10);
    let cat: VehicleCategory | null = null;
    let note = "";
    if (p >= 21) { cat = "Mini Bus"; note = "Mini Bus is best for large groups."; }
    else if (p >= 13) { cat = "Mini Bus"; note = "A 17-seater Mini Bus fits your group."; }
    else if (p >= 8) { cat = "Tempo Traveller"; note = "A Tempo Traveller comfortably seats 9–17 with luggage."; }
    else if (p >= 6) { cat = "Innova Crysta"; note = "Innova / Innova Crysta seats 7 with luggage."; }
    else if (p >= 5 || b >= 4) { cat = "SUV"; note = "An Ertiga, Carens or Innova will be the best fit."; }
    else if (p >= 3) { cat = "Sedan"; note = "A Dzire or Aura sedan is ideal."; }
    else if (p > 0) { cat = "Hatchback"; note = "A Swift or i20 hatchback is perfect for the trip."; }
    else { note = "Enter passengers to see recommendations."; }
    setMsg(note);
    onSuggest(cat);
  };

  return (
    <section className="bg-[color:var(--color-lightgrey)]/60 py-10 md:py-14">
      <div className="container-fortune">
        <Reveal>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-[color:var(--color-emerald)]/10 p-2 text-[color:var(--color-emerald)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl md:text-2xl">Find the right vehicle</h2>
                <p className="text-sm text-muted-foreground">
                  Tell us your group size and we'll recommend the best fit.
                </p>
              </div>
            </div>
            <form onSubmit={handle} className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Field label="Passengers">
                <input
                  type="number"
                  min={1}
                  value={pax}
                  onChange={(e) => setPax(e.target.value)}
                  placeholder="4"
                  className={inputCls}
                />
              </Field>
              <Field label="Luggage bags">
                <input
                  type="number"
                  min={0}
                  value={bags}
                  onChange={(e) => setBags(e.target.value)}
                  placeholder="3"
                  className={inputCls}
                />
              </Field>
              <Field label="Pickup">
                <input placeholder="Bengaluru" className={inputCls} />
              </Field>
              <Field label="Destination">
                <input placeholder="Mysuru, Coorg…" className={inputCls} />
              </Field>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-full bg-[color:var(--color-navy)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:brightness-110"
                >
                  Show Recommended
                </button>
              </div>
            </form>
            {msg && (
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-[color:var(--color-emerald)]/5 p-3 text-sm text-[color:var(--color-emerald)]">
                <Info className="mt-0.5 h-4 w-4 shrink-0" /> {msg}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm text-foreground shadow-sm outline-none focus:border-[color:var(--color-navy)] focus:ring-2 focus:ring-[color:var(--color-navy)]/20";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

/* ---------- Filter Sidebar ---------- */

function FilterSidebar({
  cats,
  toggleCat,
  paxIdx,
  setPaxIdx,
  count,
  onClear,
}: {
  cats: VehicleCategory[];
  toggleCat: (c: VehicleCategory) => void;
  paxIdx: number | null;
  setPaxIdx: (i: number | null) => void;
  count: number;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm shadow-sm"
        >
          Filters · {count}
        </button>
      </div>

      {/* Sidebar (desktop sticky, mobile drawer) */}
      <aside
        className={
          "z-40 " +
          (open
            ? "fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-border bg-white p-6 shadow-2xl lg:static lg:block lg:max-h-none lg:overflow-visible lg:rounded-none lg:border-0 lg:p-0 lg:shadow-none"
            : "hidden lg:sticky lg:top-24 lg:block lg:self-start")
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg">Filters</h3>
          <div className="flex items-center gap-2">
            <button onClick={onClear} className="text-xs text-muted-foreground underline">
              Clear all
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full border border-border p-1.5 lg:hidden"
              aria-label="Close filters"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <FilterGroup title="Vehicle Category">
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => {
              const active = cats.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleCat(c)}
                  className={
                    "rounded-lg border px-3 py-2 text-left text-xs transition " +
                    (active
                      ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)]/5 text-[color:var(--color-navy)]"
                      : "border-border hover:border-[color:var(--color-navy)]/40")
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>
        </FilterGroup>
        <FilterGroup title="Passengers">
          <div className="flex flex-wrap gap-2">
            {PAX_BUCKETS.map((b, i) => {
              const active = paxIdx === i;
              return (
                <button
                  key={b.label}
                  onClick={() => setPaxIdx(active ? null : i)}
                  className={
                    "rounded-full border px-3 py-1.5 text-xs " +
                    (active
                      ? "border-[color:var(--color-emerald)] bg-[color:var(--color-emerald)]/10 text-[color:var(--color-emerald)]"
                      : "border-border hover:border-[color:var(--color-emerald)]/40")
                  }
                >
                  {b.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>
        <div className="mt-6 rounded-xl bg-[color:var(--color-lightgrey)]/60 p-3 text-xs text-muted-foreground">
          Showing <strong className="text-foreground">{count}</strong> vehicles
        </div>
        <button
          onClick={() => setOpen(false)}
          className="mt-4 w-full rounded-full bg-[color:var(--color-navy)] px-5 py-3 text-sm font-semibold text-[color:var(--color-cream)] lg:hidden"
        >
          Apply Filters
        </button>
      </aside>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 border-t border-border pt-4 first:mt-0 first:border-0 first:pt-0">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

/* ---------- Vehicle Card ---------- */

function VehicleCard({
  v,
  compared,
  onToggleCompare,
}: {
  v: Vehicle;
  compared: boolean;
  onToggleCompare: () => void;
}) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--color-lightgrey)]">
        <img
          src={v.image}
          alt={`${v.name} rental car on a Bengaluru street`}
          width={1200}
          height={900}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--color-navy)] backdrop-blur">
          {v.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl">{v.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{v.examples.join(" · ")}</p>
          </div>
          {v.startingFrom && (
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">from</p>
              <p className="font-heading text-lg text-[color:var(--color-navy)]">₹{v.startingFrom}<span className="text-xs font-normal text-muted-foreground">/km</span></p>
            </div>
          )}
        </div>
        <ul className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
          <li className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {v.seats} pax</li>
          <li className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {v.bags} bags</li>
          <li className="flex items-center gap-1"><Snowflake className="h-3.5 w-3.5" /> AC</li>
        </ul>
        <p className="mt-3 line-clamp-2 text-sm text-foreground/80">{v.bestFor}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {v.tripTypes.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-[color:var(--color-emerald)]/10 px-2 py-0.5 text-[10px] text-[color:var(--color-emerald)]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-5">
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
            <input type="checkbox" checked={compared} onChange={onToggleCompare} className="h-4 w-4 accent-[color:var(--color-navy)]" />
            Compare
          </label>
          <div className="flex gap-2">
            <Link
              to="/car-rentals/$vehicleId"
              params={{ vehicleId: v.slug }}
              className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-navy)]/25 px-3 py-2 text-xs font-medium text-[color:var(--color-navy)] hover:bg-[color:var(--color-navy)]/5"
            >
              Details <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href={buildWhatsAppUrl({ vehicle: v.name, service: "Car Rental" })}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-emerald)] px-3 py-2 text-xs font-semibold text-[color:var(--color-cream)] hover:brightness-110"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> Book
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- Compare ---------- */

function CompareBar({
  slugs,
  onRemove,
  onClear,
  onOpen,
}: {
  slugs: string[];
  onRemove: (s: string) => void;
  onClear: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-center gap-3 rounded-full border border-border bg-white p-2 pl-4 shadow-2xl">
        <span className="hidden text-xs font-semibold text-muted-foreground sm:inline">Compare</span>
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {slugs.map((s) => {
            const v = vehicles.find((x) => x.slug === s)!;
            return (
              <span key={s} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[color:var(--color-lightgrey)] px-3 py-1.5 text-xs">
                {v.name}
                <button onClick={() => onRemove(s)} aria-label={`Remove ${v.name}`}>
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            );
          })}
          {slugs.length < 3 && (
            <span className="hidden self-center text-[11px] text-muted-foreground sm:inline">Up to 3 vehicles</span>
          )}
        </div>
        <button onClick={onClear} className="hidden text-xs text-muted-foreground underline sm:inline">Clear</button>
        <button
          onClick={onOpen}
          disabled={slugs.length < 2}
          className="rounded-full bg-[color:var(--color-navy)] px-4 py-2 text-xs font-semibold text-[color:var(--color-cream)] disabled:opacity-50"
        >
          Compare Now
        </button>
      </div>
    </div>
  );
}

function CompareModal({ slugs, onClose }: { slugs: string[]; onClose: () => void }) {
  const items = slugs.map((s) => vehicles.find((v) => v.slug === s)!).filter(Boolean);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="font-heading text-xl">Compare vehicles</h3>
          <button onClick={onClose} className="rounded-full border border-border p-1.5" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-x-auto p-6">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr>
                <th className="w-40"></th>
                {items.map((v) => (
                  <th key={v.slug} className="p-2 align-top">
                    <img src={v.image} alt={v.name} className="mb-2 aspect-[4/3] w-full rounded-lg object-cover" />
                    <p className="font-heading text-base">{v.name}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="[&_td]:border-t [&_td]:border-border [&_td]:p-3 [&_th]:border-t [&_th]:border-border [&_th]:p-3">
              <Row label="Category" cells={items.map((v) => v.category)} />
              <Row label="Seats" cells={items.map((v) => `${v.seats} pax`)} />
              <Row label="Luggage" cells={items.map((v) => v.luggage)} />
              <Row label="AC" cells={items.map((v) => (v.ac ? "Yes" : "No"))} />
              <Row label="Best for" cells={items.map((v) => v.bestFor)} />
              <Row label="Trip types" cells={items.map((v) => v.tripTypes.join(", "))} />
              <Row label="Starting from" cells={items.map((v) => (v.startingFrom ? `₹${v.startingFrom}/km` : "On request"))} />
              <tr>
                <th></th>
                {items.map((v) => (
                  <td key={v.slug}>
                    <a
                      href={buildWhatsAppUrl({ vehicle: v.name, service: "Car Rental" })}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-emerald)] px-3 py-1.5 text-xs font-semibold text-[color:var(--color-cream)]"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" /> Book
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, cells }: { label: string; cells: string[] }) {
  return (
    <tr>
      <th className="text-xs uppercase tracking-wider text-muted-foreground">{label}</th>
      {cells.map((c, i) => (
        <td key={i} className="text-foreground/90">{c}</td>
      ))}
    </tr>
  );
}

/* ---------- Use Cases ---------- */

const USE_CASES = [
  { title: "Kempegowda Airport Transfer", rec: "Sedan · Ertiga · Innova", image: "/images/fleet/usecase-airport.jpg" },
  { title: "Bengaluru Local Sightseeing", rec: "Hatchback · Sedan · Ertiga", image: "/images/state-karnataka.jpg" },
  { title: "Mysuru Day Trip", rec: "Sedan · Innova", image: "/images/state-karnataka.jpg" },
  { title: "Coorg Outstation Trip", rec: "SUV · Innova · Crysta", image: "/images/state-karnataka.jpg" },
  { title: "Corporate Employee Travel", rec: "Premium Sedan · Crysta", image: "/images/state-karnataka.jpg" },
  { title: "Wedding Guest Transport", rec: "Tempo Traveller · Mini Bus", image: "/images/state-karnataka.jpg" },
  { title: "South India Family Tour", rec: "Innova Crysta · Tempo", image: "/images/state-kerala.jpg" },
  { title: "Tirupati Pilgrimage", rec: "Innova · Tempo Traveller", image: "/images/state-andhra.jpg" },
];

function UseCases() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-fortune">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Popular reasons</p>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl">Why customers book with us</h2>
          <p className="mt-3 text-muted-foreground">
            From an early morning airport pickup to a week-long South India tour — the right vehicle for every occasion.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {USE_CASES.map((u, i) => (
            <Reveal key={u.title} delay={i * 40}>
              <article className="group overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden bg-[color:var(--color-lightgrey)]">
                  <img
                    src={u.image}
                    alt={u.title}
                    width={800}
                    height={600}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base">{u.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">Recommended: {u.rec}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Inclusions ---------- */

const INCLUDED = [
  "Professional chauffeur",
  "Clean, well-maintained vehicle",
  "Regular vehicle inspection",
  "24 × 7 customer support",
  "Basic trip coordination",
  "AC vehicle when selected",
];
const EXTRA = [
  "Fuel policy as per package",
  "Toll charges (at actuals)",
  "Parking charges (at actuals)",
  "Driver allowance / bata",
  "Night charges (if applicable)",
  "Interstate permit charges",
  "Extra kilometre charges beyond package",
  "Extra waiting charges",
];

function Inclusions() {
  return (
    <section className="bg-[color:var(--color-lightgrey)]/50 py-16 md:py-24">
      <div className="container-fortune grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-white p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Included</p>
          <h3 className="mt-2 font-heading text-2xl">Every rental includes</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {INCLUDED.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-emerald)]" />
                {i}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-white p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-gold)]">Extras (may apply)</p>
          <h3 className="mt-2 font-heading text-2xl">Additional charges</h3>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {EXTRA.map((i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Fuel className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-gold)]" />
                {i}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-xl bg-[color:var(--color-lightgrey)] p-3 text-xs text-muted-foreground">
            Final pricing may vary based on vehicle type, distance, duration, pickup time,
            route, tolls, parking and interstate permits. The complete fare is confirmed
            in writing before booking.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- Why Us ---------- */

const WHY = [
  { icon: ShieldCheck, title: "Experienced chauffeurs", blurb: "Verified, uniformed and route-trained." },
  { icon: Sparkles, title: "Clean & sanitised cars", blurb: "Regularly serviced and inspected." },
  { icon: BadgeCheck, title: "Transparent quotes", blurb: "Written pricing — no hidden charges." },
  { icon: Clock, title: "On-time pickup & drop", blurb: "Flight-tracked airport pickups." },
  { icon: MapPin, title: "Bengaluru local experts", blurb: "Every neighbourhood and hotel driveway." },
  { icon: RouteIcon, title: "South India coverage", blurb: "Karnataka, TN, Kerala, AP, Puducherry." },
  { icon: Phone, title: "24 × 7 assistance", blurb: "A real person on the phone, always." },
  { icon: Users, title: "Individuals to groups", blurb: "Solo travellers to 30-seater buses." },
];

function WhyUs() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-fortune">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Why choose us</p>
          <h2 className="mt-2 font-heading text-3xl md:text-4xl">
            Bengaluru's dependable travel partner
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 40}>
              <div className="rounded-2xl border border-border bg-white p-6">
                <div className="inline-flex rounded-xl bg-[color:var(--color-navy)]/5 p-2.5 text-[color:var(--color-navy)]">
                  <w.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-14">
          <h2 className="font-heading text-2xl md:text-3xl">Common questions</h2>
          <div className="mt-6 max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How do I get a quote?", a: "Share your trip details on WhatsApp or the enquiry form and you'll receive a written quote within a few minutes." },
                { q: "What is included in the fare?", a: "Vehicle, driver, basic coordination and AC when selected. Tolls, parking, driver bata and interstate permits are billed at actuals for outstation trips." },
                { q: "Can I book by the hour or per kilometre?", a: "Both. Local rentals are usually hourly (with an included kilometre cap). Outstation trips are per-kilometre with a daily minimum." },
                { q: "Can I cancel my booking?", a: "Yes. Free cancellation up to 24 hours before pickup. Later cancellations may attract a small driver bata charge." },
                { q: "What if my flight is delayed?", a: "We track your flight number and adjust the pickup time automatically at no extra cost." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`f-${i}`}>
                  <AccordionTrigger className="text-left font-heading text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */

function FinalCta() {
  return (
    <section className="bg-[color:var(--color-navy)] py-16 text-[color:var(--color-cream)] md:py-24">
      <div className="container-fortune grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-gold)]">Ready to book</p>
          <h2 className="mt-2 font-heading text-3xl md:text-5xl">Tell us where you want to go</h2>
          <p className="mt-4 max-w-lg opacity-85">
            Share a few trip details and our team will confirm availability, share a written
            quote and arrange the right chauffeur for your journey.
          </p>
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">
            <img
              src="/images/fleet/hero-fleet-bengaluru.jpg"
              alt="Fortune Tourism fleet lineup"
              width={1200}
              height={720}
              loading="lazy"
              className="h-56 w-full object-cover md:h-72"
            />
          </div>
        </div>
        <div className="rounded-3xl bg-[color:var(--color-cream)] p-6 text-foreground shadow-2xl md:p-8">
          <h3 className="font-heading text-2xl">Car Rental Enquiry</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Get a written quote on WhatsApp within minutes.
          </p>
          <div className="mt-5">
            <EnquiryForm compact presetService="Car Rental" />
          </div>
        </div>
      </div>
    </section>
  );
}