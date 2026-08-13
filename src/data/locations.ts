export interface LocationItem {
  id: string;
  name: string;
  normalizedName: string;
  city: string;
  state: string;
  country: string;
  code?: string; // Airport IATA code (BLR, DEL) or Station code (SBC, MYS, MAS)
  type: "airport" | "station" | "area" | "city";
  aliases: string[];
  coords?: { lat: number; lng: number };
}

export const LOCATIONS: LocationItem[] = [
  // --- Bengaluru / Karnataka ---
  {
    id: "blr-airport",
    name: "Bengaluru (BLR) — Kempegowda International Airport",
    normalizedName: "bengaluru kempegowda international airport blr bangalore",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    code: "BLR",
    type: "airport",
    aliases: ["blr", "bengaluru", "bangalore", "kempegowda", "airport", "ben", "banga"],
    coords: { lat: 13.1986, lng: 77.7066 },
  },
  {
    id: "ksr-bengaluru-station",
    name: "KSR Bengaluru City Junction (SBC)",
    normalizedName: "ksr bengaluru city junction sbc majestic bangalore station",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    code: "SBC",
    type: "station",
    aliases: ["sbc", "ksr", "majestic", "bengaluru station", "bangalore city", "banga", "maj"],
    coords: { lat: 12.9781, lng: 77.5697 },
  },
  {
    id: "yeshwanthpur-station",
    name: "Yesvantpur Junction (YPR)",
    normalizedName: "yesvantpur junction ypr yeshwanthpur bangalore station",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    code: "YPR",
    type: "station",
    aliases: ["ypr", "yeshwanthpur", "yesvantpur", "yesh"],
    coords: { lat: 13.0238, lng: 77.5504 },
  },
  {
    id: "rajajinagar-area",
    name: "Rajajinagar",
    normalizedName: "rajajinagar bengaluru karnataka rajaji nagar",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    type: "area",
    aliases: ["rajaji", "rajajinagar", "rajaji nagar", "raj"],
    coords: { lat: 12.9899, lng: 77.5534 },
  },
  {
    id: "majestic-area",
    name: "Majestic / Kempegowda Bus Station",
    normalizedName: "majestic kempegowda bus station ksrtc bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    type: "area",
    aliases: ["majestic", "maj", "bus stand", "kempegowda bus station"],
    coords: { lat: 12.9767, lng: 77.5713 },
  },
  {
    id: "electronic-city-area",
    name: "Electronic City",
    normalizedName: "electronic city e-city bengaluru karnataka elect",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    type: "area",
    aliases: ["electronic city", "ecity", "e-city", "elect", "elec"],
    coords: { lat: 12.8452, lng: 77.6602 },
  },
  {
    id: "whitefield-area",
    name: "Whitefield",
    normalizedName: "whitefield bengaluru karnataka white",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    type: "area",
    aliases: ["whitefield", "white", "itpl"],
    coords: { lat: 12.9698, lng: 77.75 },
  },
  {
    id: "koramangala-area",
    name: "Koramangala",
    normalizedName: "koramangala bengaluru karnataka kora",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    type: "area",
    aliases: ["koramangala", "kora", "forum"],
    coords: { lat: 12.9352, lng: 77.6245 },
  },
  {
    id: "mysuru-city",
    name: "Mysuru / Mysore",
    normalizedName: "mysuru mysore junction mys karnataka",
    city: "Mysuru",
    state: "Karnataka",
    country: "India",
    code: "MYS",
    type: "city",
    aliases: ["mys", "mysore", "mysuru", "mysore palace"],
    coords: { lat: 12.3052, lng: 76.6552 },
  },
  {
    id: "mangalore-city",
    name: "Mangaluru / Mangalore (IXE / MAQ)",
    normalizedName: "mangaluru mangalore ixe maq karnataka",
    city: "Mangaluru",
    state: "Karnataka",
    country: "India",
    code: "IXE",
    type: "city",
    aliases: ["mangalore", "mangaluru", "mang", "ixe", "maq"],
    coords: { lat: 12.9141, lng: 74.856 },
  },
  {
    id: "hubballi-city",
    name: "Hubballi / Hubli (HBX / UBL)",
    normalizedName: "hubballi hubli hbx ubl karnataka",
    city: "Hubballi",
    state: "Karnataka",
    country: "India",
    code: "HBX",
    type: "city",
    aliases: ["hubli", "hubballi", "hbx", "ubl"],
    coords: { lat: 15.3647, lng: 75.124 },
  },
  {
    id: "coorg-area",
    name: "Coorg / Madikeri",
    normalizedName: "coorg madikeri karnataka",
    city: "Coorg",
    state: "Karnataka",
    country: "India",
    type: "area",
    aliases: ["coorg", "madikeri", "kodagu"],
    coords: { lat: 12.4244, lng: 75.7382 },
  },

  // --- Delhi / North India ---
  {
    id: "delhi-airport",
    name: "Delhi (DEL) — Indira Gandhi International Airport",
    normalizedName: "delhi new delhi igi indira gandhi international airport del",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    code: "DEL",
    type: "airport",
    aliases: ["del", "delhi", "new delhi", "igi", "indira gandhi"],
    coords: { lat: 28.5562, lng: 77.1, },
  },
  {
    id: "new-delhi-station",
    name: "New Delhi Railway Station (NDLS)",
    normalizedName: "new delhi railway station ndls delhi",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    code: "NDLS",
    type: "station",
    aliases: ["ndls", "new delhi station", "delhi station"],
    coords: { lat: 28.643, lng: 77.2194 },
  },

  // --- Mumbai / Maharashtra ---
  {
    id: "mumbai-airport",
    name: "Mumbai (BOM) — Chhatrapati Shivaji Maharaj International Airport",
    normalizedName: "mumbai bom chhatrapati shivaji maharaj international airport bombay",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    code: "BOM",
    type: "airport",
    aliases: ["bom", "mumbai", "bombay", "csmia"],
    coords: { lat: 19.0896, lng: 72.8656 },
  },
  {
    id: "cstmt-mumbai-station",
    name: "Mumbai Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    normalizedName: "mumbai csmt cst vt chhatrapati shivaji terminus",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    code: "CSMT",
    type: "station",
    aliases: ["csmt", "cst", "vt", "mumbai central"],
    coords: { lat: 18.9402, lng: 72.8354 },
  },

  // --- Chennai / Tamil Nadu ---
  {
    id: "chennai-airport",
    name: "Chennai (MAA) — Chennai International Airport",
    normalizedName: "chennai maa international airport madras",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    code: "MAA",
    type: "airport",
    aliases: ["maa", "chennai", "madras", "chen"],
    coords: { lat: 12.9941, lng: 80.1709 },
  },
  {
    id: "chennai-central-station",
    name: "Chennai Central (MAS)",
    normalizedName: "chennai central mas puratchi thalaivar dr mg rramachandran central",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    code: "MAS",
    type: "station",
    aliases: ["mas", "chennai central", "chennai station", "chen"],
    coords: { lat: 13.0827, lng: 80.2707 },
  },
  {
    id: "ooty-city",
    name: "Ooty / Udhagamandalam",
    normalizedName: "ooty udhagamandalam nilgiris tamil nadu",
    city: "Ooty",
    state: "Tamil Nadu",
    country: "India",
    type: "city",
    aliases: ["ooty", "oot", "udhagamandalam"],
    coords: { lat: 11.4102, lng: 76.695 },
  },

  // --- Hyderabad / Telangana ---
  {
    id: "hyderabad-airport",
    name: "Hyderabad (HYD) — Rajiv Gandhi International Airport",
    normalizedName: "hyderabad hyd rajiv gandhi international airport shamshabad",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    code: "HYD",
    type: "airport",
    aliases: ["hyd", "hyderabad", "shamshabad"],
    coords: { lat: 17.2403, lng: 78.4294 },
  },
  {
    id: "secunderabad-station",
    name: "Secunderabad Junction (SC)",
    normalizedName: "secunderabad junction sc hyderabad station",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    code: "SC",
    type: "station",
    aliases: ["sc", "secunderabad", "hyderabad station"],
    coords: { lat: 17.4339, lng: 78.5017 },
  },

  // --- Kerala / Goa / Andhra ---
  {
    id: "kochi-airport",
    name: "Cochin (COK) — Cochin International Airport",
    normalizedName: "cochin cok kochi international airport kerala nedumbassery",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    code: "COK",
    type: "airport",
    aliases: ["cok", "kochi", "cochin", "nedumbassery"],
    coords: { lat: 10.152, lng: 76.4019 },
  },
  {
    id: "goa-airport",
    name: "Goa (GOI / GOX) — Dabolim & Mopa Airport",
    normalizedName: "goa goi gox dabolim mopa airport panaji",
    city: "Goa",
    state: "Goa",
    country: "India",
    code: "GOI",
    type: "airport",
    aliases: ["goa", "goi", "gox", "dabolim", "mopa"],
    coords: { lat: 15.3808, lng: 73.8313 },
  },
  {
    id: "tirupati-city",
    name: "Tirupati (TIR / TPTY)",
    normalizedName: "tirupati tirumala tpty tir andhra pradesh",
    city: "Tirupati",
    state: "Andhra Pradesh",
    country: "India",
    code: "TPTY",
    type: "city",
    aliases: ["tirupati", "tpty", "tirumala", "tir"],
    coords: { lat: 13.6288, lng: 79.4192 },
  },
  {
    id: "rajahmundry-city",
    name: "Rajahmundry (RJA / RJY)",
    normalizedName: "rajahmundry rajamahendravaram rjy rja andhra pradesh raj",
    city: "Rajahmundry",
    state: "Andhra Pradesh",
    country: "India",
    code: "RJY",
    type: "city",
    aliases: ["rajahmundry", "rajamahendravaram", "rjy", "raj"],
    coords: { lat: 17.0005, lng: 81.804 },
  },
  {
    id: "rajkot-city",
    name: "Rajkot (RAJ / RJT)",
    normalizedName: "rajkot rjt gujarat raj",
    city: "Rajkot",
    state: "Gujarat",
    country: "India",
    code: "RJT",
    type: "city",
    aliases: ["rajkot", "rjt", "raj"],
    coords: { lat: 22.3039, lng: 70.8022 },
  },
];

