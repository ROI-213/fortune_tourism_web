import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/packages")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const slug = url.searchParams.get("slug");

          if (slug) {
            const res = await query(`SELECT * FROM packages WHERE slug = $1`, [slug]);
            if (res.rows.length === 0) {
              return new Response(JSON.stringify({ success: false, error: "Package not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
              });
            }
            return new Response(JSON.stringify({ success: true, package: res.rows[0] }), {
              headers: { "Content-Type": "application/json" },
            });
          }

          const res = await query(`SELECT * FROM packages ORDER BY created_at DESC`);
          return new Response(JSON.stringify({ success: true, packages: res.rows }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("GET /api/packages error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch packages" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const {
            slug,
            title,
            duration,
            from_city,
            states,
            destinations,
            vehicles,
            starting_price,
            image,
            hero_image,
            summary,
            highlights,
            itinerary,
            inclusions,
            exclusions,
          } = body;

          if (!slug || !title || !duration || !from_city || !summary) {
            return new Response(
              JSON.stringify({ success: false, error: "Slug, title, duration, from_city, and summary are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const res = await query(
            `INSERT INTO packages 
             (slug, title, duration, from_city, states, destinations, vehicles, starting_price, image, hero_image, summary, highlights, itinerary, inclusions, exclusions)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             RETURNING *`,
            [
              slug,
              title,
              duration,
              from_city,
              states || [],
              destinations || [],
              vehicles || [],
              starting_price || 0,
              image || "/images/packages/default.jpg",
              hero_image || null,
              summary,
              highlights || [],
              JSON.stringify(itinerary || []),
              inclusions || [],
              exclusions || [],
            ]
          );

          return new Response(JSON.stringify({ success: true, package: res.rows[0] }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("POST /api/packages error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to create package" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      PUT: async ({ request }) => {
        try {
          const body = await request.json();
          const { id, title, duration, from_city, starting_price, summary, image } = body;

          if (!id) {
            return new Response(JSON.stringify({ success: false, error: "ID is required" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const res = await query(
            `UPDATE packages SET 
             title = COALESCE($1, title),
             duration = COALESCE($2, duration),
             from_city = COALESCE($3, from_city),
             starting_price = COALESCE($4, starting_price),
             summary = COALESCE($5, summary),
             image = COALESCE($6, image),
             updated_at = NOW()
             WHERE id = $7 RETURNING *`,
            [title, duration, from_city, starting_price, summary, image, id]
          );

          return new Response(JSON.stringify({ success: true, package: res.rows[0] }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("PUT /api/packages error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to update package" }),
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

          await query(`DELETE FROM packages WHERE id = $1`, [id]);
          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("DELETE /api/packages error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete package" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
