import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  Luggage,
  Plane,
  Star,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import carSedan from "@/assets/services/car-sedan.jpg";
import carErtiga from "@/assets/services/car-ertiga.jpg";
import carInnova from "@/assets/services/car-innova.jpg";
import tourMysore from "@/assets/services/tour-mysore.jpg";
import tourKerala from "@/assets/services/tour-kerala.jpg";
import tourOoty from "@/assets/services/tour-ooty.jpg";
import airportTerminal from "@/assets/services/airport-terminal.jpg";
import airportPickup from "@/assets/services/airport-pickup.jpg";
import airportLuggage from "@/assets/services/airport-luggage.jpg";

type ServiceHref = "/car-rentals" | "/tour-packages" | "/airport-transfer";

interface TravelService {
  id: string;
  title: string;
  animatedTitle: string;
  description: string;
  images: { src: string; alt: string }[];
  tags: string[];
  buttonLabel: string;
  href: ServiceHref;
  startDelayMs: number;
  icon: LucideIcon;
  featured?: boolean;
  badge?: string;
}

const travelServices: TravelService[] = [
  {
    id: "car-rentals",
    title: "Car Rentals",
    animatedTitle: "Car Rentals",
    description:
      "Choose clean and comfortable vehicles for local travel, outstation journeys and family trips.",
    images: [
      { src: carSedan, alt: "Clean white sedan on a Bengaluru road" },
      { src: carErtiga, alt: "Silver Ertiga family MPV ready for a road trip" },
      { src: carInnova, alt: "Toyota Innova Crysta on a scenic Karnataka hill road" },
    ],
    tags: ["Sedan", "SUV", "MUV", "Tempo Traveller"],
    buttonLabel: "View Our Fleet",
    href: "/car-rentals",
    startDelayMs: 0,
    icon: Car,
  },
  {
    id: "tour-packages",
    title: "Tour Packages",
    animatedTitle: "Tour Packages",
    description:
      "Explore carefully designed packages covering the most beautiful destinations across South India.",
    images: [
      { src: tourMysore, alt: "Mysore Palace at golden hour, Karnataka" },
      { src: tourKerala, alt: "Traditional Kerala houseboat on the Alleppey backwaters" },
      { src: tourOoty, alt: "Rolling tea plantations near Ooty, Tamil Nadu" },
    ],
    tags: ["Karnataka", "Kerala", "Tamil Nadu", "Andhra Pradesh"],
    buttonLabel: "Explore Packages",
    href: "/tour-packages",
    startDelayMs: 900,
    icon: Luggage,
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "airport-transfers",
    title: "Airport Transfers",
    animatedTitle: "Airport Transfers",
    description:
      "Enjoy punctual Bengaluru airport pickup and drop services with professional drivers and comfortable vehicles.",
    images: [
      { src: airportTerminal, alt: "Bengaluru international airport terminal at dusk" },
      { src: airportPickup, alt: "Chauffeur assisting at an airport pickup" },
      { src: airportLuggage, alt: "Family loading luggage into an MPV at the airport" },
    ],
    tags: ["Airport Pickup", "Airport Drop", "Hotel Transfer", "Corporate Transfer"],
    buttonLabel: "Book a Transfer",
    href: "/airport-transfer",
    startDelayMs: 1800,
    icon: Plane,
  },
];

