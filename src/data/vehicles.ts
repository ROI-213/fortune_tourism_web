export type VehicleCategory =
  | "Hatchback"
  | "Sedan"
  | "Premium Sedan"
  | "SUV"
  | "Innova"
  | "Innova Crysta"
  | "Tempo Traveller"
  | "Mini Bus";

export type TripType =
  | "Local"
  | "Airport"
  | "One-Way"
  | "Round Trip"
  | "Outstation"
  | "Corporate"
  | "Group Travel";

export interface Vehicle {
  slug: string;
  name: string;
  examples: string[];
  category: VehicleCategory;
  seats: number;
  bags: number;
  luggage: string;
  bestFor: string;
  features: string[];
  summary: string;
  image: string;
  ac: boolean;
  tripTypes: TripType[];
  startingFrom?: number; // INR
}

export const vehicles: Vehicle[] = [
  {
    slug: "hatchback",
    name: "Hatchback",
    examples: ["Maruti Swift", "Tata Altroz", "Hyundai i20"],
    category: "Hatchback",
    seats: 4,
    bags: 2,
    luggage: "1–2 bags",
    bestFor: "Short local rides, couples and budget travel",
    features: ["AC", "Chauffeur driven", "City-friendly", "Great mileage"],
    summary: "The nimble everyday choice for short city rides and small families exploring Bengaluru.",
    image: "/images/fleet/car-hatchback.jpg",
    ac: true,
    tripTypes: ["Local", "Airport"],
    startingFrom: 12,
  },
  {
    slug: "sedan",
    name: "Sedan",
    examples: ["Maruti Dzire", "Hyundai Aura", "Honda Amaze"],
    category: "Sedan",
    seats: 4,
    bags: 3,
    luggage: "2 large + 1 small",
    bestFor: "City rides & short outstation trips",
    features: ["AC", "Music system", "Chauffeur driven", "Comfort for 4"],
    summary: "The everyday choice for city rentals and airport transfers with generous boot space.",
    image: "/images/fleet/car-sedan.jpg",
    ac: true,
    tripTypes: ["Local", "Airport", "One-Way", "Round Trip", "Outstation", "Corporate"],
    startingFrom: 14,
  },
  {
    slug: "premium-sedan",
    name: "Premium Sedan",
    examples: ["Honda City", "Hyundai Verna", "Skoda Slavia"],
    category: "Premium Sedan",
    seats: 4,
    bags: 3,
    luggage: "2 large + 2 small",
    bestFor: "Corporate travel & premium airport pickup",
    features: ["Leather seats", "Extra legroom", "Silent cabin", "Professional chauffeur"],
    summary: "A refined ride for corporate guests, VIP airport transfers and business meetings.",
    image: "/images/fleet/car-premium-sedan.jpg",
    ac: true,
    tripTypes: ["Airport", "Corporate", "Local", "One-Way"],
    startingFrom: 18,
  },
  {
    slug: "suv",
    name: "MUV / SUV",
    examples: ["Maruti Ertiga", "Toyota Rumion", "Kia Carens"],
    category: "SUV",
    seats: 6,
    bags: 4,
    luggage: "3 large + 2 small",
    bestFor: "Family outstation trips",
    features: ["Captain seats", "Boot space", "Good on hills", "AC"],
    summary: "Compact SUV perfect for family trips to Coorg, Chikmagalur or Ooty.",
    image: "/images/fleet/car-suv.jpg",
    ac: true,
    tripTypes: ["Outstation", "Round Trip", "Airport", "Local", "One-Way"],
    startingFrom: 18,
  },
  {
    slug: "innova",
    name: "Toyota Innova",
    examples: ["Toyota Innova"],
    category: "Innova",
    seats: 7,
    bags: 5,
    luggage: "4 large + 2 small",
    bestFor: "Group tours & long outstation",
    features: ["Reliable long-distance", "Push-back seats", "AC", "Highway comfort"],
    summary: "The dependable South India workhorse — hills, backwaters and long temple runs.",
    image: "/images/fleet/car-innova.jpg",
    ac: true,
    tripTypes: ["Outstation", "Round Trip", "Airport", "One-Way", "Group Travel"],
    startingFrom: 20,
  },
  {
    slug: "innova-crysta",
    name: "Toyota Innova Crysta",
    examples: ["Toyota Innova Crysta"],
    category: "Innova Crysta",
    seats: 7,
    bags: 6,
    luggage: "4 large + 3 small",
    bestFor: "Premium family & corporate tours",
    features: ["Captain seats", "Ambient lighting", "Very quiet cabin", "Automatic option"],
    summary: "Our most requested vehicle for premium multi-day South India tours.",
    image: "/images/fleet/car-crysta.jpg",
    ac: true,
    tripTypes: ["Outstation", "Corporate", "Round Trip", "Airport", "One-Way"],
    startingFrom: 24,
  },
  {
    slug: "tempo-traveller",
    name: "Tempo Traveller",
    examples: ["9 / 12 / 17 Seater Tempo Traveller"],
    category: "Tempo Traveller",
    seats: 12,
    bags: 12,
    luggage: "12 mid + hand baggage",
    bestFor: "Group pilgrimages & family holidays",
    features: ["Push-back seats", "AC", "Overhead storage", "Group travel"],
    summary: "Large groups travelling together for pilgrimages, weddings or family holidays.",
    image: "/images/fleet/car-tempo.jpg",
    ac: true,
    tripTypes: ["Group Travel", "Outstation", "Round Trip"],
    startingFrom: 32,
  },
  {
    slug: "mini-bus",
    name: "Mini Bus",
    examples: ["17 / 20 / 25 / 30 Seater Mini Bus"],
    category: "Mini Bus",
    seats: 27,
    bags: 20,
    luggage: "Ample under-belly storage",
    bestFor: "Corporate offsites & large groups",
    features: ["Recliner seats", "AC", "Mic & entertainment", "Experienced driver"],
    summary: "Corporate offsites, school tours and large family groups moving across South India.",
    image: "/images/fleet/car-minibus.jpg",
    ac: true,
    tripTypes: ["Group Travel", "Corporate", "Outstation"],
    startingFrom: 55,
  },
];

export function findVehicle(slug: string) {
  return vehicles.find((v) => v.slug === slug);
}