import fs from "fs";
import path from "path";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851",
  host: "168.119.64.101",
  port: 5432,
  database: "fortu851",
  user: "fortu851",
  password: "wUNXTe5joMO1ckaBMB0354ScA",
  ssl: false,
});

const defaultPackages = [
  {
    slug: "bengaluru-mysuru-coorg",
    title: "Bengaluru → Mysuru & Coorg",
    duration: "3 Days · 2 Nights",
    from: "Bengaluru",
    states: ["karnataka"],
    destinations: ["Mysuru Palace", "Coorg Coffee Estates", "Abbey Falls", "Dubare"],
    vehicles: ["Sedan", "SUV", "Innova Crysta"],
    startingPrice: 12500,
    image: "/images/packages/mysuru-coorg.jpg",
    heroImage: "/images/packages/hero-mysuru-coorg.jpg",
    summary: "A weekend loop from Bengaluru covering the royal city of Mysuru and the misty coffee hills of Coorg.",
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
    image: "/images/packages/ooty.jpg",
    heroImage: "/images/packages/hero-ooty.jpg",
    summary: "Cool weather, tea gardens and a slow train ride through the Nilgiris.",
    highlights: ["Drive via Bandipur forest", "Doddabetta peak view", "Ooty tea museum", "Coonoor viewpoints", "Botanical Gardens"],
    itinerary: [
      { day: 1, title: "Bengaluru → Ooty", details: "Scenic drive via Bandipur & Mudumalai forest." },
      { day: 2, title: "Ooty local", details: "Doddabetta peak, tea museum, Ooty lake and Coonoor viewpoints." },
      { day: 3, title: "Ooty → Bengaluru", details: "Morning at leisure, return via Mysuru with lunch stop." },
    ],
    inclusions: ["Chauffeur-driven vehicle", "Fuel & toll", "Driver bata", "Home pickup"],
    exclusions: ["Hotel stay", "Toy train tickets", "Personal expenses"],
  },
  {
    slug: "bengaluru-tirupati",
    title: "Bengaluru → Tirupati Balaji Darshan",
    duration: "1 Day / 2 Days",
    from: "Bengaluru",
    states: ["andhra-pradesh"],
    destinations: ["Tirumala Temple", "Padmavathi Temple", "Kalahasti"],
    vehicles: ["Sedan", "Innova Crysta", "Tempo Traveller"],
    startingPrice: 8500,
    image: "/images/packages/tirupati.jpg",
    heroImage: "/images/packages/hero-tirupati.jpg",
    summary: "Comfortable door-to-door temple car service from Bengaluru with experienced drivers familiar with Tirumala routes.",
    highlights: ["Same-day return option", "Driver knows parking & hair-cutting locations", "Clean AC car with zero toll hassle"],
    itinerary: [
      { day: 1, title: "Bengaluru → Tirupati", details: "Early morning 3:30 AM departure, breakfast near Chittoor, reach Tirumala by 9:00 AM." },
    ],
    inclusions: ["Round trip car with driver", "Toll & state permits", "Driver bata"],
    exclusions: ["Darshan tickets", "Food & accommodation"],
  },
  {
    slug: "kerala-backwaters-hills",
    title: "Munnar & Alleppey Backwaters",
    duration: "4 Days · 3 Nights",
    from: "Kochi / Bengaluru",
    states: ["kerala"],
    destinations: ["Munnar Tea Gardens", "Mattupetty Dam", "Alleppey Houseboat"],
    vehicles: ["Innova Crysta", "SUV"],
    startingPrice: 19500,
    image: "/images/packages/kerala.jpg",
    heroImage: "/images/packages/hero-kerala.jpg",
    summary: "Tea gardens, waterfalls and a night on a private houseboat floating down Alleppey backwaters.",
    highlights: ["Munnar tea estate walks", "Cheeyappara waterfalls", "Alleppey houseboat experience", "Fresh Kerala cuisine"],
    itinerary: [
      { day: 1, title: "Arrival → Munnar", details: "Drive up the Western Ghats to Munnar, visit tea plantations." },
      { day: 2, title: "Munnar Sightseeing", details: "Eravikulam National Park, Mattupetty Dam, Echo Point." },
      { day: 3, title: "Munnar → Alleppey", details: "Check into deluxe houseboat at 12 PM, cruise through backwaters." },
      { day: 4, title: "Alleppey → Departure", details: "Breakfast on houseboat, transfer to airport/railway station." },
    ],
    inclusions: ["Chauffeur driven car", "Interstate permits", "Fuel & tolls"],
    exclusions: ["Houseboat booking (can be added)", "Food"],
  },
  {
    slug: "puducherry-french-colony",
    title: "Puducherry French Quarter & Beaches",
    duration: "2 Days · 1 Night",
    from: "Bengaluru / Chennai",
    states: ["puducherry", "tamil-nadu"],
    destinations: ["White Town", "Promenade Beach", "Auroville", "Paradise Beach"],
    vehicles: ["Sedan", "SUV", "Innova"],
    startingPrice: 9800,
    image: "/images/packages/puducherry.jpg",
    heroImage: "/images/packages/hero-puducherry.jpg",
    summary: "French heritage architecture, seaside cafes, Auroville peace dome, and golden beaches.",
    highlights: ["Promenade Beach walk", "Auroville Matrimandir viewpoint", "French cafe hopping", "Paradise beach boat ride"],
    itinerary: [
      { day: 1, title: "Bengaluru → Puducherry", details: "Early morning drive via ECR route, evening stroll in White Town." },
      { day: 2, title: "Auroville → Return", details: "Morning visit to Auroville, lunch at French cafe, return journey." },
    ],
    inclusions: ["AC Car with driver", "State permit & tolls", "Driver bata"],
    exclusions: ["Hotel & meals"],
  }
];

