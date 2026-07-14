import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { vehicles } from "@/data/vehicles";
import { VehicleIllustration } from "./index";
import { buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/site/Header";

export const Route = createFileRoute("/car-rentals")({
  head: () => ({
    meta: [
      { title: "Car Rentals in Bengaluru & South India | Fortune Tourism" },
      {
        name: "description",
        content:
          "Chauffeur-driven sedans, SUVs, Innova, tempo travellers and mini buses for local Bengaluru and outstation trips across South India.",
      },
      { property: "og:title", content: "Fortune Tourism Fleet — Chauffeur-driven cars" },
      { property: "og:description", content: "Sedans, SUVs, Innovas & mini buses across South India." },
    ],
  }),
  component: CarRentals,
});

const categories = ["All", "Sedan", "SUV", "Innova", "Tempo Traveller", "Mini Bus"] as const;

function CarRentals() {
  const [cat, setCat] = useState<(typeof categories)[number]>("All");
  const filtered = cat === "All" ? vehicles : vehicles.filter((v) => v.category.includes(cat));
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Car Rentals"
        title="A vehicle for every kind of trip"
        blurb="Chauffeur-driven cars, SUVs and mini buses across Bengaluru and South India — with clean interiors and professional drivers."
      />
      <section className="py-14 md:py-20">
        <div className="container-fortune">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={
                  "rounded-full border px-4 py-2 text-sm transition " +
                  (cat === c
                    ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-[color:var(--color-cream)]"
                    : "border-border text-foreground hover:border-[color:var(--color-navy)]/40")
                }
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((v, idx) => (
              <Reveal key={v.slug} delay={idx * 60}>
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                  <div className="flex h-36 items-center justify-center rounded-xl bg-gradient-to-br from-[color:var(--color-navy)]/5 to-[color:var(--color-emerald)]/10">
                    <VehicleIllustration category={v.category} />
                  </div>
                  <h3 className="mt-4 font-heading text-xl">{v.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{v.summary}</p>
                  <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <li>· {v.seats} seats</li>
                    <li>· {v.luggage}</li>
                    <li className="col-span-2">· {v.bestFor}</li>
                  </ul>
                  <div className="mt-6 flex gap-2">
                    <Link
                      to="/car-rentals/$vehicleId"
                      params={{ vehicleId: v.slug }}
                      className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-navy)]/25 px-4 py-2 text-sm font-medium text-[color:var(--color-navy)]"
                    >
                      View <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href={buildWhatsAppUrl({ vehicle: v.name, service: "Car Rental" })}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-emerald)] px-4 py-2 text-sm font-medium text-[color:var(--color-cream)]"
                    >
                      <WhatsAppIcon className="h-3.5 w-3.5" /> Book
                    </a>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}