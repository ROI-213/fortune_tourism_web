import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { vehicles } from "@/data/vehicles";
import { faqs } from "@/data/site";
import {
  ArrowRight,
  Phone,
  MessageCircle,
  MapPin,
  Plane,
  Route as RouteIcon,
  Building2,
  Users,
  Church,
  PartyPopper,
  Ticket,
  Hotel,
  Sparkles,
  ShieldCheck,
  Clock,
  BadgeCheck,
  Car,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Travel Services in Bengaluru & South India | Fortune Tourism" },
      { name: "description", content: "Chauffeur-driven car rentals, airport transfers, corporate transportation, pilgrimage and custom South India tours from Bengaluru." },
      { property: "og:title", content: "Fortune Tourism — Travel Services" },
      { property: "og:description", content: "Complete travel support from Bengaluru across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh and Puducherry." },
      { property: "og:image", content: "/images/services/hero-services.jpg" },
    ],
  }),
  component: ServicesPage,
});

type Service = {
  n: string;
  slug: string;
  title: string;
  description: string;
  benefits: string[];
  suitableFor: string[];
  vehicles: string[];
  availability: string;
  href: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SERVICES: Service[] = [
  {
    n: "01",
    slug: "local-car-rental",
    title: "Local Car Rental in Bengaluru",
    description:
      "Chauffeur-driven vehicles for business meetings, shopping, medical visits, sightseeing and hourly rentals inside Bengaluru.",
    benefits: ["Flexible hourly packages", "Doorstep pickup", "Professional local drivers", "AC vehicles, always clean", "Short & full-day options"],
    suitableFor: ["Individuals", "Families", "Business travellers", "Senior citizens"],
    vehicles: ["Hatchback", "Sedan", "Ertiga", "Innova", "Innova Crysta"],
    availability: "Bengaluru city · 4 / 8 / 12 hour packages",
    href: "/car-rentals",
    image: "/images/fleet/car-sedan.jpg",
    icon: MapPin,
  },
  {
    n: "02",
    slug: "outstation",
    title: "Outstation Car Rental from Bengaluru",
    description:
      "One-way and round-trip chauffeur-driven vehicles from Bengaluru to Coorg, Ooty, Chikmagalur, Munnar, Tirupati and across South India.",
    benefits: ["One-way & round-trip", "Experienced highway drivers", "Custom sightseeing stops", "Family & group vehicles", "Transparent km + bata quote"],
    suitableFor: ["Family holidays", "Couples", "Weekend trips", "Pilgrimages", "Business travel"],
    vehicles: ["Sedan", "Ertiga", "Innova", "Innova Crysta", "Tempo Traveller"],
    availability: "Karnataka, Kerala, TN, AP & Puducherry",
    href: "/car-rentals",
    image: "/images/fleet/car-crysta.jpg",
    icon: RouteIcon,
  },
  {
    n: "03",
    slug: "airport-transfer",
    title: "Bengaluru Airport Pickup & Drop",
    description:
      "Reliable 24×7 pickup and drop between Bengaluru areas and Kempegowda International Airport (BLR) with flight-tracked timing.",
    benefits: ["24×7 booking assistance", "Flight-tracked pickup", "Luggage-friendly vehicles", "Meet & greet on request", "Fixed transparent fares"],
    suitableFor: ["Solo travellers", "Families", "Corporate guests", "International passengers"],
    vehicles: ["Sedan", "Premium Sedan", "Ertiga", "Innova", "Innova Crysta"],
    availability: "All Bengaluru areas ↔ BLR airport",
    href: "/airport-transfer",
    image: "/images/fleet/usecase-airport.jpg",
    icon: Plane,
  },
  {
    n: "04",
    slug: "corporate",
    title: "Corporate Transportation Solutions",
    description:
      "Employee shuttles, executive pickups, client visits, offsites and recurring corporate travel with dedicated coordination and GST billing.",
    benefits: ["Executive & employee fleet", "Scheduled pickup / drop", "Corporate billing & GST", "Dedicated account manager", "Event & delegate transport"],
    suitableFor: ["Offices", "Startups", "IT campuses", "Hotels", "Event organisers"],
    vehicles: ["Sedan", "Premium Sedan", "Innova Crysta", "Tempo Traveller", "Mini Bus"],
    availability: "Whitefield · ORR · Electronic City · MG Road",
    href: "/services",
    image: "/images/fleet/car-premium-sedan.jpg",
    icon: Building2,
  },
  {
    n: "05",
    slug: "group-travel",
    title: "Group Travel & Transportation",
    description:
      "Comfortable group transportation for family gatherings, corporate teams, pilgrimage groups, school trips and private events.",
    benefits: ["12 / 17 / 20 / 27 seat options", "Group luggage support", "Coordinated pickup points", "Local & outstation", "Custom schedules"],
    suitableFor: ["Large families", "Corporate teams", "Pilgrimage groups", "School & college groups"],
    vehicles: ["Tempo Traveller", "Mini Bus"],
    availability: "Bengaluru & all South India",
    href: "/car-rentals",
    image: "/images/fleet/car-tempo.jpg",
    icon: Users,
  },
  {
    n: "06",
    slug: "pilgrimage",
    title: "South India Pilgrimage Tours",
    description:
      "Private and group pilgrimage journeys to Tirupati, Dharmasthala, Kukke Subramanya, Udupi, Rameswaram, Madurai and Murudeshwar.",
    benefits: ["Custom temple routes", "Early morning pickup", "Senior-citizen friendly", "Multi-day options", "Hotel & travel assistance"],
    suitableFor: ["Families", "Senior citizens", "Religious groups", "Couples"],
    vehicles: ["Innova", "Innova Crysta", "Tempo Traveller"],
    availability: "AP · Karnataka · TN · Kerala",
    href: "/tour-packages",
    image: "/images/packages/hero-tirupati.jpg",
    icon: Church,
  },
  {
    n: "07",
    slug: "wedding-events",
    title: "Wedding & Event Transportation",
    description:
      "Coordinated vehicles for wedding guests, hotel-to-venue transfers, receptions, corporate events and private celebrations.",
    benefits: ["Guest pickup coordination", "Hotel ↔ venue transfers", "Multiple vehicle categories", "Large group support", "Professional presentation"],
    suitableFor: ["Weddings", "Receptions", "Corporate events", "Conferences", "Family functions"],
    vehicles: ["Sedan", "Innova Crysta", "Tempo Traveller", "Mini Bus"],
    availability: "Bengaluru & nearby cities",
    href: "/contact",
    image: "/images/fleet/car-suv.jpg",
    icon: PartyPopper,
  },
  {
    n: "08",
    slug: "ticket-assistance",
    title: "Ticket Booking Assistance",
    description:
      "Our team can assist with flight, train and bus travel planning and ticket-booking coordination based on service availability.",
    benefits: ["Travel schedule coordination", "Route assistance", "Connection planning", "Pickup & drop coordination", "Group ticket support"],
    suitableFor: ["Families", "Groups", "Corporate travellers", "First-time visitors"],
    vehicles: ["As per travel plan"],
    availability: "Subject to service availability",
    href: "/contact",
    image: "/images/why-us-driver.jpg",
    icon: Ticket,
  },
  {
    n: "09",
    slug: "hotel-assistance",
    title: "Hotel & Travel Assistance",
    description:
      "Hotel-category recommendations, destination coordination and local sightseeing support across South India.",
    benefits: ["Hotel-category recommendations", "Destination coordination", "Multi-city travel support", "Custom itinerary support", "Family & group planning"],
    suitableFor: ["Families", "Couples", "Groups", "Corporate travellers"],
    vehicles: ["Innova", "Innova Crysta", "Tempo Traveller"],
    availability: "Subject to hotel availability",
    href: "/tour-packages",
    image: "/images/state-kerala.jpg",
    icon: Hotel,
  },
  {
    n: "10",
    slug: "custom-tours",
    title: "Custom South India Tours",
    description:
      "Personalised journeys across Karnataka, Andhra Pradesh, Tamil Nadu, Kerala and Puducherry, built around your dates, budget and interests.",
    benefits: ["Custom destinations", "Flexible duration", "Personal vehicle selection", "Hotel-category choice", "Pilgrimage / beach / hills / heritage themes"],
    suitableFor: ["Families", "Couples", "Groups", "Corporate teams", "Senior citizens"],
    vehicles: ["Sedan", "Innova", "Innova Crysta", "Tempo Traveller"],
    availability: "Across South India, year-round",
    href: "/tour-packages",
    image: "/images/state-karnataka.jpg",
    icon: Sparkles,
  },
];

const QUICK_ROW = [
  { icon: MapPin, label: "Local Travel" },
  { icon: Plane, label: "Airport Transfer" },
  { icon: RouteIcon, label: "Outstation Travel" },
  { icon: Building2, label: "Corporate Mobility" },
  { icon: Users, label: "Group Transportation" },
  { icon: Sparkles, label: "South India Tours" },
];

const ADDITIONAL = [
  { title: "One-Way Cabs", blurb: "Drop-only fares to nearby cities.", href: "/car-rentals" },
  { title: "Round Trips", blurb: "Same driver, same vehicle both ways.", href: "/car-rentals" },
  { title: "Weekend Packages", blurb: "Curated 2-3 day getaways from Bengaluru.", href: "/tour-packages" },
  { title: "Family Tours", blurb: "Kid & senior friendly itineraries.", href: "/tour-packages" },
  { title: "Corporate Outings", blurb: "Team offsites & day picnics.", href: "/services" },
  { title: "Temple Tours", blurb: "Single-day & multi-temple circuits.", href: "/tour-packages" },
  { title: "School / College Transport", blurb: "Educational trips & excursions.", href: "/contact" },
  { title: "Guest Transportation", blurb: "Dedicated cars for visiting guests.", href: "/services" },
  { title: "Hotel Transfers", blurb: "Hotel to hotel across cities.", href: "/services" },
  { title: "Railway Station Pickup", blurb: "SBC · YPR · KJM pickup & drop.", href: "/airport-transfer" },
  { title: "Multi-City Travel", blurb: "Chain multiple South India cities.", href: "/tour-packages" },
  { title: "Custom Group Travel", blurb: "Any group size, any route.", href: "/contact" },
];

const STEPS = [
  { n: "1", title: "Share Your Requirement", blurb: "Choose the service, date, route and traveller count." },
  { n: "2", title: "Get a Suitable Recommendation", blurb: "We suggest the vehicle, travel plan and pricing structure." },
  { n: "3", title: "Confirm Your Booking", blurb: "Confirm the quote, pickup details and travel plan." },
  { n: "4", title: "Start Your Journey", blurb: "Receive driver and vehicle details before departure." },
];

const WHY = [
  { icon: MapPin, title: "Bengaluru travel expertise" },
  { icon: ShieldCheck, title: "Professional drivers" },
  { icon: Sparkles, title: "Clean, maintained vehicles" },
  { icon: Car, title: "Multiple vehicle categories" },
  { icon: RouteIcon, title: "Local & outstation coverage" },
  { icon: Users, title: "South India tour planning" },
  { icon: BadgeCheck, title: "Transparent quotations" },
  { icon: Clock, title: "24×7 WhatsApp support" },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <Hero />
      <IntroRow />
      <MainServices />
      <Recommender />
      <AdditionalGrid />
      <VehicleShowcase />
      <ProcessSteps />
      <WhyChoose />
      <EnquirySection />
      <FinalCTA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            name: "Fortune Tourism",
            address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressRegion: "KA", addressCountry: "IN" },
            telephone: CONTACT.phone,
            areaServed: ["Karnataka", "Kerala", "Tamil Nadu", "Andhra Pradesh", "Puducherry"],
            makesOffer: SERVICES.map((s) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: s.title, description: s.description },
            })),
          }),
        }}
      />
    </SiteLayout>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="/images/services/hero-services.jpg"
        alt="Chauffeur-driven Innova Crysta, Ertiga and premium sedan on a tree-lined Bengaluru road at golden hour"
        width={1920}
        height={820}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-navy)]/90 via-[color:var(--color-navy)]/60 to-transparent" />
      <div className="relative container-fortune min-h-[540px] py-20 text-[color:var(--color-cream)] md:min-h-[560px] md:py-28">
        <nav className="text-xs uppercase tracking-[0.25em] opacity-80">
          <Link to="/" className="story-link">Home</Link>
          <span className="mx-2">/</span>
          <span>Services</span>
        </nav>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold)]">Services</p>
        <h1 className="mt-3 max-w-3xl font-heading text-4xl leading-tight md:text-6xl">
          Travel Services Designed Around Your Journey
        </h1>
        <p className="mt-5 max-w-2xl text-base opacity-90 md:text-lg">
          From Bengaluru car rentals and airport transfers to corporate transportation, pilgrimage travel and custom South India tours — Fortune Tourism provides comfortable travel solutions for individuals, families and groups.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#services" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-semibold text-[color:var(--color-navy)] transition hover:brightness-105">
            Explore Our Services <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#enquiry" className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-cream)]/60 px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:bg-white/10">
            Send Your Requirement
          </a>
          <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)] transition hover:brightness-110">
            <Phone className="h-4 w-4" /> Call Now
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs opacity-90 md:text-sm">
          {["Professional Drivers", "Clean Vehicles", "Bengaluru-Based", "Local & Outstation", "Custom Planning"].map((t) => (
            <li key={t} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[color:var(--color-gold)]" /> {t}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function IntroRow() {
  return (
    <section className="border-b border-border bg-[color:var(--color-cream)] py-12 md:py-16">
      <div className="container-fortune">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Complete travel support</p>
          <h2 className="mt-3 font-heading text-2xl md:text-3xl">
            One team for every leg of your South India journey
          </h2>
          <p className="mt-4 text-muted-foreground">
            Whether you need a car for a few hours, an airport pickup, a corporate vehicle, a family holiday or transportation for a large event, our team helps organise the right vehicle and travel plan for your requirement.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {QUICK_ROW.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-4 text-center shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--color-navy)]/5 text-[color:var(--color-navy)]"><Icon className="h-5 w-5" /></span>
              <span className="text-xs font-medium text-foreground md:text-sm">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function MainServices() {
  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container-fortune space-y-16 md:space-y-24">
        {SERVICES.map((s, idx) => (
          <ServiceRow key={s.slug} service={s} reverse={idx % 2 === 1} />
        ))}
      </div>
    </section>
  );
}

function ServiceRow({ service, reverse }: { service: Service; reverse: boolean }) {
  const wa = buildWhatsAppUrl({ service: service.title });
  return (
    <Reveal>
      <article className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className={"relative overflow-hidden rounded-2xl shadow-lg " + (reverse ? "md:order-2" : "")}>
          <img
            src={service.image}
            alt={`${service.title} — Fortune Tourism`}
            loading="lazy"
            width={960}
            height={640}
            className="h-64 w-full object-cover transition duration-700 hover:scale-105 md:h-[420px]"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--color-navy)] shadow">
            Service {service.n}
          </span>
        </div>
        <div className={reverse ? "md:order-1" : ""}>
          <div className="flex items-center gap-3 text-[color:var(--color-emerald)]">
            <service.icon className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em]">{service.availability}</span>
          </div>
          <h3 className="mt-3 font-heading text-2xl md:text-3xl">{service.title}</h3>
          <p className="mt-3 text-muted-foreground">{service.description}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Key benefits</p>
              <ul className="mt-2 space-y-1.5 text-sm">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[color:var(--color-emerald)]" />{b}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suitable for</p>
                <p className="mt-2 text-sm">{service.suitableFor.join(" · ")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Suggested vehicles</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {service.vehicles.map((v) => (
                    <span key={v} className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs">{v}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={service.href} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-cream)] hover:brightness-110">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#enquiry" className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-navy)]/20 px-5 py-2.5 text-sm font-semibold text-[color:var(--color-navy)] hover:bg-[color:var(--color-navy)]/5">
              Enquire Now
            </a>
            <a href={wa} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-emerald)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-cream)] hover:brightness-110">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function Recommender() {
  const [travel, setTravel] = useState("Outstation");
  const [pax, setPax] = useState(4);
  const [bags, setBags] = useState(4);
  const [days, setDays] = useState(2);

  const recommendation = useMemo(() => {
    if (travel === "Airport") return SERVICES[2];
    if (travel === "Corporate") return SERVICES[3];
    if (pax > 7) return SERVICES[4];
    if (travel === "Local") return SERVICES[0];
    if (days >= 3) return SERVICES[9];
    return SERVICES[1];
  }, [travel, pax, days]);

  return (
    <section className="bg-[color:var(--color-navy)]/5 py-16 md:py-20">
      <div className="container-fortune grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Find the right service</p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl">Not sure which service fits your trip?</h2>
          <p className="mt-3 text-muted-foreground">Answer a few quick questions and we'll suggest the most suitable Fortune Tourism service.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Travel type">
              <select value={travel} onChange={(e) => setTravel(e.target.value)} className={inputCls}>
                {["Local", "Outstation", "Airport", "Corporate", "Group Travel", "Custom Tour"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Travellers">
              <input type="number" min={1} value={pax} onChange={(e) => setPax(Number(e.target.value) || 1)} className={inputCls} />
            </Field>
            <Field label="Bags">
              <input type="number" min={0} value={bags} onChange={(e) => setBags(Number(e.target.value) || 0)} className={inputCls} />
            </Field>
            <Field label="Number of days">
              <input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value) || 1)} className={inputCls} />
            </Field>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-lg">
          <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--color-emerald)]">
            Recommended for your requirement
          </span>
          <h3 className="mt-3 font-heading text-2xl">{recommendation.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{recommendation.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {recommendation.vehicles.map((v) => (
              <span key={v} className="rounded-full border border-border bg-muted/40 px-2.5 py-1 text-xs">{v}</span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={recommendation.href} className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-navy)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-cream)]">
              View Service <ArrowRight className="h-4 w-4" />
            </Link>
            <a href={buildWhatsAppUrl({ service: recommendation.title, passengers: pax, notes: `Bags: ${bags} · ${days} day(s)` })} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-emerald)] px-5 py-2.5 text-sm font-semibold text-[color:var(--color-cream)]">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function AdditionalGrid() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-fortune">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Additional services</p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl">Small things we also take care of</h2>
          </div>
          <Link to="/contact" className="hidden text-sm font-semibold text-[color:var(--color-navy)] story-link md:inline">See all</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ADDITIONAL.map((a, i) => (
            <Reveal key={a.title} delay={i * 40}>
              <Link to={a.href} className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-[color:var(--color-navy)]/40 hover:shadow-md">
                <h4 className="font-heading text-lg">{a.title}</h4>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{a.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-emerald)]">
                  Enquire <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function VehicleShowcase() {
  return (
    <section className="bg-[color:var(--color-cream)] py-16 md:py-20">
      <div className="container-fortune">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Fleet</p>
        <h2 className="mt-3 font-heading text-3xl md:text-4xl">Vehicles available across services</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">Chauffeur-driven, professionally maintained and matched to your trip.</p>
        <div className="mt-8 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
          {vehicles.map((v) => (
            <Link
              key={v.slug}
              to="/car-rentals/$vehicleId"
              params={{ vehicleId: v.slug }}
              className="group min-w-[260px] snap-start overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg md:min-w-0"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={v.image} alt={v.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h4 className="font-heading text-lg">{v.name}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{v.seats} seats · {v.luggage}</p>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{v.bestFor}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--color-navy)]">
                  View Vehicle <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSteps() {
  return (
    <section className="py-16 md:py-20">
      <div className="container-fortune">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">How it works</p>
        <h2 className="mt-3 font-heading text-3xl md:text-4xl">A simple four-step booking</h2>
        <div className="relative mt-10 grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-[color:var(--color-navy)]/20 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="relative rounded-2xl border border-border bg-card p-6">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--color-navy)] font-heading text-lg text-[color:var(--color-cream)]">{s.n}</span>
                <h4 className="mt-4 font-heading text-lg">{s.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChoose() {
  return (
    <section className="bg-[color:var(--color-navy)] py-16 text-[color:var(--color-cream)] md:py-20">
      <div className="container-fortune">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-gold)]">Why Fortune Tourism</p>
        <h2 className="mt-3 font-heading text-3xl md:text-4xl">Bengaluru travel expertise you can rely on</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map(({ icon: Icon, title }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--color-gold)]/20 text-[color:var(--color-gold)]"><Icon className="h-5 w-5" /></span>
              <p className="mt-3 font-heading text-base">{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnquirySection() {
  return (
    <section id="enquiry" className="py-16 md:py-24">
      <div className="container-fortune grid gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">Enquiry</p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl">Tell us about your journey</h2>
          <p className="mt-3 text-muted-foreground">Share your route and dates — our team will send a written quote within 15 minutes.</p>
          <div className="mt-6 space-y-3 text-sm">
            <a href={CONTACT.phoneHref} className="flex items-center gap-3"><Phone className="h-4 w-4 text-[color:var(--color-emerald)]" /> {CONTACT.phone}</a>
            <a href={buildWhatsAppUrl()} target="_blank" rel="noopener" className="flex items-center gap-3"><MessageCircle className="h-4 w-4 text-[color:var(--color-emerald)]" /> WhatsApp us anytime</a>
            <p className="flex items-center gap-3 text-muted-foreground"><Clock className="h-4 w-4" /> {CONTACT.hours}</p>
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-[color:var(--color-cream)] p-5">
            <p className="font-heading text-lg">Frequently asked</p>
            <ul className="mt-3 space-y-3 text-sm">
              {faqs.slice(0, 3).map((f) => (
                <li key={f.q}>
                  <p className="font-semibold text-foreground">{f.q}</p>
                  <p className="mt-1 text-muted-foreground">{f.a}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-lg md:p-8">
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden py-20 text-[color:var(--color-cream)] md:py-28">
      <img src="/images/cta-road.jpg" alt="Scenic South Indian road" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-navy)]/95 via-[color:var(--color-navy)]/80 to-[color:var(--color-navy)]/60" />
      <div className="relative container-fortune max-w-3xl">
        <h2 className="font-heading text-3xl md:text-5xl">Need a travel service that is not listed?</h2>
        <p className="mt-4 text-base opacity-90 md:text-lg">
          Share your route, travel dates, group size and special requirements. Our team will create a suitable travel solution for your journey.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#enquiry" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-semibold text-[color:var(--color-navy)]">
            Send Requirement <ArrowRight className="h-4 w-4" />
          </a>
          <a href={buildWhatsAppUrl()} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)]">
            <MessageCircle className="h-4 w-4" /> WhatsApp Us
          </a>
          <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-cream)]/60 px-6 py-3 text-sm font-semibold text-[color:var(--color-cream)]">
            <Phone className="h-4 w-4" /> Call Now
          </a>
        </div>
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
