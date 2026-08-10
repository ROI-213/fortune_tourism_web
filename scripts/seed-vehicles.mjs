import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851",
  ssl: false,
});

const allVehicles = [
  {
    slug: "hatchback",
    name: "Hatchback (Swift / Altroz / i20)",
    category: "Hatchback",
    seats: 4,
    luggage: "1–2 bags",
    price_per_km: 12,
    description: "The nimble everyday choice for short city rides and small families exploring Bengaluru.",
    image: "/images/fleet/car-hatchback.jpg",
    is_popular: false,
  },
  {
    slug: "sedan",
    name: "Sedan (Dzire / Aura / Amaze)",
    category: "Sedan",
    seats: 4,
    luggage: "2 large + 1 small",
    price_per_km: 14,
    description: "The everyday choice for city rentals and airport transfers with generous boot space.",
    image: "/images/fleet/car-sedan.jpg",
    is_popular: true,
  },
  {
    slug: "premium-sedan",
    name: "Premium Sedan (Honda City / Verna)",
    category: "Premium Sedan",
    seats: 4,
    luggage: "2 large + 2 small",
    price_per_km: 18,
    description: "A refined ride for corporate guests, VIP airport transfers and business meetings.",
    image: "/images/fleet/car-premium-sedan.jpg",
    is_popular: false,
  },
  {
    slug: "suv",
    name: "MUV / SUV (Ertiga / Rumion / Carens)",
    category: "SUV",
    seats: 6,
    luggage: "3 large + 2 small",
    price_per_km: 18,
    description: "Compact SUV perfect for family trips to Coorg, Chikmagalur or Ooty.",
    image: "/images/fleet/car-suv.jpg",
    is_popular: true,
  },
  {
    slug: "innova",
    name: "Toyota Innova (7 Seater AC)",
    category: "Innova",
    seats: 7,
    luggage: "4 large + 2 small",
    price_per_km: 20,
    description: "The dependable South India workhorse — hills, backwaters and long temple runs.",
    image: "/images/fleet/car-innova.jpg",
    is_popular: true,
  },
  {
    slug: "innova-crysta",
    name: "Toyota Innova Crysta (Luxury 7 Seater)",
    category: "Innova Crysta",
    seats: 7,
    luggage: "4 large + 3 small",
    price_per_km: 24,
    description: "Our most requested vehicle for premium multi-day South India tours.",
    image: "/images/fleet/car-crysta.jpg",
    is_popular: true,
  },
  {
    slug: "tempo-traveller",
    name: "Tempo Traveller (12 / 17 Seater)",
    category: "Tempo Traveller",
    seats: 12,
    luggage: "12 mid + hand baggage",
    price_per_km: 32,
    description: "Large groups travelling together for pilgrimages, weddings or family holidays.",
    image: "/images/fleet/car-tempo.jpg",
    is_popular: false,
  },
  {
    slug: "mini-bus",
    name: "Mini Bus (21 / 25 / 30 Seater AC)",
    category: "Mini Bus",
    seats: 27,
    luggage: "Ample under-belly storage",
    price_per_km: 55,
    description: "Corporate offsites, school tours and large family groups moving across South India.",
    image: "/images/fleet/car-minibus.jpg",
    is_popular: false,
  },
];

async function seed() {
  console.log("Seeding all 8 Fleet Vehicles into PostgreSQL...");
  for (const veh of allVehicles) {
    const res = await pool.query(
      `INSERT INTO vehicles 
       (slug, name, category, seats, luggage, price_per_km, description, image, is_popular)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (slug) 
       DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         seats = EXCLUDED.seats,
         luggage = EXCLUDED.luggage,
         price_per_km = EXCLUDED.price_per_km,
         description = EXCLUDED.description,
         image = EXCLUDED.image,
         is_popular = EXCLUDED.is_popular,
         updated_at = NOW()
       RETURNING id, name`,
      [
        veh.slug,
        veh.name,
        veh.category,
        veh.seats,
        veh.luggage,
        veh.price_per_km,
        veh.description,
        veh.image,
        veh.is_popular,
      ]
    );
    console.log(`✓ Stored in PostgreSQL: ${res.rows[0].name} (ID: ${res.rows[0].id})`);
  }
  console.log("ALL FLEET VEHICLES STORED IN POSTGRESQL SUCCESSFULLY!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
