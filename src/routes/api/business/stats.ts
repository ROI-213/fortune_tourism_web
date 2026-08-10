import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import { BUSINESS_RESOURCES } from "@/lib/business-schema";

const MONEY_SUMMARIES: { label: string; sql: string }[] = [
  {
    label: "Total Outstanding",
    sql: `SELECT COALESCE(SUM(remaining_amount), 0)::numeric AS value FROM outstanding_entries WHERE deleted_at IS NULL`,
  },
  {
    label: "Day Book Due",
    sql: `SELECT COALESCE(SUM(due_amount), 0)::numeric AS value FROM day_book_entries WHERE deleted_at IS NULL`,
  },
  {
    label: "Cab Bookings Due",
    sql: `SELECT COALESCE(SUM(due_amount + to_pay - settled_amount), 0)::numeric AS value FROM cab_bookings WHERE deleted_at IS NULL`,
  },
  {
    label: "Package Trips Remaining",
    sql: `SELECT COALESCE(SUM(remaining_amount), 0)::numeric AS value FROM package_trips WHERE deleted_at IS NULL`,
  },
  {
    label: "Total Expenses",
    sql: `SELECT COALESCE(SUM(amount), 0)::numeric AS value FROM expenses WHERE deleted_at IS NULL`,
  },
  {
    label: "Total Payments Received",
    sql: `SELECT COALESCE(SUM(amount), 0)::numeric AS value FROM payments WHERE deleted_at IS NULL`,
  },
];

export const Route = createFileRoute("/api/business/stats")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const keys = Object.keys(BUSINESS_RESOURCES);

          // Execute resource counts in parallel
          const countPromises = keys.map((key) =>
            query(
              `SELECT COUNT(*)::int AS n FROM ${BUSINESS_RESOURCES[key].table} WHERE deleted_at IS NULL`,
            )
              .then((res) => ({ key, count: res.rows[0]?.n ?? 0 }))
              .catch(() => ({ key, count: 0 })),
          );

          // Execute money summaries in parallel
          const moneyPromises = MONEY_SUMMARIES.map((m) =>
            query(m.sql)
              .then((res) => ({ label: m.label, value: Number(res.rows[0]?.value ?? 0) }))
              .catch(() => ({ label: m.label, value: 0 })),
          );

          const [countResults, moneyResults] = await Promise.all([
            Promise.all(countPromises),
            Promise.all(moneyPromises),
          ]);

          const resources: Record<string, number> = {};
          for (const item of countResults) {
            resources[item.key] = item.count;
          }

          const money: Record<string, number> = {};
          for (const item of moneyResults) {
            money[item.label] = item.value;
          }

          return new Response(JSON.stringify({ success: true, counts: resources, money }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=5, s-maxage=5",
            },
          });
        } catch (error: any) {
          console.error("GET /api/business/stats error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to load stats" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
