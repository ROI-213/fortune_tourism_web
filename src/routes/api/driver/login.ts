import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/driver/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { email, password } = body;

          if (!email || !password) {
            return new Response(
              JSON.stringify({ success: false, error: "Email/User ID and password are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const trimmedEmail = String(email).trim();
          const trimmedPass = String(password).trim();

          // Query PostgreSQL drivers table by email, phone, or name
          const res = await query(
            `SELECT id, driver_name, phone, email, access_pin, password, allowed_sections, vehicle_type, status
             FROM drivers
             WHERE (LOWER(email) = LOWER($1) OR phone = $1 OR LOWER(driver_name) = LOWER($1))
               AND deleted_at IS NULL
             LIMIT 1`,
            [trimmedEmail],
          );

          if (res.rows.length === 0) {
            return new Response(
              JSON.stringify({ success: false, error: "Driver account not found with this Email/User ID." }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const driver = res.rows[0];

          // Check password or access_pin
          const validPass = driver.password || driver.access_pin;
          if (validPass && String(validPass).trim() !== trimmedPass) {
            return new Response(
              JSON.stringify({ success: false, error: "Invalid password for this driver account." }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          if (driver.status === "Inactive") {
            return new Response(
              JSON.stringify({ success: false, error: "This driver account is inactive. Please contact Admin." }),
              { status: 403, headers: { "Content-Type": "application/json" } },
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              driver: {
                id: driver.id,
                driver_name: driver.driver_name,
                email: driver.email,
                phone: driver.phone,
                vehicle_type: driver.vehicle_type,
                allowed_sections: driver.allowed_sections || "cab_bookings,day_book_entries,expenses",
              },
            }),
            { headers: { "Content-Type": "application/json" } },
          );
        } catch (error: any) {
          console.error("POST /api/driver/login error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to log in" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
