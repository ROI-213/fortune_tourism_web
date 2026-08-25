import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import { recalcBooking, logActivity, normalizePaymentMethod, toMoney } from "@/lib/booking-server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

/* Auto-upgrade booking status only upward — never override operational states */
async function maybeUpgradeStatus(bookingId: number): Promise<void> {
  try {
    const res = await query(`SELECT booking_status, payment_status FROM bookings WHERE id = $1`, [
      bookingId,
    ]);
    if (res.rows.length === 0) return;
    const current = String(res.rows[0].booking_status || "").toUpperCase();
    const payStatus = res.rows[0].payment_status;

    const operationalStates = [
      "IN PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "REFUND PENDING",
      "REFUNDED",
    ];
    if (operationalStates.includes(current)) return;

    let next: string | null = null;
    if (payStatus === "Fully Paid" && current === "PENDING CONFIRMATION") next = "CONFIRMED";
    else if (payStatus === "Partially Paid" && current === "PENDING CONFIRMATION")
      next = "ADVANCE RECEIVED";

    if (next) {
      await query(`UPDATE bookings SET booking_status = $2, updated_at = NOW() WHERE id = $1`, [
        bookingId,
        next,
      ]);
      await logActivity({
        booking_id: bookingId,
        action: "BOOKING STATUS CHANGED",
        entity: "booking",
        old_value: current,
        new_value: next,
        details: `Auto-upgraded based on ${payStatus} payment`,
      });
    }
  } catch (err) {
    console.error("maybeUpgradeStatus error:", err);
  }
}

