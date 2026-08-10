import pg from "pg";
const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851",
  ssl: false,
  connectionTimeoutMillis: 10000,
});
const q = (t, p = []) => pool.query(t, p);
const count = async (t) => (await q(`SELECT COUNT(*)::int AS n FROM ${t}`)).rows[0].n;
const seed = async (table, fn, rows, cols) => {
  if ((await count(table)) > 0) return console.log(`${table}: skip (has data)`);
  for (const r of rows) await q(`INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(", ")})`, fn(r));
  console.log(`${table}: ${rows.length} rows`);
};

async function main() {
  console.log("Seeding business dummy data...");

  const CUSTOMERS = [
    ["CUST-001", "Ananya Rao", "+91 98765 12345", "+91 81234 56789", "ananya.rao@gmail.com", "12, 3rd Cross, Indiranagar", "Bengaluru", "Karnataka", "Prefers Innova Crysta"],
    ["CUST-002", "Vikram Menon", "+91 98765 54321", null, "vikram.menon@outlook.com", "88, Whitefield Main Road", "Bengaluru", "Karnataka", "Corporate client"],
    ["CUST-003", "Rajesh Kumar", "+91 98765 99999", "+91 99888 77777", "rajesh.kumar@yahoo.com", "5, Kuvempunagar", "Mysuru", "Karnataka", "Temple tours"],
    ["CUST-004", "Priya Iyer", "+91 98765 88888", null, "priya.iyer@gmail.com", "201, 2nd Block, Jayanagar", "Bengaluru", "Karnataka", "Hourly rentals"],
    ["CUST-005", "Mohammed Farhan", "+91 98654 11223", "+91 90000 11122", "farhan.md@gmail.com", "44, Frazer Town", "Bengaluru", "Karnataka", "Tirupati trips"],
    ["CUST-006", "Sneha Deshpande", "+91 97412 34567", null, "sneha.deshpande@gmail.com", "7, Koregaon Park", "Pune", "Maharashtra", "Ooty packages"],
  ];
  await seed("customers", (c) => c, CUSTOMERS, ["customer_code", "name", "phone", "alternate_phone", "email", "address", "city", "state", "notes"]);

  const vids = (await q(`SELECT id, name FROM vehicles ORDER BY name`)).rows;
  const DRIVERS = [
    ["Basavaraj Patil", "Bengaluru", "Jayanagar", "+91 99801 22334", "Innova Crysta", vids[0]?.id, "Active"],
    ["Murugan S", "Bengaluru", "Koramangala", "+91 99721 44556", "Sedan", vids[1]?.id, "Active"],
    ["Lakshmana Gowda", "Bengaluru", "Hebbal", "+91 97401 77889", "SUV", vids[2]?.id, "Active"],
    ["Ramesh Yadav", "Mysuru", "Mysuru", "+91 99011 22334", "Innova", null, "On Trip"],
  ];
  await seed("drivers", (d) => d, DRIVERS, ["driver_name", "city", "area", "phone", "vehicle_type", "vehicle_id", "status"]);

  const ACCOUNTS = [
    ["HDFC Current Account", "Bank", 150000, "Active"],
    ["Cash in Hand", "Cash", 25000, "Active"],
    ["SBI Overdraft", "Loan", 0, "Active"],
    ["Office Petty Cash", "Cash", 8000, "Active"],
  ];
  await seed("accounts", (a) => a, ACCOUNTS, ["account_name", "account_type", "opening_balance", "status"]);

  const customers = (await q(`SELECT id, name FROM customers ORDER BY id`)).rows;
  const drivers = (await q(`SELECT id, driver_name FROM drivers ORDER BY id`)).rows;
  const accounts = (await q(`SELECT id, account_name FROM accounts ORDER BY id`)).rows;
  const cid = (i) => customers[i % customers.length]?.id ?? null;
  const did = (i) => drivers[i % drivers.length]?.id ?? null;
  const aid = (i) => accounts[i % accounts.length]?.id ?? null;

  await seed("day_book_entries",
    (e) => [e[0], e[1], e[2], e[3], e[4], cid(e[5]), "+91 98765 00000", e[6], e[7], e[8], e[9], e[10], e[11], e[12]],
    [
      ["DB-1001", "2026-07-10", "2026-07-12", "Innova Crysta", "Ananya Rao", 0, "Bengaluru", "Mysuru", 8500, 3000, 5500, 2400, "Confirmed"],
      ["DB-1002", "2026-07-12", "2026-07-12", "Sedan", "Vikram Menon", 1, "Whitefield", "BLR Airport", 1800, 1800, 0, 500, "Completed"],
      ["DB-1003", "2026-07-14", "2026-07-16", "SUV", "Priya Iyer", 3, "Bengaluru", "Coorg", 12000, 6000, 6000, 3800, "Confirmed"],
      ["DB-1004", "2026-07-18", "2026-07-18", "Innova Crysta", "Rajesh Kumar", 2, "Bengaluru", "Tirupati", 6500, 6500, 0, 2100, "Completed"],
      ["DB-1005", "2026-07-20", "2026-07-22", "Tempo Traveller", "Mohammed Farhan", 4, "Bengaluru", "Hampi", 18500, 9000, 9500, 5200, "Confirmed"],
      ["DB-1006", "2026-07-22", "2026-07-25", "Innova", "Sneha Deshpande", 5, "Bengaluru", "Ooty", 14500, 7000, 7500, 4600, "Quoted"],
    ],
    ["serial_number", "booking_date", "travel_date", "travel_by", "passenger_name", "customer_id", "passenger_phone", "from_location", "to_location", "booking_amount", "office_advance", "due_amount", "expense_amount", "status"]);

  await seed("cab_bookings",
    (c) => [c[0], c[1], c[2], c[3], c[4], c[5], cid(0), "+91 98888 12345", vids[0]?.id, "KA-01-AB-1234", "Innova Crysta", did(0), "+91 99801 22334", c[6], c[7], c[8], c[9], c[10]],
    [
      ["CAB-501", "2026-08-01", "2026-08-02", "Bengaluru", "Chikmagalur", "Ananya Rao", 9800, 2000, 11800, "Paid", "Completed"],
      ["CAB-502", "2026-08-03", "2026-08-03", "HSR Layout", "BLR Airport", "Vikram Menon", 2200, 0, 2200, "Paid", "Completed"],
      ["CAB-503", "2026-08-05", "2026-08-06", "Bengaluru", "Tirupati", "Mohammed Farhan", 11500, 1500, 9000, "Partial", "Confirmed"],
      ["CAB-504", "2026-08-08", "2026-08-09", "Bengaluru", "Mysuru", "Priya Iyer", 8200, 0, 0, "Pending", "Confirmed"],
      ["CAB-505", "2026-08-10", "2026-08-10", "Indiranagar", "Electronic City", "Rajesh Kumar", 1500, 0, 1500, "Paid", "Completed"],
    ],
    ["booking_number", "booking_date", "travel_date", "from_location", "to_location", "passenger_name", "customer_id", "passenger_phone", "vehicle_id", "vehicle_number", "vehicle_type", "driver_id", "driver_phone", "due_amount", "to_pay", "settled_amount", "payment_status", "status"]);

  await seed("package_trips",
    (t) => [t[0], t[1], t[2], t[3], t[4], cid(2), "+91 97777 23456", t[5], t[6], t[7], t[8], t[9], t[10], "Innova Crysta", vids[0]?.id, did(0), "+91 99801 22334", t[11], t[12], t[13], t[14]],
    [
      ["PKG-3001", "Coorg Coffee Trails", "2026-07-10", "2026-07-12", "Ananya Rao", "Bengaluru", "Bengaluru", 560, 24, 1200, 800, 13440, 13440, 15440, 0],
      ["PKG-3002", "Ooty Hills Package", "2026-07-16", "2026-07-18", "Sneha Deshpande", "Bengaluru", "Bengaluru", 640, 24, 1500, 900, 15360, 10000, 17760, 5360],
      ["PKG-3003", "Kerala Backwaters & Munnar", "2026-07-21", "2026-07-24", "Rajesh Kumar", "Kochi", "Kochi", 720, 22, 2000, 1200, 15840, 8000, 19040, 7840],
      ["PKG-3004", "Tirupati Darshan Round", "2026-07-25", "2026-07-25", "Mohammed Farhan", "Bengaluru", "Bengaluru", 560, 24, 1200, 600, 13440, 13440, 15240, 0],
    ],
    ["trip_number", "tour_name", "journey_date", "return_date", "passenger_name", "customer_id", "passenger_phone", "pickup_location", "drop_location", "total_run_km", "per_km_rate", "bata", "toll_expense", "car_type", "vehicle_id", "driver_id", "driver_phone", "due_amount", "paid_amount", "total_cost", "remaining_amount"]);

  await seed("hourly_bookings",
    (h) => [h[0], h[1], h[2], h[3], cid(3), "+91 96666 78901", "Bengaluru City", "Bengaluru Local", h[4], vids[1]?.id, did(1), "KA-05-MN-4321", h[5], h[6], h[7], h[8]],
    [
      ["HR-101", "2026-08-01", "2026-08-01", "Priya Iyer", 8, 120, 0, 3600, "Paid"],
      ["HR-102", "2026-08-04", "2026-08-04", "Vikram Menon", 4, 60, 50, 1950, "Paid"],
      ["HR-103", "2026-08-07", "2026-08-07", "Ananya Rao", 12, 200, 100, 5600, "Pending"],
    ],
    ["booking_number", "booking_date", "travel_date", "passenger_name", "customer_id", "phone", "from_location", "to_location", "hours", "vehicle_id", "driver_id", "taxi_number", "toll", "boarding", "amount", "payment_status"]);

  await seed("expenses",
    (e) => [e[0], e[1], e[2], e[3], e[4], e[5], vids[0]?.id, did(0), aid(0)],
    [
      ["2026-07-10", "Petrol", "Innova Crysta full tank", "Basavaraj Patil", 4200, "UPI"],
      ["2026-07-12", "Toll", "Bengaluru-Tirupati toll", "Ramesh Yadav", 1250, "Cash"],
      ["2026-07-15", "Repairs", "Brake pad replacement - Sedan", "Sri Balaji Garage", 5600, "Cash"],
      ["2026-07-18", "Rent", "Office rent for July", "Office Landlord", 25000, "Bank Transfer"],
      ["2026-07-20", "Driver", "Driver salary advance", "Murugan S", 8000, "Cash"],
      ["2026-07-22", "Recharge", "Office mobile & data", "Jio", 999, "UPI"],
      ["2026-07-25", "Home", "Home electricity bill", "BESCOM", 3450, "UPI"],
      ["2026-07-28", "Vehicle", "Sedan wheel alignment", "Auto Care", 800, "Cash"],
      ["2026-07-30", "Fuel", "SUV diesel", "Basavaraj Patil", 3800, "UPI"],
    ],
    ["expense_date", "category", "description", "paid_to", "amount", "payment_method", "vehicle_id", "driver_id", "account_id"]);

  await seed("account_transactions",
    (t) => [aid(t[0]), t[1], t[2], t[3], t[4], t[5], t[6]],
    [
      [0, "2026-07-11", "Credit", "Payment received - Ananya Rao", 0, 8500, "CAB-501"],
      [0, "2026-07-15", "Debit", "Office rent paid", 25000, 0, "RENT-JUL"],
      [1, "2026-07-16", "Credit", "Cash deposit from collection", 0, 15000, "DEP-001"],
      [1, "2026-07-20", "Debit", "Driver advance paid", 8000, 0, "DRV-ADV"],
      [2, "2026-07-22", "Debit", "SBI OD interest", 1500, 0, "OD-INT"],
    ],
    ["account_id", "transaction_date", "transaction_type", "description", "debit", "credit", "reference"]);

  await seed("payments",
    (p) => [p[0], p[1], p[2], p[3], cid(0), p[4]],
    [
      ["2026-07-11", 8500, "UPI", "PAY-1001", "Ananya Rao - Mysuru full settlement"],
      ["2026-07-12", 1800, "UPI", "PAY-1002", "Vikram Menon - airport transfer"],
      ["2026-07-13", 10000, "Cash", "PAY-1003", "Sneha Deshpande - Ooty advance"],
      ["2026-07-15", 8000, "Cash", "PAY-1004", "Driver advance - Murugan"],
      ["2026-07-19", 6500, "UPI", "PAY-1005", "Rajesh Kumar - Tirupati round trip"],
      ["2026-07-21", 9000, "Bank Transfer", "PAY-1006", "Farhan - Tirupati partial"],
    ],
    ["payment_date", "amount", "payment_method", "reference", "customer_id", "description"]);

  await seed("outstanding_entries",
    (o) => [o[0], o[1], o[2], o[3], o[4], o[5]],
    [
      ["Customer", "Package Trip", 7840, 0, "Open", "Sneha Deshpande - Kerala remaining"],
      ["Customer", "Package Trip", 5360, 2000, "Partial", "Sneha Deshpande - Ooty remaining"],
      ["Customer", "Cab Booking", 1500, 0, "Open", "Priya Iyer - CAB-504 due"],
      ["Driver", "Advance", 8000, 0, "Open", "Murugan advance to recover"],
    ],
    ["entity_type", "reference_type", "original_amount", "paid_amount", "status", "notes"]);

  await seed("repairs",
    (r) => [vids[0]?.id, r[0], r[1], r[2], r[3], r[4], r[5]],
    [
      ["2026-06-15", "Sri Balaji Garage", "Brake pads", 5600, "Office", "Front brake pads"],
      ["2026-06-28", "Auto Care", "Wheel alignment", 800, "Driver", "Sedan alignment"],
      ["2026-07-05", "Maruthi Service", "AC gas refill", 2400, "Office", "Innova AC service"],
    ],
    ["vehicle_id", "repair_date", "garage", "part", "amount", "paid_by", "description"]);

  await seed("permits",
    (p) => [vids[0]?.id, p[0], p[1], p[2], p[3], p[4], p[5], p[6]],
    [
      ["Temporary", "Karnataka", "2026-07-10", "2026-07-20", 950, "Paid", "KA-TP-001"],
      ["State", "Tamil Nadu", "2026-07-01", "2026-08-01", 1200, "Paid", "TN-ST-002"],
      ["Temporary", "Kerala", "2026-07-21", "2026-07-24", 850, "Pending", "KL-TP-003"],
    ],
    ["vehicle_id", "permit_type", "state", "start_date", "end_date", "amount", "payment_status", "reference"]);

  await seed("insurance_records",
    (i) => [vids[0]?.id, i[0], i[1], i[2], i[3], i[4], i[5], i[6]],
    [
      ["ICICI Lombard", "IC-2026-001122", "Comprehensive", "2026-01-01", "2026-12-31", 18500, "+91 98450 11223"],
      ["HDFC ERGO", "HD-2026-334455", "Third Party", "2026-03-15", "2027-03-14", 4200, "+91 98450 33445"],
    ],
    ["vehicle_id", "provider", "policy_number", "insurance_type", "start_date", "expiry_date", "premium", "contact"]);

  await seed("flight_bookings",
    (f) => f,
    [
      ["FL-2001", "2026-07-18", "2026-07-25", "BLR", "DEL", "IndiGo", "6E-201", "06:45", "X7K2QN", 2, "+91 98765 12345", 12400, "ClearTrip"],
      ["FL-2002", "2026-07-20", "2026-07-30", "BLR", "BOM", "Air India", "AI-808", "09:30", "M4P9RZ", 1, "+91 98765 54321", 8600, "Yatra"],
      ["FL-2003", "2026-07-22", "2026-08-05", "BLR", "HYD", "Akasa", "QP-334", "14:20", "T8B1XC", 3, "+91 98765 99999", 15700, "Goibibo"],
    ],
    ["booking_number", "booking_date", "travel_date", "from_location", "to_location", "airline", "flight_number", "flight_time", "pnr", "pax", "phone", "amount", "agent"]);

  await seed("train_bookings",
    (t) => t,
    [
      ["TR-1501", "2026-07-15", "2026-07-20", "KSR Bengaluru", "Mysuru", "2AC", "20661", "8412356789"],
      ["TR-1502", "2026-07-17", "2026-07-22", "KSR Bengaluru", "Chennai Central", "3AC", "22625", "8465123487"],
    ],
    ["booking_number", "booking_date", "travel_date", "from_location", "to_location", "class", "train_number", "pnr"]);

  await seed("bus_bookings",
    (b) => b,
    [
      ["BUS-801", "2026-07-14", "2026-07-19", "Bengaluru", "Tirupati", "SRS Travels", "KA-01-F-8899", "SR800123", 1200, 0, 1200, "Paid", "Mohammed Farhan", "+91 98654 11223"],
      ["BUS-802", "2026-07-16", "2026-07-23", "Bengaluru", "Puducherry", "KPN Travels", "TN-01-J-2233", "KP900456", 1500, 500, 1000, "Partial", "Priya Iyer", "+91 98765 88888"],
      ["BUS-803", "2026-07-18", "2026-07-26", "Bengaluru", "Goa", "VRL Travels", "KA-01-K-5566", "VR300789", 2200, 0, 0, "Pending", "Vikram Menon", "+91 98765 54321"],
    ],
    ["booking_number", "booking_date", "travel_date", "from_location", "to_location", "travels", "bus_number", "pnr", "due_amount", "to_pay", "settled_amount", "payment_status", "passenger_name", "passenger_phone"]);

  await seed("vehicle_forecasts",
    (f) => f,
    [
      ["Innova Crysta", "Innova Crysta ZX", "Diesel MT", 2850000, 24, 700000, 2150000, 9.0, 60, 44600, 12, 90, 36000, 52000, 47000],
      ["SUV", "Hyundai Creta SX", "Petrol AT", 1980000, 18, 500000, 1480000, 9.2, 60, 30900, 15, 105, 28000, 42000, 35000],
    ],
    ["vehicle_type", "car_model", "variant", "vehicle_price", "fare", "down_payment", "loan_amount", "interest_rate", "loan_tenure", "emi", "vehicle_average", "fuel_price", "monthly_fuel_expense", "monthly_expense", "remaining"]);

  await seed("rto_agents",
    (a) => a,
    [
      ["Mahesh RTO Services", "Jayanagar", "Bengaluru", "Karnataka", "+91 99002 33445", "Active"],
      ["Vinayak Permits", "Mysuru Road", "Bengaluru", "Karnataka", "+91 98452 44556", "Active"],
    ],
    ["name", "area", "city", "state", "phone", "status"]);

  await seed("enquiry_followups",
    (f) => f,
    [
      ["2026-07-20", "Contacted", "Sent package quote", "2026-07-27", "Office"],
      ["2026-07-22", "Follow-up", "Customer comparing options", "2026-07-29", "Office"],
      ["2026-07-24", "Converted", "Booking confirmed", null, "Office"],
    ],
    ["follow_up_date", "status", "remarks", "next_follow_up_date", "created_by"]);

  console.log("Done!");
  await pool.end();
}
main().catch((e) => { console.error("SEED ERROR:", e.message); process.exit(1); });
