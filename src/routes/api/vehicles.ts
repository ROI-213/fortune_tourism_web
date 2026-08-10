import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/vehicles")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const slug = url.searchParams.get("slug");

          if (slug) {
            const res = await query(`SELECT * FROM vehicles WHERE slug = $1`, [slug]);
            if (res.rows.length === 0) {
              return new Response(JSON.stringify({ success: false, error: "Vehicle not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              });
            }
            return new Response(JSON.stringify({ success: true, vehicle: res.rows[0] }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          const res = await query(`SELECT * FROM vehicles ORDER BY created_at DESC`);
          return new Response(JSON.stringify({ success: true, vehicles: res.rows }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("GET /api/vehicles error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch vehicles" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            slug,
            name,
            category,
            seats,
            luggage,
            price_per_km,
            base_price_local,
            features,
            image,
            description,
            is_popular,
          } = body;

          if (!slug || !name || !category || !seats) {
            return new Response(
              JSON.stringify({ success: false, error: "Slug, name, category, and seats are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const res = await query(
            `INSERT INTO vehicles
             (slug, name, category, seats, luggage, price_per_km, base_price_local, features, image, description, is_popular)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
             RETURNING *`,
            [
              slug,
              name,
              category,
              Number(seats),
              luggage || "2 bags",
              Number(price_per_km) || 14,
              Number(base_price_local) || (Number(price_per_km) || 14) * 80,
              features || [],
              image || "/images/fleet/default.jpg",
              description || "",
              Boolean(is_popular),
            ]
          );

          return new Response(JSON.stringify({ success: true, vehicle: res.rows[0] }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("POST /api/vehicles error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to create vehicle" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      PUT: async ({ request }) => {
        try {
          const body = await request.json();
          const { id, name, category, seats, price_per_km, description, image, is_popular } = body;

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const res = await query(
            `UPDATE vehicles SET
             name = COALESCE($1, name),
             category = COALESCE($2, category),
             seats = COALESCE($3, seats),
             price_per_km = COALESCE($4, price_per_km),
             description = COALESCE($5, description),
             image = COALESCE($6, image),
             is_popular = COALESCE($7, is_popular),
             updated_at = NOW()
             WHERE id = $8 RETURNING *`,
            [name, category, seats ? Number(seats) : null, price_per_km ? Number(price_per_km) : null, description, image, is_popular != null ? Boolean(is_popular) : null, id]
          );

          return new Response(JSON.stringify({ success: true, vehicle: res.rows[0] }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("PUT /api/vehicles error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to update vehicle" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      DELETE: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const id = url.searchParams.get("id");

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          await query(`DELETE FROM vehicles WHERE id = $1`, [id]);
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("DELETE /api/vehicles error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete vehicle" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
