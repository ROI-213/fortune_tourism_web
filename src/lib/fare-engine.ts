/**
 * Fortune Tourism — Dynamic Multi-Service Fare Engine
 * Accurately calculates itemized fares, taxes, advances, and balances.
 */

export interface CabPricingRate {
  category: string;
  name: string;
  fourHourFortyKm: number;
  eightHourEightyKm: number;
  extraKmRate: number;
  extraHourRate: number;
  driverAllowance: number;
  outstationMinKmPerDay: number;
  nightCharge: number;
  airportFlatRate: number;
}

export const DEFAULT_CAB_RATES: Record<string, CabPricingRate> = {
  hatchback: {
    category: "Hatchback",
    name: "Hatchback (Swift / WagonR / Tiago)",
    fourHourFortyKm: 1400,
    eightHourEightyKm: 2300,
    extraKmRate: 12,
    extraHourRate: 150,
    driverAllowance: 300,
    outstationMinKmPerDay: 250,
    nightCharge: 250,
    airportFlatRate: 1200,
  },
  sedan: {
    category: "Sedan",
    name: "Sedan (Dzire / Etios / Ciaz)",
    fourHourFortyKm: 1600,
    eightHourEightyKm: 2600,
    extraKmRate: 14,
    extraHourRate: 175,
    driverAllowance: 300,
    outstationMinKmPerDay: 250,
    nightCharge: 300,
    airportFlatRate: 1450,
  },
  suv: {
    category: "SUV",
    name: "SUV / Ertiga (6+1 Seater)",
    fourHourFortyKm: 2100,
    eightHourEightyKm: 3400,
    extraKmRate: 17,
    extraHourRate: 200,
    driverAllowance: 400,
    outstationMinKmPerDay: 300,
    nightCharge: 350,
    airportFlatRate: 1950,
  },
  innova: {
    category: "Innova",
    name: "Innova Crysta (7+1 Luxury)",
    fourHourFortyKm: 2600,
    eightHourEightyKm: 4200,
    extraKmRate: 21,
    extraHourRate: 250,
    driverAllowance: 500,
    outstationMinKmPerDay: 300,
    nightCharge: 400,
    airportFlatRate: 2450,
  },
  tempo: {
    category: "Tempo",
    name: "Tempo Traveller (12–17 Seater)",
    fourHourFortyKm: 4200,
    eightHourEightyKm: 6800,
    extraKmRate: 28,
    extraHourRate: 350,
    driverAllowance: 600,
    outstationMinKmPerDay: 350,
    nightCharge: 500,
    airportFlatRate: 3800,
  },
};

export interface CabFareInput {
  vehicleSlug: string;
  tripType: "Local" | "Airport Transfer" | "Outstation" | "One Way" | "Round Trip" | "Sightseeing";
  localPackage?: "4hr_40km" | "8hr_80km";
  airportType?: "Airport Pickup" | "Airport Drop";
  sightseeingPackage?: string;
  estimatedKm?: number;
  extraHours?: number;
  days?: number;
  isNightTravel?: boolean;
  tollEstimate?: number;
  parkingEstimate?: number;
  permitEstimate?: number;
  discount?: number;
  advanceAmount?: number;
}

export interface FareBreakdownItem {
  label: string;
  amount: number;
  isSubtotal?: boolean;
  isTax?: boolean;
  isDiscount?: boolean;
  isTotal?: boolean;
}

export interface FareCalculationResult {
  vehicleName: string;
  baseFare: number;
  includedKm: number;
  includedHours: number;
  extraKm: number;
  extraKmCharge: number;
  extraHours: number;
  extraHoursCharge: number;
  driverAllowance: number;
  nightCharges: number;
  toll: number;
  parking: number;
  permit: number;
  taxableSubtotal: number;
  gstRatePercent: number;
  gstAmount: number;
  discount: number;
  totalFare: number;
  advanceAmount: number;
  balanceAmount: number;
  breakdown: FareBreakdownItem[];
  snapshot: Record<string, any>;
}

