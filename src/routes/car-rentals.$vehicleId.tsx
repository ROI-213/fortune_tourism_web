import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { findVehicle, vehicles } from "@/data/vehicles";
import { VehicleIllustration } from "./index";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/car-rentals/$vehicleId")({
  loader: ({ params }) => {
    const vehicle = findVehicle(params.vehicleId);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.vehicle.name} | Fortune Tourism` : "Vehicle | Fortune Tourism" },
      {
        name: "description",
        content: loaderData?.vehicle.summary ?? "Chauffeur-driven vehicle from Fortune Tourism.",
      },
    ],
  }),
  component: VehicleDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-fortune py-20 text-center">
        <h1 className="font-heading text-3xl">Vehicle not found</h1>
        <Link to="/car-rentals" className="mt-4 inline-block text-[color:var(--color-emerald)] underline">Back to fleet</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-fortune py-20 text-center">Something went wrong.</div>
    </SiteLayout>
  ),
});

function VehicleDetail() {
  const { vehicle } = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow="Vehicle" title={vehicle.name} blurb={vehicle.summary} />
      <section className="py-16">
        <div className="container-fortune grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="flex h-64 items-center justify-center rounded-3xl bg-gradient-to-br from-[color:var(--color-navy)]/5 to-[color:var(--color-emerald)]/10">
              <VehicleIllustration category={vehicle.category} />
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
              <Stat label="Seats" value={String(vehicle.seats)} />
              <Stat label="Luggage" value={vehicle.luggage} />
              <Stat label="Category" value={vehicle.category} />
            </div>
            <h2 className="mt-10 font-heading text-2xl">Features</h2>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {vehicle.features.map((f: string) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-emerald)]" /> {f}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">Best for: {vehicle.bestFor}</p>
            <div className="mt-10">
              <h3 className="font-heading text-lg">Other vehicles</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {vehicles.filter((v) => v.slug !== vehicle.slug).map((v) => (
                  <Link key={v.slug} to="/car-rentals/$vehicleId" params={{ vehicleId: v.slug }} className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-[color:var(--color-navy)]/40">
                    {v.category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-heading text-xl">Get a quote for this vehicle</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll pre-fill the vehicle for you.</p>
            <div className="mt-5">
              <EnquiryForm compact presetService="Car Rental" presetVehicle={vehicle.name} />
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-lg">{value}</p>
    </div>
  );
}