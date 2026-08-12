import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/business/history")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const customerId = url.searchParams.get("customerId");
          const driverId = url.searchParams.get("driverId");
          const phone = url.searchParams.get("phone")?.trim();
          const name = url.searchParams.get("name")?.trim();

          if (!customerId && !driverId && !phone && !name) {
            return new Response(
              JSON.stringify({ success: false, error: "Provide customerId, driverId, phone, or name" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Gather day_book_entries, cab_bookings, package_trips, hourly_bookings, payments, account_transactions
          // 1. Day book entries
          let dbWhere: string[] = [];
          let dbParams: any[] = [];
          if (customerId) {
            dbParams.push(customerId);
            dbWhere.push(`customer_id = $${dbParams.length}`);
          }
          if (phone) {
            dbParams.push(`%${phone}%`);
            dbWhere.push(`passenger_phone ILIKE $${dbParams.length}`);
          }
          if (name) {
            dbParams.push(`%${name}%`);
            dbWhere.push(`passenger_name ILIKE $${dbParams.length}`);
          }
          const dbQuery = dbWhere.length > 0
            ? query(`SELECT 'Day Book' as source_type, id, serial_number as ref_no, booking_date as entry_date, passenger_name, passenger_phone, from_location, to_location, booking_amount as total_amt, office_advance as advance_amt, due_amount as due_amt, (COALESCE(booking_amount,0) - COALESCE(due_amount,0)) as paid_amt, status, notes FROM day_book_entries WHERE ${dbWhere.join(" OR ")} ORDER BY id DESC LIMIT 200`, dbParams)
            : Promise.resolve({ rows: [] });

          // 2. Cab bookings
          let cabWhere: string[] = [];
          let cabParams: any[] = [];
          if (customerId) {
            cabParams.push(customerId);
            cabWhere.push(`customer_id = $${cabParams.length}`);
          }
          if (driverId) {
            cabParams.push(driverId);
            cabWhere.push(`driver_id = $${cabParams.length}`);
          }
          if (phone) {
            cabParams.push(`%${phone}%`);
            cabWhere.push(`passenger_phone ILIKE $${cabParams.length} OR driver_phone ILIKE $${cabParams.length}`);
          }
          if (name) {
            cabParams.push(`%${name}%`);
            cabWhere.push(`passenger_name ILIKE $${cabParams.length}`);
          }
          const cabQuery = cabWhere.length > 0
            ? query(`SELECT 'Cab Booking' as source_type, id, booking_number as ref_no, booking_date as entry_date, passenger_name, passenger_phone, from_location, to_location, (COALESCE(due_amount,0) + COALESCE(settled_amount,0)) as total_amt, 0 as advance_amt, due_amount as due_amt, settled_amount as paid_amt, payment_status as status, notes FROM cab_bookings WHERE ${cabWhere.join(" OR ")} ORDER BY id DESC LIMIT 200`, cabParams)
            : Promise.resolve({ rows: [] });

          // 3. Package trips
          let pkgWhere: string[] = [];
          let pkgParams: any[] = [];
          if (customerId) {
            pkgParams.push(customerId);
            pkgWhere.push(`customer_id = $${pkgParams.length}`);
          }
          if (driverId) {
            pkgParams.push(driverId);
            pkgWhere.push(`driver_id = $${pkgParams.length}`);
          }
          if (phone) {
            pkgParams.push(`%${phone}%`);
            pkgWhere.push(`passenger_phone ILIKE $${pkgParams.length} OR driver_phone ILIKE $${pkgParams.length}`);
          }
          if (name) {
            pkgParams.push(`%${name}%`);
            pkgWhere.push(`passenger_name ILIKE $${pkgParams.length}`);
          }
          const pkgQuery = pkgWhere.length > 0
            ? query(`SELECT 'Package Trip' as source_type, id, trip_number as ref_no, journey_date as entry_date, passenger_name, passenger_phone, pickup_location as from_location, drop_location as to_location, total_cost as total_amt, 0 as advance_amt, due_amount as due_amt, paid_amount as paid_amt, 'Active' as status, notes FROM package_trips WHERE ${pkgWhere.join(" OR ")} ORDER BY id DESC LIMIT 200`, pkgParams)
            : Promise.resolve({ rows: [] });

          // 4. Payments received
          let payWhere: string[] = [];
          let payParams: any[] = [];
          if (customerId) {
            payParams.push(customerId);
            payWhere.push(`customer_id = $${payParams.length}`);
          }
          if (driverId) {
            payParams.push(driverId);
            payWhere.push(`driver_id = $${payParams.length}`);
          }
          const payQuery = payWhere.length > 0
            ? query(`SELECT 'Payment' as source_type, id, reference as ref_no, payment_date as entry_date, '' as passenger_name, '' as passenger_phone, '' as from_location, '' as to_location, amount as total_amt, 0 as advance_amt, 0 as due_amt, amount as paid_amt, payment_method as status, description as notes FROM payments WHERE ${payWhere.join(" OR ")} ORDER BY id DESC LIMIT 200`, payParams)
            : Promise.resolve({ rows: [] });

          // Execute all queries concurrently
          const [dbRes, cabRes, pkgRes, payRes] = await Promise.all([
            dbQuery, cabQuery, pkgQuery, payQuery
          ]);

          const allTransactions = [
            ...dbRes.rows,
            ...cabRes.rows,
            ...pkgRes.rows,
            ...payRes.rows,
          ].sort((a, b) => new Date(b.entry_date || 0).getTime() - new Date(a.entry_date || 0).getTime());

          // Calculate overall totals
          let totalBilled = 0;
          let totalPaid = 0;
          let totalDue = 0;
          let totalAdvance = 0;

          for (const item of allTransactions) {
            totalBilled += Number(item.total_amt || 0);
            totalPaid += Number(item.paid_amt || 0);
            totalDue += Number(item.due_amt || 0);
            totalAdvance += Number(item.advance_amt || 0);
          }

          return new Response(
            JSON.stringify({
              success: true,
              summary: {
                totalBilled,
                totalPaid,
                totalDue,
                totalAdvance,
                itemCount: allTransactions.length,
              },
              transactions: allTransactions,
            }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          console.error("GET /api/business/history error:", err);
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Failed to fetch history" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
