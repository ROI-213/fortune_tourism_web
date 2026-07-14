import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { packages, type TourPackage } from "@/data/packages";
import { destinations } from "@/data/destinations";
import { buildWhatsAppUrl } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/site/Header";
import { ArrowRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/tour-packages")({
  head: () => ({
    meta: [
      { title: "South India Tour Packages | Fortune Tourism" },
      {
        name: "description",
        content: "Ready-made and customisable tour packages from Bengaluru across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh and Puducherry.",
      },
      { property: "og:title", content: "South India Tour Packages" },
      { property: "og:description", content: "Curated tours from Bengaluru across South India." },
    ],
  }),
  component: TourPackagesPage,
});

function TourPackagesPage() {
  const [state, setState] = useState<string>("all");
  const filtered: TourPackage[] =
    state === "all" ? packages : packages.filter((p) => p.states.includes(state as TourPackage["states"][number]));
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Tour Packages"
        title="Curated South India journeys"
        blurb="Weekend escapes, temple runs, hill stations and multi-state loops — all starting from Bengaluru."
      />
      <section className="py-14 md:py-20">
        <div className="container-fortune">
          <div className="flex flex-wrap gap-2">
            <FilterChip active={state === "all"} onClick={() => setState("all")}>All</FilterChip>
            {destinations.map((d) => (
              <FilterChip key={d.slug} active={state === d.slug} onClick={() => setState(d.slug)}>
                {d.state}
              </FilterChip>
            ))}
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, idx) => (
              <Reveal key={p.slug} delay={idx * 50}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={p.image} alt={p.title} loading="lazy" width={1200} height={900} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[color:var(--color-navy)]">{p.duration}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-heading text-xl">{p.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {p.destinations.slice(0, 3).join(", ")}</p>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{p.summary}</p>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground">From</p>
                        <p className="font-heading text-lg text-[color:var(--color-navy)]">₹ {p.startingPrice?.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link to="/tour-packages/$packageId" params={{ packageId: p.slug }} className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-navy)]/25 px-3 py-2 text-xs font-medium text-[color:var(--color-navy)]">
                          Details <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                        <a href={buildWhatsAppUrl({ package: p.title, service: "Tour Package" })} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-emerald)] px-3 py-2 text-xs font-medium text-[color:var(--color-cream)]">
                          <WhatsAppIcon className="h-3.5 w-3.5" />
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
    </SiteLayout>
  );
}

function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-4 py-2 text-sm transition " +
        (active
          ? "border-[color:var(--color-navy)] bg-[color:var(--color-navy)] text-[color:var(--color-cream)]"
          : "border-border text-foreground hover:border-[color:var(--color-navy)]/40")
      }
    >
      {children}
    </button>
  );
}