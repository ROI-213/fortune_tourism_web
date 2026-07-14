import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  MapPin,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { destinations } from "@/data/destinations";
import { packages } from "@/data/packages";
import { vehicles } from "@/data/vehicles";
import {
  services,
  trustPoints,
  bookingSteps,
  testimonials,
  faqs,
} from "@/data/site";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/site/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fortune Tourism | South India Car Rentals & Tour Packages" },
      {
        name: "description",
        content:
          "Chauffeur-driven car rentals, curated tour packages and Bengaluru airport transfers across Karnataka, Andhra Pradesh, Tamil Nadu, Kerala & Puducherry.",
      },
      { property: "og:title", content: "Fortune Tourism | South India Travel Experts" },
      {
        property: "og:description",
        content: "Cars, tour packages and airport transfers built for the way South India travels.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout transparentHeader>
      <HeroCarousel />
      <QuickEnquiry />
      <ServicesGrid />
      <ExploreSouthIndia />
      <FeaturedPackages />
      <FleetPreview />
      <RouteMap />
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <FAQSection />
      <FinalCTA />
    </SiteLayout>
  );
}

/* --- Hero Carousel --- */
function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = destinations.length;

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setI((v) => (v + 1) % n), 7500);
    return () => window.clearInterval(id);
  }, [paused, n]);

  const go = (d: number) => {
    setPaused(true);
    setI((v) => (v + d + n) % n);
  };

  return (
    <section
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[color:var(--color-navy)] text-[color:var(--color-cream)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {destinations.map((d, idx) => (
        <div
          key={d.slug}
          className={
            "absolute inset-0 transition-opacity duration-1000 ease-out " +
            (idx === i ? "opacity-100" : "opacity-0 pointer-events-none")
          }
          aria-hidden={idx !== i}
        >
          <img
            src={d.image}
            alt={`${d.state} — ${d.highlights.slice(0, 3).join(", ")}`}
            className={"h-full w-full object-cover " + (idx === i ? "animate-kenburns" : "")}
            loading={idx === 0 ? "eager" : "lazy"}
            width={1600}
            height={1000}
          />
          <div className="absolute inset-0 bg-hero-gradient" />
        </div>
      ))}

      <div className="relative z-10 flex h-full flex-col">
        <div className="mt-auto container-fortune pb-28 md:pb-36">
          {destinations.map((d, idx) => (
            <div
              key={d.slug}
              className={
                "max-w-2xl transition-all duration-700 " +
                (idx === i ? "opacity-100 translate-y-0" : "hidden opacity-0 translate-y-4")
              }
            >
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold)]">{d.label}</p>
              <h1 className="mt-4 font-heading text-4xl leading-tight md:text-6xl">
                {d.heading}
              </h1>
              <p className="mt-4 max-w-xl text-base italic opacity-90 md:text-lg">"{d.quote}"</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/tour-packages"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-semibold text-[color:var(--color-navy)] hover:brightness-110"
                >
                  Explore {d.state} <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={buildWhatsAppUrl({ destination: d.state, service: "Tour Package" })}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Plan on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="container-fortune flex items-center justify-between pb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => go(-1)} aria-label="Previous slide" className="rounded-full border border-white/30 p-2 hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(1)} aria-label="Next slide" className="rounded-full border border-white/30 p-2 hover:bg-white/10">
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="ml-3 text-xs opacity-80">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-1 items-center gap-2 pl-6">
            {destinations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setPaused(true); setI(idx); }}
                className="h-0.5 flex-1 overflow-hidden bg-white/25"
                aria-label={`Go to slide ${idx + 1}`}
              >
                <span
                  className={"block h-full bg-[color:var(--color-gold)] transition-all duration-500 " + (idx === i ? "w-full" : "w-0")}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Quick enquiry overlapping the hero --- */
function QuickEnquiry() {
  return (
    <section className="relative -mt-24 md:-mt-20">
      <div className="container-fortune">
        <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-xl md:p-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-emerald)]">Plan in a minute</p>
              <h2 className="mt-1 font-heading text-2xl md:text-3xl">Tell us where you'd like to go</h2>
            </div>
            <p className="text-sm text-muted-foreground">Written quote within 15 minutes.</p>
          </div>
          <EnquiryForm />
        </Reveal>
      </div>
    </section>
  );
}

