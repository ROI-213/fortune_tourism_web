import { useMemo, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { findVehicle, vehicles, type Vehicle } from "@/data/vehicles";
import { testimonials, faqs } from "@/data/site";
import { buildWhatsAppUrl, PHONE } from "@/lib/contact";
import {
  CheckCircle2,
  Users,
  Briefcase,
  Snowflake,
  Gauge,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Star,
  MapPin,
  Plane,
  Building2,
  Route as RouteIcon,
  Car as CarIcon,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/car-rentals/$vehicleId")({
  loader: ({ params }) => {
    const vehicle = findVehicle(params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.vehicle.name} | Fortune Tourism` : "Vehicle | Fortune Tourism" },
      {
        name: "description",
        content: loaderData?.vehicle.summary ?? "Chauffeur-driven vehicle from Fortune Tourism.",
      },
    ],
  }),
  component: VehicleDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-fortune py-20 text-center">
        <h1 className="font-heading text-3xl">Vehicle not found</h1>
        <Link to="/car-rentals" className="mt-4 inline-block text-[color:var(--color-emerald)] underline">Back to fleet</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-fortune py-20 text-center">Something went wrong.</div>
    </SiteLayout>
  ),
});

function VehicleDetail() {
  const { vehicle } = Route.useLoaderData();
  const gallery = useMemo(
    () => [
      { src: vehicle.image, label: "Exterior" },
      { src: vehicle.image, label: "Side profile" },
      { src: vehicle.image, label: "Interior" },
      { src: vehicle.image, label: "Seating" },
      { src: vehicle.image, label: "Luggage" },
    ],
    [vehicle.image],
  );
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const waUrl = buildWhatsAppUrl({
    service: "Car Rental",
    vehicle: vehicle.name,
    pickup: "Bengaluru",
  });

  const related = vehicles
    .filter((v) => v.slug !== vehicle.slug)
    .sort((a, b) => Math.abs(a.seats - vehicle.seats) - Math.abs(b.seats - vehicle.seats))
    .slice(0, 4);

  return (
    <SiteLayout>
      {/* Section 1: Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-border/60 bg-[color:var(--color-cream)]/60">
        <div className="container-fortune py-4 text-xs">
          <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/car-rentals" className="hover:text-foreground">Car Rentals</Link></li>
            <li aria-hidden>/</li>
            <li>{vehicle.category}</li>
            <li aria-hidden>/</li>
            <li className="text-foreground">{vehicle.name}</li>
          </ol>
        </div>
      </nav>

      {/* Section 2: Gallery + Summary */}
      <section className="py-10 md:py-14">
        <div className="container-fortune grid gap-8 lg:grid-cols-[1.15fr_1fr]">
          {/* Gallery */}
          <div>
            <div className="group relative overflow-hidden rounded-3xl border border-border bg-white">
              <img
                src={gallery[active].src}
                alt={`${vehicle.name} chauffeur-driven rental vehicle in Bengaluru — ${gallery[active].label}`}
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full animate-fade-in object-cover"
                loading="eager"
              />
              <button
                type="button"
                onClick={() => setActive((i) => (i - 1 + gallery.length) % gallery.length)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setActive((i) => (i + 1) % gallery.length)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightbox(true)}
                className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/80"
              >
                View full screen
              </button>
              <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                {active + 1} / {gallery.length}
              </div>
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show ${g.label}`}
                  className={
                    "shrink-0 overflow-hidden rounded-xl border-2 transition " +
                    (active === i
                      ? "border-[color:var(--color-emerald)]"
                      : "border-transparent opacity-70 hover:opacity-100")
                  }
                >
                  <img src={g.src} alt="" className="h-16 w-24 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[color:var(--color-navy)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-navy)]">
                {vehicle.category}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Available
              </span>
            </div>
            <h1 className="mt-3 font-heading text-3xl md:text-4xl">{vehicle.name}</h1>
            <p className="mt-3 text-sm text-muted-foreground">{vehicle.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                `${vehicle.seats} Passengers`,
                `${vehicle.luggage}`,
                vehicle.ac ? "Air Conditioned" : "Non-AC",
                "Professional Driver",
                ...vehicle.tripTypes.slice(0, 3),
              ].map((chip) => (
                <span key={chip} className="rounded-full border border-border bg-white px-3 py-1 text-xs">
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Starting from</p>
              <p className="mt-1 font-heading text-2xl">
                {vehicle.startingFrom ? `₹${vehicle.startingFrom}/km` : "Get Custom Quote"}
                <span className="ml-2 text-sm font-normal text-muted-foreground">indicative</span>
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
                <a
                  href="#enquiry"
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-navy)] px-4 py-2.5 text-sm font-semibold text-[color:var(--color-cream)] hover:brightness-110"
                >
                  Get Quote
                </a>
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
                <a
                  href={`tel:${PHONE}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-sm font-semibold hover:border-[color:var(--color-navy)]/40"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Rates vary with route, dates, tolls, parking & permits. Confirm final pricing over WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Quick specs */}
      <section className="border-y border-border/60 bg-[color:var(--color-cream)]/60 py-10">
        <div className="container-fortune">
          <h2 className="font-heading text-2xl">Quick specifications</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Spec icon={Users} label="Passengers" value={`${vehicle.seats}`} />
            <Spec icon={Briefcase} label="Luggage" value={vehicle.luggage} />
            <Spec icon={Snowflake} label="AC" value={vehicle.ac ? "Yes" : "No"} />
            <Spec icon={Gauge} label="Category" value={vehicle.category} />
            <Spec icon={MapPin} label="Local" value={vehicle.tripTypes.includes("Local") ? "Yes" : "On request"} />
            <Spec icon={RouteIcon} label="Outstation" value={vehicle.tripTypes.includes("Outstation") ? "Yes" : "On request"} />
            <Spec icon={Plane} label="Airport" value={vehicle.tripTypes.includes("Airport") ? "Yes" : "On request"} />
            <Spec icon={Building2} label="Corporate" value={vehicle.tripTypes.includes("Corporate") ? "Yes" : "On request"} />
          </div>
        </div>
      </section>

      {/* Overview + Comfort + Best-suited */}
      <section className="py-14">
        <div className="container-fortune grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-heading text-2xl">Vehicle overview</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The {vehicle.name} is ideal for {vehicle.bestFor.toLowerCase()}. With comfortable seating for
              up to {vehicle.seats} passengers and space for {vehicle.luggage}, it works equally well for
              Bengaluru airport transfers, day-long local sightseeing and multi-day outstation journeys
              across Karnataka, Kerala, Tamil Nadu and Andhra Pradesh. Common example models include{" "}
              {vehicle.examples.join(", ")}.
            </p>

            <h3 className="mt-8 font-heading text-xl">Comfort features</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {[...vehicle.features, "Rear AC vents", "Charging ports", "Clean seat covers", "Ample legroom"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-emerald)]" /> {f}
                </li>
              ))}
            </ul>

            <h3 className="mt-8 font-heading text-xl">Seating arrangement</h3>
            <div className="mt-3 rounded-2xl border border-border bg-card p-5 text-sm">
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <SeatBox label="Driver" value="1" />
                <SeatBox label="Passengers" value={`${vehicle.seats}`} />
                <SeatBox label="Recommended" value={`${Math.max(1, vehicle.seats - 1)}`} />
                <SeatBox label="Luggage" value={vehicle.luggage} />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Actual luggage capacity may vary based on bag size, seating arrangement and passenger count.
              </p>
            </div>

            <h3 className="mt-8 font-heading text-xl">Best suited for</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {[
                { icon: Plane, t: "Bengaluru airport transfer" },
                { icon: MapPin, t: "Local city travel" },
                { icon: Building2, t: "Corporate travel" },
                { icon: Users, t: "Family tours" },
                { icon: RouteIcon, t: "Outstation trips" },
                { icon: CarIcon, t: "Weekend getaways" },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-sm">
                  <Icon className="h-5 w-5 text-[color:var(--color-navy)]" />
                  {t}
                </div>
              ))}
            </div>

            {/* Local + Outstation + Airport */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <InfoCard title="Local rentals">
                <ul className="space-y-1">
                  <li>4 Hrs / 40 Km</li>
                  <li>8 Hrs / 80 Km</li>
                  <li>12 Hrs / 120 Km</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">Extra hour & km at actuals. Contact us for the latest quotation.</p>
              </InfoCard>
              <InfoCard title="Outstation">
                <ul className="space-y-1">
                  <li>Min. 250 km / day</li>
                  <li>Driver bata included in quote</li>
                  <li>Night halt as applicable</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">Tolls, parking & interstate permits at actuals.</p>
              </InfoCard>
              <InfoCard title="Airport (BLR)">
                <ul className="space-y-1">
                  <li>Flight-tracked pickup</li>
                  <li>Meet & greet available</li>
                  <li>Night pickup supported</li>
                </ul>
                <a href="#enquiry" className="mt-2 inline-block text-xs font-semibold text-[color:var(--color-emerald)] hover:underline">
                  Book Bengaluru Airport Transfer →
                </a>
              </InfoCard>
            </div>

            {/* Inclusions / Additional */}
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-5">
                <h4 className="font-heading text-lg">Rental inclusions</h4>
                <ul className="mt-3 space-y-2 text-sm">
                  {["Professional driver", "Clean, well-maintained vehicle", "AC when selected", "Route coordination & support"].map((i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-[color:var(--color-emerald)]" /> {i}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-white p-5">
                <h4 className="font-heading text-lg">Additional charges</h4>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {["Toll & parking", "Interstate permit", "Driver bata & night charges", "Extra km / hour beyond package", "Hill-station charges where applicable"].map((i) => (
                    <li key={i}>• {i}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms accordion */}
            <h3 className="mt-10 font-heading text-xl">Terms & conditions</h3>
            <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
              {[
                { q: "Booking & advance payment", a: "Small advance confirms your booking. Full payment before trip end." },
                { q: "Cancellation policy", a: "Free cancellation up to 24 hours before pickup. Later cancellations may attract a driver bata charge." },
                { q: "Waiting-time policy", a: "First 30 minutes complimentary at pickup. Additional waiting billed per hour." },
                { q: "Vehicle substitution", a: "In rare cases we may allocate an equivalent or better vehicle without notice." },
                { q: "Route change & delays", a: "Charges recalculated for route changes. We are not responsible for traffic or weather delays." },
                { q: "Smoking, alcohol & pets", a: "Smoking and alcohol not permitted. Pets by prior arrangement only." },
              ].map((t, i) => (
                <details key={i} className="group p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold">
                    {t.q}
                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{t.a}</p>
                </details>
              ))}
            </div>

            {/* Safety */}
            <div className="mt-10 rounded-3xl border border-border bg-[color:var(--color-navy)]/[0.03] p-6">
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-8 w-8 shrink-0 text-[color:var(--color-emerald)]" />
                <div>
                  <h3 className="font-heading text-xl">Safety & cleanliness</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Verified full-time drivers, regularly serviced vehicles, sanitised interiors and 24×7
                    on-call assistance across every Fortune Tourism trip.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <h3 className="mt-10 font-heading text-xl">What customers say</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {testimonials.slice(0, 4).map((t) => (
                <div key={t.name} className="rounded-2xl border border-border bg-white p-5">
                  <div className="flex items-center gap-1 text-[color:var(--color-gold)]">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm">{t.text}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t.name} · {t.route} · {t.vehicle}
                  </p>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <h3 className="mt-10 font-heading text-xl">Frequently asked questions</h3>
            <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-white">
              {faqs.map((f, i) => (
                <div key={i} className="p-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between text-left text-sm font-semibold"
                    aria-expanded={openFaq === i}
                  >
                    {f.q}
                    <ChevronDown className={"h-4 w-4 transition " + (openFaq === i ? "rotate-180" : "")} />
                  </button>
                  {openFaq === i && <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Sticky enquiry panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start" id="enquiry">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={vehicle.image} alt="" className="h-14 w-20 rounded-lg object-cover" />
                <div>
                  <p className="font-heading text-base">{vehicle.name}</p>
                  <p className="text-xs text-emerald-700">● Available</p>
                </div>
              </div>
              <h2 className="mt-4 font-heading text-lg">Get a quick quote</h2>
              <div className="mt-3">
                <EnquiryForm compact presetService="Car Rental" presetVehicle={vehicle.name} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border bg-white p-4 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-[color:var(--color-gold)]" />
              Written quote in ~15 min · No hidden charges
            </div>
          </aside>
        </div>
      </section>

      {/* Related vehicles */}
      <section className="border-t border-border/60 bg-[color:var(--color-cream)]/60 py-14">
        <div className="container-fortune">
          <h2 className="font-heading text-2xl">Related vehicles</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((v) => (
              <RelatedCard key={v.slug} v={v} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile fixed booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-white p-2 shadow-lg lg:hidden" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <a href={`tel:${PHONE}`} className="inline-flex items-center justify-center gap-1 rounded-full border border-border py-2.5 text-xs font-semibold">
          <Phone className="h-4 w-4" /> Call
        </a>
        <a href={waUrl} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-1 rounded-full bg-[color:var(--color-emerald)] py-2.5 text-xs font-semibold text-white">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a href="#enquiry" className="inline-flex items-center justify-center rounded-full bg-[color:var(--color-navy)] py-2.5 text-xs font-semibold text-[color:var(--color-cream)]">
          Get Quote
        </a>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={gallery[active].src}
            alt={`${vehicle.name} — ${gallery[active].label}`}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </SiteLayout>
  );
}

function Spec({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-white p-4">
      <Icon className="h-5 w-5 text-[color:var(--color-navy)]" />
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SeatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-white p-3 text-center">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-base">{value}</p>
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h4 className="font-heading text-lg">{title}</h4>
      <div className="mt-3 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function RelatedCard({ v }: { v: Vehicle }) {
  return (
    <Link
      to="/car-rentals/$vehicleId"
      params={{ vehicleId: v.slug }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="overflow-hidden">
        <img
          src={v.image}
          alt={v.name}
          className="aspect-[4/3] w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{v.category}</p>
        <p className="mt-1 font-heading text-base">{v.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">{v.seats} pax · {v.luggage}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-[color:var(--color-emerald)]">View Details →</span>
          {v.startingFrom && <span className="text-xs">₹{v.startingFrom}/km</span>}
        </div>
      </div>
    </Link>
  );
}