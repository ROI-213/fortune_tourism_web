import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/bookings/stats/")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const today = new Date().toISOString().split("T")[0];
          const in7 = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

          const [
            todayRes,
            upcomingRes,
            pendingPayRes,
            fullyPaidRes,
            partiallyPaidRes,
            cancelledRes,
            totalRes,
          ] = await Promise.all([
            query(
              `SELECT COUNT(*)::int AS n FROM bookings WHERE (created_at::date = $1::date OR departure_datetime::date = $1::date) AND UPPER(booking_status) NOT IN ('CANCELLED','REFUNDED')`,
              [today],
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(
              `SELECT COUNT(*)::int AS n FROM bookings WHERE departure_datetime::date >= $1::date AND UPPER(booking_status) NOT IN ('CANCELLED','REFUNDED')`,
              [today],
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(
              `SELECT COUNT(*)::int AS n,
                        COALESCE(SUM(GREATEST(b.total_amount - COALESCE(p.paid_total,0) - COALESCE(r.refunded_total,0), 0)), 0)::numeric AS outstanding
                   FROM bookings b
                   LEFT JOIN (SELECT booking_id, SUM(amount) AS paid_total FROM booking_payments WHERE payment_status='Success' AND NOT COALESCE(is_deleted,false) GROUP BY booking_id) p ON p.booking_id = b.id
                   LEFT JOIN (SELECT booking_id, SUM(amount) AS refunded_total FROM refunds GROUP BY booking_id) r ON r.booking_id = b.id
                  WHERE (b.total_amount - COALESCE(p.paid_total,0) - COALESCE(r.refunded_total,0)) > 0
                    AND UPPER(b.booking_status) NOT IN ('CANCELLED','REFUNDED')`,
            ).catch(() => ({ rows: [{ n: 0, outstanding: 0 }] })),
            query(
              `SELECT COUNT(*)::int AS n FROM bookings WHERE payment_status = 'Fully Paid'`,
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(
              `SELECT COUNT(*)::int AS n FROM bookings WHERE payment_status = 'Partially Paid'`,
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(
              `SELECT COUNT(*)::int AS n FROM bookings WHERE UPPER(booking_status) = 'CANCELLED'`,
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(`SELECT COUNT(*)::int AS n FROM bookings`).catch(() => ({ rows: [{ n: 0 }] })),
          ]);

          /* Today-specific financial aggregates */
          const [
            todayRevenueRes,
            todayAdvanceRes,
            todayPendingRes,
            valueRes,
            collectedRes,
            outstandingListRes,
          ] = await Promise.all([
            // Today's total booking value
            query(
              `SELECT COALESCE(SUM(total_amount), 0)::numeric AS value FROM bookings 
               WHERE (created_at::date = $1::date OR departure_datetime::date = $1::date)
                 AND UPPER(booking_status) NOT IN ('CANCELLED','REFUNDED')`,
              [today],
            ).catch(() => ({ rows: [{ value: 0 }] })),

            // Advance / payments collected today
            query(
              `SELECT COALESCE(SUM(amount), 0)::numeric AS value FROM booking_payments
                WHERE payment_status='Success' AND NOT COALESCE(is_deleted,false)
                  AND (COALESCE(payment_date, paid_at::date) = $1::date OR created_at::date = $1::date)`,
              [today],
            ).catch(() => ({ rows: [{ value: 0 }] })),

            // Outstanding balance on today's bookings
            query(
              `SELECT COALESCE(SUM(GREATEST(b.total_amount - COALESCE(p.paid_total,0) - COALESCE(r.refunded_total,0), 0)), 0)::numeric AS value
                 FROM bookings b
                 LEFT JOIN (SELECT booking_id, SUM(amount) AS paid_total FROM booking_payments WHERE payment_status='Success' AND NOT COALESCE(is_deleted,false) GROUP BY booking_id) p ON p.booking_id = b.id
                 LEFT JOIN (SELECT booking_id, SUM(amount) AS refunded_total FROM refunds GROUP BY booking_id) r ON r.booking_id = b.id
                WHERE (b.created_at::date = $1::date OR b.departure_datetime::date = $1::date)
                  AND (b.total_amount - COALESCE(p.paid_total,0) - COALESCE(r.refunded_total,0)) > 0
                  AND UPPER(b.booking_status) NOT IN ('CANCELLED','REFUNDED')`,
              [today],
            ).catch(() => ({ rows: [{ value: 0 }] })),

            // Lifetime all-time totals
            query(`SELECT COALESCE(SUM(total_amount), 0)::numeric AS value FROM bookings WHERE UPPER(booking_status) NOT IN ('CANCELLED','REFUNDED')`),
            query(
              `SELECT COALESCE((SELECT SUM(amount) FROM booking_payments WHERE payment_status='Success' AND NOT COALESCE(is_deleted,false)), 0)::numeric AS gross,
                      COALESCE((SELECT SUM(amount) FROM refunds), 0)::numeric AS refunded`,
            ),
            query(
              `SELECT b.id, b.booking_number, b.passenger_name, b.passenger_phone, b.category,
                      GREATEST(b.total_amount - COALESCE(p.paid_total,0) - COALESCE(r.refunded_total,0), 0)::numeric AS remaining,
                      b.departure_datetime
                 FROM bookings b
                 LEFT JOIN (SELECT booking_id, SUM(amount) AS paid_total FROM booking_payments WHERE payment_status='Success' AND NOT COALESCE(is_deleted,false) GROUP BY booking_id) p ON p.booking_id = b.id
                 LEFT JOIN (SELECT booking_id, SUM(amount) AS refunded_total FROM refunds GROUP BY booking_id) r ON r.booking_id = b.id
                WHERE (b.total_amount - COALESCE(p.paid_total,0) - COALESCE(r.refunded_total,0)) > 0
                  AND UPPER(b.booking_status) NOT IN ('CANCELLED','REFUNDED')
                ORDER BY remaining DESC LIMIT 50`,
            ),
          ]);

          const [newEnquiriesRes, upcomingTripsRes, byCategoryRes, byTypeRes, ticketsPendingRes, bookingRequestedRes] = await Promise.all([
            query(
              `SELECT COUNT(*)::int AS n FROM enquiries WHERE UPPER(status) IN ('NEW', 'OPEN')`,
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(
              `SELECT * FROM bookings
                WHERE departure_datetime::date BETWEEN $1::date AND $2::date
                  AND UPPER(booking_status) NOT IN ('CANCELLED','REFUNDED')
                ORDER BY departure_datetime ASC LIMIT 10`,
              [today, in7],
            ).catch(() => ({ rows: [] as any[] })),
            query(
              `SELECT COALESCE(category, 'OTHER') AS category, COUNT(*)::int AS n FROM bookings GROUP BY COALESCE(category, 'OTHER')`,
            ).catch(() => ({ rows: [] as any[] })),
            query(
              `SELECT COALESCE(UPPER(booking_type), 'TAXI') AS booking_type, COUNT(*)::int AS n FROM bookings GROUP BY COALESCE(UPPER(booking_type), 'TAXI')`,
            ).catch(() => ({ rows: [] as any[] })),
            query(
              `SELECT COUNT(*)::int AS n FROM bookings
                WHERE UPPER(booking_type) IN ('BUS','TRAIN','FLIGHT')
                  AND UPPER(booking_status) NOT IN ('TICKET UPLOADED','CONFIRMED','COMPLETED','CANCELLED','REFUNDED')
                  AND NOT EXISTS (SELECT 1 FROM booking_documents bd WHERE bd.booking_id = bookings.id AND bd.status = 'active')`,
            ).catch(() => ({ rows: [{ n: 0 }] })),
            query(
              `SELECT COUNT(*)::int AS n FROM bookings WHERE UPPER(booking_status) = 'BOOKING REQUESTED'`,
            ).catch(() => ({ rows: [{ n: 0 }] })),
          ]);

          const gross = Number(collectedRes.rows[0]?.gross ?? 0);
          const refunded = Number(collectedRes.rows[0]?.refunded ?? 0);
          const outstandingTotal = Number(pendingPayRes.rows[0]?.outstanding ?? 0);

          const todayRevenue = Number(todayRevenueRes.rows[0]?.value ?? 0);
          const todayAdvance = Number(todayAdvanceRes.rows[0]?.value ?? 0);
          const todayPending = Number(todayPendingRes.rows[0]?.value ?? 0);

          return new Response(
            JSON.stringify({
              success: true,
              stats: {
                /* Today Financial Metrics (Requested by user) */
                todayRevenue,
                todayAdvanceCollected: todayAdvance,
                todayPending,

                /* Booking counts */
                todayBookings: todayRes.rows[0]?.n ?? 0,
                upcomingBookings: upcomingRes.rows[0]?.n ?? 0,
                pendingPayments: pendingPayRes.rows[0]?.n ?? 0,
                fullyPaid: fullyPaidRes.rows[0]?.n ?? 0,
                partiallyPaid: partiallyPaidRes.rows[0]?.n ?? 0,
                cancelled: cancelledRes.rows[0]?.n ?? 0,
                totalBookings: totalRes.rows[0]?.n ?? 0,
                totalRevenue: gross - refunded,
                pendingAmount: outstandingTotal,

                /* Dashboard lifetime keys */
                totalBookingValue: Number(valueRes.rows[0]?.value ?? 0),
                totalAdvanceReceived: gross - refunded,
                totalOutstanding: outstandingTotal,
                todaysCollections: todayAdvance,
                newEnquiries: newEnquiriesRes.rows[0]?.n ?? 0,
                upcomingThisWeek: Array.isArray(upcomingTripsRes.rows) ? upcomingTripsRes.rows : [],
                byCategory: byCategoryRes.rows,

                /* Booking type breakdown */
                byType: byTypeRes.rows,
                taxiBookings: byTypeRes.rows.find((r: any) => r.booking_type === "TAXI")?.n ?? 0,
                busBookings: byTypeRes.rows.find((r: any) => r.booking_type === "BUS")?.n ?? 0,
                trainBookings: byTypeRes.rows.find((r: any) => r.booking_type === "TRAIN")?.n ?? 0,
                flightBookings: byTypeRes.rows.find((r: any) => r.booking_type === "FLIGHT")?.n ?? 0,
                ticketsPending: ticketsPendingRes.rows[0]?.n ?? 0,
                pendingEnquiries: bookingRequestedRes.rows[0]?.n ?? 0,
              },
              outstandingTop: outstandingListRes.rows,
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "public, max-age=5",
              },
            },
          );
        } catch (error: any) {
          console.error("GET /api/bookings/stats error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to load stats" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
