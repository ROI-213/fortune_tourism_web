import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/storage/files/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { id } = params;

          if (!id) {
            return new Response("Missing file ID", { status: 400 });
          }

          const res = await query(`SELECT mime_type, filename, data FROM storage_files WHERE id = $1`, [id]);

          if (res.rows.length === 0) {
            return new Response("File not found in PostgreSQL storage", { status: 404 });
          }

          const file = res.rows[0];
          const buffer = Buffer.from(file.data);

          return new Response(buffer, {
            status: 200,
            headers: {
              "Content-Type": file.mime_type || "image/jpeg",
              "Content-Disposition": `inline; filename="${file.filename}"`,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch (error: any) {
          console.error("GET /api/storage/files/$id error:", error);
          return new Response("Internal server error fetching file", { status: 500 });
        }
      },
    },
  },
});
