import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import { recalcBooking, updateBookingFromPayload, logActivity } from "@/lib/booking-server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/bookings/$id/")({
  server: {
    handlers: {
      /* Full detail: booking with computed money + payments + refunds +
         passengers + enquiry + audit timeline (#41) */
      GET: async ({ params }) => {
        try {
          const raw = params?.id;
          if (!raw) {
            return new Response(JSON.stringify({ success: false, error: "ID is required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const id = Number(raw);

          let bookingRow: any = null;
          if (Number.isFinite(id)) {
            const r = await query("SELECT * FROM bookings WHERE id = $1", [id]);
            if (r.rows.length > 0) bookingRow = r.rows[0];
          }
          if (!bookingRow) {
            // Legacy lookup by ticket_number / booking_id / pnr
            const r = await query(
              "SELECT * FROM bookings WHERE ticket_number = $1 OR booking_id = $1 OR pnr_number = $1 LIMIT 1",
              [raw],
            );
            if (r.rows.length > 0) bookingRow = r.rows[0];
          }

          if (!bookingRow) {
            return new Response(JSON.stringify({ success: false, error: "Booking not found." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const bid = bookingRow.id;
          const summary = await recalcBooking(bid);

          const [paymentsRes, refundsRes, passengersRes, logsRes, enquiryRes] = await Promise.all([
            query(
              `SELECT * FROM booking_payments WHERE booking_id = $1 AND NOT COALESCE(is_deleted, false)
               ORDER BY COALESCE(payment_date, paid_at::date) DESC, created_at DESC`,
              [bid],
            ),
            query(`SELECT * FROM refunds WHERE booking_id = $1 ORDER BY refund_date DESC`, [bid]),
            query(`SELECT * FROM booking_passengers WHERE booking_id = $1 ORDER BY id ASC`, [bid]),
            query(
              `SELECT * FROM booking_activity_logs WHERE booking_id = $1 OR (enquiry_id IS NOT NULL AND enquiry_id = $2)
               ORDER BY created_at DESC LIMIT 100`,
              [bid, bookingRow.enquiry_id ?? -1],
            ),
            bookingRow.enquiry_id
              ? query(
                  `SELECT id, enquiry_number, name, phone, service, travel_date, notes FROM enquiries WHERE id = $1`,
                  [bookingRow.enquiry_id],
                )
              : Promise.resolve({ rows: [] as any[] }),
          ]);

          return new Response(
            JSON.stringify({
              success: true,
              booking: {
                ...bookingRow,
                paid_total: summary.netPaid,
                refunded_total: summary.refunded,
                remaining_amount: summary.remaining,
                overpaid_amount: summary.overpaid,
                payment_status: summary.paymentStatus,
              },
              payments: paymentsRes.rows,
              refunds: refundsRes.rows,
              passengers: passengersRes.rows,
              activity_logs: logsRes.rows,
              enquiry: enquiryRes.rows[0] || null,
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("GET /api/bookings/$id error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch booking" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      PUT: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();
          const payload = await request.json();
          const data = { ...payload, id: payload?.id ?? params?.id };

          if (!data.id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const result = await updateBookingFromPayload(data);
          if (!result.ok) {
            return new Response(JSON.stringify({ success: false, error: result.error }), {
              status: result.status || 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          return new Response(JSON.stringify({ success: true, booking: result.booking }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("PUT /api/bookings/$id error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to update booking" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();
          const id = Number(params?.id);
          if (!Number.isFinite(id)) {
            return new Response(JSON.stringify({ success: false, error: "ID is required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }
          const current = await query(`SELECT booking_number FROM bookings WHERE id = $1`, [id]);
          await query("DELETE FROM bookings WHERE id = $1", [id]);
          if (current.rows[0]) {
            await logActivity({
              action: "BOOKING DELETED",
              entity: "booking",
              entity_ref: current.rows[0].booking_number,
            });
          }
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("DELETE /api/bookings/$id error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete booking" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
