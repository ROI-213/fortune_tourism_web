import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import fleetBanner from "@/assets/fleet-banner.jpg";

export function FleetBanner() {
  return (
    <section className="bg-[color:var(--background)] py-14 md:py-20">
      <div className="mx-auto w-[calc(100%-24px)] max-w-[1880px] md:w-[calc(100%-40px)]">
        <div className="relative overflow-hidden rounded-[28px] bg-[#f4efe6] shadow-[0_30px_80px_-40px_rgba(11,31,58,0.35)] ring-1 ring-black/5">
          <div className="grid gap-0 md:grid-cols-[1.35fr_1fr]">
            {/* Image side */}
            <div className="relative min-h-[320px] md:min-h-[520px]">
              <img
                src={fleetBanner}
                alt="Fortune Travels fleet of clean tourism cars parked on a Bengaluru street with a yellow Fortune Travels signboard"
                width={1920}
                height={912}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Soft right fade so overlay content stays readable on md+ */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 md:block"
                style={{
                  background:
                    "linear-gradient(to right, rgba(244,239,230,0) 0%, rgba(244,239,230,0.85) 60%, #f4efe6 100%)",
                }}
              />
            </div>

            {/* Text side */}
            <div className="relative flex flex-col justify-center gap-5 px-6 py-8 md:px-10 md:py-12 lg:px-14">
              {/* Badge */}
              <div className="absolute right-6 top-6 hidden md:block">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#0E6B50] text-center text-[10px] font-semibold uppercase leading-tight tracking-wide text-white shadow-lg lg:h-28 lg:w-28 lg:text-[11px]">
                  <span className="px-2">
                    Trusted
                    <br />
                    Bengaluru
                    <br />
                    Travel
                  </span>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-[color:var(--primary)] ring-1 ring-black/5">
                <ShieldCheck className="h-3.5 w-3.5" /> Our Fleet
              </span>

              <h2 className="font-[Playfair_Display,serif] text-3xl font-bold leading-[1.05] text-[#0B1F3A] md:text-4xl lg:text-5xl xl:text-[52px]">
                TRAVEL WITH{" "}
                <span className="text-[#0E6B50]">COMFORT, STYLE</span> &amp; TRUST
              </h2>

              <p className="max-w-xl text-sm leading-relaxed text-[#3a4049] md:text-base">
                Local trips, airport transfers, tour packages and outstation
                rides across Bengaluru and South India.
              </p>

              <p className="text-xs font-medium uppercase tracking-wider text-[#0E6B50] md:text-sm">
                Well-maintained vehicles • Professional drivers • Comfortable journeys
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/car-rentals"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0E6B50] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#0b5741] hover:shadow-lg"
                >
                  View Our Fleet <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-[#0B1F3A]/20 bg-white px-6 py-3 text-sm font-semibold text-[#0B1F3A] transition hover:border-[#0B1F3A]/40"
                >
                  Book Your Ride
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FleetBanner;