const defaultVehicles = [
  {
    slug: "hatchback",
    name: "Hatchback (Swift / i20)",
    category: "Hatchback",
    seats: 4,
    luggage: "1–2 bags",
    price_per_km: 12,
    base_price_local: 1200,
    features: ["AC", "Chauffeur driven", "City-friendly", "Clean interior"],
    image: "/images/fleet/car-hatchback.jpg",
    description: "The nimble everyday choice for short city rides and small families exploring Bengaluru.",
    is_popular: false,
  },
  {
    slug: "sedan",
    name: "Sedan (Dzire / Aura)",
    category: "Sedan",
    seats: 4,
    luggage: "2 large + 1 small",
    price_per_km: 14,
    base_price_local: 1600,
    features: ["AC", "Music system", "Chauffeur driven", "Comfortable boot space"],
    image: "/images/fleet/car-sedan.jpg",
    description: "The everyday choice for city rentals and airport transfers with generous boot space.",
    is_popular: true,
  },
  {
    slug: "premium-sedan",
    name: "Premium Sedan (Honda City / Verna)",
    category: "Premium Sedan",
    seats: 4,
    luggage: "2 large + 2 small",
    price_per_km: 18,
    base_price_local: 2200,
    features: ["Leather seats", "Extra legroom", "Silent cabin", "Professional chauffeur"],
    image: "/images/fleet/car-premium-sedan.jpg",
    description: "A refined ride for corporate guests, VIP airport transfers and business meetings.",
    is_popular: false,
  },
  {
    slug: "suv",
    name: "MUV / SUV (Ertiga / Carens)",
    category: "SUV",
    seats: 6,
    luggage: "3 large + 2 small",
    price_per_km: 18,
    base_price_local: 2400,
    features: ["Captain seats", "Rear AC vents", "Boot space", "Good on hills"],
    image: "/images/fleet/car-suv.jpg",
    description: "Compact MUV perfect for family trips to Coorg, Chikmagalur or Ooty.",
    is_popular: true,
  },
  {
    slug: "innova-crysta",
    name: "Toyota Innova Crysta",
    category: "Innova Crysta",
    seats: 7,
    luggage: "4 large + 3 small",
    price_per_km: 24,
    base_price_local: 3200,
    features: ["Captain seats", "Ambient lighting", "Very quiet cabin", "Automatic option"],
    image: "/images/fleet/car-crysta.jpg",
    description: "Our most requested vehicle for premium multi-day South India tours.",
    is_popular: true,
  },
  {
    slug: "tempo-traveller",
    name: "Tempo Traveller (12/17 Seater)",
    category: "Tempo Traveller",
    seats: 12,
    luggage: "12 mid + hand baggage",
    price_per_km: 32,
    base_price_local: 4500,
    features: ["Push-back seats", "AC", "Overhead storage", "Music system"],
    image: "/images/fleet/car-tempo.jpg",
    description: "Large groups travelling together for pilgrimages, weddings or family holidays.",
    is_popular: false,
  },
];

