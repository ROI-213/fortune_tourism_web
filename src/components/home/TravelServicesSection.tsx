import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

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
    startDelayMs: 1000,
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
    startDelayMs: 2000,
  },
];

const HEADING_INTERVAL_MS = 3200;

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
  const reduced = usePrefersReducedMotion();
  const headingPhrases = useMemo(
    () => travelServices.map((s) => s.animatedTitle),
    [],
  );

  // Heading rotator — respects tab visibility and reduced motion.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let id: number | undefined;
    const tick = () =>
      setActiveIdx((i) => (i + 1) % headingPhrases.length);
    const start = () => {
      stop();
      id = window.setInterval(tick, HEADING_INTERVAL_MS);
    };
    const stop = () => {
      if (id !== undefined) window.clearInterval(id);
      id = undefined;
    };
    const onVis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [headingPhrases.length]);

  const longestPhrase = useMemo(
    () => headingPhrases.reduce((a, b) => (a.length >= b.length ? a : b)),
    [headingPhrases],
  );

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8">
        <AnimatedServiceHeading
          phrases={headingPhrases}
          activeIdx={activeIdx}
          longestPhrase={longestPhrase}
          reduced={reduced}
        />

        <p className="mx-auto mt-5 max-w-[850px] text-center text-base leading-relaxed text-muted-foreground md:text-lg">
          Comfortable, reliable and carefully planned travel solutions for every
          journey.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-8">
          {travelServices.map((s, idx) => (
            <TravelServiceCard
              key={s.id}
              service={s}
              isActive={idx === activeIdx}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
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
  return (
    <article
      className={
        "group flex h-full flex-col overflow-hidden rounded-[20px] border bg-card transition-all duration-300 ease-out " +
        (isActive
          ? "border-[color:var(--color-emerald)]/70 shadow-[0_18px_40px_-18px_rgba(14,107,80,0.35)] md:-translate-y-1"
          : "border-border shadow-[0_8px_24px_-16px_rgba(11,31,58,0.18)] hover:shadow-[0_16px_36px_-18px_rgba(11,31,58,0.28)]")
      }
    >
      <ServiceImageSlideshow
        images={service.images}
        startDelayMs={service.startDelayMs}
        reduced={reduced}
      />

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 className="font-heading text-[22px] font-semibold text-foreground md:text-[26px]">
          {service.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground md:text-base">
          {service.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-[color:var(--color-lightgrey)] px-3 py-1 text-xs font-medium text-[color:var(--color-navy)]"
            >
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-7">
          <Link
            to={service.href}
            className="group/btn flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-6 text-sm font-bold uppercase tracking-wide text-[color:var(--color-cream)] shadow-[0_10px_24px_-12px_rgba(14,107,80,0.55)] transition-all duration-300 hover:brightness-95 hover:shadow-[0_14px_28px_-12px_rgba(14,107,80,0.65)] active:translate-y-px"
            aria-label={service.buttonLabel}
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
}: {
  images: { src: string; alt: string }[];
  startDelayMs: number;
  reduced: boolean;
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
      className="relative h-[200px] w-full overflow-hidden bg-muted md:h-[220px]"
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