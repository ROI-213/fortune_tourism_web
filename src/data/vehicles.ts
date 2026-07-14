export interface Vehicle {
  slug: string;
  name: string;
  category: "Sedan" | "Premium Sedan" | "SUV" | "Innova" | "Innova Crysta" | "Tempo Traveller" | "Mini Bus";
  seats: number;
  luggage: string;
  bestFor: string;
  features: string[];
  summary: string;
}

export const vehicles: Vehicle[] = [
  {
    slug: "sedan",
    name: "Sedan · Dzire / Etios",
    category: "Sedan",
    seats: 4,
    luggage: "2 large + 1 small",
    bestFor: "City rides & short outstation trips",
    features: ["AC", "Music system", "Chauffeur driven", "Comfort for 4"],
    summary: "The everyday choice for city rentals and airport transfers with generous boot space.",
  },
  {
    slug: "premium-sedan",
    name: "Premium Sedan · Ciaz / Honda City",
    category: "Premium Sedan",
    seats: 4,
    luggage: "2 large + 2 small",
    bestFor: "Corporate travel & premium airport pickup",
    features: ["Leather seats", "Extra legroom", "Silent cabin", "Professional chauffeur"],
    summary: "A refined ride for corporate guests, VIP airport transfers and business meetings.",
  },
  {
    slug: "suv",
    name: "SUV · Ertiga / XL6",
    category: "SUV",
    seats: 6,
    luggage: "3 large + 2 small",
    bestFor: "Family outstation trips",
    features: ["Captain seats", "Boot space", "Good on hills", "AC"],
    summary: "Compact SUV perfect for family trips to Coorg, Chikmagalur or Ooty.",
  },
  {
    slug: "innova",
    name: "Toyota Innova",
    category: "Innova",
    seats: 7,
    luggage: "4 large + 2 small",
    bestFor: "Group tours & long outstation",
    features: ["Reliable long-distance", "Push-back seats", "AC", "Highway comfort"],
    summary: "The dependable South India workhorse — hills, backwaters and long temple runs.",
  },
  {
    slug: "innova-crysta",
    name: "Toyota Innova Crysta",
    category: "Innova Crysta",
    seats: 7,
    luggage: "4 large + 3 small",
    bestFor: "Premium family & corporate tours",
    features: ["Captain seats", "Ambient lighting", "Very quiet cabin", "Automatic option"],
    summary: "Our most requested vehicle for premium multi-day South India tours.",
  },
  {
    slug: "tempo-traveller",
    name: "Tempo Traveller",
    category: "Tempo Traveller",
    seats: 12,
    luggage: "12 mid + hand baggage",
    bestFor: "Group pilgrimages & family holidays",
    features: ["Push-back seats", "AC", "Overhead storage", "Group travel"],
    summary: "Large groups travelling together for pilgrimages, weddings or family holidays.",
  },
  {
    slug: "mini-bus",
    name: "Mini Bus (17 – 27 seater)",
    category: "Mini Bus",
    seats: 27,
    luggage: "Ample under-belly storage",
    bestFor: "Corporate offsites & large groups",
    features: ["Recliner seats", "AC", "Mic & entertainment", "Experienced driver"],
    summary: "Corporate offsites, school tours and large family groups moving across South India.",
  },
];

export function findVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}