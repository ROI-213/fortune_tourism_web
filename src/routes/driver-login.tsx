import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { UserCheck, KeyRound, ShieldAlert, ArrowRight, Truck } from "lucide-react";

export const Route = createFileRoute("/driver-login")({
  head: () => ({
    meta: [
      { title: "Driver Portal Login | Fortune Tourism" },
      { name: "description", content: "Driver login portal for Fortune Tourism chauffeur duty management." },
    ],
  }),
  component: DriverLoginPage,
});

function DriverLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter User ID / Email and Password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/driver/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Welcome back, ${d.driver.driver_name}!`);
        localStorage.setItem("fortune_driver_session", JSON.stringify(d.driver));
        navigate({ to: "/driver/dashboard" as any });
      } else {
        toast.error(d.error || "Invalid login credentials");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Login failed. Please check network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="relative min-h-[80vh] flex items-center justify-center py-16 px-4 bg-[color:var(--color-cream)]/50">
        <div className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-navy)] text-white shadow-md">
              <Truck className="h-7 w-7" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-[color:var(--color-emerald)]">
              Fortune Tourism
            </p>
            <h1 className="mt-1 font-heading text-3xl font-bold text-[#0F2E23]">Driver Portal Login</h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Sign in with your assigned Driver User ID / Email and Password to view your allowed duty sections.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                User ID / Email / Phone *
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver.ramesh@fortunetourism.com or Phone"
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)]/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Password *
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)]/30"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--color-navy)] py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
            >
              <span>{loading ? "Verifying..." : "Login to Driver Portal"}</span>
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-8 border-t border-border pt-5 text-center text-xs text-muted-foreground">
            <p>Admin permissions apply strictly to allowed sections.</p>
            <Link to="/admin" className="mt-2 inline-block font-semibold text-[color:var(--color-navy)] hover:underline">
              Go to Full Admin Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
