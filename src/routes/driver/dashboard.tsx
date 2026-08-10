import { useEffect, useState, useMemo } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ResourceManager } from "@/components/business/ResourceManager";
import { BUSINESS_RESOURCES } from "@/lib/business-schema";
import {
  Truck,
  LogOut,
  Car,
  Route as RouteIcon,
  BookOpen,
  Timer,
  Wallet,
  Wrench,
  Users,
  ShieldCheck,
  Building2,
} from "lucide-react";

export const Route = createFileRoute("/driver/dashboard")({
  head: () => ({
    meta: [
      { title: "Driver Duty Portal | Fortune Tourism" },
      { name: "description", content: "Chauffeur duty slips, package trips, and expense logging." },
    ],
  }),
  component: DriverDashboardPage,
});

interface DriverSession {
  id: number | string;
  driver_name: string;
  email?: string;
  phone?: string;
  vehicle_type?: string;
  allowed_sections?: string;
}

const SECTION_MAP: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  cab_bookings: { label: "Cab Bookings", icon: Car },
  package_trips: { label: "Package Trips", icon: RouteIcon },
  day_book_entries: { label: "Day Book", icon: BookOpen },
  hourly_bookings: { label: "Hourly Rental", icon: Timer },
  expenses: { label: "Expenses / Fuel", icon: Wallet },
  repairs: { label: "Vehicle Repairs", icon: Wrench },
  customers: { label: "Customers", icon: Users },
  drivers: { label: "Drivers List", icon: Users },
  vehicles: { label: "Vehicle Registry", icon: Car },
  bus_bookings: { label: "Bus Bookings", icon: Building2 },
  train_bookings: { label: "Train Bookings", icon: Building2 },
  flight_bookings: { label: "Flight Bookings", icon: Building2 },
};

function DriverDashboardPage() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState<DriverSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("fortune_driver_session");
    if (!raw) {
      toast.error("Please log in to access the Driver Portal");
      navigate({ to: "/driver-login" as any });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as DriverSession;
      setDriver(parsed);
      const allowed = (parsed.allowed_sections || "cab_bookings,package_trips,day_book_entries,expenses")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (allowed.length > 0) {
        setActiveTab(allowed[0]);
      }
    } catch (e) {
      localStorage.removeItem("fortune_driver_session");
      navigate({ to: "/driver-login" as any });
    }
  }, [navigate]);

  const allowedSectionKeys = useMemo(() => {
    if (!driver?.allowed_sections) return ["cab_bookings", "package_trips", "day_book_entries", "expenses"];
    return driver.allowed_sections
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [driver]);

  const handleLogout = () => {
    localStorage.removeItem("fortune_driver_session");
    toast.success("Logged out from Driver Portal");
    navigate({ to: "/driver-login" as any });
  };

  if (!driver) return null;

  const currentResource = BUSINESS_RESOURCES[activeTab];

  return (
    <SiteLayout>
      <div className="bg-[color:var(--color-cream)]/50 py-10 min-h-[85vh]">
        <div className="container-fortune space-y-6">
          {/* Header Card */}
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-navy)] text-white shadow-md">
                  <Truck className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#0F2E23]">
                      Driver Portal: {driver.driver_name}
                    </h1>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      Authorized Driver
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Email/ID: <span className="font-semibold text-foreground">{driver.email || driver.phone}</span> · Vehicle Type: <span className="font-semibold text-foreground">{driver.vehicle_type || "Standard"}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="rounded-xl border border-border bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Admin Switch
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow transition hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-border bg-white rounded-2xl p-2 shadow-sm gap-2 overflow-x-auto">
            {allowedSectionKeys.map((secKey) => {
              const meta = SECTION_MAP[secKey] || { label: secKey, icon: ShieldCheck };
              const Icon = meta.icon;
              const isActive = activeTab === secKey;
              return (
                <button
                  key={secKey}
                  onClick={() => setActiveTab(secKey)}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs transition flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? "bg-[color:var(--color-navy)] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {meta.label}
                </button>
              );
            })}
          </div>

          {/* Active Allowed Resource View & Editor */}
          {currentResource ? (
            <div>
              <ResourceManager resource={currentResource} />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center text-sm text-muted-foreground">
              Select a section above to view and edit duty records.
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