export function calculateCabFare(input: CabFareInput): FareCalculationResult {
  const slug = (input.vehicleSlug || "sedan").toLowerCase();
  const rate =
    DEFAULT_CAB_RATES[slug] ||
    Object.values(DEFAULT_CAB_RATES).find((r) => slug.includes(r.category.toLowerCase())) ||
    DEFAULT_CAB_RATES.sedan;

  let baseFare = 0;
  let includedKm = 0;
  let includedHours = 0;
  let extraKm = 0;
  let extraKmCharge = 0;
  let extraHours = Number(input.extraHours || 0);
  let extraHoursCharge = extraHours * rate.extraHourRate;
  let driverAllowance = rate.driverAllowance;
  let nightCharges = input.isNightTravel ? rate.nightCharge : 0;
  let toll = Number(input.tollEstimate || 0);
  let parking = Number(input.parkingEstimate || 0);
  let permit = Number(input.permitEstimate || 0);
  const days = Math.max(1, Number(input.days || 1));

  if (input.tripType === "Local") {
    if (input.localPackage === "4hr_40km") {
      baseFare = rate.fourHourFortyKm;
      includedKm = 40;
      includedHours = 4;
    } else {
      baseFare = rate.eightHourEightyKm;
      includedKm = 80;
      includedHours = 8;
    }
    const estKm = Number(input.estimatedKm || includedKm);
    if (estKm > includedKm) {
      extraKm = estKm - includedKm;
      extraKmCharge = extraKm * rate.extraKmRate;
    }
  } else if (input.tripType === "Airport Transfer") {
    baseFare = rate.airportFlatRate;
    includedKm = 45;
    includedHours = 3;
    parking = parking || 150; // airport parking allowance
    driverAllowance = 0; // included in airport flat rate
    const estKm = Number(input.estimatedKm || includedKm);
    if (estKm > includedKm) {
      extraKm = estKm - includedKm;
      extraKmCharge = extraKm * rate.extraKmRate;
    }
  } else if (input.tripType === "Sightseeing") {
    // Sightseeing packages default to full day 8h/80km + driver
    baseFare = rate.eightHourEightyKm;
    includedKm = 80;
    includedHours = 8;
    parking = parking || 150;
    const estKm = Number(input.estimatedKm || includedKm);
    if (estKm > includedKm) {
      extraKm = estKm - includedKm;
      extraKmCharge = extraKm * rate.extraKmRate;
    }
  } else {
    // Outstation (One Way or Round Trip)
    const minDailyKm = rate.outstationMinKmPerDay * days;
    const estKm = Math.max(minDailyKm, Number(input.estimatedKm || minDailyKm));
    includedKm = minDailyKm;
    includedHours = days * 12;
    baseFare = minDailyKm * rate.extraKmRate;
    driverAllowance = rate.driverAllowance * days;
    if (estKm > minDailyKm) {
      extraKm = estKm - minDailyKm;
      extraKmCharge = extraKm * rate.extraKmRate;
    }
    toll = toll || 350 * days;
  }

  const taxableSubtotal =
    baseFare +
    extraKmCharge +
    extraHoursCharge +
    driverAllowance +
    nightCharges +
    toll +
    parking +
    permit;

  const discount = Math.min(taxableSubtotal, Number(input.discount || 0));
  const subtotalAfterDiscount = taxableSubtotal - discount;

  const gstRatePercent = 5;
  const gstAmount = Math.round((subtotalAfterDiscount * gstRatePercent) / 100);
  const totalFare = subtotalAfterDiscount + gstAmount;

  const advanceAmount = Math.min(totalFare, Number(input.advanceAmount || 0));
  const balanceAmount = Math.max(0, totalFare - advanceAmount);

  const breakdown: FareBreakdownItem[] = [
    { label: `Base Package (${rate.name})`, amount: baseFare },
  ];

  if (extraKmCharge > 0) {
    breakdown.push({
      label: `Extra Distance (${extraKm} KM @ ₹${rate.extraKmRate}/KM)`,
      amount: extraKmCharge,
    });
  }

  if (extraHoursCharge > 0) {
    breakdown.push({
      label: `Extra Time (${extraHours} Hrs @ ₹${rate.extraHourRate}/Hr)`,
      amount: extraHoursCharge,
    });
  }

  if (driverAllowance > 0) {
    breakdown.push({ label: `Driver Allowance (${days > 1 ? `${days} Days` : "Day"})`, amount: driverAllowance });
  }

  if (nightCharges > 0) {
    breakdown.push({ label: "Night Travel Allowance", amount: nightCharges });
  }

  if (toll > 0) {
    breakdown.push({ label: "Estimated Toll Charges", amount: toll });
  }

  if (parking > 0) {
    breakdown.push({ label: "Estimated Parking / Airport Entry", amount: parking });
  }

  if (permit > 0) {
    breakdown.push({ label: "State Border Permit", amount: permit });
  }

  if (discount > 0) {
    breakdown.push({ label: "Promotional Discount", amount: -discount, isDiscount: true });
  }

  breakdown.push({ label: "Taxable Subtotal", amount: subtotalAfterDiscount, isSubtotal: true });
  breakdown.push({ label: `GST (${gstRatePercent}%)`, amount: gstAmount, isTax: true });
  breakdown.push({ label: "Total Estimated Fare", amount: totalFare, isTotal: true });

  const snapshot = {
    vehicleName: rate.name,
    vehicleSlug: slug,
    tripType: input.tripType,
    baseFare,
    includedKm,
    includedHours,
    extraKm,
    extraKmCharge,
    extraHours,
    extraHoursCharge,
    driverAllowance,
    nightCharges,
    toll,
    parking,
    permit,
    taxableSubtotal,
    gstRatePercent,
    gstAmount,
    discount,
    totalFare,
    advanceAmount,
    balanceAmount,
  };

  return {
    vehicleName: rate.name,
    baseFare,
    includedKm,
    includedHours,
    extraKm,
    extraKmCharge,
    extraHours,
    extraHoursCharge,
    driverAllowance,
    nightCharges,
    toll,
    parking,
    permit,
    taxableSubtotal,
    gstRatePercent,
    gstAmount,
    discount,
    totalFare,
    advanceAmount,
    balanceAmount,
    breakdown,
    snapshot,
  };
}

