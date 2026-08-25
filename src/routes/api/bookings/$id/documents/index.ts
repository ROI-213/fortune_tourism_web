import { createFileRoute } from "@tanstack/react-router";
import { query } from "@/lib/db";
import { logActivity } from "@/lib/booking-server";
import { isAdminAuthorized, unauthorizedResponse } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/bookings/$id/documents/")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const { id } = params;
          const res = await query(
            `SELECT * FROM booking_documents WHERE booking_id = $1 AND status != 'deleted' ORDER BY uploaded_at DESC`,
            [Number(id)]
          );
          return new Response(JSON.stringify({ success: true, documents: res.rows }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("GET /api/bookings/$id/documents error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to fetch documents" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      POST: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();

          const { id } = params;
          const formData = await request.formData();
          const file = formData.get("file") as File | null;
          const document_type = formData.get("document_type") as string;
          const notes = formData.get("notes") as string | null;

          if (!file || !document_type) {
            return new Response(
              JSON.stringify({ success: false, error: "File and document_type are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate file type
          const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
          if (!allowedTypes.includes(file.type)) {
            return new Response(
              JSON.stringify({ success: false, error: "Invalid file type. Only PDF, JPG, and PNG are allowed." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Validate file size (10MB)
          if (file.size > 10 * 1024 * 1024) {
            return new Response(
              JSON.stringify({ success: false, error: "File size exceeds 10MB limit." }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          // Ensure bucket exists
          await query(
            `INSERT INTO storage_buckets (id, name, is_public) VALUES ('tickets', 'tickets bucket', TRUE) ON CONFLICT (id) DO NOTHING`
          );

          // Upload file directly to storage_files
          const buffer = await file.arrayBuffer();
          const data = Buffer.from(buffer);
          const uploadRes = await query(
            `INSERT INTO storage_files (bucket_id, filename, mime_type, size, data) VALUES ('tickets', $1, $2, $3, $4) RETURNING id, filename, mime_type, size`,
            [file.name, file.type, file.size, data]
          );

          const storageFile = uploadRes.rows[0];
          const storage_path = `/api/storage/files/${storageFile.id}`;

          // Create booking document record
          const docRes = await query(
            `INSERT INTO booking_documents (booking_id, document_type, file_name, storage_file_id, storage_path, uploaded_by, notes)
             VALUES ($1, $2, $3, $4, $5, 'Admin', $6) RETURNING *`,
            [Number(id), document_type, file.name, storageFile.id, storage_path, notes || null]
          );

          const document = docRes.rows[0];

          await logActivity({
            booking_id: Number(id),
            action: "DOCUMENT UPLOADED",
            entity: "booking_document",
            entity_ref: file.name,
            details: `Ticket/document uploaded for booking`,
            actor: "Admin",
          });

          // Check if auto-advance needed
          const bookingRes = await query(`SELECT booking_status, booking_number FROM bookings WHERE id = $1`, [Number(id)]);
          if (bookingRes.rows.length > 0) {
            const currentStatus = bookingRes.rows[0].booking_status;
            if (String(currentStatus).toUpperCase() === 'TICKET BOOKED') {
              await query(`UPDATE bookings SET booking_status = 'TICKET UPLOADED', updated_at = NOW() WHERE id = $1`, [Number(id)]);
              await logActivity({
                booking_id: Number(id),
                action: "BOOKING STATUS CHANGED",
                entity: "booking",
                entity_ref: bookingRes.rows[0].booking_number,
                old_value: currentStatus,
                new_value: "TICKET UPLOADED",
                actor: "System",
              });
            }
          }

          return new Response(JSON.stringify({ success: true, document }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("POST /api/bookings/$id/documents error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to upload document" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
      DELETE: async ({ request, params }) => {
        try {
          if (!isAdminAuthorized(request)) return unauthorizedResponse();

          const { id } = params;
          const url = new URL(request.url);
          const doc_id = url.searchParams.get("doc_id");

          if (!doc_id) {
            return new Response(JSON.stringify({ success: false, error: "doc_id is required." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          const currentRes = await query(`SELECT file_name FROM booking_documents WHERE id = $1 AND booking_id = $2`, [Number(doc_id), Number(id)]);
          
          if (currentRes.rows.length > 0) {
            await query(`UPDATE booking_documents SET status = 'deleted' WHERE id = $1 AND booking_id = $2`, [Number(doc_id), Number(id)]);
            await logActivity({
              booking_id: Number(id),
              action: "DOCUMENT REMOVED",
              entity: "booking_document",
              entity_ref: currentRes.rows[0].file_name,
              details: "Document removed from booking",
              actor: "Admin"
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error: any) {
          console.error("DELETE /api/bookings/$id/documents error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Failed to delete document" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      },
    },
  },
});