async function main() {
  console.log("Connecting to PostgreSQL database (168.119.64.101:5432 / fortu851)...");

  const sqlPath = path.join(process.cwd(), "scripts", "init-db.sql");
  const sql = fs.readFileSync(sqlPath, "utf-8");

  console.log("Running SQL schema creation script...");
  await pool.query(sql);
  console.log("Tables (enquiries, packages, vehicles, storage_buckets, storage_files) created/verified!");

  // Seed default packages
  const packagesRes = await pool.query("SELECT COUNT(*) FROM packages");
  if (parseInt(packagesRes.rows[0].count, 10) === 0) {
    console.log("Seeding default tour packages into PostgreSQL...");
    for (const pkg of defaultPackages) {
      await pool.query(
        `INSERT INTO packages (slug, title, duration, from_city, states, destinations, vehicles, starting_price, image, hero_image, summary, highlights, itinerary, inclusions, exclusions)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         ON CONFLICT (slug) DO NOTHING`,
        [
          pkg.slug,
          pkg.title,
          pkg.duration,
          pkg.from,
          pkg.states,
          pkg.destinations,
          pkg.vehicles,
          pkg.startingPrice,
          pkg.image,
          pkg.heroImage,
          pkg.summary,
          pkg.highlights,
          JSON.stringify(pkg.itinerary),
          pkg.inclusions,
          pkg.exclusions,
        ]
      );
    }
    console.log(`Seeded ${defaultPackages.length} packages.`);
  } else {
    console.log(`Packages table contains ${packagesRes.rows[0].count} items.`);
  }

  // Seed default vehicles
  const vehiclesRes = await pool.query("SELECT COUNT(*) FROM vehicles");
  if (parseInt(vehiclesRes.rows[0].count, 10) === 0) {
    console.log("Seeding default vehicles into PostgreSQL...");
    for (const v of defaultVehicles) {
      await pool.query(
        `INSERT INTO vehicles (slug, name, category, seats, luggage, price_per_km, base_price_local, features, image, description, is_popular)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) DO NOTHING`,
        [
          v.slug,
          v.name,
          v.category,
          v.seats,
          v.luggage,
          v.price_per_km,
          v.base_price_local,
          v.features,
          v.image,
          v.description,
          v.is_popular,
        ]
      );
    }
    console.log(`Seeded ${defaultVehicles.length} vehicles.`);
  } else {
    console.log(`Vehicles table contains ${vehiclesRes.rows[0].count} items.`);
  }

  // Seed initial enquiries
  const enquiriesRes = await pool.query("SELECT COUNT(*) FROM enquiries");
  if (parseInt(enquiriesRes.rows[0].count, 10) === 0) {
    console.log("Seeding sample enquiries into PostgreSQL...");
    const sampleEnquiries = [
      { name: "Ananya Rao", phone: "+91 98765 12345", service: "Tour Package", pickup: "Bengaluru", destination: "Coorg", travel_date: "2026-08-15", passengers: "4", notes: "Needs Innova Crysta for family", status: "New" },
      { name: "Vikram Menon", phone: "+91 98765 54321", service: "Airport Transfer", pickup: "Whitefield, BLR", destination: "BLR Airport", travel_date: "2026-08-11", passengers: "2", notes: "Pickup at 5:00 AM", status: "Quoted" },
      { name: "Rajesh Kumar", phone: "+91 98765 99999", service: "Outstation", pickup: "Bengaluru", destination: "Tirupati", travel_date: "2026-08-20", passengers: "6", notes: "Temple trip round trip", status: "Confirmed" },
      { name: "Priya Iyer", phone: "+91 98765 88888", service: "Car Rental", pickup: "Indiranagar", destination: "City Local", travel_date: "2026-08-10", passengers: "3", notes: "8 Hrs 80 Kms local package", status: "Confirmed" },
    ];
    for (const e of sampleEnquiries) {
      await pool.query(
        `INSERT INTO enquiries (name, phone, service, pickup, destination, travel_date, passengers, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [e.name, e.phone, e.service, e.pickup, e.destination, e.travel_date, e.passengers, e.notes, e.status]
      );
    }
    console.log("Seeded sample enquiries.");
  } else {
    console.log(`Enquiries table contains ${enquiriesRes.rows[0].count} items.`);
  }

  console.log("\n✅ SUCCESS: All PostgreSQL tables and storage buckets are ready!");
  await pool.end();
}

main().catch((err) => {
  console.error("❌ Error setting up PostgreSQL database:", err);
  process.exit(1);
});
