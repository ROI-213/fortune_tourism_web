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
    coords: { lat: 28.5562, lng: 77.1 },
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
  filterType?: "flight" | "bus" | "train" | "taxi",
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
    const aliasMatch = loc.aliases.some(
      (alias) =>
        alias.toLowerCase().replace(/\s+/g, "").includes(q) ||
        q.includes(alias.toLowerCase().replace(/\s+/g, "")),
    );

    return nameMatch || cityMatch || codeMatch || aliasMatch;
  }).slice(0, 10);
}

/**
 * Reverse geocode latitude and longitude to real location/area details using public CORS geocoding services
 */
async function reverseGeocodeCoords(
  latitude: number,
  longitude: number,
): Promise<{ name: string; city: string; state: string; country: string } | null> {
  // 1. Try BigDataCloud reverse geocode client API (fast, CORS enabled, no API key required)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      { signal: controller.signal },
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const locality =
        data.locality ||
        data.localityInfo?.administrative?.[3]?.name ||
        data.localityInfo?.administrative?.[2]?.name ||
        "";
      const city = data.city || data.principalSubdivision || "";
      const state = data.principalSubdivision || "";
      const country = data.countryName || "India";

      let name = "";
      if (locality && city && locality !== city) {
        name = `${locality}, ${city}`;
      } else if (city && state && city !== state) {
        name = `${city}, ${state}`;
      } else {
        name = locality || city || state || "Current Location";
      }

      return {
        name,
        city: city || locality || "Bengaluru",
        state: state || "Karnataka",
        country,
      };
    }
  } catch {
    // Continue to next fallback
  }

  // 2. Try OpenStreetMap Nominatim reverse geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      {
        headers: { "Accept-Language": "en" },
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const suburb = addr.suburb || addr.neighbourhood || addr.residential || addr.quarter || "";
      const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || "";
      const state = addr.state || "";
      const country = addr.country || "India";

      let name = "";
      if (suburb && city) {
        name = `${suburb}, ${city}`;
      } else if (city) {
        name = state ? `${city}, ${state}` : city;
      } else {
        name = data.display_name?.split(",")?.slice(0, 2)?.join(",") || "Current Location";
      }

      return {
        name,
        city: city || suburb || "Bengaluru",
        state: state || "Karnataka",
        country,
      };
    }
  } catch {
    // Continue
  }

  return null;
}

/**
 * Fallback to IP-based Geolocation when browser GPS is blocked, unavailable, or times out
 */
async function detectByIp(): Promise<{
  success: boolean;
  location?: LocationItem;
  cityName?: string;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("https://ipapi.co/json/", { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.city) {
        const city = data.city;
        const state = data.region || data.region_code || "Karnataka";
        const country = data.country_name || "India";
        const displayName = state ? `${city}, ${state}` : city;

        const locItem: LocationItem = {
          id: `ip-${Date.now()}`,
          name: displayName,
          normalizedName: displayName.toLowerCase(),
          city,
          state,
          country,
          type: "area",
          aliases: [city.toLowerCase(), state.toLowerCase()],
          coords:
            data.latitude && data.longitude
              ? { lat: data.latitude, lng: data.longitude }
              : undefined,
        };

        return { success: true, location: locItem, cityName: city };
      }
    }
  } catch {
    // Try secondary IP lookup service
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch("https://ipwho.is/", { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.city) {
          const city = data.city;
          const state = data.region || "Karnataka";
          const country = data.country || "India";
          const displayName = state ? `${city}, ${state}` : city;

          const locItem: LocationItem = {
            id: `ip-${Date.now()}`,
            name: displayName,
            normalizedName: displayName.toLowerCase(),
            city,
            state,
            country,
            type: "area",
            aliases: [city.toLowerCase(), state.toLowerCase()],
            coords:
              data.latitude && data.longitude
                ? { lat: data.latitude, lng: data.longitude }
                : undefined,
          };

          return { success: true, location: locItem, cityName: city };
        }
      }
    } catch {
      // Continue
    }
  }

  return {
    success: false,
    error: "Location access disabled or unavailable. Please select your location manually.",
  };
}

/**
 * Obtain browser coordinates with high-accuracy and standard-accuracy retry mechanisms
 */
function getBrowserCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    let settled = false;

    // Step 1: Try high accuracy GPS (fast 5s limit)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!settled) {
          settled = true;
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        }
      },
      () => {
        // Step 2: High accuracy failed or timed out, try standard WiFi / cell tower positioning
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            if (!settled) {
              settled = true;
              resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            }
          },
          () => {
            if (!settled) {
              settled = true;
              resolve(null);
            }
          },
          { timeout: 5000, enableHighAccuracy: false, maximumAge: 120000 },
        );
      },
      { timeout: 5000, enableHighAccuracy: true, maximumAge: 60000 },
    );
  });
}

/**
 * Detect Nearest / Live User Location using Browser Geolocation with Reverse Geocoding and IP fallback
 */
export async function detectUserLocation(): Promise<{
  success: boolean;
  location?: LocationItem;
  cityName?: string;
  error?: string;
}> {
  try {
    const coords = await getBrowserCoordinates();

    if (coords) {
      const { latitude, longitude } = coords;

      // 1. Try reverse geocoding to retrieve actual locality/suburb/city
      const geoResult = await reverseGeocodeCoords(latitude, longitude);
      if (geoResult) {
        const liveLocation: LocationItem = {
          id: `gps-${Date.now()}`,
          name: geoResult.name,
          normalizedName: geoResult.name.toLowerCase(),
          city: geoResult.city,
          state: geoResult.state,
          country: geoResult.country,
          type: "area",
          aliases: [geoResult.city.toLowerCase(), geoResult.state.toLowerCase()],
          coords: { lat: latitude, lng: longitude },
        };
        return {
          success: true,
          location: liveLocation,
          cityName: geoResult.city,
        };
      }

      // 2. If reverse geocoding networks are unreachable, find the nearest preset location
      let minDistance = Infinity;
      let closestLocation: LocationItem = LOCATIONS[0];

      for (const loc of LOCATIONS) {
        if (loc.coords) {
          const dist = Math.hypot(loc.coords.lat - latitude, loc.coords.lng - longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closestLocation = loc;
          }
        }
      }

      return {
        success: true,
        location: closestLocation,
        cityName: closestLocation.city,
      };
    }

    // 3. If GPS is unavailable/denied, fallback to IP detection
    const ipResult = await detectByIp();
    if (ipResult.success) {
      return ipResult;
    }

    return {
      success: false,
      error: "Location access disabled or unavailable. Please enter pickup location manually.",
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Unable to detect location. Please type manually.",
    };
  }
}
