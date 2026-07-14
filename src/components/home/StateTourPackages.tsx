import { useState } from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { packages, type TourPackage } from "@/data/packages";

type StateSlug = "karnataka" | "andhra-pradesh" | "tamil-nadu" | "kerala" | "puducherry";

const STATES: { slug: StateSlug; title: string; subtitle: string }[] = [
  { slug: "karnataka", title: "Karnataka Tour Packages", subtitle: "Heritage cities, hill stations, beaches and natural wonders." },
  { slug: "andhra-pradesh", title: "Andhra Pradesh Tour Packages", subtitle: "Sacred temples, scenic valleys, beaches and historic landmarks." },
  { slug: "tamil-nadu", title: "Tamil Nadu Tour Packages", subtitle: "Temples, hill stations, coastal beauty and cultural heritage." },
  { slug: "kerala", title: "Kerala Tour Packages", subtitle: "Backwaters, hill stations, beaches and tropical landscapes." },
  { slug: "puducherry", title: "Pondicherry Tour Packages", subtitle: "French heritage, peaceful beaches, cafés and spiritual retreats." },
];

export function StateTourPackages() {
  const [selected, setSelected] = useState<TourPackage | null>(null);

  return (
    <section className="bg-[#F8F2E7] py-16 md:py-20">
      <div className="container-fortune space-y-10 md:space-y-14">
        {STATES.map((s) => {
          const list = packages.filter((p) => p.states.includes(s.slug));
          if (list.length === 0) return null;
          return (
            <StateRow
              key={s.slug}
              title={s.title}
              subtitle={s.subtitle}
              items={list}
              onEnquire={setSelected}
            />
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">
                  Enquire — {selected.title}
                </DialogTitle>
                <DialogDescription>
                  {selected.duration} · {selected.destinations.slice(0, 4).join(", ")}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2 flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="h-16 w-24 rounded-lg object-cover"
                />
                <div className="min-w-0 text-sm">
                  <div className="truncate font-medium">{selected.title}</div>
                  <div className="mt-0.5 text-muted-foreground">
                    From ₹{selected.startingPrice?.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <EnquiryForm
                  presetService="Tour Package"
                  presetPackage={selected.title}
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function StateRow({
  title,
  subtitle,
  items,
  onEnquire,
}: {
  title: string;
  subtitle: string;
  items: TourPackage[];
  onEnquire: (p: TourPackage) => void;
}) {
  return (
    <div className="rounded-3xl border border-[#E8E1D5] bg-white p-5 shadow-[0_10px_30px_rgba(23,76,54,0.06)] md:p-8">
      <Carousel opts={{ align: "start", loop: false }}>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="font-heading text-2xl font-semibold text-[#0D3B2A] md:text-3xl">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-[15px]">
              {subtitle}
            </p>
          </div>
          <div className="relative hidden shrink-0 items-center gap-2 sm:flex">
            <CarouselPrevious className="static translate-y-0 border-[#E8E1D5] text-[#0D3B2A] hover:bg-[#F8F2E7]" />
            <CarouselNext className="static translate-y-0 border-[#E8E1D5] text-[#0D3B2A] hover:bg-[#F8F2E7]" />
          </div>
        </div>

        <CarouselContent className="-ml-4">
          {items.map((p) => (
            <CarouselItem
              key={p.slug}
              className="pl-4 basis-[86%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <PackageCard pkg={p} onEnquire={onEnquire} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

function PackageCard({
  pkg,
  onEnquire,
}: {
  pkg: TourPackage;
  onEnquire: (p: TourPackage) => void;
}) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E8E1D5] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#0D3B2A] px-3 py-1 text-xs font-medium text-white shadow">
          <Clock className="h-3.5 w-3.5" /> {pkg.duration}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-lg font-semibold text-[#0D3B2A] line-clamp-2">
          {pkg.title}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground line-clamp-2">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#174C36]" />
          <span>{pkg.destinations.slice(0, 4).join(" · ")}</span>
        </p>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{pkg.summary}</p>
        {pkg.startingPrice && (
          <p className="mt-3 text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold text-[#0D3B2A]">
              ₹{pkg.startingPrice.toLocaleString("en-IN")}
            </span>
          </p>
        )}
        <button
          type="button"
          onClick={() => onEnquire(pkg)}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#D5A63A] px-4 py-2 text-sm font-semibold text-[#0D3B2A] transition hover:-translate-y-0.5 hover:bg-[#0D3B2A] hover:text-white"
        >
          Enquire Now <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}