const HEADING_INTERVAL_MS = 3600;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mql.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function TravelServicesSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [manualNonce, setManualNonce] = useState(0);
  const reduced = usePrefersReducedMotion();
  // Reference the manual nonce so unused-var lint stays quiet after removing
  // the auto-advance heading rotator.
  void manualNonce;

  const goTo = (idx: number) => {
    setActiveIdx(((idx % travelServices.length) + travelServices.length) % travelServices.length);
    setManualNonce((n) => n + 1);
  };

  return (
    <section className="relative overflow-hidden bg-[#F9F5EC] py-20 md:py-28">
      <TravelDecor />
      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-8">
        <h2 className="text-center font-heading font-bold leading-[1.1] tracking-tight text-[#1D1D1D] text-[34px] md:text-[52px] lg:text-[64px]">
          Travel smarter with our{" "}
          <span className="text-[color:var(--color-emerald)]">Tour Packages</span>
        </h2>

        <div className="mx-auto mt-5 flex items-center justify-center gap-4 text-[#C9A84C]" aria-hidden="true">
          <span className="h-px w-24 bg-current opacity-70 md:w-40" />
          <span className="text-sm">✦</span>
          <span className="h-px w-24 bg-current opacity-70 md:w-40" />
        </div>

        <p className="mx-auto mt-5 max-w-[720px] text-center text-[17px] leading-relaxed text-[#666666] md:text-[20px]">
          Comfortable, reliable and carefully planned travel solutions for every
          journey.
        </p>

        <div className="relative mt-14 md:mt-16">
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => goTo(activeIdx - 1)}
            className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white text-[color:var(--color-emerald)] shadow-[0_10px_24px_-12px_rgba(11,31,58,0.25)] transition hover:scale-105 hover:bg-white md:flex lg:-translate-x-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() => goTo(activeIdx + 1)}
            className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 translate-x-5 -translate-y-1/2 items-center justify-center rounded-full border border-black/5 bg-white text-[color:var(--color-emerald)] shadow-[0_10px_24px_-12px_rgba(11,31,58,0.25)] transition hover:scale-105 hover:bg-white md:flex lg:translate-x-8"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-7">
            {travelServices.map((s, idx) => (
              <TravelServiceCard
                key={s.id}
                service={s}
                isActive={idx === activeIdx}
                reduced={reduced}
              />
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-2" role="tablist" aria-label="Active service">
            {travelServices.map((s, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Show ${s.title}`}
                  onClick={() => goTo(idx)}
                  className={
                    "h-2 w-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-emerald)]/60 " +
                    (active
                      ? "bg-[color:var(--color-emerald)]"
                      : "bg-black/15 hover:bg-black/25")
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Decorative background ---------------- */

function TravelDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        className="absolute -left-10 top-8 h-24 w-64 text-[color:var(--color-emerald)]/25 md:h-28 md:w-96"
        viewBox="0 0 400 100"
        fill="none"
      >
        <path d="M2 80 C 80 20, 200 90, 398 30" stroke="currentColor" strokeWidth="1.4" strokeDasharray="4 6" />
      </svg>
      <svg
        className="absolute right-6 top-6 h-8 w-8 text-[color:var(--color-emerald)]/40 md:h-10 md:w-10"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M22 12l-9 3-3 6-2-6-6-2 20-9-0 8z" />
      </svg>
      <svg
        className="absolute right-8 bottom-10 h-14 w-14 text-[color:var(--color-emerald)]/20 md:h-20 md:w-20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    </div>
  );
}

/* ---------------- Animated heading ---------------- */

function AnimatedServiceHeading({
  phrases,
  activeIdx,
  longestPhrase,
  reduced,
}: {
  phrases: string[];
  activeIdx: number;
  longestPhrase: string;
  reduced: boolean;
}) {
  return (
    <h2 className="text-center font-heading text-[28px] font-bold leading-[1.15] tracking-tight text-foreground md:text-[42px] lg:text-[52px]">
      <span className="block sm:inline">Travel smarter with our </span>
      <span
        className="relative mt-1 inline-flex items-center justify-center align-baseline sm:mt-0"
        style={{ minHeight: "1.15em" }}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Invisible sizer reserves width for the longest phrase */}
        <span
          aria-hidden="true"
          className="pointer-events-none invisible whitespace-nowrap px-1 text-[color:var(--color-emerald)]"
        >
          {longestPhrase}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          {phrases.map((p, idx) => {
            const active = idx === activeIdx;
            return (
              <span
                key={p}
                className={
                  "absolute inset-0 flex items-center justify-center whitespace-nowrap px-1 text-[color:var(--color-emerald)] transition-all " +
                  (reduced
                    ? "duration-0 "
                    : "duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] ") +
                  (active
                    ? "translate-y-0 opacity-100 blur-0"
                    : "-translate-y-3 opacity-0 blur-[6px]")
                }
              >
                {p}
              </span>
            );
          })}
        </span>
      </span>
    </h2>
  );
}

/* ---------------- Card ---------------- */

function TravelServiceCard({
  service,
  isActive,
  reduced,
}: {
  service: TravelService;
  isActive: boolean;
  reduced: boolean;
}) {
  const Icon = service.icon;
  return (
    <article
      className={
        "group relative flex h-full flex-col rounded-[24px] bg-white/95 transition-all duration-350 ease-out " +
        (service.featured ? "lg:-my-2 " : "") +
        (isActive
          ? "border-2 border-[color:var(--color-emerald)] shadow-[0_22px_52px_-18px_rgba(14,107,80,0.35),0_0_0_2px_rgba(14,107,80,0.06)] md:-translate-y-1"
          : "border border-[color:var(--color-emerald)]/15 shadow-[0_18px_42px_-22px_rgba(42,48,45,0.22)] hover:shadow-[0_20px_44px_-20px_rgba(11,31,58,0.28)]")
      }
    >
      <div className="relative overflow-hidden rounded-t-[22px]">
        <ServiceImageSlideshow
          images={service.images}
          startDelayMs={service.startDelayMs}
          reduced={reduced}
          featured={!!service.featured}
        />
        {service.badge && (
          <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-emerald)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-lg">
            <Star className="h-3.5 w-3.5 fill-white" />
            {service.badge}
          </div>
        )}
      </div>

      <div className="relative -mt-8 grid h-[62px] w-[62px] place-items-center self-center rounded-full border-[5px] border-white bg-[color:var(--color-emerald)] text-white shadow-[0_10px_22px_-8px_rgba(14,107,80,0.5)]">
        <Icon className="h-6 w-6" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-6 pt-3 text-center md:px-6">
        <h3 className="font-heading text-[22px] font-semibold text-foreground md:text-[24px]">
          {service.title}
        </h3>
        <div className="mx-auto mt-1.5 flex items-center gap-2 text-[color:var(--color-emerald)]/60" aria-hidden="true">
          <span className="h-px w-6 bg-current" />
          <span className="text-[10px]">◆</span>
          <span className="h-px w-6 bg-current" />
        </div>
        <p className="mx-auto mt-3 max-w-[34ch] text-[14px] leading-relaxed text-muted-foreground">
          {service.description}
        </p>

        <ul className="mt-4 flex flex-wrap justify-center gap-2">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full px-3 py-1 text-[11px] font-medium text-[color:var(--color-navy)]"
              style={{ backgroundColor: "rgba(14,107,80,0.08)" }}
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            to={service.href}
            aria-label={service.buttonLabel}
            className={
              "group/btn flex h-[46px] w-full items-center justify-center gap-2 rounded-full px-5 text-[12px] font-bold uppercase tracking-[0.12em] transition-all duration-300 active:translate-y-px " +
              (isActive
                ? "bg-[color:var(--color-emerald)] text-white shadow-[0_12px_26px_-12px_rgba(14,107,80,0.6)] hover:brightness-95"
                : "border-[1.5px] border-[color:var(--color-emerald)] bg-white text-[color:var(--color-emerald)] hover:bg-[color:var(--color-emerald)] hover:text-white")
            }
          >
            <span>{service.buttonLabel}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ---------------- Slideshow ---------------- */

function ServiceImageSlideshow({
  images,
  startDelayMs,
  reduced,
  featured = false,
}: {
  images: { src: string; alt: string }[];
  startDelayMs: number;
  reduced: boolean;
  featured?: boolean;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const startTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (reduced) return; // no auto-advance under reduced motion

    const clearTimer = () => {
      if (timerRef.current !== undefined) {
        window.clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
    const clearStart = () => {
      if (startTimeoutRef.current !== undefined) {
        window.clearTimeout(startTimeoutRef.current);
        startTimeoutRef.current = undefined;
      }
    };

    const advance = () => setI((v) => (v + 1) % images.length);

    const start = () => {
      clearTimer();
      timerRef.current = window.setInterval(advance, 3800);
    };

    const scheduleStart = () => {
      clearStart();
      startTimeoutRef.current = window.setTimeout(() => {
        if (!document.hidden && !paused) start();
      }, startDelayMs);
    };

    const onVis = () => {
      if (document.hidden) {
        clearTimer();
      } else if (!paused) {
        start();
      }
    };

    if (paused) {
      clearTimer();
    } else {
      scheduleStart();
    }

    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearTimer();
      clearStart();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [images.length, paused, reduced, startDelayMs]);

  const goTo = (idx: number) => {
    setI(idx);
    // Restart the auto-timer so the user gets a fresh full window
    if (timerRef.current !== undefined) {
      window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(
        () => setI((v) => (v + 1) % images.length),
        3800,
      );
    }
  };

  return (
    <div
      ref={wrapRef}
      className={
        "relative w-full overflow-hidden bg-muted " +
        (featured
          ? "h-[190px] md:h-[210px] lg:h-[220px]"
          : "h-[180px] md:h-[200px] lg:h-[210px]")
      }
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {images.map((img, idx) => {
        const active = idx === i;
        return (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            loading={idx === 0 ? "eager" : "lazy"}
            decoding="async"
            width={1200}
            height={800}
            className={
              "absolute inset-0 h-full w-full object-cover transition-opacity ease-out " +
              (reduced ? "duration-0 " : "duration-[700ms] ") +
              (active ? "opacity-100" : "opacity-0") +
              " " +
              (active && !reduced ? "kb-zoom" : "")
            }
            aria-hidden={active ? "false" : "true"}
            style={active ? undefined : { pointerEvents: "none" }}
          />
        );
      })}
      {/* subtle bottom gradient only where dots sit */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent" />

      <div
        className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5"
        role="tablist"
        aria-label="Image navigation"
      >
        {images.map((_, idx) => {
          const active = idx === i;
          return (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show image ${idx + 1} of ${images.length}`}
              onClick={() => goTo(idx)}
              className={
                "h-1.5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 " +
                (active
                  ? "w-6 bg-white shadow"
                  : "w-1.5 bg-white/60 hover:bg-white/85")
              }
            />
          );
        })}
      </div>
    </div>
  );
}