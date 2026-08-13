import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Car,
  Route,
  Timer,
  Wallet,
  Landmark,
  Banknote,
  UserCog,
  ClipboardList,
  Wrench,
  FileBadge,
  ShieldCheck,
  Plane,
  TrainFront,
  Bus,
  Calculator,
  Building2,
  PieChart,
  FileSpreadsheet,
} from "lucide-react";
import { ResourceManager } from "@/components/business/ResourceManager";
import { DailyExpenseReport } from "@/components/business/DailyExpenseReport";
import { ClientStatementsManager } from "@/components/business/ClientStatementsManager";
import { OfflineSectorBookingHub } from "@/components/business/OfflineSectorBookingHub";
import { BUSINESS_RESOURCES, type ResourceConfig } from "@/lib/business-schema";

type TabKey =
  | "overview"
  | "offline_hub"
  | "client_statements"
  | "customers"
  | "day_book_entries"
  | "cab_bookings"
  | "package_trips"
  | "hourly_bookings"
  | "expenses"
  | "daily_expense_report"
  | "accounts"
  | "account_transactions"
  | "payments"
  | "drivers"
  | "vehicles"
  | "outstanding_entries"
  | "repairs"
  | "permits"
  | "insurance_records"
  | "flight_bookings"
  | "train_bookings"
  | "bus_bookings"
  | "vehicle_forecasts"
  | "rto_agents";

const TABS: {
  key: TabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  countKey?: string;
}[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "offline_hub", label: "Offline Sector Bookings", icon: ClipboardList },
  { key: "client_statements", label: "Client Statements", icon: FileSpreadsheet },
  { key: "customers", label: "Customers", icon: Users, countKey: "customers" },
  { key: "day_book_entries", label: "Day Book", icon: BookOpen, countKey: "day_book_entries" },
  { key: "cab_bookings", label: "Cab Bookings", icon: Car, countKey: "cab_bookings" },
  { key: "package_trips", label: "Package Trips", icon: Route, countKey: "package_trips" },
  { key: "hourly_bookings", label: "Hourly", icon: Timer, countKey: "hourly_bookings" },
  { key: "expenses", label: "Expenses", icon: Wallet, countKey: "expenses" },
  { key: "daily_expense_report", label: "Daily Expense Report", icon: PieChart },
  { key: "accounts", label: "Accounts", icon: Landmark, countKey: "accounts" },
  {
    key: "account_transactions",
    label: "Transactions",
    icon: Banknote,
    countKey: "account_transactions",
  },
  { key: "payments", label: "Payments", icon: Banknote, countKey: "payments" },
  { key: "drivers", label: "Drivers", icon: UserCog, countKey: "drivers" },
  { key: "vehicles", label: "Vehicle Registry", icon: Car, countKey: "vehicles" },
  {
    key: "outstanding_entries",
    label: "Outstanding",
    icon: ClipboardList,
    countKey: "outstanding_entries",
  },
  { key: "repairs", label: "Repairs", icon: Wrench, countKey: "repairs" },
  { key: "permits", label: "Permits", icon: FileBadge, countKey: "permits" },
  {
    key: "insurance_records",
    label: "Insurance",
    icon: ShieldCheck,
    countKey: "insurance_records",
  },
  { key: "flight_bookings", label: "Flights", icon: Plane, countKey: "flight_bookings" },
  { key: "train_bookings", label: "Trains", icon: TrainFront, countKey: "train_bookings" },
  { key: "bus_bookings", label: "Buses", icon: Bus, countKey: "bus_bookings" },
  { key: "vehicle_forecasts", label: "Forecasts", icon: Calculator, countKey: "vehicle_forecasts" },
  { key: "rto_agents", label: "RTO Agents", icon: Building2, countKey: "rto_agents" },
];

const MONEY_CARDS: { label: string; color: string; border: string; textColor: string }[] = [
  { label: "Total Outstanding", color: "bg-red-50", border: "border-red-200", textColor: "text-red-600" },
  { label: "Day Book Due", color: "bg-red-50/80", border: "border-red-200", textColor: "text-red-600" },
  { label: "Cab Bookings Due", color: "bg-red-50/60", border: "border-red-200", textColor: "text-red-600" },
  { label: "Package Trips Remaining", color: "bg-blue-50", border: "border-blue-200", textColor: "text-blue-600" },
  { label: "Total Expenses", color: "bg-purple-50", border: "border-purple-200", textColor: "text-purple-600" },
  { label: "Payments Received", color: "bg-emerald-50", border: "border-emerald-200", textColor: "text-emerald-600" },
];

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface DriverProfile {
  id: number | string;
  driver_name: string;
  phone?: string;
  access_pin?: string;
  allowed_sections?: string;
}

