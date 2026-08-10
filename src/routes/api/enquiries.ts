import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/enquiries")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const status = url.searchParams.get("status");

          let sql = "SELECT * FROM enquiries";
          const params: any[] = [];

          if (status) {
            sql += " WHERE status = $1";
            params.push(status);
          }

          sql += " ORDER BY created_at DESC";

          const res = await query(sql, params);
          return new Response(JSON.stringify({ success: true, enquiries: res.rows }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("GET /api/enquiries error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch enquiries" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            name,
            phone,
            email,
            service,
            pickup,
            destination,
            date,
            return_date,
            time,
            passengers,
            trip_type,
            car_type,
            number_of_days,
            company_name,
            gst_number,
            airport_name,
            flight_number,
            hours_package,
            tour_name,
            train_class,
            train_preference,
            bus_operator,
            bus_type,
            passengers_detail,
            notes,
            package_slug,
            vehicle_slug,
          } = body;

          if (!name || !phone || !service) {
            return new Response(
              JSON.stringify({ success: false, error: "Name, phone, and service are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Build a structured notes summary containing all extra customer-facing fields
          const detailsList: string[] = [];
          if (email) detailsList.push(`Email: ${email}`);
          if (trip_type) detailsList.push(`Trip Type: ${trip_type}`);
          if (return_date) detailsList.push(`Return Date: ${return_date}`);
          if (time) detailsList.push(`Time: ${time}`);
          if (car_type) detailsList.push(`Vehicle Type: ${car_type}`);
          if (number_of_days) detailsList.push(`Duration: ${number_of_days} Days`);
          if (company_name) detailsList.push(`Company: ${company_name}`);
          if (gst_number) detailsList.push(`GST: ${gst_number}`);
          if (airport_name) detailsList.push(`Airport: ${airport_name}`);
          if (flight_number) detailsList.push(`Flight No: ${flight_number}`);
          if (hours_package) detailsList.push(`Package: ${hours_package}`);
          if (tour_name) detailsList.push(`Tour: ${tour_name}`);
          if (train_class) detailsList.push(`Train Class: ${train_class}`);
          if (train_preference) detailsList.push(`Train Preference: ${train_preference}`);
          if (bus_operator) detailsList.push(`Bus Operator: ${bus_operator}`);
          if (bus_type) detailsList.push(`Bus Type: ${bus_type}`);
          if (Array.isArray(passengers_detail) && passengers_detail.length > 0) {
            const pStr = passengers_detail
              .map((p: any, i: number) => `P${i + 1}: ${p.name || ""} (${p.age || ""}/${p.gender || ""})`)
              .join("; ");
            detailsList.push(`Passenger Details: ${pStr}`);
          }
          if (notes) detailsList.push(`Notes: ${notes}`);

          const combinedNotes = detailsList.join(" | ");

          const res = await query(
            `INSERT INTO enquiries (name, phone, service, pickup, destination, travel_date, passengers, notes, status, package_slug, vehicle_slug)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'New', $9, $10)
             RETURNING *`,
            [
              name,
              phone,
              service,
              pickup || null,
              destination || null,
              date || null,
              passengers ? String(passengers) : null,
              combinedNotes || null,
              package_slug || null,
              vehicle_slug || null,
            ]
          );

          // Sync into corresponding Business Record tables (Day Book, Cab Bookings, Package Trips, etc.) asynchronously
          syncToBusinessRecords(body, combinedNotes).catch((err) =>
            console.error("Background sync error:", err)
          );

          return new Response(JSON.stringify({ success: true, enquiry: res.rows[0] }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("POST /api/enquiries error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to create enquiry" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      PATCH: async ({ request }) => {
        try {
          const body = await request.json();
          const { id, status } = body;

          if (!id || !status) {
            return new Response(
              JSON.stringify({ success: false, error: "ID and status are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const res = await query(
            `UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
          );

          if (res.rowCount === 0) {
            return new Response(
              JSON.stringify({ success: false, error: "Enquiry not found." }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }

          return new Response(JSON.stringify({ success: true, enquiry: res.rows[0] }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("PATCH /api/enquiries error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to update status" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");

          if (!id) {
            return new Response(
              JSON.stringify({ success: false, error: "ID is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          await query(`DELETE FROM enquiries WHERE id = $1`, [id]);
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("DELETE /api/enquiries error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete enquiry" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});

async function syncToBusinessRecords(payload: any, combinedNotes: string) {
  const {
    name,
    phone,
    email,
    service,
    pickup,
    destination,
    date,
    return_date,
    time,
    passengers,
    car_type,
    number_of_days,
    company_name,
    airport_name,
    flight_number,
    hours_package,
    tour_name,
    train_class,
    train_preference,
    bus_operator,
    bus_type,
  } = payload;

  const todayStr = new Date().toISOString().split("T")[0];
  const travelDate = date || todayStr;
  const sUpper = String(service || "").toUpperCase();

  // 1. Ensure customer exists in customers table
  try {
    const existing = await query("SELECT id FROM customers WHERE phone = $1 LIMIT 1", [phone]).catch(() => null);
    if (!existing || existing.rows.length === 0) {
      const custCode = `CUST-${phone.replace(/\D/g, "").slice(-4) || "001"}`;
      await query(
        `INSERT INTO customers (customer_code, name, phone, email, notes)
         VALUES ($1, $2, $3, $4, 'Registered from website enquiry')`,
        [custCode, name, phone, email || null]
      ).catch(() => {});
    }
  } catch (e) {}

  // 2. Always create a Day Book Entry
  try {
    const serialNo = `DB-${Date.now().toString().slice(-6)}`;
    await query(
      `INSERT INTO day_book_entries (serial_number, booking_date, travel_date, travel_by, passenger_name, passenger_phone, from_location, to_location, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', $9)`,
      [
        serialNo,
        todayStr,
        travelDate,
        car_type || service || "Cab",
        name,
        phone,
        pickup || "Bengaluru",
        destination || "Outstation",
        combinedNotes,
      ]
    ).catch(() => {});
  } catch (e) {}

  // 3. Create record in specific service section table
  try {
    if (sUpper.includes("PACKAGE") || sUpper.includes("TOUR")) {
      const tripNo = `PKG-${Date.now().toString().slice(-6)}`;
      await query(
        `INSERT INTO package_trips (trip_number, tour_name, journey_date, return_date, passenger_name, passenger_phone, pickup_location, drop_location, car_type, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          tripNo,
          tour_name || service,
          travelDate,
          return_date || null,
          name,
          phone,
          pickup || "Bengaluru",
          destination || "Tour Destination",
          car_type || "SUV",
          combinedNotes,
        ]
      ).catch(() => {});
    } else if (sUpper.includes("HOURLY") || sUpper.includes("LOCAL")) {
      const bkNo = `HR-${Date.now().toString().slice(-6)}`;
      const hrs = hours_package ? parseInt(hours_package) || 8 : 8;
      await query(
        `INSERT INTO hourly_bookings (booking_number, booking_date, travel_date, passenger_name, phone, from_location, to_location, hours, payment_status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', $9)`,
        [
          bkNo,
          todayStr,
          travelDate,
          name,
          phone,
          pickup || "Bengaluru",
          destination || "Local City",
          hrs,
          combinedNotes,
        ]
      ).catch(() => {});
    } else if (sUpper.includes("BUS")) {
      const bkNo = `BUS-${Date.now().toString().slice(-6)}`;
      await query(
        `INSERT INTO bus_bookings (booking_number, booking_date, travel_date, from_location, to_location, travels, passenger_name, passenger_phone, payment_status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Pending', $9)`,
        [
          bkNo,
          todayStr,
          travelDate,
          pickup || "Bengaluru",
          destination || "Destination City",
          bus_operator || "KSRTC / Private Operator",
          name,
          phone,
          combinedNotes,
        ]
      ).catch(() => {});
    } else if (sUpper.includes("TRAIN")) {
      const bkNo = `TRN-${Date.now().toString().slice(-6)}`;
      await query(
        `INSERT INTO train_bookings (booking_number, booking_date, travel_date, from_location, to_location, class, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          bkNo,
          todayStr,
          travelDate,
          pickup || "Bengaluru",
          destination || "Destination Station",
          train_class || "3AC",
          `Passenger: ${name} (${phone}) | Preference: ${train_preference || "None"} | ${combinedNotes}`,
        ]
      ).catch(() => {});
    } else if (sUpper.includes("FLIGHT")) {
      const bkNo = `FLT-${Date.now().toString().slice(-6)}`;
      const paxCount = passengers ? parseInt(String(passengers)) || 1 : 1;
      await query(
        `INSERT INTO flight_bookings (booking_number, booking_date, travel_date, from_location, to_location, phone, pax, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          bkNo,
          todayStr,
          travelDate,
          pickup || "Bengaluru",
          destination || "Destination City",
          phone,
          paxCount,
          `Passenger: ${name} | ${combinedNotes}`,
        ]
      ).catch(() => {});
    } else {
      // Default: Outstation / Cab / Corporate / Airport -> Insert into cab_bookings
      const bkNo = `CAB-${Date.now().toString().slice(-6)}`;
      await query(
        `INSERT INTO cab_bookings (booking_number, booking_date, travel_date, from_location, to_location, pickup_time, passenger_name, passenger_phone, vehicle_type, payment_status, status, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Pending', 'Pending', $10)`,
        [
          bkNo,
          todayStr,
          travelDate,
          pickup || "Bengaluru",
          destination || "Outstation",
          time || null,
          company_name ? `${name} (${company_name})` : name,
          phone,
          car_type || "Sedan",
          combinedNotes,
        ]
      ).catch(() => {});
    }
  } catch (e) {
    console.error("Error syncing to business records:", e);
  }
}
