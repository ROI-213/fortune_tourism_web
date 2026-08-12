import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import sharp from "sharp";

async function compressImage(
  buffer: Buffer,
  originalMimeType: string,
  filename: string
): Promise<{
  buffer: Buffer;
  mimeType: string;
  filename: string;
  compressed: boolean;
  originalSize: number;
  compressedSize: number;
}> {
  const originalSize = buffer.length;

  // Only compress raster image types (JPEG, PNG, WebP, AVIF, TIFF) and skip vector formats like SVG
  const isRasterImage =
    originalMimeType.startsWith("image/") && !originalMimeType.includes("svg");

  if (!isRasterImage) {
    return {
      buffer,
      mimeType: originalMimeType,
      filename,
      compressed: false,
      originalSize,
      compressedSize: originalSize,
    };
  }

  try {
    const pipeline = sharp(buffer, { failOn: "none" });
    const metadata = await pipeline.metadata();

    // Resize if dimensions exceed 1920px
    const MAX_DIMENSION = 1920;
    if (
      (metadata.width && metadata.width > MAX_DIMENSION) ||
      (metadata.height && metadata.height > MAX_DIMENSION)
    ) {
      pipeline.resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Convert/compress to webp with quality 80
    const compressedBuffer = await pipeline
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    // Keep compressed version only if size was reduced
    if (compressedBuffer.length < originalSize) {
      const nameParts = filename.split(".");
      if (nameParts.length > 1) {
        nameParts[nameParts.length - 1] = "webp";
      } else {
        nameParts.push("webp");
      }
      const newFilename = nameParts.join(".");

      return {
        buffer: compressedBuffer,
        mimeType: "image/webp",
        filename: newFilename,
        compressed: true,
        originalSize,
        compressedSize: compressedBuffer.length,
      };
    }
  } catch (err) {
    console.warn("Sharp image compression warning, falling back to original file:", err);
  }

  return {
    buffer,
    mimeType: originalMimeType,
    filename,
    compressed: false,
    originalSize,
    compressedSize: originalSize,
  };
}

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

          // Automatically compress images before saving to storage
          const compressionResult = await compressImage(buffer, mimeType, filename);
          buffer = compressionResult.buffer;
          mimeType = compressionResult.mimeType;
          filename = compressionResult.filename;

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
              compression: {
                compressed: compressionResult.compressed,
                originalSize: compressionResult.originalSize,
                compressedSize: compressionResult.compressedSize,
                savedBytes: compressionResult.originalSize - compressionResult.compressedSize,
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