/**
 * Smart Search utility for Location Autocomplete:
 * Supports partial matching, case-insensitive query, aliases, codes, areas & stations.
 */
export function searchLocations(
  query: string,
  filterType?: "flight" | "bus" | "train"
): LocationItem[] {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  if (!q) return LOCATIONS.slice(0, 8);

  return LOCATIONS.filter((loc) => {
    // Category specific filtering if needed
    if (filterType === "flight" && loc.type === "station") return false;
    if (filterType === "train" && loc.type === "airport") return false;

    // Direct check name or code
    const nameMatch = loc.name.toLowerCase().replace(/\s+/g, "").includes(q);
    const cityMatch = loc.city.toLowerCase().replace(/\s+/g, "").includes(q);
    const codeMatch = loc.code ? loc.code.toLowerCase().includes(q) : false;
    const aliasMatch = loc.aliases.some((alias) =>
      alias.toLowerCase().replace(/\s+/g, "").includes(q) || q.includes(alias.toLowerCase().replace(/\s+/g, ""))
    );

    return nameMatch || cityMatch || codeMatch || aliasMatch;
  }).slice(0, 10);
}

/**
 * Detect Nearest Location using Geolocation API
 */
export async function detectUserLocation(): Promise<{
  success: boolean;
  location?: LocationItem;
  cityName?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        success: false,
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Find closest known location in our database
        let minDistance = Infinity;
        let closestLocation: LocationItem = LOCATIONS[0]; // default Bengaluru

        for (const loc of LOCATIONS) {
          if (loc.coords) {
            const dist = Math.hypot(
              loc.coords.lat - latitude,
              loc.coords.lng - longitude
            );
            if (dist < minDistance) {
              minDistance = dist;
              closestLocation = loc;
            }
          }
        }

        resolve({
          success: true,
          location: closestLocation,
          cityName: closestLocation.city,
        });
      },
      (error) => {
        let msg = "Unable to retrieve location.";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "Location permission denied. Please select your location manually.";
        }
        resolve({ success: false, error: msg });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}
