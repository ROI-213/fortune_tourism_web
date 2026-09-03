import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { BusinessDashboard } from "@/components/business/BusinessDashboard";
import { ResourceManager } from "@/components/business/ResourceManager";
import { ClientStatementsManager } from "@/components/business/ClientStatementsManager";
import { DailyExpenseReport } from "@/components/business/DailyExpenseReport";
import { DayBookingsManager, BookingListManager, PendingPaymentsManager } from "@/components/admin/BookingManager";
import { BookingsManager } from "@/components/admin/BookingsManager";
import { PaymentHistoryManager } from "@/components/admin/PaymentHistoryManager";
import { HotelAdminManager } from "@/components/admin/HotelAdminManager";
import { RechargeAdminManager } from "@/components/admin/RechargeAdminManager";
import { BillPaymentAdminManager } from "@/components/admin/BillPaymentAdminManager";
import { AccountsReportsHub, type AccountReportKey, REPORT_DEFINITIONS } from "@/components/admin/AccountsReportsHub";
import logoAsset from "@/assets/fortune-tourism-logo.png";
import keralaHeroImg from "@/assets/kerala-hero.jpg";
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
  CheckCircle2,
  Clock,
  Upload,
  ExternalLink,
  ShieldCheck,
  ClipboardList,
  UserCog,
  Pencil,
  FileSpreadsheet,
  TrendingDown,
  CalendarDays,
  List,
  IndianRupee,
  Bus,
  TrainFront,
  Plane,
  Hotel,
  Smartphone,
  Receipt,
  Ticket,
  ChevronDown,
  AlertCircle,
  History,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Shield,
  Search,
  PhoneCall,
  MessageSquare,
  Home,
  CreditCard,
  TrendingUp,
  Wallet,
  Zap,
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
  enquiry_number?: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  service: string;
  pickup?: string;
  destination?: string;
  travel_date?: string;
  pickup_time?: string;
  passengers?: string;
  notes?: string;
  status: string;
  source?: string;
  trip_type?: string;
  vehicle_name?: string;
  car_type?: string;
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
  type ServiceNavKey =
    | "home"
    | "flight"
    | "bus"
    | "train"
    | "cars"
    | "hotel"
    | "packages"
    | "accounts"
    | "recharge"
    | "bill_payment";
  const [activeService, setActiveService] = useState<ServiceNavKey>("home");
  const [bookingDropdownOpen, setBookingDropdownOpen] = useState(false);
  const bookingDropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterBooking = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setBookingDropdownOpen(true);
  };

  const handleMouseLeaveBooking = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setBookingDropdownOpen(false);
    }, 250);
  };

  const handleToggleBookingDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setBookingDropdownOpen((prev) => !prev);
  };

  const handleSelectBookingOption = (key: ServiceNavKey) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveService(key);
    setBookingDropdownOpen(false);
  };

  // Accounts Dropdown states & handlers
  const [accountsDropdownOpen, setAccountsDropdownOpen] = useState(false);
  const accountsDropdownRef = useRef<HTMLDivElement>(null);
  const accountsHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [activeAccountReport, setActiveAccountReport] = useState<AccountReportKey>("reports");

  const handleMouseEnterAccounts = () => {
    if (accountsHoverTimeoutRef.current) {
      clearTimeout(accountsHoverTimeoutRef.current);
      accountsHoverTimeoutRef.current = null;
    }
    setAccountsDropdownOpen(true);
  };

  const handleMouseLeaveAccounts = () => {
    accountsHoverTimeoutRef.current = setTimeout(() => {
      setAccountsDropdownOpen(false);
    }, 250);
  };

  const handleToggleAccountsDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (accountsHoverTimeoutRef.current) {
      clearTimeout(accountsHoverTimeoutRef.current);
      accountsHoverTimeoutRef.current = null;
    }
    setAccountsDropdownOpen((prev) => !prev);
  };

  const handleSelectAccountOption = (reportKey: AccountReportKey) => {
    if (accountsHoverTimeoutRef.current) {
      clearTimeout(accountsHoverTimeoutRef.current);
      accountsHoverTimeoutRef.current = null;
    }
    setActiveAccountReport(reportKey);
    setActiveService("accounts");
    setAccountsDropdownOpen(false);
  };

  const [accountsTab, setAccountsTab] = useState<
    "business" | "statements" | "daily_expenses" | "payment_history" | "pending_payments"
  >("business");

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bookingDropdownRef.current && !bookingDropdownRef.current.contains(event.target as Node)) {
        setBookingDropdownOpen(false);
      }
      if (accountsDropdownRef.current && !accountsDropdownRef.current.contains(event.target as Node)) {
        setAccountsDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setBookingDropdownOpen(false);
        setAccountsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (accountsHoverTimeoutRef.current) {
        clearTimeout(accountsHoverTimeoutRef.current);
      }
    };
  }, []);

  const [activeTab, setActiveTab] = useState<
    "bookings" | "business" | "statements" | "daily_expenses" | "drivers" | "enquiries" | "packages" | "vehicles" | "storage" | "day_bookings" | "all_bookings" | "pending_payments" | "payment_history"
  >("business");

  // Admin Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [adminUser, setAdminUser] = useState<{ email?: string; role?: string; name?: string } | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [loginEmail, setLoginEmail] = useState("adminfortunetourism@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packagesList, setPackagesList] = useState<TourPackageItem[]>([]);
  const [vehiclesList, setVehiclesList] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterSource, setFilterSource] = useState<string>("All");
  const [enquirySearch, setEnquirySearch] = useState<string>("");

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

  // Booking Stats state
  const [bookingStats, setBookingStats] = useState({
    todayRevenue: 0,
    todayAdvanceCollected: 0,
    todayPending: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    pendingPayments: 0,
    fullyPaid: 0,
    partiallyPaid: 0,
    cancelled: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    taxiBookings: 0,
    busBookings: 0,
    trainBookings: 0,
    flightBookings: 0,
    ticketsPending: 0,
    pendingEnquiries: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const adminKey = sessionStorage.getItem("fortune_admin_key") || localStorage.getItem("fortune_admin_key") || "";
      const headers: Record<string, string> = {
        "x-admin-key": adminKey,
      };

      const [enqRes, pkgRes, vehRes, statsRes] = await Promise.all([
        fetch("/api/enquiries", { headers }),
        fetch("/api/packages", { headers }),
        fetch("/api/vehicles", { headers }),
        fetch("/api/bookings/stats", { headers }),
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
      if (statsRes.ok) {
        const d = await statsRes.json();
        if (d.success) setBookingStats(d.stats);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load PostgreSQL database records");
    } finally {
      setLoading(false);
    }
  };

  // Check login on mount
  useEffect(() => {
    const key = sessionStorage.getItem("fortune_admin_key") || localStorage.getItem("fortune_admin_key");
    const authStr = sessionStorage.getItem("fortune_admin_auth") || localStorage.getItem("fortune_admin_auth");

    if (key === "Admin@fortunetourism2026") {
      setIsAuthenticated(true);
      if (authStr) {
        try {
          setAdminUser(JSON.parse(authStr));
        } catch {
          setAdminUser({ email: "adminfortunetourism@gmail.com", name: "Administrator" });
        }
      } else {
        setAdminUser({ email: "adminfortunetourism@gmail.com", name: "Administrator" });
      }
      fetchData();
    }
    setAuthChecking(false);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const email = loginEmail.trim();
    const password = loginPassword.trim();

    if (!email || !password) {
      setLoginError("Please enter both User ID/Email and Password.");
      toast.error("Please fill in all fields.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Signed in successfully to Fortune Tourism Admin!");
        sessionStorage.setItem("fortune_admin_key", data.admin_key);
        sessionStorage.setItem("fortune_admin_auth", JSON.stringify(data.user));
        localStorage.setItem("fortune_admin_key", data.admin_key);
        localStorage.setItem("fortune_admin_auth", JSON.stringify(data.user));
        setAdminUser(data.user);
        setIsAuthenticated(true);
        fetchData();
      } else {
        setLoginError(data.error || "Invalid login credentials.");
        toast.error(data.error || "Invalid Email or Password");
      }
    } catch (err: any) {
      console.error("Admin login error:", err);
      setLoginError("Connection failed. Please check your network and try again.");
      toast.error("Login failed. Please check network connection.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("fortune_admin_key");
    sessionStorage.removeItem("fortune_admin_auth");
    localStorage.removeItem("fortune_admin_key");
    localStorage.removeItem("fortune_admin_auth");
    setIsAuthenticated(false);
    setAdminUser(null);
    setLoginPassword("");
    toast.info("Logged out of Admin Portal.");
  };

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

  const filteredEnquiries = enquiries.filter((e) => {
    const statusNormalized = (e.status || "NEW").toUpperCase();
    const matchesStatus =
      filterStatus === "All" ||
      statusNormalized === filterStatus.toUpperCase() ||
      (filterStatus === "New" && (statusNormalized === "NEW" || statusNormalized === "PENDING"));

    const sourceVal = e.source || "HOME_BANNER_ENQUIRY";
    const matchesSource =
      filterSource === "All" ||
      (filterSource === "Home Banner" && (sourceVal === "HOME_BANNER_ENQUIRY" || !e.source)) ||
      (filterSource === "Website Booking" && sourceVal === "WEBSITE");

    const q = enquirySearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      e.name?.toLowerCase().includes(q) ||
      e.phone?.toLowerCase().includes(q) ||
      e.email?.toLowerCase().includes(q) ||
      e.enquiry_number?.toLowerCase().includes(q) ||
      e.pickup?.toLowerCase().includes(q) ||
      e.destination?.toLowerCase().includes(q) ||
      e.service?.toLowerCase().includes(q) ||
      e.notes?.toLowerCase().includes(q);

    return matchesStatus && matchesSource && matchesSearch;
  });

  const stats = [
    {
      label: "Total Revenue Today",
      value: `₹${Number(bookingStats.todayRevenue || 0).toLocaleString("en-IN")}`,
      subtext: "Today's Bookings Value",
      icon: TrendingUp,
      color: "text-emerald-700 bg-emerald-50",
      highlight: true,
      onClick: () => setActiveTab("day_bookings"),
    },
    {
      label: "Advance Collected Today",
      value: `₹${Number(bookingStats.todayAdvanceCollected || 0).toLocaleString("en-IN")}`,
      subtext: "Received Transactions",
      icon: CreditCard,
      color: "text-blue-700 bg-blue-50",
      highlight: true,
      onClick: () => setActiveTab("payment_history"),
    },
    {
      label: "Pending Today",
      value: `₹${Number(bookingStats.todayPending || 0).toLocaleString("en-IN")}`,
      subtext: "Remaining Unpaid Balance",
      icon: IndianRupee,
      color: "text-rose-700 bg-rose-50",
      highlight: true,
      onClick: () => setActiveTab("pending_payments"),
    },
    {
      label: "Today's Bookings",
      value: bookingStats.todayBookings.toString(),
      subtext: "Trips & Day Bookings",
      icon: CalendarDays,
      color: "text-sky-600 bg-sky-50",
      onClick: () => setActiveTab("day_bookings"),
    },
    {
      label: "Taxi Bookings",
      value: bookingStats.taxiBookings.toString(),
      icon: Car,
      color: "text-amber-600 bg-amber-50",
      onClick: () => setActiveTab("bookings"),
    },
    {
      label: "Bus Bookings",
      value: bookingStats.busBookings.toString(),
      icon: Bus,
      color: "text-orange-600 bg-orange-50",
      onClick: () => setActiveTab("bookings"),
    },
    {
      label: "Train Bookings",
      value: bookingStats.trainBookings.toString(),
      icon: TrainFront,
      color: "text-indigo-600 bg-indigo-50",
      onClick: () => setActiveTab("bookings"),
    },
    {
      label: "Flight Bookings",
      value: bookingStats.flightBookings.toString(),
      icon: Plane,
      color: "text-blue-600 bg-blue-50",
      onClick: () => setActiveTab("bookings"),
    },
    {
      label: "Pending Enquiries",
      value: bookingStats.pendingEnquiries.toString(),
      icon: AlertCircle,
      color: "text-red-600 bg-red-50",
      onClick: () => setActiveTab("bookings"),
    },
    {
      label: "Tickets Pending",
      value: bookingStats.ticketsPending.toString(),
      icon: Ticket,
      color: "text-yellow-600 bg-yellow-50",
      onClick: () => setActiveTab("bookings"),
    },
    {
      label: "Remaining Payments",
      value: bookingStats.pendingPayments.toString(),
      icon: IndianRupee,
      color: "text-rose-600 bg-rose-50",
      onClick: () => setActiveTab("pending_payments"),
    },
    {
      label: "Fully Paid",
      value: bookingStats.fullyPaid.toString(),
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50",
      onClick: () => setActiveTab("all_bookings"),
    },
    {
      label: "Total Revenue (All Time)",
      value: `₹${Number(bookingStats.totalRevenue || 0).toLocaleString("en-IN")}`,
      subtext: "Net Lifetime Collections",
      icon: TrendingDown,
      color: "text-green-600 bg-green-50",
      onClick: () => setActiveTab("payment_history"),
    },
    {
      label: "Total Bookings",
      value: bookingStats.totalBookings.toString(),
      icon: ClipboardList,
      color: "text-purple-600 bg-purple-50",
      onClick: () => setActiveTab("all_bookings"),
    },
    {
      label: "New Enquiries",
      value: enquiries.filter((e) => (e.status || "").toUpperCase() === "NEW").length.toString(),
      icon: Users,
      color: "text-teal-600 bg-teal-50",
      onClick: () => setActiveTab("enquiries"),
    },
  ];

  if (authChecking) {
    return (
      <SiteLayout transparentHeader>
        <div className="min-h-[75vh] flex flex-col items-center justify-center py-20 bg-slate-50">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-600">Verifying Admin Authorization...</p>
        </div>
      </SiteLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <SiteLayout transparentHeader>
        {/* Top Half: Clean White Header Section */}
        <section className="relative overflow-hidden bg-white border-b border-slate-200/80 text-slate-900 py-10 sm:py-12 flex items-center justify-center shadow-xs">
          <div className="relative container-fortune flex items-center justify-center text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4.5">
              <img
                src={logoAsset}
                alt="Fortune Tourism Logo"
                className="h-12 sm:h-14 w-auto object-contain rounded-xl shadow-sm shrink-0"
              />
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">
                <span className="text-slate-900">Fortune </span>
                <span className="text-amber-600">Tourism</span>
              </h1>
            </div>
          </div>
        </section>

        {/* Bottom Half: Kerala Background Section with Words Content & Login Card */}
        <section className="relative overflow-hidden py-14 sm:py-18 px-4 min-h-[75vh] flex flex-col items-center justify-center">
          {/* Panoramic Kerala Background applied ONLY to this bottom half */}
          <div className="absolute inset-0 z-0">
            <img
              src={keralaHeroImg}
              alt="Explore Kerala - God's Own Country"
              className="w-full h-full object-cover object-center"
            />
            {/* Cinematic Gradient Overlays for high contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329]/95 via-[#0b1329]/75 to-[#0b1329]/85" />
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]" />
          </div>

          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
            {/* Words Content: EXPLORE */}
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.35em] text-amber-300/95 drop-shadow">
              EXPLORE
            </p>

            {/* Words Content: KERALA */}
            <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-white uppercase drop-shadow-2xl leading-none my-1">
              KERALA
            </h2>

            {/* Words Content: GOD'S OWN COUNTRY with decorative lines */}
            <div className="flex items-center justify-center gap-3 w-full max-w-sm sm:max-w-md my-1">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-400/80 to-amber-400 flex-1" />
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-amber-300 whitespace-nowrap drop-shadow">
                GOD&apos;S OWN COUNTRY.
              </p>
              <div className="h-px bg-gradient-to-r from-amber-400 via-amber-400/80 to-transparent flex-1" />
            </div>

            {/* Words Content: Quote */}
            <p className="max-w-xl text-xs sm:text-sm text-slate-200 italic font-serif leading-relaxed px-4 drop-shadow-md mb-6">
              &ldquo;Backwaters, misty hills and coconut coasts &mdash; where nature slows time down.&rdquo;
            </p>

            {/* Login Credentials Card */}
            <div className="w-full max-w-md bg-white/95 backdrop-blur-md border border-white/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-left">
              {loginError && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="font-medium leading-relaxed">{loginError}</div>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    User ID / Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="adminfortunetourism@gmail.com"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                  >
                    {loginLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" /> Sign In to Admin Operations
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center space-y-1">
                <div className="text-[11px] text-slate-400">
                  Authorized Personnel Only · Fortune Tourism &copy; 2026
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  adminfortunetourism@gmail.com
                </div>
              </div>
            </div>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const totalBookingCount =
    (bookingStats.flightBookings || 0) +
    (bookingStats.busBookings || 0) +
    (bookingStats.trainBookings || 0) +
    (bookingStats.taxiBookings || 0);

  const isBookingActive = ["flight", "bus", "train", "cars"].includes(activeService);

  const bookingDropdownItems = [
    { key: "flight" as const, label: "Flight", icon: Plane, count: bookingStats.flightBookings },
    { key: "bus" as const, label: "Bus", icon: Bus, count: bookingStats.busBookings },
    { key: "train" as const, label: "Train", icon: TrainFront, count: bookingStats.trainBookings },
    { key: "cars" as const, label: "Cars", icon: Car, count: bookingStats.taxiBookings },
  ];

  return (
    <SiteLayout transparentHeader hideFooter>
      {/* First Navigation Bar - Sticky Admin Header */}
      <header className="sticky top-0 z-50 w-full bg-[#0b1329] border-b border-slate-800 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-11 sm:h-12">
            {/* Left empty slot to preserve balance */}
            <div className="w-16 sm:w-20 shrink-0" aria-hidden="true" />

            {/* Exact Horizontal Centre: Logo + Welcome to Fortune Tourism + Subtitle */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-2.5 min-w-0 max-w-[calc(100%-110px)] sm:max-w-[calc(100%-160px)]">
              <button
                type="button"
                onClick={() => setActiveService("home")}
                className="shrink-0 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg p-0.5 transition"
                title="Fortune Tourism Admin Home"
              >
                <img
                  src={logoAsset}
                  alt="Fortune Tourism Logo"
                  className="h-6 sm:h-7 w-auto object-contain rounded-md"
                />
              </button>
              <div className="min-w-0 text-center sm:text-left">
                <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight truncate flex items-center gap-1 sm:gap-1.5 justify-center sm:justify-start">
                  <span className="font-semibold text-slate-300">Welcome to</span>
                  <span className="text-amber-400 font-black">Fortune Tourism</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:block font-medium truncate leading-tight">
                  Live Operations, Booking Lifecycle &amp; Utility Services
                </p>
              </div>
            </div>

            {/* Right: Sign Out Button */}
            <div className="flex items-center shrink-0 z-10">
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 sm:gap-1.5 rounded-lg border border-red-900/40 bg-red-950/50 hover:bg-red-900/70 text-red-300 hover:text-red-100 px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-extrabold shadow-xs transition-all cursor-pointer focus:ring-2 focus:ring-red-400"
                title="Sign out of Admin Portal"
              >
                <LogOut className="h-3.5 w-3.5 text-red-400" />
                <span className="hidden xs:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Second Navigation Bar - Sticky Service Management Menu */}
      <nav className="sticky top-11 sm:top-12 z-40 w-full bg-[#0f1b3d] border-b border-slate-800/90 shadow-sm backdrop-blur-md overflow-visible">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 overflow-visible">
          <div className="grid grid-cols-5 gap-1 sm:gap-2 py-2 overflow-visible items-center">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => setActiveService("home")}
              className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeService === "home"
                  ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-400 shadow-sm font-extrabold"
                  : "text-slate-300 hover:text-amber-300 hover:bg-slate-800/70 border-b-2 border-transparent"
              }`}
            >
              <Home className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${activeService === "home" ? "text-amber-400 scale-110" : "text-slate-400"}`} />
              <span className="truncate">Home</span>
            </button>

            {/* 2. Booking (with Dropdown) */}
            <div
              ref={bookingDropdownRef}
              className="relative w-full overflow-visible"
              onMouseEnter={handleMouseEnterBooking}
              onMouseLeave={handleMouseLeaveBooking}
            >
              <button
                type="button"
                onClick={handleToggleBookingDropdown}
                className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isBookingActive
                    ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-400 shadow-sm font-extrabold"
                    : "text-slate-300 hover:text-amber-300 hover:bg-slate-800/70 border-b-2 border-transparent"
                }`}
                aria-expanded={bookingDropdownOpen}
                aria-haspopup="true"
              >
                <Ticket className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${isBookingActive ? "text-amber-400 scale-110" : "text-slate-400"}`} />
                <span className="truncate">Booking</span>
                {totalBookingCount > 0 && (
                  <span
                    className={`hidden sm:inline-block text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      isBookingActive ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {totalBookingCount}
                  </span>
                )}
                <ChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform duration-200 ${
                    bookingDropdownOpen ? "rotate-180 text-amber-400" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {bookingDropdownOpen && (
                <div
                  className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full pt-1.5 w-56 sm:w-60 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="rounded-2xl bg-[#0b1329] border border-slate-700/90 shadow-2xl backdrop-blur-xl p-1.5 ring-1 ring-black/40">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
                      Select Booking Service
                    </div>
                    {bookingDropdownItems.map((item) => {
                      const Icon = item.icon;
                      const isItemActive = activeService === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectBookingOption(item.key);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 text-left cursor-pointer ${
                            isItemActive
                              ? "bg-amber-500/20 text-amber-400 font-extrabold border border-amber-400/30"
                              : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 border border-transparent"
                          }`}
                          role="menuitem"
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 shrink-0 ${isItemActive ? "text-amber-400" : "text-slate-400"}`} />
                            <span>{item.label}</span>
                          </div>
                          {item.count !== undefined && item.count > 0 && (
                            <span
                              className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                                isItemActive ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
                              }`}
                            >
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Hotel */}
            <button
              type="button"
              onClick={() => setActiveService("hotel")}
              className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeService === "hotel"
                  ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-400 shadow-sm font-extrabold"
                  : "text-slate-300 hover:text-amber-300 hover:bg-slate-800/70 border-b-2 border-transparent"
              }`}
            >
              <Hotel className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${activeService === "hotel" ? "text-amber-400 scale-110" : "text-slate-400"}`} />
              <span className="truncate">Hotel</span>
            </button>

            {/* 4. Tour Package */}
            <button
              type="button"
              onClick={() => setActiveService("packages")}
              className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeService === "packages"
                  ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-400 shadow-sm font-extrabold"
                  : "text-slate-300 hover:text-amber-300 hover:bg-slate-800/70 border-b-2 border-transparent"
              }`}
            >
              <Package className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${activeService === "packages" ? "text-amber-400 scale-110" : "text-slate-400"}`} />
              <span className="truncate">Tour Package</span>
              {packagesList.length > 0 && (
                <span
                  className={`hidden md:inline-block text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                    activeService === "packages" ? "bg-amber-400 text-slate-950" : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {packagesList.length}
                </span>
              )}
            </button>

            {/* 5. Accounts (with Dropdown) */}
            <div
              ref={accountsDropdownRef}
              className="relative w-full overflow-visible"
              onMouseEnter={handleMouseEnterAccounts}
              onMouseLeave={handleMouseLeaveAccounts}
            >
              <button
                type="button"
                onClick={handleToggleAccountsDropdown}
                className={`w-full flex items-center justify-center gap-1 sm:gap-1.5 px-1 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeService === "accounts"
                    ? "bg-amber-500/20 text-amber-400 border-b-2 border-amber-400 shadow-sm font-extrabold"
                    : "text-slate-300 hover:text-amber-300 hover:bg-slate-800/70 border-b-2 border-transparent"
                }`}
                aria-expanded={accountsDropdownOpen}
                aria-haspopup="true"
              >
                <IndianRupee className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform ${activeService === "accounts" ? "text-amber-400 scale-110" : "text-slate-400"}`} />
                <span className="truncate">Accounts</span>
                <ChevronDown
                  className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform duration-200 ${
                    accountsDropdownOpen ? "rotate-180 text-amber-400" : "text-slate-400"
                  }`}
                />
              </button>

              {/* Accounts Dropdown Menu */}
              {accountsDropdownOpen && (
                <div
                  className="absolute right-0 top-full pt-1.5 w-72 sm:w-80 md:w-[560px] z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                >
                  <div className="rounded-2xl bg-[#0b1329] border border-slate-700/90 shadow-2xl backdrop-blur-xl p-2 ring-1 ring-black/40">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-2 flex items-center justify-between">
                      <span>Accounts &amp; Financial Reports</span>
                      <span className="text-[9px] text-amber-400/80 font-bold hidden sm:inline">10 Specialized Ledgers</span>
                    </div>

                    {/* Desktop: 2-column grid, Mobile: 1-column scrollable */}
                    <div className="max-h-[68vh] overflow-y-auto pr-1 md:grid md:grid-cols-2 gap-1.5 scrollbar-thin">
                      {REPORT_DEFINITIONS.map((r) => {
                        const Icon = r.icon;
                        const isOptActive = activeService === "accounts" && activeAccountReport === r.key;
                        return (
                          <button
                            key={r.key}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAccountOption(r.key);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 text-left cursor-pointer ${
                              isOptActive
                                ? "bg-amber-500/20 text-amber-400 font-extrabold border border-amber-400/40 shadow-xs"
                                : "text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 border border-transparent"
                            }`}
                            role="menuitem"
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isOptActive ? "bg-amber-400/20 text-amber-400" : "bg-slate-800 text-slate-300"
                            }`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs">{r.title}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <section className="py-6 sm:py-8 bg-slate-50/70 min-h-screen">
        <div className="container-fortune">
          {/* Sub-header status bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Live PostgreSQL Connected
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Active View: <span className="font-bold text-amber-700 uppercase">{activeService.replace("_", " ")}</span>
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Auto-synced: {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* HOME SERVICE VIEW: EXISTING FULL DASHBOARD */}
          {activeService === "home" && (
            <>
              {/* Stats Bar */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  onClick={s.onClick}
                  className={`rounded-2xl border bg-white p-5 shadow-xs flex items-center justify-between cursor-pointer hover:shadow-md transition text-left group ${
                    s.highlight ? "border-slate-300 ring-1 ring-slate-200" : "border-border hover:border-slate-300"
                  }`}
                >
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                      {s.label}
                    </p>
                    <p className="mt-1 font-sans text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      {s.value}
                    </p>
                    {s.subtext && (
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.subtext}</p>
                    )}
                  </div>
                  <div className={`p-3.5 rounded-2xl ${s.color} shrink-0`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-border mb-6 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("bookings")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "bookings"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="h-4 w-4" /> Bookings
            </button>
            <button
              onClick={() => setActiveTab("day_bookings")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "day_bookings"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="h-4 w-4" /> Day Booking
            </button>
            <button
              onClick={() => setActiveTab("all_bookings")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "all_bookings"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" /> Bookings ({bookingStats.totalBookings})
            </button>
            <button
              onClick={() => setActiveTab("pending_payments")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "pending_payments"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <IndianRupee className="h-4 w-4 text-rose-600" /> Remaining Payments ({bookingStats.pendingPayments})
            </button>
            <button
              onClick={() => setActiveTab("payment_history")}
              className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === "payment_history"
                  ? "border-[color:var(--color-navy)] text-[color:var(--color-navy)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="h-4 w-4 text-emerald-600" /> Payment History
            </button>
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

          {/* TAB: BOOKINGS & PAYMENTS LIFECYCLE */}
          {activeTab === "bookings" && <BookingsManager />}

          {/* TAB 0: BUSINESS RECORDS */}
          {activeTab === "business" && <BusinessDashboard />}

          {/* TAB: DAY BOOKINGS */}
          {activeTab === "day_bookings" && <DayBookingsManager />}

          {/* TAB: ALL BOOKINGS */}
          {activeTab === "all_bookings" && <BookingListManager />}

          {/* TAB: PENDING / REMAINING PAYMENTS */}
          {activeTab === "pending_payments" && <PendingPaymentsManager />}

          {/* TAB: PAYMENT HISTORY */}
          {activeTab === "payment_history" && <PaymentHistoryManager />}

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
            <div className="space-y-6">
              {/* Summary Header */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-500">Total Enquiries</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{enquiries.length}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-emerald-700">Home Banner Enquiries</p>
                    <p className="text-2xl font-black text-emerald-800 mt-1">
                      {enquiries.filter((e) => e.source === "HOME_BANNER_ENQUIRY" || !e.source).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Home className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white border border-amber-200/80 rounded-2xl p-4 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase text-amber-700">New / Uncontacted</p>
                    <p className="text-2xl font-black text-amber-800 mt-1">
                      {enquiries.filter((e) => (e.status || "").toUpperCase() === "NEW").length}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Table Card */}
              <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between border-b border-border p-4 sm:p-5 gap-3 bg-slate-50/50">
                  <div>
                    <h2 className="font-heading text-lg font-bold text-slate-900">Customer Enquiries ({filteredEnquiries.length})</h2>
                    <p className="text-xs text-slate-500">Live enquiries received from Home Page Quick Enquiry Banner & website forms.</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search name, phone, ref, place..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                      />
                    </div>

                    {/* Source Filter */}
                    <select
                      value={filterSource}
                      onChange={(e) => setFilterSource(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="All">All Sources</option>
                      <option value="Home Banner">Home Banner Enquiry</option>
                      <option value="Website Booking">Website Booking</option>
                    </select>

                    {/* Status Filter */}
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="QUOTED">Quoted</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading customer enquiries...
                  </div>
                ) : filteredEnquiries.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 text-sm">
                    No enquiries found matching the selected filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-100/70 text-left text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-5 py-3">Enquiry Ref & Time</th>
                          <th className="px-5 py-3">Customer Details</th>
                          <th className="px-5 py-3">Service & Route</th>
                          <th className="px-5 py-3">Travel Date</th>
                          <th className="px-5 py-3">Notes & Requirements</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEnquiries.map((e) => {
                          const isHomeBanner = e.source === "HOME_BANNER_ENQUIRY" || !e.source;
                          const waMessage = `Hello ${e.name}! Thank you for your enquiry with Fortune Tourism regarding ${e.service || "Travel"} from ${e.pickup || "your location"} to ${e.destination || "destination"}. How can we assist you with the booking? (Ref: ${e.enquiry_number || e.id.slice(-6)})`;
                          const waUrl = `https://wa.me/${e.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(waMessage)}`;

                          return (
                            <tr key={e.id} className="hover:bg-slate-50/80 transition">
                              {/* Ref & Source */}
                              <td className="px-5 py-4 align-top">
                                <div className="font-mono font-black text-amber-700 text-xs">
                                  {e.enquiry_number || `ENQ-${e.id.slice(-6).toUpperCase()}`}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  {new Date(e.created_at).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                                <div className="mt-1.5">
                                  {isHomeBanner ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                                      <Home className="w-3 h-3 text-emerald-600" /> Home Banner
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold">
                                      🌐 Website Form
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* Customer */}
                              <td className="px-5 py-4 align-top">
                                <div className="font-bold text-slate-900 text-sm">{e.name}</div>
                                <div className="text-xs text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                                  <PhoneCall className="w-3 h-3 text-slate-400" />
                                  <a href={`tel:${e.phone}`} className="hover:text-amber-700 hover:underline">
                                    {e.phone}
                                  </a>
                                </div>
                                {e.email && (
                                  <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                                    <Mail className="w-3 h-3 text-slate-400" />
                                    {e.email}
                                  </div>
                                )}
                              </td>

                              {/* Service & Route */}
                              <td className="px-5 py-4 align-top">
                                <span className="font-bold text-xs rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1">
                                  {e.service}
                                </span>
                                {(e.pickup || e.destination) && (
                                  <div className="text-xs text-slate-700 mt-1.5 font-medium">
                                    {e.pickup || "Bengaluru"} → {e.destination || "Open"}
                                  </div>
                                )}
                                {e.passengers && (
                                  <div className="text-[11px] text-slate-500 mt-0.5">
                                    👥 {e.passengers} Passengers
                                  </div>
                                )}
                              </td>

                              {/* Travel Date */}
                              <td className="px-5 py-4 align-top text-xs text-slate-700 font-medium">
                                {e.travel_date ? (
                                  <div>
                                    <span>{e.travel_date}</span>
                                    {e.pickup_time && <span className="text-slate-500 block text-[11px]">{e.pickup_time}</span>}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">Not specified</span>
                                )}
                              </td>

                              {/* Notes */}
                              <td className="px-5 py-4 align-top text-xs text-slate-600 max-w-xs">
                                {e.notes ? (
                                  <p className="line-clamp-3 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                                    {e.notes}
                                  </p>
                                ) : (
                                  <span className="text-slate-400 italic">—</span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="px-5 py-4 align-top">
                                <select
                                  value={(e.status || "NEW").toUpperCase()}
                                  onChange={(eVal) => handleUpdateStatus(e.id, eVal.target.value)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-bold border outline-none cursor-pointer ${
                                    (e.status || "").toUpperCase() === "NEW"
                                      ? "bg-amber-50 text-amber-800 border-amber-200"
                                      : (e.status || "").toUpperCase() === "CONTACTED"
                                      ? "bg-blue-50 text-blue-800 border-blue-200"
                                      : (e.status || "").toUpperCase() === "QUOTED"
                                      ? "bg-purple-50 text-purple-800 border-purple-200"
                                      : (e.status || "").toUpperCase() === "CONFIRMED"
                                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                      : "bg-slate-100 text-slate-700 border-slate-200"
                                  }`}
                                >
                                  <option value="NEW">NEW</option>
                                  <option value="CONTACTED">CONTACTED</option>
                                  <option value="QUOTED">QUOTED</option>
                                  <option value="CONFIRMED">CONFIRMED</option>
                                  <option value="CLOSED">CLOSED</option>
                                </select>
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4 align-top text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  {/* WhatsApp button */}
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                                    title="WhatsApp Customer"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                  </a>

                                  {/* Phone call button */}
                                  <a
                                    href={`tel:${e.phone}`}
                                    className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition"
                                    title="Call Customer"
                                  >
                                    <PhoneCall className="w-4 h-4" />
                                  </a>

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleDeleteEnquiry(e.id)}
                                    className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition"
                                    title="Delete Enquiry"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
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
        </>
      )}
      {/* END HOME SERVICE VIEW */}

          {/* FLIGHT MANAGEMENT SECTION */}
          {activeService === "flight" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0b1329] via-[#101e46] to-[#0b1329] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                      <Plane className="w-3.5 h-3.5" />
                      AIRLINE TICKETING &amp; FLIGHT OPERATIONS
                    </div>
                    <h2 className="text-2xl font-black text-white">Flight Management Section</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Manage domestic &amp; international flight bookings, PNR issues, ticket copy PDF generation, and passenger manifests.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-900/60 border border-blue-500/40 text-blue-200 text-xs font-bold px-3.5 py-2 rounded-xl">
                      IndiGo · Air India · Akasa · SpiceJet
                    </span>
                  </div>
                </div>
              </div>

              {/* Flight Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Flight Bookings</p>
                  <p className="text-2xl font-black text-blue-700 mt-1">{bookingStats.flightBookings}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Confirmed air reservations</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Flight Enquiries</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">
                    {enquiries.filter((e) => (e.service || "").toUpperCase().includes("FLIGHT")).length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Airfare quote requests</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Tickets Pending</p>
                  <p className="text-2xl font-black text-rose-600 mt-1">{bookingStats.ticketsPending}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Requires PDF dispatch</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Payment Status</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">Live Gateway</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Connected to PostgreSQL</p>
                </div>
              </div>

              <BookingsManager initialTab="FLIGHT" />
            </div>
          )}

          {/* BUS MANAGEMENT SECTION */}
          {activeService === "bus" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0b1329] via-[#101e46] to-[#0b1329] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                      <Bus className="w-3.5 h-3.5" />
                      INTERCITY &amp; PRIVATE BUS FLEET
                    </div>
                    <h2 className="text-2xl font-black text-white">Bus Management Section</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Manage AC Sleeper, Semi-Sleeper, KSRTC/SETC and private bus passenger manifests, boarding points, and seat allotments.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-900/60 border border-orange-500/40 text-orange-200 text-xs font-bold px-3.5 py-2 rounded-xl">
                      Multi-Axle · AC Sleeper · Volvo
                    </span>
                  </div>
                </div>
              </div>

              {/* Bus Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Bus Bookings</p>
                  <p className="text-2xl font-black text-orange-600 mt-1">{bookingStats.busBookings}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Confirmed bus seats</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Bus Enquiries</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">
                    {enquiries.filter((e) => (e.service || "").toUpperCase().includes("BUS")).length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Route &amp; timing requests</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Day Trips &amp; Routes</p>
                  <p className="text-2xl font-black text-sky-600 mt-1">{bookingStats.todayBookings}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Active departures today</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Fleet Operations</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">Operational</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Live fleet dispatcher</p>
                </div>
              </div>

              <BookingsManager initialTab="BUS" />
            </div>
          )}

          {/* HOTEL MANAGEMENT SECTION */}
          {activeService === "hotel" && <HotelAdminManager />}

          {/* RECHARGE MANAGEMENT SECTION */}
          {activeService === "recharge" && <RechargeAdminManager />}

          {/* BILL PAYMENT MANAGEMENT SECTION */}
          {activeService === "bill_payment" && <BillPaymentAdminManager />}

          {/* TRAIN MANAGEMENT SECTION */}
          {activeService === "train" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0b1329] via-[#101e46] to-[#0b1329] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                      <TrainFront className="w-3.5 h-3.5" />
                      IRCTC RAILWAY RESERVATIONS &amp; PNR
                    </div>
                    <h2 className="text-2xl font-black text-white">Train Management Section</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Monitor Tatkal requests, General quota PNR confirmations, Berth allotments (up to 6 passengers per ticket copy), and refund tracking.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 text-xs font-bold px-3.5 py-2 rounded-xl">
                      1A · 2A · 3A · SL · Tatkal Quota
                    </span>
                  </div>
                </div>
              </div>

              {/* Train Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Train Bookings</p>
                  <p className="text-2xl font-black text-indigo-600 mt-1">{bookingStats.trainBookings}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">IRCTC confirmed tickets</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Train Enquiries</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">
                    {enquiries.filter((e) => (e.service || "").toUpperCase().includes("TRAIN")).length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Tatkal &amp; waitlist checks</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Ticket Copy Pending</p>
                  <p className="text-2xl font-black text-yellow-600 mt-1">{bookingStats.ticketsPending}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Requires client dispatch</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Berth Optimization</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">Active</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Auto coach/berth generator</p>
                </div>
              </div>

              <BookingsManager initialTab="TRAIN" />
            </div>
          )}

          {/* CARS BOOKING MANAGEMENT SECTION */}
          {activeService === "cars" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0b1329] via-[#101e46] to-[#0b1329] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                      <Car className="w-3.5 h-3.5" />
                      CAR RENTALS, TAXIS &amp; FLEET MANAGEMENT
                    </div>
                    <h2 className="text-2xl font-black text-white">Car Booking Management</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Manage local city cabs, outstation trips, airport transfers, chauffeur allotments, and fleet vehicle status.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold px-3.5 py-2 rounded-xl">
                      Sedan · SUV · Innova Crysta · Tempo Traveller
                    </span>
                  </div>
                </div>
              </div>

              {/* Cars Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Taxi / Car Bookings</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">{bookingStats.taxiBookings}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Active &amp; completed car rentals</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Fleet Vehicles</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{vehiclesList.length}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Commercial fleet ready</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Today's Day Trips</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">{bookingStats.todayBookings}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Assigned &amp; on road</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Fleet Status</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">Operational</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Live GPS &amp; driver dispatch</p>
                </div>
              </div>

              <BookingsManager initialTab="CAR" />
            </div>
          )}

          {/* TOURISM PACKAGES MANAGEMENT SECTION */}
          {activeService === "packages" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0b1329] via-[#101e46] to-[#0b1329] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
                      <Package className="w-3.5 h-3.5" />
                      HOLIDAY TOURS &amp; ITINERARIES
                    </div>
                    <h2 className="text-2xl font-black text-white">Tourism Packages Management</h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Create, customize, price, and manage tour packages across Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, and Goa.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105"
                    >
                      <Plus className="w-4 h-4" /> Add New Package
                    </button>
                  </div>
                </div>
              </div>

              {/* Package Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Total Tour Packages</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{packagesList.length}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Published on website</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Popular Destinations</p>
                  <p className="text-2xl font-black text-amber-600 mt-1">Ooty · Coorg · Munnar</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">South India circuits</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Package Enquiries</p>
                  <p className="text-2xl font-black text-blue-600 mt-1">
                    {enquiries.filter((e) => (e.service || "").toUpperCase().includes("TOUR") || (e.service || "").toUpperCase().includes("PACKAGE")).length}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Holiday quote requests</p>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
                  <p className="text-xs font-bold uppercase text-slate-500">Hub City</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">Bengaluru</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Primary departure origin</p>
                </div>
              </div>

              {/* Add / Edit Package Modal */}
              {showPackageForm && (
                <form
                  onSubmit={handleSavePackage}
                  className="mb-6 rounded-2xl border border-slate-300 bg-white p-6 shadow-xl grid gap-4 sm:grid-cols-2 animate-in fade-in duration-200"
                >
                  <h3 className="sm:col-span-2 font-black text-base border-b pb-2 text-slate-900 flex items-center justify-between">
                    <span>{editingPkg ? `Edit Package: ${editingPkg.title}` : "Add New Tour Package"}</span>
                    <button
                      type="button"
                      onClick={() => setShowPackageForm(false)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                    >
                      ✕ Cancel
                    </button>
                  </h3>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Title *</label>
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
                      placeholder="e.g. Bengaluru → Coorg Hill Station Special"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Slug *</label>
                    <input
                      value={newPkg.slug}
                      onChange={(e) => setNewPkg({ ...newPkg, slug: e.target.value })}
                      placeholder="e.g. bengaluru-coorg-hill-station"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Duration</label>
                    <input
                      value={newPkg.duration}
                      onChange={(e) => setNewPkg({ ...newPkg, duration: e.target.value })}
                      placeholder="3 Days · 2 Nights"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">From City</label>
                    <input
                      value={newPkg.from_city}
                      onChange={(e) => setNewPkg({ ...newPkg, from_city: e.target.value })}
                      placeholder="Bengaluru"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Starting Price (₹)</label>
                    <input
                      type="number"
                      value={newPkg.starting_price}
                      onChange={(e) => setNewPkg({ ...newPkg, starting_price: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 uppercase">Image URL</label>
                    <input
                      value={newPkg.image}
                      onChange={(e) => setNewPkg({ ...newPkg, image: e.target.value })}
                      placeholder="/images/packages/coorg.jpg"
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-600 uppercase">Summary / Highlights</label>
                    <textarea
                      value={newPkg.summary}
                      onChange={(e) => setNewPkg({ ...newPkg, summary: e.target.value })}
                      rows={3}
                      placeholder="Detailed itinerary overview, inclusions, sightseeing points..."
                      className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowPackageForm(false)}
                      className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 text-xs"
                    >
                      {editingPkg ? "Update Package in Database" : "Save Package to Database"}
                    </button>
                  </div>
                </form>
              )}

              {/* Packages Cards Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {packagesList.map((pkg) => (
                  <div key={pkg.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      {pkg.image && (
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="h-36 w-full rounded-xl object-cover mb-3 bg-slate-100"
                        />
                      )}
                      <h3 className="font-extrabold text-slate-900 text-sm">{pkg.title}</h3>
                      <p className="text-xs font-medium text-amber-700 mt-1">
                        {pkg.duration} · From {pkg.from_city}
                      </p>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">{pkg.summary}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Starting from</span>
                        <p className="text-base font-black text-slate-900">
                          ₹{Number(pkg.starting_price || 0).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditPackageClick(pkg)}
                          className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Edit Package"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePackage(pkg.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
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

          {/* ACCOUNTS & FINANCIAL OPERATIONS SECTION */}
          {activeService === "accounts" && (
            <AccountsReportsHub
              initialReport={activeAccountReport}
              onSelectReport={(k) => setActiveAccountReport(k)}
            />
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
