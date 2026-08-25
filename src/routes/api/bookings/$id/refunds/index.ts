import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import { recalcBooking, logActivity } from "@/lib/booking-server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/bookings/$id/refunds/")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const id = Number(params?.id);
          if (!Number.isFinite(id)) {
            return new Response(
              JSON.stringify({ success: false, error: "Booking ID is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          const [refundsRes, summary] = await Promise.all([
            query(`SELECT * FROM refunds WHERE booking_id = $1 ORDER BY refund_date DESC`, [id]),
            recalcBooking(id),
          ]);
          return new Response(
            JSON.stringify({ success: true, refunds: refundsRes.rows, summary }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("GET /api/bookings/$id/refunds error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch refunds" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      /* Record a refund — reduces NET PAID and can flip booking to refund states (#45) */
      POST: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();
          const id = Number(params?.id);
          const body = await request.json();

          if (body?.amount === undefined || body.amount === null || Number(body.amount) <= 0) {
            return new Response(
              JSON.stringify({ success: false, error: "A positive refund amount is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }
          const amount = Math.round(Number(body.amount) * 100) / 100;

          const bookingRes = await query(
            `SELECT id, booking_number, booking_status FROM bookings WHERE id = $1`,
            [id],
          );
          if (bookingRes.rows.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Booking not found." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }
          const booking = bookingRes.rows[0];

          const summaryBefore = await recalcBooking(id);
          if (amount > summaryBefore.netPaid) {
            return new Response(
              JSON.stringify({
                success: false,
                error: `Refund of ₹${amount} exceeds net received (₹${summaryBefore.netPaid}).`,
              }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const insertRes = await query(
            `INSERT INTO refunds
               (booking_id, refund_reference, amount, refund_method, refund_date, status, reason, processed_by)
             VALUES ($1,$2,$3,$4, COALESCE($5::date, CURRENT_DATE), 'Processed', $6, $7)
             RETURNING *`,
            [
              id,
              body?.refund_reference || `REF-${Date.now()}`,
              amount,
              body?.refund_method || body?.payment_method || "BANK TRANSFER",
              body?.refund_date || null,
              body?.reason || null,
              body?.processed_by || "Admin",
            ],
          );

          const summary = await recalcBooking(id);

          await logActivity({
            booking_id: id,
            action: "REFUND ISSUED",
            entity: "refund",
            entity_ref: insertRes.rows[0].refund_reference,
            new_value: String(amount),
            details: `${insertRes.rows[0].refund_method}${body?.reason ? ` · ${body.reason}` : ""}`,
          });

          /* Auto-manage booking status for cancelled/refund workflows only */
          const currentStatus = String(booking.booking_status || "").toUpperCase();
          if (["CANCELLED", "REFUND PENDING", "REFUNDED"].includes(currentStatus)) {
            let next: string | null = null;
            if (summary.netPaid <= 0 && currentStatus !== "REFUNDED") next = "REFUNDED";
            else if (currentStatus === "CANCELLED" && summary.netPaid > 0) next = "REFUND PENDING";

            if (next) {
              await query(
                `UPDATE bookings SET booking_status = $2, updated_at = NOW() WHERE id = $1`,
                [id, next],
              );
              await logActivity({
                booking_id: id,
                action: "BOOKING STATUS CHANGED",
                entity: "booking",
                old_value: currentStatus,
                new_value: next,
                details: "Auto-set after refund processing",
              });
            }
          }

          return new Response(
            JSON.stringify({ success: true, refund: insertRes.rows[0], summary }),
            { status: 201, headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("POST /api/bookings/$id/refunds error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to record refund" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
