import {
  Car,
  MapPin,
  Plane,
  Route,
  Building2,
  Users,
  ShieldCheck,
  Sparkles,
  Clock,
  BadgeCheck,
  Compass,
  HandCoins,
} from "lucide-react";

export const services = [
  { icon: Car, title: "Car Rentals", blurb: "Chauffeur-driven cars for hours, days or weeks.", href: "/car-rentals" },
  { icon: Route, title: "Tour Packages", blurb: "Ready and custom South India itineraries.", href: "/tour-packages" },
  { icon: Plane, title: "Airport Transfer", blurb: "On-time Bengaluru airport pickup & drop.", href: "/airport-transfer" },
  { icon: MapPin, title: "Outstation Cabs", blurb: "One-way and round-trip outstation travel.", href: "/services" },
  { icon: Building2, title: "Corporate Travel", blurb: "Monthly staff transport & VIP guest cars.", href: "/services" },
  { icon: Users, title: "Group Travel", blurb: "Tempo travellers and mini buses for groups.", href: "/services" },
];

export const trustPoints = [
  { icon: ShieldCheck, title: "Verified drivers", blurb: "Trained, uniformed and background-checked." },
  { icon: Sparkles, title: "Clean vehicles", blurb: "Sanitised interiors and regular servicing." },
  { icon: BadgeCheck, title: "Transparent pricing", blurb: "Written quotes — no hidden charges." },
  { icon: Clock, title: "24 × 7 assistance", blurb: "A real person on the phone, day or night." },
  { icon: Compass, title: "Custom planning", blurb: "Itineraries built around how you travel." },
  { icon: HandCoins, title: "Simple payments", blurb: "UPI, card or bank transfer — your choice." },
];

export const bookingSteps = [
  { n: 1, title: "Select a service", blurb: "Car rental, tour package or airport transfer." },
  { n: 2, title: "Share trip details", blurb: "Dates, destinations and passenger count." },
  { n: 3, title: "Receive your quote", blurb: "A clear, written quote on WhatsApp or email." },
  { n: 4, title: "Confirm & travel", blurb: "Pay a small advance and your driver arrives on time." },
];

export const testimonials = [
  {
    name: "Ananya Rao",
    route: "Bengaluru → Coorg → Chikmagalur",
    rating: 5,
    vehicle: "Innova Crysta",
    text: "Very clean car and our driver knew every viewpoint. Booking was so simple over WhatsApp.",
  },
  {
    name: "Vikram Menon",
    route: "Bengaluru → Munnar → Alleppey",
    rating: 5,
    vehicle: "Tempo Traveller",
    text: "We were 10 people and Fortune Tourism made the whole Kerala trip completely stress-free.",
  },
  {
    name: "Priya Iyer",
    route: "Airport Pickup · Bengaluru",
    rating: 5,
    vehicle: "Premium Sedan",
    text: "The driver was already at the exit when I landed. Best airport pickup service I have used.",
  },
  {
    name: "Rajesh Kumar",
    route: "Bengaluru → Tirupati",
    rating: 5,
    vehicle: "Innova",
    text: "Comfortable seats, safe driving and darshan support at the temple. Highly recommend.",
  },
];

export const faqs = [
  {
    q: "How do I get a quote?",
    a: "Share your trip details on WhatsApp or the enquiry form and you'll receive a written quote within a few minutes.",
  },
  {
    q: "Are the drivers full-time employees?",
    a: "Yes. Every driver is a verified full-time chauffeur trained on South India routes and etiquette.",
  },
  {
    q: "Can you customise a tour package?",
    a: "Absolutely — most of our bookings are custom itineraries built around your dates and interests.",
  },
  {
    q: "Do prices include tolls and parking?",
    a: "Local rentals include everything. For outstation trips, tolls, parking and driver bata are usually billed at actuals and clearly shown in the quote.",
  },
  {
    q: "What if my flight is delayed?",
    a: "Airport pickups are tracked using your flight number, so we adjust the pickup time automatically at no extra cost.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Free cancellation up to 24 hours before pickup. Later cancellations may attract a small driver bata charge.",
  },
];

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/car-rentals", label: "Car Rentals" },
  { to: "/tour-packages", label: "Tour Packages" },
  { to: "/airport-transfer", label: "Airport Transfer" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;