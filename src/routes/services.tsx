import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { services } from "@/data/site";
import { ArrowRight, Church, Ticket, Sparkles, Briefcase } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Travel Services in South India | Fortune Tourism" },
      { name: "description", content: "Chauffeur-driven car rentals, custom tour packages, corporate transport, pilgrimage tours and ticket assistance across South India." },
      { property: "og:title", content: "Fortune Tourism Services" },
      { property: "og:description", content: "Everything you need to travel South India." },
    ],
  }),
  component: ServicesPage,
});

const extra = [
  { icon: Church, title: "Pilgrimage tours", blurb: "Tirupati, Rameswaram, Sabarimala and multi-temple circuits." },
  { icon: Sparkles, title: "Custom itineraries", blurb: "Trip planning tailored to your dates, interests and budget." },
  { icon: Ticket, title: "Ticket assistance", blurb: "Help with train, flight and temple entry tickets." },
  { icon: Briefcase, title: "Corporate accounts", blurb: "Monthly billing, GST invoicing and priority dispatch." },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Services"
        title="Complete travel support, one number to call"
        blurb="From a two-hour city ride to a two-week South India loop, Fortune Tourism is a single point of contact for every part of your trip."
      />
      <section className="py-14 md:py-20">
        <div className="container-fortune">
          <h2 className="font-heading text-2xl md:text-3xl">Core services</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 60}>
                <Link to={s.href} className="group block h-full rounded-2xl border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-lg transition">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--color-navy)]/5 text-[color:var(--color-navy)]"><s.icon className="h-6 w-6" /></div>
                  <h3 className="mt-5 font-heading text-xl">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-emerald)]">Explore <ArrowRight className="h-4 w-4" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <h2 className="mt-16 font-heading text-2xl md:text-3xl">Plus, small things that matter</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {extra.map((s, idx) => (
              <Reveal key={s.title} delay={idx * 50}>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--color-emerald)]/10 text-[color:var(--color-emerald)]"><s.icon className="h-5 w-5" /></div>
                  <h4 className="mt-4 font-heading text-lg">{s.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{s.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}