import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { BusinessDashboard } from "@/components/business/BusinessDashboard";
import { ResourceManager } from "@/components/business/ResourceManager";
import { ClientStatementsManager } from "@/components/business/ClientStatementsManager";
import { DailyExpenseReport } from "@/components/business/DailyExpenseReport";
import { BUSINESS_RESOURCES } from "@/lib/business-schema";
import {
  Users,
  Car,
  Package,
  HardDrive,
  RefreshCw,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Upload,
  ExternalLink,
  ShieldCheck,
  ClipboardList,
  UserCog,
  Pencil,
  FileSpreadsheet,
  TrendingDown,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Operations | Fortune Tourism" },
      {
        name: "description",
        content: "Fortune Tourism live database administration dashboard connected to PostgreSQL.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

interface Enquiry {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  service: string;
  pickup?: string;
  destination?: string;
  travel_date?: string;
  passengers?: string;
  notes?: string;
  status: string;
}

interface TourPackageItem {
  id: string;
  slug: string;
  title: string;
  duration: string;
  from_city: string;
  starting_price: number;
  image: string;
  summary: string;
}

interface VehicleItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  seats: number;
  luggage: string;
  price_per_km: number;
  image: string;
  description: string;
  is_popular: boolean;
}

function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    "business" | "statements" | "daily_expenses" | "drivers" | "enquiries" | "packages" | "vehicles" | "storage"
  >("business");

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packagesList, setPackagesList] = useState<TourPackageItem[]>([]);
  const [vehiclesList, setVehiclesList] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // New & Edit Package Modal / Form state
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPkg, setEditingPkg] = useState<TourPackageItem | null>(null);
  const [newPkg, setNewPkg] = useState({
    slug: "",
    title: "",
    duration: "3 Days · 2 Nights",
    from_city: "Bengaluru",
    starting_price: 12000,
    summary: "",
    image: "",
  });

  // New & Edit Vehicle Modal / Form state
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [editingVeh, setEditingVeh] = useState<VehicleItem | null>(null);
  const [newVeh, setNewVeh] = useState({
    slug: "",
    name: "",
    category: "Sedan",
    seats: 4,
    luggage: "2 bags",
    price_per_km: 14,
    description: "",
    image: "",
  });

  // Storage Upload state
  const [uploadBucket, setUploadBucket] = useState("images");
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enqRes, pkgRes, vehRes] = await Promise.all([
        fetch("/api/enquiries"),
        fetch("/api/packages"),
        fetch("/api/vehicles"),
      ]);

      if (enqRes.ok) {
        const d = await enqRes.json();
        if (d.success) setEnquiries(d.enquiries || []);
      }
      if (pkgRes.ok) {
        const d = await pkgRes.json();
        if (d.success) setPackagesList(d.packages || []);
      }
      if (vehRes.ok) {
        const d = await vehRes.json();
        if (d.success) setVehiclesList(d.vehicles || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load PostgreSQL database records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(`Enquiry marked as ${newStatus}`);
        setEnquiries((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)),
        );
      } else {
        toast.error(d.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating status");
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        toast.success("Enquiry deleted from PostgreSQL");
        setEnquiries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete enquiry");
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkg.title || !newPkg.slug) {
      toast.error("Title and slug are required");
      return;
    }
    const isEditing = Boolean(editingPkg?.id);
    try {
      const res = await fetch("/api/packages", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: editingPkg!.id, ...newPkg } : newPkg),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(
          isEditing
            ? "Tour Package updated in PostgreSQL!"
            : "New Tour Package saved to PostgreSQL database!",
        );
        if (isEditing) {
          setPackagesList((prev) =>
            prev.map((p) => (String(p.id) === String(editingPkg!.id) ? d.package : p)),
          );
        } else {
          setPackagesList([d.package, ...packagesList]);
        }
        setShowPackageForm(false);
        setEditingPkg(null);
        setNewPkg({
          slug: "",
          title: "",
          duration: "3 Days · 2 Nights",
          from_city: "Bengaluru",
          starting_price: 12000,
          summary: "",
          image: "",
        });
      } else {
        toast.error(d.error || "Failed to save package");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving package");
    }
  };

  const handleEditPackageClick = (pkg: TourPackageItem) => {
    setEditingPkg(pkg);
    setNewPkg({
      slug: pkg.slug || "",
      title: pkg.title || "",
      duration: pkg.duration || "3 Days · 2 Nights",
      from_city: pkg.from_city || "Bengaluru",
      starting_price: pkg.starting_price || 0,
      summary: pkg.summary || "",
      image: pkg.image || "",
    });
    setShowPackageForm(true);
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Delete this tour package from PostgreSQL?")) return;
    try {
      const res = await fetch(`/api/packages?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        toast.success("Package deleted");
        setPackagesList((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting package");
    }
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVeh.name || !newVeh.slug) {
      toast.error("Name and slug are required");
      return;
    }
    const isEditing = Boolean(editingVeh?.id);
    try {
      const res = await fetch("/api/vehicles", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: editingVeh!.id, ...newVeh } : newVeh),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(
          isEditing
            ? "Vehicle updated in PostgreSQL!"
            : "New Vehicle saved to PostgreSQL database!",
        );
        if (isEditing) {
          setVehiclesList((prev) =>
            prev.map((v) => (String(v.id) === String(editingVeh!.id) ? d.vehicle : v)),
          );
        } else {
          setVehiclesList([d.vehicle, ...vehiclesList]);
        }
        setShowVehicleForm(false);
        setEditingVeh(null);
        setNewVeh({
          slug: "",
          name: "",
          category: "Sedan",
          seats: 4,
          luggage: "2 bags",
          price_per_km: 14,
          description: "",
          image: "",
        });
      } else {
        toast.error(d.error || "Failed to save vehicle");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving vehicle");
    }
  };

  const handleEditVehicleClick = (veh: VehicleItem) => {
    setEditingVeh(veh);
    setNewVeh({
      slug: veh.slug || "",
      name: veh.name || "",
      category: veh.category || "Sedan",
      seats: veh.seats || 4,
      luggage: veh.luggage || "2 bags",
      price_per_km: veh.price_per_km || 14,
      description: veh.description || "",
      image: veh.image || "",
    });
    setShowVehicleForm(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Delete vehicle from PostgreSQL?")) return;
    try {
      const res = await fetch(`/api/vehicles?id=${id}`, { method: "DELETE" });
      const d = await res.json();
      if (d.success) {
        toast.success("Vehicle deleted");
        setVehiclesList((prev) => prev.filter((v) => v.id !== id));
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting vehicle");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", uploadBucket);

    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });
      const d = await res.json();
      if (d.success) {
        toast.success("Image uploaded & saved to PostgreSQL storage BYTEA table!");
        setUploadedUrl(d.file.url);
      } else {
        toast.error(d.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file to PostgreSQL");
    } finally {
      setIsUploading(false);
    }
  };

  const filteredEnquiries = enquiries.filter(
    (e) => filterStatus === "All" || e.status === filterStatus,
  );

  const stats = [
    {
      label: "Total Enquiries",
      value: enquiries.length.toString(),
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "New Leads",
      value: enquiries.filter((e) => e.status === "New").length.toString(),
      icon: Clock,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Active Tour Packages",
      value: packagesList.length.toString(),
      icon: Package,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Fleet Vehicles",
      value: vehiclesList.length.toString(),
      icon: Car,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <SiteLayout transparentHeader>
      <PageHero
        eyebrow="FORTUNE TOURISM · OPERATIONAL DASHBOARD"
        title="Fortune Tourism Admin Operations"
        blurb="Complete administration portal for managing customer enquiries, tour packages, fleet vehicles, driver accounts, and business operations."
      />

      <section className="py-10 bg-slate-50/50 min-h-screen">
        <div className="container-fortune">
          {/* Status badge & refresh button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Connected: Fortune Tourism Admin (Live & Operational)
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh Operations Data
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-white p-5 shadow-sm flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {s.label}
                    </p>
                    <p className="mt-1 font-heading text-3xl text-[color:var(--color-navy)] font-bold">
                      {s.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${s.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-6 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("business")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "business"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <ClipboardList className="h-4 w-4" /> Business Records
            </button>
            <button
              onClick={() => setActiveTab("statements")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "statements"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileSpreadsheet className="h-4 w-4 text-amber-600" /> Client Statements
            </button>
            <button
              onClick={() => setActiveTab("daily_expenses")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "daily_expenses"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingDown className="h-4 w-4 text-red-600" /> Daily Expense Report
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "drivers"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCog className="h-4 w-4" /> Driver Accounts
            </button>
            <button
              onClick={() => setActiveTab("enquiries")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "enquiries"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" /> Customer Enquiries ({enquiries.length})
            </button>
            <button
              onClick={() => setActiveTab("packages")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "packages"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="h-4 w-4" /> Tour Packages ({packagesList.length})
            </button>
            <button
              onClick={() => setActiveTab("vehicles")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "vehicles"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Car className="h-4 w-4" /> Fleet Vehicles ({vehiclesList.length})
            </button>
            <button
              onClick={() => setActiveTab("storage")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "storage"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <HardDrive className="h-4 w-4" /> File Storage & Assets
            </button>
          </div>

          {/* TAB 0: BUSINESS RECORDS */}
          {activeTab === "business" && <BusinessDashboard />}

          {/* TAB 0.2: CLIENT STATEMENTS */}
          {activeTab === "statements" && <ClientStatementsManager />}

          {/* TAB 0.3: DAILY EXPENSE REPORT */}
          {activeTab === "daily_expenses" && <DailyExpenseReport />}

          {/* TAB 0.5: DRIVER ACCOUNTS */}
          {activeTab === "drivers" && (
            <div>
              <ResourceManager resource={BUSINESS_RESOURCES["drivers"]} />
            </div>
          )}

          {/* TAB 1: ENQUIRIES */}
          {activeTab === "enquiries" && (
            <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border p-5 gap-3 bg-slate-50/50">
                <h2 className="font-heading text-lg font-bold">Customer Enquiries</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase text-muted-foreground">
                    Filter status:
                  </span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium"
                  >
                    <option>All</option>
                    <option>New</option>
                    <option>Quoted</option>
                    <option>Confirmed</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                  Loading customer enquiries...
                </div>
              ) : filteredEnquiries.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-sm">
                  No enquiries found for status "{filterStatus}".
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100/70 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Service & Route</th>
                        <th className="px-5 py-3">Travel Date</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-5 py-4 font-semibold text-foreground">
                            {e.name}
                            {e.notes && (
                              <p className="text-xs text-muted-foreground font-normal mt-0.5 max-w-xs truncate">
                                {e.notes}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-slate-700">
                            {e.phone}
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-medium text-xs rounded bg-slate-100 px-2 py-0.5">
                              {e.service}
                            </span>
                            {(e.pickup || e.destination) && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {e.pickup || "Any"} → {e.destination || "Any"}
                              </p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs text-muted-foreground">
                            {e.travel_date || "Not specified"}
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={
                                "rounded-full px-2.5 py-1 text-xs font-semibold " +
                                (e.status === "New"
                                  ? "bg-amber-100 text-amber-800"
                                  : e.status === "Quoted"
                                    ? "bg-blue-100 text-blue-800"
                                    : e.status === "Confirmed"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-slate-100 text-slate-700")
                              }
                            >
                              {e.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              {e.status !== "Quoted" && (
                                <button
                                  onClick={() => handleUpdateStatus(e.id, "Quoted")}
                                  className="px-2 py-1 text-xs font-medium rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
                                >
                                  Quote
                                </button>
                              )}
                              {e.status !== "Confirmed" && (
                                <button
                                  onClick={() => handleUpdateStatus(e.id, "Confirmed")}
                                  className="px-2 py-1 text-xs font-medium rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                >
                                  Confirm
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteEnquiry(e.id)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PACKAGES */}
          {activeTab === "packages" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold">Tour Packages ({packagesList.length})</h2>
                <button
                  onClick={() => {
                    setEditingPkg(null);
                    setNewPkg({
                      slug: "",
                      title: "",
                      duration: "3 Days · 2 Nights",
                      from_city: "Bengaluru",
                      starting_price: 12000,
                      summary: "",
                      image: "",
                    });
                    setShowPackageForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-navy)] px-4 py-2 text-xs font-semibold text-white shadow transition hover:brightness-110"
                >
                  <Plus className="h-4 w-4" /> Add New Package
                </button>
              </div>

              {/* Add / Edit Package Form Modal */}
              {showPackageForm && (
                <form
                  onSubmit={handleSavePackage}
                  className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-md grid gap-4 sm:grid-cols-2"
                >
                  <h3 className="sm:col-span-2 font-heading font-bold text-base border-b pb-2">
                    {editingPkg ? `Edit Package: ${editingPkg.title}` : "Add New Tour Package"}
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Title *
                    </label>
                    <input
                      value={newPkg.title}
                      onChange={(e) =>
                        setNewPkg({
                          ...newPkg,
                          title: e.target.value,
                          slug: editingPkg
                            ? newPkg.slug
                            : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      placeholder="e.g. Bengaluru → Coorg Hill Station"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Slug *
                    </label>
                    <input
                      value={newPkg.slug}
                      onChange={(e) => setNewPkg({ ...newPkg, slug: e.target.value })}
                      placeholder="e.g. bengaluru-coorg-hill-station"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Duration
                    </label>
                    <input
                      value={newPkg.duration}
                      onChange={(e) => setNewPkg({ ...newPkg, duration: e.target.value })}
                      placeholder="3 Days · 2 Nights"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Starting Price (₹)
                    </label>
                    <input
                      type="number"
                      value={newPkg.starting_price}
                      onChange={(e) =>
                        setNewPkg({ ...newPkg, starting_price: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Origin City
                    </label>
                    <input
                      value={newPkg.from_city}
                      onChange={(e) => setNewPkg({ ...newPkg, from_city: e.target.value })}
                      placeholder="Bengaluru"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Image URL or Storage Path
                    </label>
                    <input
                      value={newPkg.image}
                      onChange={(e) => setNewPkg({ ...newPkg, image: e.target.value })}
                      placeholder="/images/packages/coorg.jpg or /api/storage/files/..."
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Summary
                    </label>
                    <textarea
                      rows={3}
                      value={newPkg.summary}
                      onChange={(e) => setNewPkg({ ...newPkg, summary: e.target.value })}
                      placeholder="Brief overview of the tour package"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPackageForm(false);
                        setEditingPkg(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold border rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow"
                    >
                      {editingPkg ? "Update Package" : "Save to PostgreSQL"}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {packagesList.map((pkg) => (
                  <div
                    key={pkg.id || pkg.slug}
                    className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {pkg.duration}
                        </span>
                        <span className="text-sm font-bold text-navy">₹ {pkg.starting_price}</span>
                      </div>
                      <h3 className="mt-3 font-heading text-base font-bold text-foreground">
                        {pkg.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {pkg.summary}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        From {pkg.from_city || "Bengaluru"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditPackageClick(pkg)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="Edit Package"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id!)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          title="Delete Package"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VEHICLES */}
          {activeTab === "vehicles" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold">Fleet Vehicles ({vehiclesList.length})</h2>
                <button
                  onClick={() => {
                    setEditingVeh(null);
                    setNewVeh({
                      slug: "",
                      name: "",
                      category: "Sedan",
                      seats: 4,
                      luggage: "2 bags",
                      price_per_km: 14,
                      description: "",
                      image: "",
                    });
                    setShowVehicleForm(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-navy)] px-4 py-2 text-xs font-semibold text-white shadow transition hover:brightness-110"
                >
                  <Plus className="h-4 w-4" /> Add New Vehicle
                </button>
              </div>

              {/* Add / Edit Vehicle Form Modal */}
              {showVehicleForm && (
                <form
                  onSubmit={handleSaveVehicle}
                  className="mb-6 rounded-2xl border border-border bg-white p-6 shadow-md grid gap-4 sm:grid-cols-2"
                >
                  <h3 className="sm:col-span-2 font-heading font-bold text-base border-b pb-2">
                    {editingVeh ? `Edit Vehicle: ${editingVeh.name}` : "Add New Vehicle to Fleet"}
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Vehicle Name *
                    </label>
                    <input
                      value={newVeh.name}
                      onChange={(e) =>
                        setNewVeh({
                          ...newVeh,
                          name: e.target.value,
                          slug: editingVeh
                            ? newVeh.slug
                            : e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                        })
                      }
                      placeholder="e.g. Toyota Hyryder Hybrid"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Slug *
                    </label>
                    <input
                      value={newVeh.slug}
                      onChange={(e) => setNewVeh({ ...newVeh, slug: e.target.value })}
                      placeholder="e.g. toyota-hyryder"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Category
                    </label>
                    <select
                      value={newVeh.category}
                      onChange={(e) => setNewVeh({ ...newVeh, category: e.target.value })}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    >
                      <option>Hatchback</option>
                      <option>Sedan</option>
                      <option>Premium Sedan</option>
                      <option>SUV</option>
                      <option>Innova</option>
                      <option>Innova Crysta</option>
                      <option>Tempo Traveller</option>
                      <option>Mini Bus</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Seats
                    </label>
                    <input
                      type="number"
                      value={newVeh.seats}
                      onChange={(e) => setNewVeh({ ...newVeh, seats: Number(e.target.value) })}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Price / km (₹)
                    </label>
                    <input
                      type="number"
                      value={newVeh.price_per_km}
                      onChange={(e) =>
                        setNewVeh({ ...newVeh, price_per_km: Number(e.target.value) })
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Image URL or Storage Path
                    </label>
                    <input
                      value={newVeh.image}
                      onChange={(e) => setNewVeh({ ...newVeh, image: e.target.value })}
                      placeholder="/images/fleet/car-sedan.jpg or /api/storage/files/..."
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={newVeh.description}
                      onChange={(e) => setNewVeh({ ...newVeh, description: e.target.value })}
                      placeholder="Vehicle features and comfort description"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowVehicleForm(false);
                        setEditingVeh(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold border rounded-lg hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow"
                    >
                      {editingVeh ? "Update Vehicle" : "Save to PostgreSQL"}
                    </button>
                  </div>
                </form>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {vehiclesList.map((v) => (
                  <div
                    key={v.id || v.slug}
                    className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      {v.image && (
                        <img
                          src={v.image}
                          alt={v.name}
                          className="h-36 w-full object-cover rounded-xl mb-3 border border-slate-100 bg-slate-50"
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          {v.category}
                        </span>
                        <span className="text-sm font-bold text-navy">₹ {v.price_per_km} / km</span>
                      </div>
                      <h3 className="mt-3 font-heading text-base font-bold text-foreground">
                        {v.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {v.seats} Seater · {v.luggage || "Luggage space"}
                      </p>
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2">{v.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-slate-500">Slug: {v.slug}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditVehicleClick(v)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                          title="Edit Vehicle"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteVehicle(v.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          title="Delete Vehicle"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FILE STORAGE ENGINE */}
          {activeTab === "storage" && (
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h2 className="font-heading text-lg font-bold mb-2">
                File Storage & Asset Management
              </h2>
              <p className="text-xs text-muted-foreground mb-6">
                Upload vehicle images, package banners, driver documents, or PDF receipts to cloud asset storage. Images are stored securely and served via fast HTTP streaming endpoints.
              </p>

              <div className="max-w-xl rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50/50">
                <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                <p className="text-sm font-semibold text-slate-700">Upload Image / Asset</p>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Select file to upload to asset store
                </p>

                <div className="flex justify-center gap-3 mb-4">
                  <select
                    value={uploadBucket}
                    onChange={(e) => setUploadBucket(e.target.value)}
                    className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium"
                  >
                    <option value="images">Bucket: images</option>
                    <option value="packages">Bucket: packages</option>
                    <option value="vehicles">Bucket: vehicles</option>
                  </select>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--color-navy)] px-5 py-2.5 text-xs font-semibold text-white shadow transition hover:brightness-110 disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Choose File to Upload"}
                </button>

                {uploadedUrl && (
                  <div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-left">
                    <p className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-emerald-600" /> File Uploaded Successfully!
                    </p>
                    <p className="text-xs text-slate-600 mt-1 font-mono break-all">{uploadedUrl}</p>
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                    >
                      Open Streamed Image <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