/* --- Services --- */
function ServicesGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="Our Services" title="Everything you need to travel South India" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, idx) => (
            <Reveal key={s.title} delay={idx * 60}>
              <Link to={s.href} className="group block h-full rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-navy)]/40 hover:shadow-lg">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--color-navy)]/5 text-[color:var(--color-navy)]">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-heading text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-emerald)] group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Explore --- */
function ExploreSouthIndia() {
  return (
    <section className="bg-[color:var(--color-lightgrey)] py-20 md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="Explore" title="Five states, one seamless journey" />
        <div className="mt-12 grid gap-5 md:grid-cols-6 md:grid-rows-2">
          {destinations.map((d, idx) => {
            const spans = [
              "md:col-span-3 md:row-span-2",
              "md:col-span-3",
              "md:col-span-2",
              "md:col-span-4",
              "md:col-span-6",
            ];
            return (
              <Reveal key={d.slug} delay={idx * 80} className={spans[idx]}>
                <Link to="/tour-packages" className="group relative block h-full min-h-[220px] overflow-hidden rounded-2xl">
                  <img
                    src={d.image}
                    alt={d.state}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    loading="lazy"
                    width={1600}
                    height={1000}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-6 text-[color:var(--color-cream)]">
                    <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-gold)]">{d.packageCount} packages</p>
                    <h3 className="mt-2 font-heading text-2xl md:text-3xl">{d.state}</h3>
                    <p className="mt-1 line-clamp-1 text-sm opacity-90">{d.highlights.slice(0, 4).join(" · ")}</p>
                    <span className="mt-3 inline-flex w-max items-center gap-1 rounded-full border border-white/40 px-3 py-1 text-xs font-medium">
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* --- Featured packages --- */
function FeaturedPackages() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="Featured" title="Tour packages built from Bengaluru" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((p, idx) => (
            <Reveal key={p.slug} delay={idx * 60}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" width={1200} height={900} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--color-navy)]">{p.duration}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-heading text-xl">{p.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> from {p.from}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
                    {p.vehicles.slice(0, 3).map((v) => (
                      <span key={v} className="rounded-full bg-[color:var(--color-lightgrey)] px-2 py-0.5">{v}</span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Starting at</p>
                      <p className="font-heading text-lg text-[color:var(--color-navy)]">₹ {p.startingPrice?.toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/tour-packages/$packageId"
                        params={{ packageId: p.slug }}
                        className="inline-flex items-center rounded-full border border-[color:var(--color-navy)]/20 px-3 py-2 text-xs font-medium text-[color:var(--color-navy)] hover:bg-[color:var(--color-navy)]/5"
                      >
                        Details
                      </Link>
                      <a
                        href={buildWhatsAppUrl({ package: p.title, service: "Tour Package" })}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-emerald)] px-3 py-2 text-xs font-medium text-[color:var(--color-cream)]"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" /> Enquire
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Fleet --- */
function FleetPreview() {
  return (
    <section className="bg-[color:var(--color-lightgrey)] py-20 md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="Our Fleet" title="Vehicles for every kind of trip" />
        <div className="mt-12 -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 lg:grid-cols-4">
          {vehicles.map((v, idx) => (
            <Reveal key={v.slug} delay={idx * 40} className="min-w-[260px] snap-start md:min-w-0">
              <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
                <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--color-navy)]/5 to-[color:var(--color-emerald)]/10">
                  <VehicleIllustration category={v.category} />
                </div>
                <h3 className="mt-4 font-heading text-lg">{v.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{v.bestFor}</p>
                <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <li>{v.seats} seats</li>
                  <li>{v.luggage}</li>
                </ul>
                <Link
                  to="/car-rentals/$vehicleId"
                  params={{ vehicleId: v.slug }}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-emerald)]"
                >
                  View vehicle <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VehicleIllustration({ category }: { category: string }) {
  return (
    <svg viewBox="0 0 120 60" className="h-20 w-40 text-[color:var(--color-navy)]" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <title>{category}</title>
      <path d="M8 42h104" strokeLinecap="round" opacity=".2" />
      <path d="M18 42c-4 0-7-3-7-7v-6l6-2 8-10c1.5-2 4-3 6.5-3h39c2.5 0 5 1 6.5 3l8 10 6 2v6c0 4-3 7-7 7" strokeLinejoin="round" />
      <circle cx="34" cy="42" r="6" fill="currentColor" />
      <circle cx="86" cy="42" r="6" fill="currentColor" />
      <path d="M30 30l7-8h20l7 8" opacity=".4" />
    </svg>
  );
}

/* --- Route map --- */
function RouteMap() {
  const stops = ["Bengaluru", "Mysuru", "Coorg", "Ooty", "Tirupati", "Munnar", "Puducherry"];
  return (
    <section className="py-20 md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="On the road" title="Starting from Bengaluru, across South India" center />
        <Reveal className="mt-12">
          <div className="rounded-3xl bg-[color:var(--color-navy)] p-8 text-[color:var(--color-cream)] md:p-12">
            <svg viewBox="0 0 1000 240" className="h-auto w-full">
              <defs>
                <linearGradient id="rline" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--color-gold)" />
                  <stop offset="100%" stopColor="var(--color-emerald)" />
                </linearGradient>
              </defs>
              <path
                d="M40 180 C 150 60, 250 60, 320 140 S 500 220, 580 120 S 780 40, 880 160 L 960 120"
                stroke="url(#rline)"
                strokeWidth="3"
                fill="none"
                className="draw-route"
                strokeLinecap="round"
              />
              {[40, 180, 320, 460, 620, 780, 940].map((x, idx) => (
                <g key={idx}>
                  <circle cx={x} cy={idx % 2 === 0 ? 160 : 100} r="7" fill="var(--color-gold)" />
                  <text x={x} y={idx % 2 === 0 ? 190 : 78} fill="currentColor" fontSize="14" textAnchor="middle" opacity=".9">
                    {stops[idx]}
                  </text>
                </g>
              ))}
            </svg>
            <p className="mt-6 text-center text-sm opacity-80">
              A signature Fortune Tourism arc — cool hills, temple towns, backwaters and coastal calm, all with one chauffeur.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --- Why us --- */
function WhyChooseUs() {
  return (
    <section className="bg-[color:var(--color-lightgrey)] py-20 md:py-28">
      <div className="container-fortune grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl">
            <img src="/images/why-us-driver.jpg" alt="Professional Fortune Tourism chauffeur" loading="lazy" width={1200} height={1400} className="h-full w-full object-cover" />
          </div>
        </Reveal>
        <div>
          <SectionHeader eyebrow="Why travel with us" title="Small details, big journeys" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {trustPoints.map((t, idx) => (
              <Reveal key={t.title} delay={idx * 60}>
                <div className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--color-navy)]/10 text-[color:var(--color-navy)]">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-lg">{t.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{t.blurb}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- How it works --- */
function HowItWorks() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="How it works" title="Booking is refreshingly simple" center />
        <div className="relative mt-14">
          <div className="pointer-events-none absolute left-6 top-0 hidden h-full w-px bg-border md:left-1/2 md:h-px md:w-full md:top-8" />
          <div className="grid gap-8 md:grid-cols-4">
            {bookingSteps.map((s, idx) => (
              <Reveal key={s.n} delay={idx * 100}>
                <div className="relative flex items-start gap-4 md:block">
                  <div className="z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[color:var(--color-gold)] font-heading text-lg font-semibold text-[color:var(--color-navy)] md:mx-auto">
                    {s.n}
                  </div>
                  <div className="md:mt-5 md:text-center">
                    <h4 className="font-heading text-lg">{s.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Testimonials --- */
function Testimonials() {
  const [i, setI] = useState(0);
  const n = testimonials.length;
  return (
    <section className="bg-[color:var(--color-navy)] py-20 text-[color:var(--color-cream)] md:py-28">
      <div className="container-fortune">
        <SectionHeader eyebrow="Traveller stories" title="Loved by families, groups and companies" inverse center />
        <div className="mx-auto mt-12 max-w-3xl">
          <div className="rounded-3xl bg-white/5 p-8 backdrop-blur md:p-10">
            <div className="flex items-center gap-1 text-[color:var(--color-gold)]">
              {Array.from({ length: testimonials[i].rating }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-5 font-heading text-xl md:text-2xl">"{testimonials[i].text}"</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{testimonials[i].name}</p>
                <p className="text-sm opacity-80">{testimonials[i].route} · {testimonials[i].vehicle}</p>
              </div>
              <div className="flex items-center gap-2">
                <button aria-label="Previous" onClick={() => setI((v) => (v - 1 + n) % n)} className="rounded-full border border-white/30 p-2 hover:bg-white/10">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button aria-label="Next" onClick={() => setI((v) => (v + 1) % n)} className="rounded-full border border-white/30 p-2 hover:bg-white/10">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {testimonials.map((_, idx) => (
              <button key={idx} onClick={() => setI(idx)} aria-label={`Review ${idx + 1}`} className={"h-1.5 w-6 rounded-full transition " + (idx === i ? "bg-[color:var(--color-gold)]" : "bg-white/25")} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- FAQ --- */
function FAQSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-fortune grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionHeader eyebrow="Answers" title="Questions travellers usually ask" />
          <p className="mt-4 text-sm text-muted-foreground">Can't find your answer? Message us on WhatsApp — we usually reply within a few minutes.</p>
          <a href={buildWhatsAppUrl()} target="_blank" rel="noreferrer noopener" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-cream)]">
            <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
          </a>
        </div>
        <Reveal>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-4">
            {faqs.map((f, idx) => (
              <AccordionItem key={idx} value={`f${idx}`} className="border-b last:border-b-0">
                <AccordionTrigger className="text-left text-base font-medium">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

/* --- Final CTA --- */
function FinalCTA() {
  return (
    <section className="relative overflow-hidden">
      <img src="/images/cta-road.jpg" alt="Scenic South India road at sunset" loading="lazy" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-navy)]/85 via-[color:var(--color-navy)]/60 to-transparent" />
      <div className="relative container-fortune py-24 text-[color:var(--color-cream)] md:py-32">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--color-gold)]">Ready when you are</p>
          <h2 className="mt-3 font-heading text-3xl md:text-5xl">Your next journey starts with Fortune Tourism</h2>
          <p className="mt-4 max-w-lg text-base opacity-90">
            Tell us where you want to go, and we'll help you choose the right vehicle, route and travel plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={buildWhatsAppUrl()} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-6 py-3 text-sm font-semibold">
              <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              Call {CONTACT.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Shared --- */
function SectionHeader({
  eyebrow,
  title,
  center = false,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  center?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={"text-xs uppercase tracking-[0.3em] " + (inverse ? "text-[color:var(--color-gold)]" : "text-[color:var(--color-emerald)]")}>{eyebrow}</p>
      <h2 className={"mt-3 font-heading text-3xl md:text-4xl " + (inverse ? "text-[color:var(--color-cream)]" : "text-foreground")}>{title}</h2>
    </div>
  );
}

export { SectionHeader };