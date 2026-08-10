import pg from "pg";
const { Pool } = pg;
const pool = new Pool({ connectionString: "postgres://fortu851:wUNXTe5joMO1ckaBMB0354ScA@168.119.64.101:5432/fortu851", ssl: false });
(async () => {
  const fixes = [
    ["EQ-2026-005", "Ravi Shankar", "+91 98111 22233", "Ooty Hill Station", "2", "Wants Innova Crysta for family"],
    ["EQ-2026-006", "Meera Krishnan", "+91 98222 33344", "BLR Airport", "1", "Monthly corporate airport pickup"],
    ["EQ-2026-007", "Arjun Nair", "+91 98333 44455", "Tirupati", "6", "Round trip same day"],
    ["EQ-2026-008", "Divya Sharma", "+91 98444 55566", "City Local", "3", "8 hrs / 80 km package"],
    ["EQ-2026-009", "Karthik Rao", "+91 98555 66677", "Hampi", "8", "Tempo traveller for 8 pax"],
    ["EQ-2026-010", "Sandeep Reddy", "+91 98666 77788", "Ooty", "4", "4N/5D package enquiry"],
  ];
  for (const [num, name, phone, dest, pax, notes] of fixes) {
    await pool.query(`UPDATE enquiries SET name=$1, phone=$2, destination=$3, passengers=$4, notes=$5 WHERE enquiry_number=$6`, [name, phone, dest, pax, notes, num]);
  }
  console.log("fixed", fixes.length, "enquiries");
  await pool.end();
})();