export const Route = createFileRoute("/api/bookings/$id/payments/")({
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

          const [paymentsRes, summary] = await Promise.all([
            query(
              `SELECT * FROM booking_payments WHERE booking_id = $1 AND NOT COALESCE(is_deleted, false)
               ORDER BY COALESCE(payment_date, paid_at::date) DESC, created_at DESC`,
              [id],
            ),
            recalcBooking(id),
          ]);

          return new Response(
            JSON.stringify({
              success: true,
              payments: paymentsRes.rows,
              summary,
              totals: {
                total_amount: summary.total,
                amount_paid: summary.netPaid,
                balance_amount: summary.remaining,
                refunded_amount: summary.refunded,
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("GET /api/bookings/$id/payments error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch payments" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      /* Record a payment against a booking (#43) */
      POST: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();
          const id = Number(params?.id);
          const body = await request.json();

          const amount = toMoney(body?.amount);
          if (!Number.isFinite(id) || amount === null || amount <= 0) {
            return new Response(
              JSON.stringify({ success: false, error: "A positive payment amount is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const bookingRes = await query("SELECT id, booking_number FROM bookings WHERE id = $1", [
            id,
          ]);
          if (bookingRes.rows.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Booking not found." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }

          const method = normalizePaymentMethod(body?.payment_method || body?.method || "CASH");
          const payId = body?.payment_id || `PAY-${Date.now()}`;
          const payDate: string | null = body?.payment_date || body?.paid_at || null;

          const insertRes = await query(
            `INSERT INTO booking_payments
               (booking_id, payment_id, transaction_id, amount, payment_method, payment_status,
                paid_at, payment_date, reference_number, notes, received_by)
             VALUES ($1,$2,$3,$4,$5,'Success',
                     COALESCE($6::timestamp, NOW()), COALESCE($6::date, CURRENT_DATE), $7, $8, $9)
             RETURNING *`,
            [
              id,
              payId,
              body?.transaction_id || null,
              amount,
              method,
              payDate,
              body?.reference_number || null,
              body?.notes || `Payment received via ${method}`,
              body?.received_by || "Admin",
            ],
          );

          const summary = await recalcBooking(id);

          await logActivity({
            booking_id: id,
            action: "PAYMENT RECORDED",
            entity: "payment",
            entity_ref: payId,
            new_value: String(amount),
            details: `${method}${body?.transaction_id ? ` · Txn ${body.transaction_id}` : ""}${
              body?.reference_number ? ` · Ref ${body.reference_number}` : ""
            }${summary.overpaid > 0 ? ` · OVERPAID by ₹${summary.overpaid}` : ""}`,
          });

          await maybeUpgradeStatus(id);

          const updatedBooking = await query("SELECT * FROM bookings WHERE id = $1", [id]);

          return new Response(
            JSON.stringify({
              success: true,
              payment: insertRes.rows[0],
              booking: updatedBooking.rows[0],
              summary,
              warning:
                summary.overpaid > 0
                  ? `Payment exceeds booking total. Overpaid by ₹${summary.overpaid}.`
                  : null,
            }),
            { status: 201, headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("POST /api/bookings/$id/payments error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to record payment" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      /* Edit an existing payment (correct mistakes without losing history) */
      PATCH: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();
          const bookingId = Number(params?.id);
          const body = await request.json();
          const paymentRowId = Number(body?.id);

          if (!Number.isFinite(paymentRowId)) {
            return new Response(
              JSON.stringify({ success: false, error: "Payment id is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const existingRes = await query(
            `SELECT * FROM booking_payments WHERE id = $1 AND booking_id = $2`,
            [paymentRowId, bookingId],
          );
          if (existingRes.rows.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Payment not found." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }
          const existing = existingRes.rows[0];

          const sets: string[] = [];
          const values: unknown[] = [];
          const changes: Array<{ f: string; oldV: any; newV: any }> = [];

          if (body.amount !== undefined) {
            const amt = toMoney(body.amount);
            if (amt === null || amt <= 0) {
              return new Response(
                JSON.stringify({ success: false, error: "Amount must be a positive number." }),
                { status: 400, headers: { "Content-Type": "application/json" } },
              );
            }
            sets.push(`amount = $${values.push(amt)}`);
            changes.push({ f: "amount", oldV: existing.amount, newV: amt });
          }
          if (body.payment_method !== undefined) {
            const mth = normalizePaymentMethod(body.payment_method);
            sets.push(`payment_method = $${values.push(mth)}`);
            changes.push({ f: "payment_method", oldV: existing.payment_method, newV: mth });
          }
          if (body.payment_status !== undefined) {
            const st = String(body.payment_status).trim();
            if (!["Success", "Pending", "Failed"].includes(st)) {
              return new Response(
                JSON.stringify({ success: false, error: "Invalid payment status." }),
                { status: 400, headers: { "Content-Type": "application/json" } },
              );
            }
            sets.push(`payment_status = $${values.push(st)}`);
            changes.push({ f: "payment_status", oldV: existing.payment_status, newV: st });
          }
          if (body.transaction_id !== undefined) {
            sets.push(`transaction_id = $${values.push(body.transaction_id || null)}`);
            changes.push({
              f: "transaction_id",
              oldV: existing.transaction_id,
              newV: body.transaction_id,
            });
          }
          if (body.reference_number !== undefined) {
            sets.push(`reference_number = $${values.push(body.reference_number || null)}`);
          }
          if (body.notes !== undefined) {
            sets.push(`notes = $${values.push(body.notes || null)}`);
          }
          if (body.received_by !== undefined) {
            sets.push(`received_by = $${values.push(body.received_by || null)}`);
          }
          if (body.payment_date !== undefined) {
            sets.push(
              `payment_date = COALESCE($${values.length + 1}::date, CURRENT_DATE), paid_at = COALESCE($${values.length + 1}::timestamp, paid_at)`,
            );
            values.push(body.payment_date || null);
          }

          if (sets.length === 0) {
            return new Response(
              JSON.stringify({ success: false, error: "No fields provided for update." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          sets.push("updated_at = NOW()");
          values.push(paymentRowId);

          const res = await query(
            `UPDATE booking_payments SET ${sets.join(", ")} WHERE id = $${values.length} RETURNING *`,
            values,
          );

          const summary = await recalcBooking(bookingId);

          await logActivity({
            booking_id: bookingId,
            action: "PAYMENT EDITED",
            entity: "payment",
            entity_ref: existing.payment_id,
            old_value: changes.find((c) => c.f === "amount")?.oldV ?? null,
            new_value: changes.find((c) => c.f === "amount")?.newV ?? null,
            details:
              changes.map((c) => `${c.f}: ${c.oldV ?? "—"} → ${c.newV ?? "—"}`).join("; ") ||
              "metadata updated",
          });

          return new Response(JSON.stringify({ success: true, payment: res.rows[0], summary }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("PATCH /api/bookings/$id/payments error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to update payment" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },

      /* Soft-delete so history is preserved (#44) */
      DELETE: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();
          const bookingId = Number(params?.id);
          const url = new URL(request.url);
          const paymentRowId = Number(url.searchParams.get("paymentId"));

          if (!Number.isFinite(paymentRowId)) {
            return new Response(
              JSON.stringify({ success: false, error: "paymentId query param is required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const existingRes = await query(
            `SELECT * FROM booking_payments WHERE id = $1 AND booking_id = $2`,
            [paymentRowId, bookingId],
          );
          if (existingRes.rows.length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Payment not found." }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }
          const existing = existingRes.rows[0];

          await query(
            `UPDATE booking_payments SET is_deleted = true, deleted_at = NOW(), updated_at = NOW() WHERE id = $1`,
            [paymentRowId],
          );

          const summary = await recalcBooking(bookingId);

          await logActivity({
            booking_id: bookingId,
            action: "PAYMENT DELETED",
            entity: "payment",
            entity_ref: existing.payment_id,
            old_value: String(existing.amount),
            details: `${existing.payment_method} payment removed`,
          });

          return new Response(JSON.stringify({ success: true, summary }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("DELETE /api/bookings/$id/payments error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete payment" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
