import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851",
  ssl: false,
});

async function main() {
  console.log("Seeding rich dummy expense records...");

  const DUMMY_EXPENSES = [
    // Today: 2026-08-12 & 2026-08-05 (shown in screenshot)
    ["2026-08-12", "Fuel", "Shell Petrol Pump Bommasandra - Innova Crysta KA 05 MN 1234 Full Tank Diesel", "Shell Petrol Pump", 3850, "UPI", "EXP-8001", "Full tank diesel for Bangalore Outstation trip"],
    ["2026-08-12", "Driver", "Driver Bata for Zameer - Mysore Coorg 3 Days Outstation Duty", "Zameer", 1500, "Cash", "EXP-8002", "Driver outstation daily bata allowance"],
    ["2026-08-12", "Repairs", "Car Care Garage Bommasandra - Innova Crysta Brake Pad Replacement & Oil Filter", "Car Care Garage", 6400, "Bank Transfer", "EXP-8003", "Regular servicing & brake pad replacement"],
    ["2026-08-12", "Toll", "KIA Airport Toll & Parking Fee - Innova Airport Pickup Voucher", "Airport Toll Booth", 350, "Cash", "EXP-8004", "Airport arrival gate pickup parking fee"],
    ["2026-08-12", "Office", "Airtel Office Fiber Internet & Phone Bill Payment", "Airtel India", 1899, "UPI", "EXP-8005", "Monthly broadband connection bill"],
    ["2026-08-12", "Fuel", "HP Fuel Station Hosur Road - Swift Dzire KA 51 AA 598 Diesel", "HP Fuel Station", 2200, "UPI", "EXP-8006", "Fuel refill for airport transfer cab"],
    ["2026-08-12", "Driver", "Driver Night Allowance - Basavaraj Patil Airport Midnight Drop", "Basavaraj Patil", 600, "Cash", "EXP-8007", "Midnight driver allowance"],

    // Date shown in screenshot: 2026-08-05
    ["2026-08-05", "Fuel", "Indian Oil Airport Road - Tempo Traveller KA 03 AF 4832 Diesel", "Indian Oil Corp", 4500, "UPI", "EXP-7001", "Diesel refill for group tour trip"],
    ["2026-08-05", "Driver", "Driver Daily Allowance & Food Bata - Murugan S Local Sightseeing Trip", "Murugan S", 1200, "Cash", "EXP-7002", "Driver daily meal allowance"],
    ["2026-08-05", "Toll", "FASTag Recharge - HDFC Bank FASTag Auto Debit Fleet Toll Pass", "HDFC FASTag", 2000, "UPI", "EXP-7003", "Auto wallet top up for national highway tolls"],
    ["2026-08-05", "Office", "Bommasandra Office Electricity Bill - BESCOM Monthly Payment", "BESCOM Karnataka", 3450, "Bank Transfer", "EXP-7004", "Office power bill"],
    ["2026-08-05", "Repairs", "Apex Tyres Hosur - Swift Dzire Wheel Alignment & Puncture Repair", "Apex Tyres", 1200, "UPI", "EXP-7005", "Wheel balancing & alignment"],
    ["2026-08-05", "Office", "Office Tea, Snacks & Mineral Water Supply", "Bommasandra Traders", 750, "Cash", "EXP-7006", "Office daily supplies"],

    // Yesterday: 2026-08-11 & 2026-08-04
    ["2026-08-11", "Fuel", "Shell Station Indiranagar - Innova Diesel", "Shell Indiranagar", 3100, "UPI", "EXP-6001", "Fuel refill"],
    ["2026-08-11", "Driver", "Driver Outstation Allowance - Ramesh Yadav", "Ramesh Yadav", 800, "Cash", "EXP-6002", "Outstation duty allowance"],
    ["2026-08-11", "Office", "Stationery - Printed Trip Sheets, Receipt Books & Letterheads", "Royal Printers", 1400, "Cash", "EXP-6003", "Printing office vouchers"],

    ["2026-08-04", "Fuel", "HP Petrol Station Koramangala - Dzire Petrol", "HP Koramangala", 2800, "UPI", "EXP-5001", "Local trip fuel refill"],
    ["2026-08-04", "Driver", "Driver Food Allowance - Lakshmana Gowda", "Lakshmana Gowda", 750, "Cash", "EXP-5002", "Bata payment"],
    ["2026-08-04", "Toll", "Nandi Hills Toll & Entry Parking Pass", "Nandi Hills Authority", 450, "Cash", "EXP-5003", "Parking voucher"],
  ];

  for (const exp of DUMMY_EXPENSES) {
    await pool.query(
      `INSERT INTO expenses (expense_date, category, description, paid_to, amount, payment_method, reference, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      exp
    );
  }

  console.log(`Successfully seeded ${DUMMY_EXPENSES.length} dummy expense records!`);
  await pool.end();
}

main().catch((err) => {
  console.error("Error seeding dummy expenses:", err);
  process.exit(1);
});
