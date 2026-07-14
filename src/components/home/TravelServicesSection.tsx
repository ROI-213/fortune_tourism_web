import { Link } from "@tanstack/react-router";
import { ArrowRight, Car, Luggage, Plane, type LucideIcon } from "lucide-react";

import bgImg from "@/assets/services-hero/bg.jpg.asset.json";
import cardCar from "@/assets/services-hero/card-car.jpg.asset.json";
import cardTour from "@/assets/services-hero/card-tour.jpg.asset.json";
import cardAirport from "@/assets/services-hero/card-airport.jpg.asset.json";

type ServiceHref = "/car-rentals" | "/tour-packages" | "/airport-transfer";

interface Service {
  id: string;
  title: string;
  description: string[];
  image: string;
  imageAlt: string;
  buttonLabel: string;
  href: ServiceHref;
  icon: LucideIcon;
}

const services: Service[] = [
  {
    id: "car-rentals",
    title: "Car Rentals",
    description: [
      "Well-maintained vehicles for every journey.",
      "Drive at your pace, in total comfort.",
    ],
    image: cardCar.url,
    imageAlt: "White Toyota Innova driving on a scenic tea-estate road in South India",
    buttonLabel: "View Our Fleet",
    href: "/car-rentals",
    icon: Car,
  },
  {
    id: "tour-packages",
    title: "Tour Packages",
    description: [
      "Handpicked experiences across",
      "iconic destinations.",
    ],
    image: cardTour.url,
    imageAlt: "South Indian temple gopuram reflected in a calm temple pond at sunrise",
    buttonLabel: "Explore Packages",
    href: "/tour-packages",
    icon: Luggage,
  },
  {
    id: "airport-transfers",
    title: "Airport Transfers",
    description: [
      "Timely pickups and drop-offs.",
      "Travel stress-free, every time.",
    ],
    image: cardAirport.url,
    imageAlt: "Chauffeur in a suit standing beside a black luxury sedan at the Bengaluru airport",
    buttonLabel: "Book a Transfer",
    href: "/airport-transfer",
    icon: Plane,
  },
];

export function TravelServicesSection() {
  return (
    <section
      className="relative isolate overflow-hidden py-20 md:py-28"
      aria-labelledby="our-services-heading"
    >
      {/* Background */}
      <img
        src={bgImg.url}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.55) 100%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1240px] px-4 md:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--color-emerald)]">
            Our Services
          </p>
          <span
            aria-hidden="true"
            className="mx-auto mt-2 block h-px w-10 bg-[color:var(--color-emerald)]/60"
          />
          <h2
            id="our-services-heading"
            className="mt-5 font-heading font-bold leading-[1.1] tracking-tight text-[#0F2E23] text-[32px] md:text-[48px] lg:text-[56px]"
          >
            Travel made simple, every step of the way
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-[15px] leading-relaxed text-[#3d4a45] md:text-[17px]">
            Reliable, comfortable, and curated travel solutions tailored to you.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-7 md:mt-16 md:grid-cols-3 md:gap-7">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_25px_60px_-25px_rgba(15,46,35,0.35)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative h-[220px] w-full overflow-hidden md:h-[240px]">
                  <img
                    src={s.image}
                    alt={s.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                </div>

                {/* Icon badge */}
                <div className="relative -mt-8 grid h-16 w-16 place-items-center self-center rounded-full border border-[color:var(--color-emerald)]/20 bg-white text-[color:var(--color-emerald)] shadow-[0_10px_24px_-10px_rgba(15,46,35,0.35)]">
                  <Icon className="h-6 w-6" strokeWidth={1.8} />
                </div>

                <div className="flex flex-1 flex-col px-7 pb-8 pt-4 text-center">
                  <h3 className="font-heading text-[24px] font-bold text-[#0F2E23] md:text-[26px]">
                    {s.title}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="mx-auto mt-2 block h-px w-10 bg-[color:var(--color-emerald)]/60"
                  />
                  <p className="mx-auto mt-4 max-w-[280px] text-[14.5px] leading-relaxed text-[#5a6661] md:text-[15px]">
                    {s.description.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </p>

                  <div className="mt-auto pt-7">
                    <Link
                      to={s.href}
                      aria-label={s.buttonLabel}
                      className="group/btn mx-auto flex h-[52px] w-full items-center justify-center gap-2 rounded-[10px] border-2 border-[color:var(--color-emerald)] bg-transparent px-5 text-[12px] font-bold uppercase tracking-[0.16em] text-[color:var(--color-emerald)] transition-all duration-300 hover:bg-[color:var(--color-emerald)] hover:text-white"
                    >
                      <span>{s.buttonLabel}</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
