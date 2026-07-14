import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { findPackage } from "@/data/packages";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/tour-packages/$packageId")({
  loader: ({ params }) => {
    const pkg = findPackage(params.packageId);
    if (!pkg) throw notFound();
    return { pkg };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.pkg.title} | Fortune Tourism` : "Package | Fortune Tourism" },
      { name: "description", content: loaderData?.pkg.summary ?? "South India tour package." },
      { property: "og:image", content: loaderData?.pkg.image ?? "" },
    ].filter((m) => m.content !== ""),
  }),
  component: PackageDetail,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-fortune py-20 text-center">
        <h1 className="font-heading text-3xl">Package not found</h1>
        <Link to="/tour-packages" className="mt-4 inline-block text-[color:var(--color-emerald)] underline">Back to packages</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-fortune py-20 text-center">Something went wrong.</div>
    </SiteLayout>
  ),
});

function PackageDetail() {
  const { pkg } = Route.useLoaderData();
  return (
    <SiteLayout>
      <PageHero eyebrow={pkg.duration} title={pkg.title} blurb={pkg.summary} image={pkg.image} />
      <section className="py-16">
        <div className="container-fortune grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Info label="Duration" value={pkg.duration} />
              <Info label="Starts from" value={pkg.from} />
              <Info label="From" value={pkg.startingPrice ? `₹ ${pkg.startingPrice.toLocaleString("en-IN")}` : "Custom quote"} />
            </div>
            <h2 className="mt-10 font-heading text-2xl">Day-wise itinerary</h2>
            <Accordion type="single" collapsible className="mt-4 rounded-2xl border border-border bg-card px-4">
              {pkg.itinerary.map((d: { day: number; title: string; details: string }) => (
                <AccordionItem key={d.day} value={`d${d.day}`} className="border-b last:border-b-0">
                  <AccordionTrigger className="text-left text-base font-medium">Day {d.day} · {d.title}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{d.details}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-heading text-lg">Inclusions</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {pkg.inclusions.map((i: string) => (
                    <li key={i} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-emerald)]" /> {i}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-heading text-lg">Exclusions</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {pkg.exclusions.map((i: string) => (
                    <li key={i} className="flex items-start gap-2"><XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /> {i}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <h3 className="font-heading text-lg">Vehicle options</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {pkg.vehicles.map((v: string) => (
                  <span key={v} className="rounded-full border border-border px-3 py-1.5 text-xs">{v}</span>
                ))}
              </div>
            </div>
          </div>
          <aside className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
            <h2 className="font-heading text-xl">Enquire about this trip</h2>
            <p className="mt-1 text-sm text-muted-foreground">We'll build a written quote for your dates.</p>
            <div className="mt-5">
              <EnquiryForm compact presetService="Tour Package" presetPackage={pkg.title} />
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-lg">{value}</p>
    </div>
  );
}