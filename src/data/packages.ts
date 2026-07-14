export interface TourPackage {
  slug: string;
  title: string;
  duration: string;
  from: string;
  states: Array<"karnataka" | "andhra-pradesh" | "tamil-nadu" | "kerala" | "puducherry">;
  destinations: string[];
  vehicles: string[];
  startingPrice?: number;
  image: string;
  heroImage?: string;
  highlights?: string[];
  summary: string;
  itinerary: { day: number; title: string; details: string }[];
  inclusions: string[];
  exclusions: string[];
}

export const packages: TourPackage[] = [
  {
    slug: "bengaluru-mysuru-coorg",
    title: "Bengaluru → Mysuru & Coorg",
    duration: "3 Days · 2 Nights",
    from: "Bengaluru",
    states: ["karnataka"],
    destinations: ["Mysuru Palace", "Coorg Coffee Estates", "Abbey Falls", "Dubare"],
    vehicles: ["Sedan", "SUV", "Innova Crysta"],
    startingPrice: 12500,
    image: "/images/state-karnataka.jpg",
    summary:
      "A weekend loop from Bengaluru covering the royal city of Mysuru and the misty coffee hills of Coorg.",
    heroImage: "/images/packages/hero-mysuru-coorg.jpg",
    highlights: ["Visit Mysuru Palace", "Coorg coffee estate stay", "Abbey Falls viewpoint", "Dubare elephant camp", "Scenic Western Ghats drive"],
    itinerary: [
      { day: 1, title: "Bengaluru → Mysuru", details: "Depart early, visit Mysuru Palace, Brindavan Gardens and check into a heritage stay." },
      { day: 2, title: "Mysuru → Coorg", details: "Drive to Coorg via Dubare elephant camp, spend the evening in a coffee estate." },
      { day: 3, title: "Coorg → Bengaluru", details: "Morning walk in the estate, visit Abbey Falls and drive back to Bengaluru." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata", "Airport / home pickup"],
    exclusions: ["Hotel stay", "Meals", "Monument entry fees"],
  },
  {
    slug: "bengaluru-ooty",
    title: "Bengaluru → Ooty Hills",
    duration: "3 Days · 2 Nights",
    from: "Bengaluru",
    states: ["tamil-nadu"],
    destinations: ["Ooty", "Coonoor", "Doddabetta", "Botanical Gardens"],
    vehicles: ["SUV", "Innova", "Innova Crysta"],
    startingPrice: 13500,
    image: "/images/state-tamilnadu.jpg",
    summary: "Cool weather, tea gardens and a slow train ride through the Nilgiris.",
    heroImage: "/images/packages/hero-ooty.jpg",
    highlights: ["Drive via Bandipur forest", "Doddabetta peak view", "Ooty tea museum", "Coonoor viewpoints", "Botanical Gardens"],
    itinerary: [
      { day: 1, title: "Bengaluru → Ooty", details: "Scenic drive via Bandipur & Mudumalai forest." },
      { day: 2, title: "Ooty local", details: "Doddabetta peak, tea museum, Ooty lake and Coonoor viewpoints." },
      { day: 3, title: "Ooty → Bengaluru", details: "Morning at leisure, return via Mysuru with lunch stop." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata"],
    exclusions: ["Stay", "Meals", "Entry tickets"],
  },
  {
    slug: "bengaluru-chikmagalur",
    title: "Bengaluru → Chikmagalur",
    duration: "2 Days · 1 Night",
    from: "Bengaluru",
    states: ["karnataka"],
    destinations: ["Mullayanagiri", "Baba Budangiri", "Coffee Estates", "Hebbe Falls"],
    vehicles: ["Sedan", "SUV"],
    startingPrice: 8500,
    image: "/images/state-karnataka.jpg",
    summary: "A quick escape to Karnataka's coffee country and the tallest peak in the state.",
    heroImage: "/images/packages/hero-chikmagalur.jpg",
    highlights: ["Sunrise at Mullayanagiri", "Coffee estate homestay", "Baba Budangiri drive", "Hebbe Falls trek"],
    itinerary: [
      { day: 1, title: "Bengaluru → Chikmagalur", details: "Drive to a coffee estate homestay, evening walk." },
      { day: 2, title: "Peaks & falls", details: "Sunrise at Mullayanagiri, waterfalls, then drive back." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata"],
    exclusions: ["Stay", "Meals"],
  },
  {
    slug: "bengaluru-tirupati",
    title: "Bengaluru → Tirupati Darshan",
    duration: "1 Day · Return",
    from: "Bengaluru",
    states: ["andhra-pradesh"],
    destinations: ["Tirumala", "Tirupati Temple", "Kanipakam (optional)"],
    vehicles: ["Sedan", "Innova", "Tempo Traveller"],
    startingPrice: 6500,
    image: "/images/state-andhra.jpg",
    summary: "Same-day return darshan trip with early pickup and comfortable seating.",
    heroImage: "/images/packages/hero-tirupati.jpg",
    highlights: ["Early morning pickup", "Darshan assistance", "Comfortable AC vehicle", "Same-day return"],
    itinerary: [
      { day: 1, title: "Bengaluru ↔ Tirupati", details: "Early departure, darshan assistance, return by night." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata"],
    exclusions: ["Darshan tickets", "Meals"],
  },
  {
    slug: "bengaluru-munnar-alleppey",
    title: "Bengaluru → Munnar & Alleppey",
    duration: "5 Days · 4 Nights",
    from: "Bengaluru",
    states: ["kerala"],
    destinations: ["Munnar", "Thekkady", "Alleppey Backwaters", "Kochi"],
    vehicles: ["SUV", "Innova Crysta", "Tempo Traveller"],
    startingPrice: 24500,
    image: "/images/state-kerala.jpg",
    summary: "Signature Kerala loop with tea gardens, spice trails and a night on the backwaters.",
    heroImage: "/images/packages/hero-munnar-alleppey.jpg",
    highlights: ["Munnar tea gardens", "Eravikulam National Park", "Thekkady spice trails", "Alleppey houseboat night", "Fort Kochi walk"],
    itinerary: [
      { day: 1, title: "Bengaluru → Munnar", details: "Long scenic drive, evening at leisure." },
      { day: 2, title: "Munnar sightseeing", details: "Tea gardens, Eravikulam, Mattupetty." },
      { day: 3, title: "Munnar → Thekkady", details: "Spice plantations & Periyar lake." },
      { day: 4, title: "Thekkady → Alleppey", details: "Check into a houseboat, cruise the backwaters." },
      { day: 5, title: "Alleppey → Kochi → Bengaluru", details: "Fort Kochi walk, drop at airport or drive back." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata"],
    exclusions: ["Stay", "Houseboat", "Meals"],
  },
  {
    slug: "bengaluru-puducherry",
    title: "Bengaluru → Puducherry",
    duration: "3 Days · 2 Nights",
    from: "Bengaluru",
    states: ["tamil-nadu", "puducherry"],
    destinations: ["White Town", "Promenade", "Paradise Beach", "Auroville"],
    vehicles: ["Sedan", "SUV", "Innova"],
    startingPrice: 14500,
    image: "/images/state-puducherry.jpg",
    summary: "French quarter mornings, quiet beaches and a slow drive back through the eastern coast.",
    heroImage: "/images/packages/hero-puducherry.jpg",
    highlights: ["White Town heritage walk", "Promenade sunrise", "Paradise Beach ferry", "Auroville visit"],
    itinerary: [
      { day: 1, title: "Bengaluru → Puducherry", details: "Drive via Krishnagiri, evening on the Promenade." },
      { day: 2, title: "Puducherry", details: "White Town walk, Paradise Beach ferry, Auroville." },
      { day: 3, title: "Puducherry → Bengaluru", details: "Beach breakfast, return via Chennai bypass." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata"],
    exclusions: ["Stay", "Meals", "Ferry tickets"],
  },
];

export function findPackage(slug: string) {
  return packages.find((p) => p.slug === slug);
}