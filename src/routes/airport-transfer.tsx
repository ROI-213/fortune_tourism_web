import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Reveal } from "@/components/site/Reveal";
import { useMemo, useState } from "react";
import {
  Plane, Clock, ShieldCheck, MapPin, Phone, MessageCircle, ChevronDown,
  Users, Briefcase, Check, ArrowRight, Search, PlaneTakeoff, PlaneLanding, Repeat,
} from "lucide-react";
import { CONTACT, buildWhatsAppUrl } from "@/lib/contact";

export const Route = createFileRoute("/airport-transfer")({
  head: () => ({
    meta: [
      { title: "Bengaluru Airport Taxi — 24×7 Pickup & Drop | Fortune Tourism" },
      { name: "description", content: "Book a Bengaluru Kempegowda Airport pickup or drop with clean vehicles, professional drivers and flight coordination. 24×7 across all Bengaluru areas." },
      { property: "og:title", content: "Bengaluru Airport Transfer — Fortune Tourism" },
      { property: "og:description", content: "Reliable BLR airport pickup & drop across North, South, East, West and Central Bengaluru." },
      { property: "og:image", content: "/images/airport/hero-airport-transfer.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AirportTransfer,
});

type TransferType = "pickup" | "drop" | "round";

const TRANSFER_TYPES: { id: TransferType; title: string; blurb: string; Icon: typeof Plane }[] = [
  { id: "pickup", title: "Airport Pickup", blurb: "Pickup from Kempegowda International Airport and drop at your Bengaluru location.", Icon: PlaneLanding },
  { id: "drop", title: "Airport Drop", blurb: "Pickup from your Bengaluru address and drop at Kempegowda International Airport.", Icon: PlaneTakeoff },
  { id: "round", title: "Round Trip", blurb: "Book both your airport drop and return airport pickup.", Icon: Repeat },
];

const DIRECTIONS: { id: string; name: string; areas: string[] }[] = [
  { id: "north", name: "North Bengaluru", areas: ["Yelahanka","Hebbal","Jakkur","Sahakar Nagar","Devanahalli","Thanisandra","Hennur","Nagawara","RT Nagar","Kodigehalli"] },
  { id: "south", name: "South Bengaluru", areas: ["Jayanagar","JP Nagar","Banashankari","Bannerghatta Road","Electronic City","BTM Layout","HSR Layout","Bommanahalli","Kanakapura Road","Uttarahalli"] },
  { id: "east",  name: "East Bengaluru",  areas: ["Whitefield","Marathahalli","KR Puram","Mahadevapura","Bellandur","Brookefield","Indiranagar","Sarjapur Road","Kadugodi","Hoodi"] },
  { id: "west",  name: "West Bengaluru",  areas: ["Rajajinagar","Vijayanagar","Nagarbhavi","Kengeri","Yeshwanthpur","Malleshwaram","Basaveshwaranagar","Peenya","Magadi Road","RR Nagar"] },
  { id: "central", name: "Central Bengaluru", areas: ["Majestic","MG Road","Shivajinagar","Richmond Road","Vasanth Nagar","Cubbon Park","Cunningham Road","Residency Road","Brigade Road","Shantinagar"] },
];

const VEHICLES = [
  { id: "sedan", name: "Sedan", examples: "Maruti Dzire · Honda Amaze · Hyundai Aura", seats: 4, bags: "2–3 bags", best: "Solo, couples, business travel", image: "/images/fleet/car-sedan.jpg" },
  { id: "premium-sedan", name: "Premium Sedan", examples: "Honda City · Hyundai Verna · Skoda Slavia", seats: 4, bags: "2–3 bags", best: "Corporate & executive pickup", image: "/images/fleet/car-premium-sedan.jpg" },
  { id: "suv", name: "SUV / MUV", examples: "Maruti Ertiga · Toyota Rumion · Kia Carens", seats: 6, bags: "3–4 bags", best: "Families with extra luggage", image: "/images/fleet/car-suv.jpg" },
  { id: "innova", name: "Innova", examples: "Toyota Innova", seats: 7, bags: "4–5 bags", best: "Family airport travel & groups", image: "/images/fleet/car-innova.jpg" },
  { id: "crysta", name: "Innova Crysta", examples: "Toyota Innova Crysta", seats: 7, bags: "4–5 bags", best: "Premium family & executive travel", image: "/images/fleet/car-crysta.jpg" },
  { id: "tempo", name: "Tempo Traveller", examples: "Force Urbania · Traveller 12/17", seats: 17, bags: "12+ bags", best: "Groups, weddings, corporate", image: "/images/fleet/car-tempo.jpg" },
  { id: "minibus", name: "Mini Bus", examples: "20–25 seater coach", seats: 25, bags: "20+ bags", best: "Large groups & delegations", image: "/images/fleet/car-minibus.jpg" },
];

const PERKS = [
  { Icon: Clock, title: "24×7 Service", blurb: "Early morning, late night — pickups and drops any hour." },
  { Icon: ShieldCheck, title: "Professional Drivers", blurb: "Background-checked, uniformed and airport-familiar chauffeurs." },
  { Icon: Plane, title: "Flight Coordination", blurb: "Share your flight number and we coordinate the pickup time." },
  { Icon: MapPin, title: "All Bengaluru Areas", blurb: "North, South, East, West and Central Bengaluru covered." },
];

const FAQS = [
  { q: "Are airport transfers available at night?", a: "Yes, Fortune Tourism operates 24×7. Night charges may apply between 10 PM and 6 AM depending on the vehicle and route." },
  { q: "What happens if my flight is delayed?", a: "Share your flight number at the time of booking. Our team coordinates the pickup based on the updated arrival, subject to the confirmed waiting policy." },
  { q: "Are waiting charges applicable?", a: "A reasonable free waiting time is included. Extended waiting beyond that is charged as per the confirmed quotation." },
  { q: "Which terminal should I select?", a: "Choose Terminal 1 or Terminal 2 if you know it, or select Not Sure — the team will confirm using your flight number." },
  { q: "How much luggage can I carry?", a: "Luggage capacity depends on the vehicle. Sedans fit 2–3 bags; Innova / Crysta and SUVs comfortably fit 4–5 bags." },
  { q: "When will I receive driver details?", a: "Driver name, vehicle number and contact are shared shortly before the scheduled pickup time." },
  { q: "Can I book a round trip?", a: "Yes — you can book an airport drop and a return pickup together in a single enquiry." },
  { q: "Can I add multiple pickup points?", a: "Additional pickup or drop points can be added on request. Charges depend on distance and vehicle." },
  { q: "Is airport parking included?", a: "Airport parking is billed at actuals in most cases and will be reflected in the final quotation." },
  { q: "What payment methods are available?", a: "UPI, bank transfer and cash are accepted. Corporate invoicing is available on request." },
  { q: "What is the cancellation policy?", a: "Cancellations made well in advance are typically free. Late cancellations may attract a nominal charge — the current policy is shared with your quotation." },
  { q: "Is meet-and-greet available?", a: "Yes — meet-and-greet with a name board can be arranged at pickup on request." },
];

function AirportTransfer() {
  const [type, setType] = useState<TransferType>("pickup");
  const [dirId, setDirId] = useState<string>("north");
  const [area, setArea] = useState<string>("");
  const [areaQuery, setAreaQuery] = useState("");
  const [address, setAddress] = useState("");
  const [terminal, setTerminal] = useState<string>("T2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [flight, setFlight] = useState("");
  const [pax, setPax] = useState(2);
  const [bags, setBags] = useState(2);
  const [vehicleId, setVehicleId] = useState<string>("sedan");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);

  const direction = DIRECTIONS.find((d) => d.id === dirId)!;
  const filteredAreas = useMemo(
    () => direction.areas.filter((a) => a.toLowerCase().includes(areaQuery.toLowerCase())),
    [direction, areaQuery]
  );

  const recommendedId = useMemo(() => {
    if (pax >= 13) return "minibus";
    if (pax >= 8) return "tempo";
    if (pax >= 6) return "crysta";
    if (pax >= 5 || bags >= 4) return "suv";
    if (pax >= 4) return "suv";
    return "sedan";
  }, [pax, bags]);

  const selectedVehicle = VEHICLES.find((v) => v.id === vehicleId)!;
  const capacityWarning = pax > selectedVehicle.seats;

  const waLink = () =>
    buildWhatsAppUrl({
      service: `Airport ${type === "pickup" ? "Pickup" : type === "drop" ? "Drop" : "Round Trip"} · Terminal ${terminal}`,
      vehicle: `${selectedVehicle.name} (${selectedVehicle.examples})`,
      pickup: type === "drop" ? `${address}, ${area}, ${direction.name}` : `Kempegowda International Airport · Terminal ${terminal}`,
      destination: type === "drop" ? `Kempegowda International Airport · Terminal ${terminal}` : `${address}, ${area}, ${direction.name}`,
      date,
      passengers: `${pax} pax · ${bags} bags${flight ? ` · Flight ${flight}` : ""}${time ? ` · ${time}` : ""}`,
      name,
      phone: mobile,
      notes,
    });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/airport/hero-airport-transfer.jpg"
            alt="Innova Crysta at Kempegowda International Airport Bengaluru pickup zone"
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
        </div>
        <div className="container-fortune relative z-10 flex min-h-[440px] flex-col justify-end py-10 md:min-h-[520px] md:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-white/70">
            <a href="/" className="hover:text-white">Home</a> <span className="mx-1">/</span> <span className="text-white">Airport Transfer</span>
          </nav>
          <h1 className="mt-4 max-w-2xl font-heading text-3xl leading-tight text-white md:text-5xl">
            Reliable Bengaluru Airport Transfers
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/85 md:text-base">
            24×7 airport pickup and drop with clean vehicles, professional drivers and reliable travel across Bengaluru.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#booking" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-5 py-3 text-sm font-medium text-white shadow-lg hover:opacity-95">
              Book Airport Taxi <ArrowRight className="h-4 w-4" />
            </a>
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur hover:bg-white/20">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/80">
            {["24×7 Service","Professional Drivers","Clean Vehicles","Flight Coordination","All Bengaluru Areas"].map((t) => (
              <li key={t} className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[color:var(--color-emerald)]" />{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* QUICK BOOKING WIDGET */}
      <section className="relative z-20 -mt-6 md:-mt-10">
        <div className="container-fortune">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl md:p-6">
            <div className="grid gap-3 md:grid-cols-6">
              <div className="md:col-span-1">
                <label className="text-xs text-muted-foreground">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value as TransferType)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option value="pickup">Pickup</option>
                  <option value="drop">Drop</option>
                  <option value="round">Round Trip</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Direction</label>
                <select value={dirId} onChange={(e) => { setDirId(e.target.value); setArea(""); }} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  {DIRECTIONS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Area</label>
                <select value={area} onChange={(e) => setArea(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
                  <option value="">Select area…</option>
                  {direction.areas.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Time</label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
              </div>
              <div className="flex items-end">
                <a href="#booking" className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[color:var(--color-navy)] px-4 py-2.5 text-sm font-medium text-white hover:opacity-95">
                  Get Quote <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSFER TYPE CARDS */}
      <section className="py-12 md:py-16">
        <div className="container-fortune">
          <h2 className="font-heading text-2xl md:text-3xl">Choose your transfer type</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TRANSFER_TYPES.map(({ id, title, blurb, Icon }) => {
              const active = type === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setType(id)}
                  className={`group relative rounded-2xl border p-6 text-left transition-all ${active ? "border-[color:var(--color-emerald)] bg-[color:var(--color-emerald)]/5 shadow-md" : "border-border bg-card hover:border-[color:var(--color-navy)]/40 hover:shadow"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid h-11 w-11 place-items-center rounded-full ${active ? "bg-[color:var(--color-emerald)] text-white" : "bg-[color:var(--color-navy)]/10 text-[color:var(--color-navy)]"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-lg">{title}</h3>
                    {active && <Check className="ml-auto h-5 w-5 text-[color:var(--color-emerald)]" />}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{blurb}</p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* DIRECTION & AREA */}
      <section className="bg-[color:var(--color-lightgrey)] py-12 md:py-16">
        <div className="container-fortune">
          <h2 className="font-heading text-2xl md:text-3xl">Select your Bengaluru area</h2>
          <p className="mt-2 text-sm text-muted-foreground">Pick a direction, then choose your neighbourhood.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DIRECTIONS.map((d) => {
              const active = dirId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => { setDirId(d.id); setArea(""); setAreaQuery(""); }}
                  className={`rounded-xl border p-4 text-left transition-all ${active ? "border-[color:var(--color-emerald)] bg-white shadow" : "border-border bg-white/60 hover:bg-white"}`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className={`h-4 w-4 ${active ? "text-[color:var(--color-emerald)]" : "text-[color:var(--color-navy)]"}`} />
                    <span className="font-medium">{d.name}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{d.areas.length} areas</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-heading text-lg">{direction.name}</h3>
              <div className="ml-auto flex items-center gap-2 rounded-md border border-border px-3 py-1.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={areaQuery}
                  onChange={(e) => setAreaQuery(e.target.value)}
                  placeholder="Search your Bengaluru area"
                  className="w-56 bg-transparent text-sm outline-none"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {filteredAreas.map((a) => {
                const active = area === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setArea(a)}
                    className={`rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-[color:var(--color-emerald)] bg-[color:var(--color-emerald)] text-white" : "border-border bg-background hover:border-[color:var(--color-navy)]/40"}`}
                  >
                    {a}
                  </button>
                );
              })}
              {filteredAreas.length === 0 && (
                <p className="text-sm text-muted-foreground">No matching areas — you can enter another Bengaluru location in the booking form below.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* VEHICLE SELECTION */}
      <section className="py-12 md:py-16">
        <div className="container-fortune">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-heading text-2xl md:text-3xl">Select your vehicle</h2>
              <p className="mt-2 text-sm text-muted-foreground">Recommended for {pax} passenger{pax > 1 ? "s" : ""} and {bags} bag{bags > 1 ? "s" : ""}.</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <label className="flex items-center gap-2"><Users className="h-4 w-4" /> Pax
                <input type="number" min={1} max={30} value={pax} onChange={(e) => setPax(Math.max(1, +e.target.value || 1))} className="w-16 rounded-md border border-border bg-background px-2 py-1" />
              </label>
              <label className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Bags
                <input type="number" min={0} max={30} value={bags} onChange={(e) => setBags(Math.max(0, +e.target.value || 0))} className="w-16 rounded-md border border-border bg-background px-2 py-1" />
              </label>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLES.map((v) => {
              const active = vehicleId === v.id;
              const recommended = v.id === recommendedId;
              return (
                <Reveal key={v.id}>
                  <div className={`overflow-hidden rounded-2xl border bg-card transition-all ${active ? "border-[color:var(--color-emerald)] shadow-md" : "border-border hover:shadow"}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img src={v.image} alt={v.name} loading="lazy" className="h-full w-full object-cover" />
                      {recommended && (
                        <span className="absolute left-3 top-3 rounded-full bg-[color:var(--color-emerald)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">Recommended</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-heading text-lg">{v.name}</h3>
                          <p className="text-xs text-muted-foreground">{v.examples}</p>
                        </div>
                        {active && <Check className="h-5 w-5 text-[color:var(--color-emerald)]" />}
                      </div>
                      <ul className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <li className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {v.seats} pax</li>
                        <li className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {v.bags}</li>
                        <li className="col-span-2">Best for: {v.best}</li>
                      </ul>
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setVehicleId(v.id)}
                          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${active ? "bg-[color:var(--color-emerald)] text-white" : "bg-[color:var(--color-navy)] text-white hover:opacity-95"}`}
                        >
                          {active ? "Selected" : "Select"}
                        </button>
                        <a href="/car-rentals" className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">Details</a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          {capacityWarning && (
            <p className="mt-6 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              This vehicle may not provide enough seating for {pax} passengers. Please select a larger option.
            </p>
          )}
        </div>
      </section>

      {/* BOOKING FORM */}
      <section id="booking" className="bg-[color:var(--color-lightgrey)] py-12 md:py-16">
        <div className="container-fortune grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-white p-6 md:p-8">
            <h2 className="font-heading text-2xl">Airport transfer details</h2>
            <p className="mt-1 text-sm text-muted-foreground">Fill the details below — we'll confirm availability and pricing.</p>

            <fieldset className="mt-6 grid gap-4 md:grid-cols-2">
              <legend className="col-span-full text-xs font-medium uppercase tracking-wider text-[color:var(--color-emerald)]">1 · Transfer</legend>
              <Field label="Full pickup / drop address" required>
                <input value={address} onChange={(e) => setAddress(e.target.value)} required className="input" placeholder="House / Building, Street, Landmark" />
              </Field>
              <Field label="Airport terminal">
                <select value={terminal} onChange={(e) => setTerminal(e.target.value)} className="input">
                  <option value="T1">Terminal 1</option>
                  <option value="T2">Terminal 2</option>
                  <option value="not-sure">Not Sure</option>
                  <option value="from-flight">Confirm Using Flight Number</option>
                </select>
              </Field>
            </fieldset>

            <fieldset className="mt-6 grid gap-4 md:grid-cols-3">
              <legend className="col-span-full text-xs font-medium uppercase tracking-wider text-[color:var(--color-emerald)]">2 · Date & flight</legend>
              <Field label="Travel date" required>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="input" />
              </Field>
              <Field label="Pickup time" required>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required className="input" />
              </Field>
              <Field label="Flight number">
                <input value={flight} onChange={(e) => setFlight(e.target.value)} className="input" placeholder="e.g. 6E 812" />
              </Field>
            </fieldset>

            <fieldset className="mt-6 grid gap-4 md:grid-cols-3">
              <legend className="col-span-full text-xs font-medium uppercase tracking-wider text-[color:var(--color-emerald)]">3 · Passengers & luggage</legend>
              <Field label="Passengers" required>
                <input type="number" min={1} max={30} value={pax} onChange={(e) => setPax(Math.max(1, +e.target.value || 1))} className="input" />
              </Field>
              <Field label="Bags" required>
                <input type="number" min={0} max={30} value={bags} onChange={(e) => setBags(Math.max(0, +e.target.value || 0))} className="input" />
              </Field>
              <Field label="Vehicle">
                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="input">
                  {VEHICLES.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </Field>
            </fieldset>

            <fieldset className="mt-6 grid gap-4 md:grid-cols-2">
              <legend className="col-span-full text-xs font-medium uppercase tracking-wider text-[color:var(--color-emerald)]">4 · Your details</legend>
              <Field label="Full name" required>
                <input value={name} onChange={(e) => setName(e.target.value)} required className="input" />
              </Field>
              <Field label="Mobile number" required>
                <input value={mobile} onChange={(e) => setMobile(e.target.value)} required pattern="[0-9+ ]{8,}" className="input" placeholder="+91 …" />
              </Field>
              <Field label="Special instructions" className="md:col-span-2">
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="input" placeholder="Meet & greet, child seat, waiting time, etc." />
              </Field>
            </fieldset>

            {submitted ? (
              <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                Thank you. Your Bengaluru airport-transfer request has been received. The Fortune Tourism team will confirm availability, pricing and driver details shortly.
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-navy)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95">
                Request Airport Quote <ArrowRight className="h-4 w-4" />
              </button>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-emerald)] px-5 py-2.5 text-sm font-medium text-white hover:opacity-95">
                <MessageCircle className="h-4 w-4" /> Continue on WhatsApp
              </a>
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
                <Phone className="h-4 w-4" /> Call Now
              </a>
            </div>
          </form>

          {/* SUMMARY */}
          <aside className="rounded-2xl border border-border bg-white p-6 md:p-8 lg:sticky lg:top-24 h-fit">
            <h3 className="font-heading text-xl">Booking summary</h3>
            <dl className="mt-4 divide-y divide-border text-sm">
              <Row k="Transfer" v={type === "pickup" ? "Airport Pickup" : type === "drop" ? "Airport Drop" : "Round Trip"} />
              <Row k="Direction" v={direction.name} />
              <Row k="Area" v={area || "—"} />
              <Row k="Terminal" v={terminal} />
              <Row k="Date · Time" v={`${date || "—"} · ${time || "—"}`} />
              <Row k="Flight" v={flight || "—"} />
              <Row k="Passengers · Bags" v={`${pax} · ${bags}`} />
              <Row k="Vehicle" v={selectedVehicle.name} />
              <Row k="Fare" v="Get Quote" />
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Final pricing may vary based on pickup location, vehicle, travel time, tolls, airport parking, night travel, waiting time and additional stops.
            </p>
          </aside>
        </div>
      </section>

      {/* TRUST & HOW IT WORKS */}
      <section className="py-12 md:py-16">
        <div className="container-fortune">
          <h2 className="font-heading text-2xl md:text-3xl">Why travellers choose Fortune Tourism</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p) => (
              <div key={p.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[color:var(--color-navy)]/10 text-[color:var(--color-navy)]">
                  <p.Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-3 font-heading text-lg">{p.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <h2 className="font-heading text-2xl md:text-3xl">How airport transfer works</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-4">
              {[
                "Choose pickup or drop.",
                "Select your Bengaluru location and airport terminal.",
                "Choose a suitable vehicle based on passengers and luggage.",
                "Receive confirmation, driver details and pickup instructions.",
              ].map((step, i) => (
                <li key={i} className="rounded-2xl border border-border bg-card p-5">
                  <div className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-emerald)]">Step {i + 1}</div>
                  <p className="mt-2 text-sm">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* PICKUP & DROP GUIDANCE */}
      <section className="bg-[color:var(--color-lightgrey)] py-12 md:py-16">
        <div className="container-fortune grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-heading text-xl">Airport pickup instructions</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>· Confirm your terminal before travel</li>
              <li>· Keep your phone reachable after landing</li>
              <li>· Driver contact is shared before pickup</li>
              <li>· Follow the confirmed pickup-zone instructions</li>
              <li>· Meet-and-greet with a name board on request</li>
              <li>· Reasonable waiting time is included; extended delays are billed as per quote</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-heading text-xl">Airport drop guidance</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>· Plan sufficient travel time based on Bengaluru traffic</li>
              <li>· Domestic: reach at least 2 hours prior; International: 3+ hours prior</li>
              <li>· Extra time needed for luggage loading and multiple pickups</li>
              <li>· Confirm the correct terminal (T1 or T2)</li>
              <li>· Additional stops can be added on request</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-12 md:py-16">
        <div className="container-fortune rounded-2xl border border-border bg-card p-6 md:p-8">
          <h2 className="font-heading text-2xl md:text-3xl">Transparent pricing</h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Get a customised airport-transfer quotation based on your Bengaluru location, travel time, vehicle type and luggage requirements.
          </p>
          <div className="mt-6 grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
            {["Base airport-transfer rate","Area or direction surcharge","Vehicle category","Night charges (10 PM – 6 AM)","Airport parking (at actuals)","Toll charges","Waiting charges","Additional stops","Additional kilometres","Meet-and-greet fee","Child seat (on request)","Applicable taxes"].map((c) => (
              <div key={c} className="flex items-center gap-2 rounded-md border border-border px-3 py-2">
                <Check className="h-4 w-4 text-[color:var(--color-emerald)]" /> {c}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Final pricing may vary depending on pickup location, vehicle category, travel time, tolls, airport parking, night travel, waiting time and additional stops.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[color:var(--color-lightgrey)] py-12 md:py-16">
        <div className="container-fortune max-w-4xl">
          <h2 className="font-heading text-2xl md:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-white">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="font-medium">{f.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/airport/cta-airport-fleet.jpg" alt="Fortune Tourism airport fleet at Bengaluru" loading="lazy" className="h-full w-full object-cover" width={1920} height={1000} />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--color-navy)]/85 to-[color:var(--color-navy)]/50" />
        </div>
        <div className="container-fortune relative z-10 py-16 md:py-24 text-white">
          <h2 className="max-w-2xl font-heading text-3xl md:text-4xl">Book your Bengaluru airport ride</h2>
          <p className="mt-3 max-w-xl text-sm md:text-base text-white/85">
            Choose your location, travel time and vehicle. Fortune Tourism will help coordinate a comfortable airport pickup or drop.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#booking" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-emerald)] px-5 py-3 text-sm font-medium text-white shadow-lg">Book Airport Taxi</a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white border border-white/30 backdrop-blur">
              <MessageCircle className="h-4 w-4" /> WhatsApp Enquiry
            </a>
            <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-medium text-white border border-white/30 backdrop-blur">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </div>
        </div>
      </section>

      {/* MOBILE FIXED BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-white shadow-lg md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <a href={CONTACT.phoneHref} className="flex items-center justify-center gap-2 py-3 text-sm">
          <Phone className="h-4 w-4" /> Call
        </a>
        <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border-x border-border py-3 text-sm text-[color:var(--color-emerald)]">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a href="#booking" className="flex items-center justify-center gap-2 bg-[color:var(--color-navy)] py-3 text-sm font-medium text-white">
          Book Taxi
        </a>
      </div>
      <div className="h-14 md:hidden" aria-hidden />

      {/* utility styles for inputs */}
      <style>{`.input{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:0.5rem;padding:0.55rem 0.75rem;font-size:0.875rem;outline:none;}
        .input:focus{border-color:var(--color-emerald);box-shadow:0 0 0 3px color-mix(in oklab, var(--color-emerald) 20%, transparent);}
      `}</style>
    </SiteLayout>
  );
}

function Field({ label, required, children, className = "" }: { label: string; required?: boolean; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}{required && <span className="text-red-500"> *</span>}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}

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