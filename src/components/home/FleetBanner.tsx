import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import fleetBanner from "@/assets/fleet-banner.jpg";

export function FleetBanner() {
  return (
    <section className="bg-[#f8f5ee] py-10 md:py-14">
      <div className="mx-auto w-[calc(100%-24px)] max-w-[1880px] xl:w-[calc(100%-40px)]">
        {/* Desktop / tablet: integrated banner with curved white panel */}
        <div
          className="relative hidden overflow-hidden rounded-[34px] bg-[#f8f4ec] shadow-[0_14px_36px_rgba(23,36,31,0.1)] md:block"
          style={{ aspectRatio: "2.15 / 1", maxHeight: "740px", minHeight: "500px" }}
        >
          {/* Fleet image full-bleed */}
          <img
            src={fleetBanner}
            alt="Fortune Travels fleet of clean tourism cars parked in a row on a Bengaluru street with a yellow Fortune Travels signboard"
            width={1920}
            height={832}
            loading="lazy"
            className="absolute inset-0 h-full w-[68%] object-cover"
            style={{ objectPosition: "center center" }}
          />

          {/* Soft blend from image into panel */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, transparent 46%, rgba(255,253,248,0.05) 54%, rgba(255,253,248,0.38) 62%, rgba(255,253,248,0.88) 72%, #fffdf8 82%)",
            }}
          />

          {/* Curved white panel (SVG shape for organic curve) */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-y-0 right-0 h-full"
            style={{ width: "48%" }}
          >
            <path
              d="M 30 0 C 12 10, 2 28, 1 50 C 0 72, 12 90, 30 100 L 100 100 L 100 0 Z"
              fill="#fffdf8"
            />
          </svg>

          {/* Panel content */}
          <div className="absolute inset-y-0 right-0 flex w-[42%] flex-col justify-center px-8 lg:px-12 xl:pl-14 xl:pr-[clamp(48px,5vw,110px)]">
            <h2
              className="font-[Playfair_Display,serif] font-bold uppercase text-[#12213b]"
              style={{
                fontSize: "clamp(34px, 3.2vw, 60px)",
                lineHeight: 0.96,
                letterSpacing: "-0.035em",
                maxWidth: "560px",
              }}
            >
              Travel with
              <br />
              <span className="text-[#0E6B50]">Comfort, Style</span>
              <br />
              &amp; Trust.
            </h2>

            <p className="mt-5 max-w-[460px] text-[15px] leading-[1.5] text-[#58616d] lg:text-[17px]">
              Local trips, airport transfers, tour packages and outstation
              rides across Bengaluru and South India.
            </p>

            <p className="mt-4 max-w-[500px] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#087453] lg:text-[13px]">
              Well-maintained vehicles • Professional drivers • Comfortable journeys
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                to="/car-rentals"
                className="inline-flex min-h-[54px] items-center gap-2 rounded-full bg-[#0E6B50] px-7 text-[14px] font-semibold text-white shadow-md transition hover:bg-[#0b5741] hover:shadow-lg"
              >
                View Our Fleet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex min-h-[54px] items-center gap-2 rounded-full border-2 border-[#0E6B50] bg-white px-7 text-[14px] font-semibold text-[#12213b] transition hover:bg-[#0E6B50]/5"
              >
                Book Your Ride
              </Link>
            </div>
          </div>

          {/* Trust badge overlapping panel top-right */}
          <div className="absolute" style={{ top: "8%", right: "3.6%" }}>
            <div className="relative flex items-center justify-center rounded-full bg-[#0E6B50] text-center text-white shadow-[0_12px_30px_rgba(14,107,80,0.3)]"
                 style={{ width: "clamp(115px, 8.5vw, 155px)", aspectRatio: "1" }}
            >
              <span
                aria-hidden
                className="absolute inset-[6px] rounded-full border border-dashed border-white/60"
              />
              <span className="relative px-3 text-[10px] font-bold uppercase leading-[1.3] tracking-[0.08em] lg:text-[12px]">
                Trusted
                <br />
                Bengaluru
                <br />
                Travel
              </span>
            </div>
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="overflow-hidden rounded-3xl bg-[#fffdf8] shadow-[0_16px_40px_rgba(25,35,30,0.08)] md:hidden">
          <div className="relative h-[240px] w-full">
            <img
              src={fleetBanner}
              alt="Fortune Travels fleet on a Bengaluru street"
              width={1920}
              height={832}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute -bottom-8 right-5">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#0E6B50] text-center text-white shadow-lg">
                <span aria-hidden className="absolute inset-1.5 rounded-full border border-dashed border-white/60" />
                <span className="relative px-2 text-[9px] font-bold uppercase leading-[1.2] tracking-wide">
                  Trusted<br />Bengaluru<br />Travel
                </span>
              </div>
            </div>
          </div>
          <div className="px-6 pb-8 pt-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f0ede4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0E6B50]">
              <ShieldCheck className="h-3 w-3" /> Our Fleet
            </span>
            <h2 className="mt-3 font-[Playfair_Display,serif] text-3xl font-bold uppercase leading-[1.02] text-[#12213b]">
              Travel with <span className="text-[#0E6B50]">Comfort, Style</span> &amp; Trust.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4a5260]">
              Local trips, airport transfers, tour packages and outstation rides across Bengaluru and South India.
            </p>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0E6B50]">
              Well-maintained vehicles • Professional drivers • Comfortable journeys
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                to="/car-rentals"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0E6B50] px-6 py-3 text-sm font-semibold text-white shadow-md"
              >
                View Our Fleet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-[#0E6B50]/40 bg-white px-6 py-3 text-sm font-semibold text-[#12213b]"
              >
                Book Your Ride
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FleetBanner;