import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";

export const Route = createFileRoute("/api/storage/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const contentType = request.headers.get("content-type") || "";

          let bucketId = "images";
          let filename = `upload-${Date.now()}`;
          let mimeType = "image/png";
          let buffer: Buffer;

          if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            const file = formData.get("file") as File | null;
            bucketId = (formData.get("bucket") as string) || "images";

            if (!file) {
              return new Response(
                JSON.stringify({ success: false, error: "No file uploaded in form data." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }

            filename = file.name || filename;
            mimeType = file.type || mimeType;
            const arrayBuffer = await file.arrayBuffer();
            buffer = Buffer.from(arrayBuffer);
          } else {
            const body = await request.json();
            bucketId = body.bucket || "images";
            filename = body.filename || filename;
            mimeType = body.mimeType || "image/png";

            if (!body.base64) {
              return new Response(
                JSON.stringify({ success: false, error: "base64 file content is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
              );
            }

            const cleanBase64 = body.base64.replace(/^data:[^;]+;base64,/, "");
            buffer = Buffer.from(cleanBase64, "base64");
          }

          // Verify bucket exists or insert default
          await query(
            `INSERT INTO storage_buckets (id, name, is_public) VALUES ($1, $2, TRUE) ON CONFLICT (id) DO NOTHING`,
            [bucketId, `${bucketId} bucket`]
          );

          // Save file into PostgreSQL storage_files BYTEA table
          const res = await query(
            `INSERT INTO storage_files (bucket_id, filename, mime_type, size, data)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, bucket_id, filename, mime_type, size, created_at`,
            [bucketId, filename, mimeType, buffer.length, buffer]
          );

          const savedFile = res.rows[0];
          const fileUrl = `/api/storage/files/${savedFile.id}`;

          return new Response(
            JSON.stringify({
              success: true,
              file: {
                ...savedFile,
                url: fileUrl,
              },
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
          );
        } catch (error: any) {
          console.error("POST /api/storage/upload error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to upload file to PostgreSQL storage" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
