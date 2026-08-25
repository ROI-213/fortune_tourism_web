/**
 * Lightweight admin gate for mutating booking/payment endpoints.
 *
 * Set ADMIN_PASSWORD in the environment to lock down admin operations.
 * When the variable is NOT set the endpoints stay open (development /
 * backward-compatible mode) so existing workflows never break.
 *
 * The admin UI sends the key via the `x-admin-key` header.
 */
export function isAdminAuthorized(request: Request): boolean {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return true; // open mode — no ADMIN_PASSWORD configured

  const headerKey = request.headers.get("x-admin-key");
  if (headerKey && headerKey === pwd) return true;

  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)fortune_admin_key=([^;]+)/);
  if (match && decodeURIComponent(match[1]) === pwd) return true;

  return false;
}

export function unauthorizedResponse(): Response {
  return new Response(
    JSON.stringify({ success: false, error: "Unauthorized. Admin key required." }),
    { status: 401, headers: { "Content-Type": "application/json" } },
  );
}
