import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Users, Briefcase, MapPin, ChevronRight } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact";

import imgHatchback from "@/assets/fleets/white-hatchback.png";
import imgSedan from "@/assets/fleets/white-sedan.png";
import imgPremiumSedan from "@/assets/fleets/white-premium-sedan.png";
import imgSUV from "@/assets/fleets/white-suv.png";
import imgInnovaCrysta from "@/assets/fleets/white-innova-crysta.png";

type Fleet = {
  id: string;
  name: string;
  category: string;
  seats: string;
  luggage: string;
  bestFor: string;
  transmission?: string;
  image: string;
  alt: string;
};

const fleets: Fleet[] = [
  {
    id: "hatchback",
    name: "Hatchback",
    category: "Hatchback",
    seats: "4 + driver",
    luggage: "1–2 bags",
    bestFor: "Nimble city rides and short local trips",
    transmission: "Manual",
    image: imgHatchback,
    alt: "White hatchback on a clean white studio background",
  },
  {
    id: "sedan",
    name: "Sedan",
    category: "Sedan",
    seats: "4 + driver",
    luggage: "2 medium bags",
    bestFor: "Airport transfers, city travel, short outstation",
    transmission: "Manual / Auto",
    image: imgSedan,
    alt: "White sedan on a clean white studio background",
  },
  {
    id: "premium-sedan",
    name: "Premium Sedan",
    category: "Premium Sedan",
    seats: "4 + driver",
    luggage: "2 large + 1 small",
    bestFor: "Corporate travel and VIP airport pickup",
    transmission: "Manual / Auto",
    image: imgPremiumSedan,
    alt: "White premium sedan on a clean white studio background",
  },
  {
    id: "suv",
    name: "SUV",
    category: "SUV",
    seats: "6 + driver",
    luggage: "Large capacity",
    bestFor: "Premium outstation and hill terrain",
    transmission: "Automatic",
    image: imgSUV,
    alt: "White SUV on a clean white studio background",
  },
  {
    id: "innova-crysta",
    name: "Innova Crysta",
    category: "Premium MUV",
    seats: "6–7 + driver",
    luggage: "Large capacity",
    bestFor: "Long-distance, corporate and family tours",
    transmission: "Manual / Auto",
    image: imgInnovaCrysta,
    alt: "White Innova Crysta on a clean white studio background",
  },
];

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setM(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return m;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setR(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return r;
}

export function FleetShowcase() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const usePin = !isMobile && !reduced;

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  const total = fleets.length;

  // Recompute the horizontal distance the track needs to travel.
  useLayoutEffect(() => {
    if (!usePin) {
      setDistance(0);
      return;
    }
    const compute = () => {
      const track = trackRef.current;
      if (!track) return;
      const vw = window.innerWidth;
      const d = Math.max(0, track.scrollWidth - vw);
      setDistance(d);
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", compute);
    window.addEventListener("load", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
      window.removeEventListener("load", compute);
    };
  }, [usePin]);

  // Scroll-driven progress + translate.
  useEffect(() => {
    if (!usePin) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrollable = section.offsetHeight - vh;
        if (scrollable <= 0) return;
        const p = Math.min(1, Math.max(0, -rect.top / scrollable));
        setProgress(p);
        track.style.transform = `translate3d(${(-p * distance).toFixed(2)}px, 0, 0)`;
        // active card = closest to viewport centre
        const centre = window.innerWidth / 2;
        const cards = track.querySelectorAll<HTMLElement>("[data-fleet-card]");
        let best = 0;
        let bestDist = Infinity;
        cards.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const c = r.left + r.width / 2;
          const dd = Math.abs(c - centre);
          if (dd < bestDist) {
            bestDist = dd;
            best = i;
          }
        });
        setActiveIdx(best);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [distance, usePin]);

  // Mobile: swipe-based active tracking.
  useEffect(() => {
    if (usePin) return;
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const centre = track.getBoundingClientRect().left + track.clientWidth / 2;
      const cards = track.querySelectorAll<HTMLElement>("[data-fleet-card]");
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const c = r.left + r.width / 2;
        const d = Math.abs(c - centre);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActiveIdx(best);
      setProgress(total > 1 ? best / (total - 1) : 0);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener("scroll", onScroll);
  }, [usePin, total]);

  const sectionStyle = useMemo<React.CSSProperties>(() => {
    if (!usePin) return {};
    // Vertical scroll length = one viewport for the pin + horizontal distance.
    return { height: `calc(100vh + ${distance}px)` };
  }, [distance, usePin]);

  return (
    <section
      ref={sectionRef}
      className="fleet-showcase-section relative bg-[#f8f5ee]"
      style={sectionStyle}
      aria-label="Fortune Tourism fleet showcase"
    >
      <div
        ref={stickyRef}
        className={
          usePin
            ? "sticky top-0 flex h-screen w-full flex-col overflow-hidden"
            : "relative flex w-full flex-col overflow-hidden py-10"
        }
      >
        {/* Heading row */}
        <div className="mx-auto flex w-full max-w-[1880px] items-end justify-between gap-6 px-5 pt-8 md:px-10 md:pt-12 xl:px-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0E6B50]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0E6B50]">
              Our Fleet
            </span>
            <h2
              className="mt-3 font-[Playfair_Display,serif] font-bold uppercase text-[#12213b]"
              style={{
                fontSize: "clamp(28px, 3vw, 52px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Choose the Perfect Ride
              <br />
              for <span className="text-[#0E6B50]">Every Journey</span>
            </h2>
            <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-[#58616d] md:text-[15px]">
              From nimble hatchbacks to premium sedans, rugged SUVs and the spacious Innova Crysta,
              explore our clean, well-maintained white fleet for Bengaluru and South India travel.
            </p>
          </div>
          <div className="hidden shrink-0 flex-col items-end gap-2 md:flex">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#58616d]">
              {String(activeIdx + 1).padStart(2, "0")} <span className="text-[#0E6B50]/60">/</span>{" "}
              {String(total).padStart(2, "0")}
            </div>
            <div className="h-[3px] w-48 overflow-hidden rounded-full bg-[#0E6B50]/15">
              <div
                className="h-full rounded-full bg-[#0E6B50] transition-[width] duration-150 ease-out"
                style={{ width: `${Math.max(4, progress * 100)}%` }}
              />
            </div>
            {usePin ? (
              <div className="mt-1 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-[#58616d]">
                Scroll to explore <ChevronRight className="h-3 w-3" />
              </div>
            ) : null}
          </div>
        </div>

        {/* Track viewport */}
        <div
          className={
            usePin
              ? "relative mt-6 flex flex-1 items-center overflow-hidden"
              : "relative mt-6 flex w-full items-stretch overflow-x-auto overflow-y-hidden pb-4"
          }
          style={
            usePin ? undefined : { scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }
          }
        >
          <div
            ref={trackRef}
            className="flex items-stretch gap-6 md:gap-8"
            style={{
              paddingLeft: "max(5vw, 40px)",
              paddingRight: "max(5vw, 40px)",
              willChange: usePin ? "transform" : undefined,
              transform: usePin ? "translate3d(0,0,0)" : undefined,
            }}
          >
            {fleets.map((f, i) => (
              <FleetCard
                key={f.id}
                fleet={f}
                index={i}
                total={total}
                active={i === activeIdx}
                mobile={!usePin}
              />
            ))}
            {/* Final CTA panel */}
            <FinalCTAPanel mobile={!usePin} />
          </div>
        </div>

        {/* Mobile progress */}
        {!usePin && (
          <div className="mx-auto mt-3 flex w-full max-w-[1880px] items-center justify-between px-5 md:hidden">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#58616d]">
              {String(activeIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="ml-3 h-[3px] flex-1 overflow-hidden rounded-full bg-[#0E6B50]/15">
              <div
                className="h-full rounded-full bg-[#0E6B50]"
                style={{ width: `${Math.max(4, progress * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function FleetCard({
  fleet,
  index,
  total,
  active,
  mobile,
}: {
  fleet: Fleet;
  index: number;
  total: number;
  active: boolean;
  mobile: boolean;
}) {
  const waHref = buildWhatsAppUrl({
    service: "Fleet Booking",
    vehicle: `${fleet.name} (${fleet.category})`,
    notes: `Enquiry from fleet showcase card ${index + 1} of ${total}`,
  });
  return (
    <article
      data-fleet-card
      className={
        "fleet-showcase-card group relative flex shrink-0 flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_16px_44px_rgba(23,36,31,0.08)] transition-all duration-500 md:h-[min(560px,calc(100vh-320px))] md:flex-row " +
        (active ? "opacity-100" : "opacity-90")
      }
      style={{
        flex: mobile ? "0 0 calc(100vw - 32px)" : "0 0 min(82vw, 1160px)",
        scrollSnapAlign: mobile ? "center" : undefined,
        transform: !mobile && !active ? "scale(0.97)" : "scale(1)",
        outline: active ? "2px solid rgba(14,107,80,0.35)" : "none",
        outlineOffset: active ? "-2px" : undefined,
      }}
      aria-label={`${fleet.name} — ${fleet.category}`}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden md:w-[68%]">
        <div className="aspect-[16/10] w-full md:aspect-auto md:h-full">
          <img
            src={fleet.image}
            alt={fleet.alt}
            width={1600}
            height={1000}
            loading={index < 2 ? "eager" : "lazy"}
            decoding="async"
            className={
              "h-full w-full object-cover transition-transform duration-700 " +
              (active ? "scale-100" : "scale-[1.03]")
            }
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/20" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#0E6B50] backdrop-blur">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-[#0E6B50] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow">
            {fleet.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex w-full flex-col justify-start gap-5 bg-[#fffdf8] p-6 md:w-[32%] md:p-8">
        <div>
          <h3
            className="font-[Playfair_Display,serif] font-bold text-[#12213b]"
            style={{
              fontSize: "clamp(22px, 2vw, 32px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {fleet.name}
          </h3>
          <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[#0E6B50]">
            {fleet.category}
          </p>

          <ul className="mt-5 flex flex-col gap-2.5 text-[13px] text-[#3a4353]">
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#0E6B50]" />
              <span>{fleet.seats}</span>
            </li>
            <li className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#0E6B50]" />
              <span>{fleet.luggage}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0E6B50]" />
              <span>{fleet.bestFor}</span>
            </li>
          </ul>

          {fleet.transmission && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {fleet.transmission.split(" / ").map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[#0E6B50]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0E6B50]"
                >
                  {t}
                </span>
              ))}
              <span className="rounded-full bg-[#0E6B50]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0E6B50]">
                AC
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link
            to="/contact"
            hash="enquiry"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0E6B50] px-5 py-3 text-[13px] font-semibold text-white shadow-md transition hover:bg-[#0b5741] hover:shadow-lg"
          >
            Enquire Now <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-full border-2 border-[#0E6B50] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#12213b] transition hover:bg-[#0E6B50]/5"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </article>
  );
}

function FinalCTAPanel({ mobile }: { mobile: boolean }) {
  const waHref = buildWhatsAppUrl({
    service: "Fleet Booking",
    notes: "Ready to plan a ride — please recommend a vehicle.",
  });
  return (
    <article
      data-fleet-card
      className="fleet-showcase-final relative flex shrink-0 flex-col justify-center overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0E6B50] to-[#0b5741] p-8 text-white shadow-[0_16px_44px_rgba(14,107,80,0.24)] md:p-12"
      style={{
        flex: mobile ? "0 0 calc(100vw - 32px)" : "0 0 min(70vw, 900px)",
        scrollSnapAlign: mobile ? "center" : undefined,
      }}
      aria-label="Plan your ride"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
      />
      <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">
        Fortune Tourism
      </span>
      <h3
        className="mt-2 font-[Playfair_Display,serif] font-bold"
        style={{ fontSize: "clamp(28px, 3vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
      >
        Ready to Plan Your Ride?
      </h3>
      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/85 md:text-[15px]">
        Tell us your route, group size and travel date — we'll recommend the right vehicle from our
        fleet.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/contact"
          hash="enquiry"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[#0E6B50] shadow-md transition hover:brightness-95"
        >
          Enquire Now <ArrowRight className="h-4 w-4" />
        </Link>
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-transparent px-6 py-3 text-[13px] font-semibold text-white transition hover:bg-white/10"
        >
          WhatsApp Us
        </a>
      </div>
    </article>
  );
}

export default FleetShowcase;
