import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/business/settle")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { sourceType, id, amountToSettle, paymentMethod, notes, customerId, driverId, phone, name } = body;

          const settleAmount = Number(amountToSettle || 0);

          if (sourceType === "FULL_ACCOUNT" || sourceType === "CLOSE_ACCOUNT") {
            // Settle all outstanding dues for this profile
            if (customerId) {
              await query(
                `UPDATE day_book_entries SET due_amount = 0, status = 'Paid' WHERE customer_id = $1 AND due_amount > 0`,
                [customerId]
              );
              await query(
                `UPDATE cab_bookings SET settled_amount = COALESCE(settled_amount, 0) + COALESCE(due_amount, 0), due_amount = 0, payment_status = 'Paid' WHERE customer_id = $1 AND due_amount > 0`,
                [customerId]
              );
              await query(
                `UPDATE package_trips SET paid_amount = COALESCE(paid_amount, 0) + COALESCE(due_amount, 0), due_amount = 0, remaining_amount = 0 WHERE customer_id = $1 AND due_amount > 0`,
                [customerId]
              );
            }
            if (driverId) {
              await query(
                `UPDATE cab_bookings SET settled_amount = COALESCE(settled_amount, 0) + COALESCE(due_amount, 0), due_amount = 0, payment_status = 'Paid' WHERE driver_id = $1 AND due_amount > 0`,
                [driverId]
              );
              await query(
                `UPDATE package_trips SET paid_amount = COALESCE(paid_amount, 0) + COALESCE(due_amount, 0), due_amount = 0, remaining_amount = 0 WHERE driver_id = $1 AND due_amount > 0`,
                [driverId]
              );
            }
            if (phone) {
              await query(
                `UPDATE day_book_entries SET due_amount = 0, status = 'Paid' WHERE passenger_phone ILIKE $1 AND due_amount > 0`,
                [`%${phone}%`]
              );
              await query(
                `UPDATE cab_bookings SET settled_amount = COALESCE(settled_amount, 0) + COALESCE(due_amount, 0), due_amount = 0, payment_status = 'Paid' WHERE (passenger_phone ILIKE $1 OR driver_phone ILIKE $1) AND due_amount > 0`,
                [`%${phone}%`]
              );
              await query(
                `UPDATE package_trips SET paid_amount = COALESCE(paid_amount, 0) + COALESCE(due_amount, 0), due_amount = 0, remaining_amount = 0 WHERE (passenger_phone ILIKE $1 OR driver_phone ILIKE $1) AND due_amount > 0`,
                [`%${phone}%`]
              );
            }
          } else if (sourceType === "Day Book" && id) {
            // Update day_book_entries due_amount
            await query(
              `UPDATE day_book_entries SET due_amount = GREATEST(0, COALESCE(due_amount, 0) - $1), status = CASE WHEN (COALESCE(due_amount, 0) - $1) <= 0 THEN 'Paid' ELSE status END WHERE id = $2`,
              [settleAmount, id]
            );
          } else if (sourceType === "Cab Booking" && id) {
            await query(
              `UPDATE cab_bookings SET due_amount = GREATEST(0, COALESCE(due_amount, 0) - $1), settled_amount = COALESCE(settled_amount, 0) + $1, payment_status = CASE WHEN (COALESCE(due_amount, 0) - $1) <= 0 THEN 'Paid' ELSE 'Partial' END WHERE id = $2`,
              [settleAmount, id]
            );
          } else if (sourceType === "Package Trip" && id) {
            await query(
              `UPDATE package_trips SET due_amount = GREATEST(0, COALESCE(due_amount, 0) - $1), paid_amount = COALESCE(paid_amount, 0) + $1, remaining_amount = GREATEST(0, COALESCE(remaining_amount, 0) - $1) WHERE id = $2`,
              [settleAmount, id]
            );
          }

          // Record payment entry in payments table
          await query(
            `INSERT INTO payments (amount, payment_method, reference, customer_id, driver_id, description, notes, payment_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE)`,
            [
              settleAmount,
              paymentMethod || "Cash",
              `SETTLE-${sourceType ? sourceType.replace(/\s+/g, '') : 'ACC'}-${Date.now().toString().slice(-6)}`,
              customerId ? Number(customerId) : null,
              driverId ? Number(driverId) : null,
              `Full account settlement for ${name || 'Client'} (${phone || 'N/A'})`,
              notes || 'Account closed and fully settled via Admin Panel',
            ]
          );

          return new Response(
            JSON.stringify({ success: true, message: "Account closed and fully settled successfully!" }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (err: any) {
          console.error("POST /api/business/settle error:", err);
          return new Response(
            JSON.stringify({ success: false, error: err.message || "Failed to settle account" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