export function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [money, setMoney] = useState<Record<string, number>>({});

  // Driver Mode state
  const [activeDriver, setActiveDriver] = useState<DriverProfile | null>(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driversList, setDriversList] = useState<DriverProfile[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [enteredPin, setEnteredPin] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  useEffect(() => {
    fetch("/api/business/stats")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setCounts(d.counts || {});
          setMoney(d.money || {});
        }
      })
      .catch(() => {});
  }, []);

  const openDriverModal = async () => {
    setPinError("");
    setEnteredPin("");
    setShowDriverModal(true);
    try {
      const res = await fetch("/api/business/drivers?limit=500");
      const d = await res.json();
      if (d.success) setDriversList(d.rows || []);
    } catch (e) {
      console.error("Failed to load drivers", e);
    }
  };

  const handleDriverLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");
    const drv = driversList.find((d) => String(d.id) === String(selectedDriverId));
    if (!drv) {
      setPinError("Please select a driver");
      return;
    }
    if (drv.access_pin && drv.access_pin.trim() !== enteredPin.trim()) {
      setPinError("Incorrect PIN for " + drv.driver_name);
      return;
    }

    setActiveDriver(drv);
    setShowDriverModal(false);
    setActiveTab("overview");
  };

  const exitDriverMode = () => {
    setActiveDriver(null);
    setSelectedDriverId("");
    setEnteredPin("");
  };

  // Filter tabs dynamically based on driver section permissions
  const allowedSectionKeys = (activeDriver?.allowed_sections || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const visibleTabs = activeDriver
    ? TABS.filter((t) => t.key === "overview" || allowedSectionKeys.includes(t.key))
    : TABS;

  return (
    <div>
      {/* Active Driver Banner (if Driver Mode active) */}
      {activeDriver && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm">
              👤
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Active Driver View: {activeDriver.driver_name}
              </p>
              <p className="text-xs text-slate-600">
                {allowedSectionKeys.length > 0
                  ? `Access granted to: ${allowedSectionKeys.join(", ")}`
                  : "No specific sections granted yet. Admin can set sections in Drivers list."}
              </p>
            </div>
          </div>
          <button
            onClick={exitDriverMode}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Exit Driver Mode
          </button>
        </div>
      )}

      {/* Driver Login Modal */}
      {showDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="font-heading text-xl font-bold text-[#12213b]">Driver Portal Login</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Select a driver profile and enter PIN to view allowed driver sections.
            </p>

            <form onSubmit={handleDriverLogin} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Select Driver *
                </label>
                <select
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)]/30"
                  required
                >
                  <option value="">— Select Registered Driver —</option>
                  {driversList.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.driver_name} ({d.phone || "No phone"}) {d.allowed_sections ? `[${d.allowed_sections}]` : "[No sections set]"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Access PIN / Password
                </label>
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="Enter PIN (if required)"
                  className="w-full rounded-xl border border-border bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-navy)]/30"
                />
              </div>

              {pinError && <p className="text-xs text-red-600 font-semibold">{pinError}</p>}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDriverModal(false)}
                  className="flex-1 rounded-xl border border-border bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[color:var(--color-navy)] py-3 text-xs font-bold text-white shadow hover:brightness-110"
                >
                  Enter Driver View
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex border-b border-border mb-6 gap-2 overflow-x-auto pb-1">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const count = tab.countKey ? counts[tab.countKey] : undefined;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {count !== undefined && (
                <span className="text-[11px] text-muted-foreground">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "overview" ? (
        <div>
          <h2 className="font-heading text-lg font-bold mb-1">
            {activeDriver ? `Driver Dashboard — ${activeDriver.driver_name}` : "Business Overview"}
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            {activeDriver
              ? `Displaying sections granted to ${activeDriver.driver_name}.`
              : "Live snapshot of all Excel-style business records stored in PostgreSQL."}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {MONEY_CARDS.map((m) => (
              <div
                key={m.label}
                className={`rounded-2xl border ${m.border} ${m.color} p-5 shadow-sm`}
              >
                <p className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                  {m.label}
                </p>
                <p className={`mt-1 font-heading text-2xl font-bold ${m.textColor}`}>
                  {inr(money[m.label] ?? 0)}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleTabs
              .filter((t) => t.key !== "overview")
              .map((tab) => {
                const Icon = tab.icon;
                const count = tab.countKey ? (counts[tab.countKey] ?? 0) : 0;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="rounded-2xl border border-border bg-white p-5 shadow-sm flex items-center justify-between hover:border-[color:var(--color-navy)]/40 transition text-left"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        {tab.label}
                      </p>
                      <p className="mt-1 font-heading text-2xl text-[color:var(--color-navy)] font-bold">
                        {count}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-500">
                      <Icon className="h-6 w-6" />
                    </div>
                  </button>
                );
              })}
          </div>
        </div>
      ) : activeTab === "offline_hub" ? (
        <OfflineSectorBookingHub />
      ) : activeTab === "daily_expense_report" ? (
        <DailyExpenseReport />
      ) : activeTab === "client_statements" ? (
        <ClientStatementsManager />
      ) : (
        <ResourceManager
          key={activeTab}
          resource={BUSINESS_RESOURCES[activeTab] as ResourceConfig}
        />
      )}
    </div>
  );
}
