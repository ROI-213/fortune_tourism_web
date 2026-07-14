export interface Destination {
  slug: "karnataka" | "andhra-pradesh" | "tamil-nadu" | "kerala" | "puducherry";
  state: string;
  label: string;
  heading: string;
  quote: string;
  blurb: string;
  highlights: string[];
  packageCount: number;
  image: string;
}

export const destinations: Destination[] = [
  {
    slug: "karnataka",
    state: "Karnataka",
    label: "South India · State 01",
    heading: "Discover the Soul of Karnataka",
    quote: "From royal palaces to misty hills, every road leads to a new story.",
    blurb:
      "Palaces, ruined empires, coffee estates and rugged coastlines — Karnataka is where every kind of traveller finds a favourite view.",
    highlights: ["Mysuru", "Hampi", "Coorg", "Chikmagalur", "Gokarna", "Jog Falls"],
    packageCount: 12,
    image: "/images/state-karnataka.jpg",
  },
  {
    slug: "andhra-pradesh",
    state: "Andhra Pradesh",
    label: "South India · State 02",
    heading: "Experience Andhra Pradesh",
    quote: "Sacred journeys, dramatic valleys and coastal horizons await.",
    blurb:
      "Temple towns, canyon country and coastal cities — Andhra brings together devotion, drama and quiet beach mornings.",
    highlights: ["Tirupati", "Araku Valley", "Visakhapatnam", "Gandikota", "Srisailam"],
    packageCount: 8,
    image: "/images/state-andhra.jpg",
  },
  {
    slug: "tamil-nadu",
    state: "Tamil Nadu",
    label: "South India · State 03",
    heading: "Journey Through Tamil Nadu",
    quote: "Ancient temples, cool mountains and timeless coastlines travel together.",
    blurb:
      "From the cool slopes of Ooty and Kodaikanal to the temple corridors of Madurai and Rameswaram — Tamil Nadu is a full South India story on its own.",
    highlights: ["Ooty", "Kodaikanal", "Madurai", "Rameswaram", "Kanyakumari", "Mahabalipuram"],
    packageCount: 10,
    image: "/images/state-tamilnadu.jpg",
  },
  {
    slug: "kerala",
    state: "Kerala",
    label: "South India · State 04",
    heading: "Escape to God's Own Country",
    quote: "Slow down where green mountains meet peaceful backwaters.",
    blurb:
      "Tea gardens, houseboats and quiet coastal towns — Kerala is built for slow, unhurried travel with your own driver.",
    highlights: ["Munnar", "Alleppey", "Wayanad", "Kochi", "Thekkady", "Athirappilly"],
    packageCount: 11,
    image: "/images/state-kerala.jpg",
  },
  {
    slug: "puducherry",
    state: "Puducherry",
    label: "South India · State 05",
    heading: "Find Your Calm in Puducherry",
    quote: "French charm, peaceful beaches and colourful streets create the perfect escape.",
    blurb:
      "Colonial streets, calm beaches and Auroville — Puducherry is the perfect long weekend from Bengaluru or Chennai.",
    highlights: ["White Town", "Promenade", "Paradise Beach", "Auroville", "Serenity Beach"],
    packageCount: 4,
    image: "/images/state-puducherry.jpg",
  },
];

export function findDestination(slug: string) {
  return destinations.find((d) => d.slug === slug);
}