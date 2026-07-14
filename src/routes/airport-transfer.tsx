import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { Reveal } from "@/components/site/Reveal";
import { Plane, Clock, ShieldCheck, MapPin } from "lucide-react";

export const Route = createFileRoute("/airport-transfer")({
  head: () => ({
    meta: [
      { title: "Bengaluru Airport Transfer & Pickup | Fortune Tourism" },
      { name: "description", content: "On-time Bengaluru airport pickup and drop with clean cars, flight tracking and professional drivers." },
      { property: "og:title", content: "Bengaluru Airport Transfer — Fortune Tourism" },
      { property: "og:description", content: "Flight-tracked airport pickups across Bengaluru." },
    ],
  }),
  component: AirportTransfer,
});

const perks = [
  { icon: Plane, title: "Flight tracking", blurb: "We monitor your flight and adjust pickup time automatically." },
  { icon: Clock, title: "On-time guarantee", blurb: "Drivers arrive at least 15 minutes before your scheduled pickup." },
  { icon: ShieldCheck, title: "Uniformed drivers", blurb: "Background-checked, name-board holding chauffeurs." },
  { icon: MapPin, title: "Anywhere in Bengaluru", blurb: "Pickup and drop across all Bengaluru neighbourhoods." },
];

function AirportTransfer() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Airport Transfer"
        title="Bengaluru airport pickup & drop, done right"
        blurb="Skip the queue and the surge pricing. Book a Fortune Tourism airport transfer with a clean car and a professional chauffeur."
      />
      <section className="py-14 md:py-20">
        <div className="container-fortune grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl">Why travellers choose our airport service</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {perks.map((p, idx) => (
                <Reveal key={p.title} delay={idx * 60}>
                  <div className="flex gap-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--color-navy)]/10 text-[color:var(--color-navy)]">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-heading text-lg">{p.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-10 rounded-2xl bg-[color:var(--color-lightgrey)] p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--color-emerald)]">Popular routes</p>
              <ul className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                <li>· BLR ↔ Whitefield</li>
                <li>· BLR ↔ Electronic City</li>
                <li>· BLR ↔ Koramangala / Indiranagar</li>
                <li>· BLR ↔ Mysuru & Coorg</li>
              </ul>
            </div>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl">Book your transfer</h2>
            <p className="mt-1 text-sm text-muted-foreground">Share your flight time and pickup location.</p>
            <div className="mt-5">
              <EnquiryForm compact presetService="Airport Transfer" />
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}