export interface TourFareInput {
  packageTitle: string;
  basePackagePrice: number;
  adults: number;
  children?: number;
  infants?: number;
  vehicleSlug?: string;
  hotelTier?: "Budget" | "Standard" | "Deluxe" | "Premium";
  days?: number;
  discount?: number;
  advanceAmount?: number;
}

export function calculateTourFare(input: TourFareInput): FareCalculationResult {
  const basePrice = Number(input.basePackagePrice || 4999);
  const adults = Math.max(1, Number(input.adults || 2));
  const children = Math.max(0, Number(input.children || 0));
  const infants = Math.max(0, Number(input.infants || 0));
  const days = Math.max(1, Number(input.days || 2));
  const nights = Math.max(1, days - 1);

  // Base price includes 2 adults
  let extraAdultsCost = 0;
  if (adults > 2) {
    extraAdultsCost = (adults - 2) * Math.round(basePrice * 0.45);
  }

  const childCost = children * Math.round(basePrice * 0.3);

  // Vehicle tier differential
  let vehicleDiff = 0;
  const vSlug = (input.vehicleSlug || "sedan").toLowerCase();
  if (vSlug.includes("suv") || vSlug.includes("ertiga")) {
    vehicleDiff = 1800 * days;
  } else if (vSlug.includes("innova") || vSlug.includes("crysta")) {
    vehicleDiff = 3200 * days;
  } else if (vSlug.includes("tempo")) {
    vehicleDiff = 6000 * days;
  }

  // Hotel tier multiplier per night
  let hotelDiff = 0;
  const hTier = input.hotelTier || "Standard";
  if (hTier === "Budget") {
    hotelDiff = 0;
  } else if (hTier === "Standard") {
    hotelDiff = 1200 * nights * Math.ceil(adults / 2);
  } else if (hTier === "Deluxe") {
    hotelDiff = 2800 * nights * Math.ceil(adults / 2);
  } else if (hTier === "Premium") {
    hotelDiff = 5500 * nights * Math.ceil(adults / 2);
  }

  const taxableSubtotal = basePrice + extraAdultsCost + childCost + vehicleDiff + hotelDiff;
  const discount = Math.min(taxableSubtotal, Number(input.discount || 0));
  const subtotalAfterDiscount = taxableSubtotal - discount;

  const gstRatePercent = 5;
  const gstAmount = Math.round((subtotalAfterDiscount * gstRatePercent) / 100);
  const totalFare = subtotalAfterDiscount + gstAmount;

  const advanceAmount = Math.min(totalFare, Number(input.advanceAmount || 0));
  const balanceAmount = Math.max(0, totalFare - advanceAmount);

  const breakdown: FareBreakdownItem[] = [
    { label: `Base Tour Package (${input.packageTitle} - 2 Adults)`, amount: basePrice },
  ];

  if (extraAdultsCost > 0) {
    breakdown.push({ label: `Extra Adults (${adults - 2} Guests)`, amount: extraAdultsCost });
  }

  if (childCost > 0) {
    breakdown.push({ label: `Children (${children} Kids)`, amount: childCost });
  }

  if (vehicleDiff > 0) {
    breakdown.push({ label: `Vehicle Upgrade (${vSlug.toUpperCase()})`, amount: vehicleDiff });
  }

  if (hotelDiff > 0) {
    breakdown.push({ label: `Accommodation Upgrade (${hTier} Tier · ${nights} Nights)`, amount: hotelDiff });
  }

  if (discount > 0) {
    breakdown.push({ label: "Special Package Discount", amount: -discount, isDiscount: true });
  }

  breakdown.push({ label: "Taxable Package Subtotal", amount: subtotalAfterDiscount, isSubtotal: true });
  breakdown.push({ label: `GST (${gstRatePercent}%)`, amount: gstAmount, isTax: true });
  breakdown.push({ label: "Total Tour Package Fare", amount: totalFare, isTotal: true });

  const snapshot = {
    packageTitle: input.packageTitle,
    basePrice,
    adults,
    children,
    infants,
    extraAdultsCost,
    childCost,
    vehicleSlug: vSlug,
    vehicleDiff,
    hotelTier: hTier,
    hotelDiff,
    days,
    nights,
    taxableSubtotal,
    gstRatePercent,
    gstAmount,
    discount,
    totalFare,
    advanceAmount,
    balanceAmount,
  };

  return {
    vehicleName: input.packageTitle,
    baseFare: basePrice,
    includedKm: 0,
    includedHours: 0,
    extraKm: 0,
    extraKmCharge: 0,
    extraHours: 0,
    extraHoursCharge: 0,
    driverAllowance: 0,
    nightCharges: 0,
    toll: 0,
    parking: 0,
    permit: 0,
    taxableSubtotal,
    gstRatePercent,
    gstAmount,
    discount,
    totalFare,
    advanceAmount,
    balanceAmount,
    breakdown,
    snapshot,
  };
}
