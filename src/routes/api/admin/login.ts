import { createFileRoute } from "@tanstack/react-router";
import { validateAdminCredentials, getAdminEmail, getAdminPassword } from "@/lib/admin-auth";

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { email, password } = body;

          if (!email || !password) {
            return new Response(
              JSON.stringify({ success: false, error: "User ID / Email and password are required." }),
              { status: 400, headers: { "Content-Type": "application/json" } },
            );
          }

          const isValid = validateAdminCredentials(email, password);

          if (!isValid) {
            return new Response(
              JSON.stringify({
                success: false,
                error: "Invalid Email or Password. Please check your credentials.",
              }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const adminKey = getAdminPassword();
          const adminEmail = getAdminEmail();

          return new Response(
            JSON.stringify({
              success: true,
              message: "Admin login successful.",
              admin_key: adminKey,
              user: {
                email: adminEmail,
                role: "SUPER_ADMIN",
                name: "Fortune Tourism Administrator",
              },
            }),
            {
              headers: {
                "Content-Type": "application/json",
                "Set-Cookie": `fortune_admin_key=${encodeURIComponent(adminKey)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
              },
            },
          );
        } catch (error: any) {
          console.error("POST /api/admin/login error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message || "Login failed." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
