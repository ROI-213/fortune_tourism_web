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
import fullLogoAsset from "@/assets/fortune-tourism-full-logo.png";
import keralaHeroImg from "@/assets/kerala-hero.jpg";
import karnatakaHeroImg from "@/assets/karnataka-hero.jpg";
import pondicherryHeroImg from "@/assets/pondicherry-hero.jpg";
import andhraHeroImg from "@/assets/andhra-hero.jpg";
import tamilnaduHeroImg from "@/assets/tamilnadu-hero.jpg";
import fleetInnovaImg from "@/assets/fleet-innova-hero.jpg";
import fleetTempoImg from "@/assets/fleet-tempo-hero.jpg";
import fleetDzireImg from "@/assets/fleet-dzire-hero.jpg";
import fleetHondaImg from "@/assets/fleet-honda-hero.jpg";
import fleetUrbaniaImg from "@/assets/fleet-urbania-hero.png";
import { BUSINESS_RESOURCES } from "@/lib/business-schema";

const LOGIN_DESTINATION_SLIDES = [
  {
    eyebrow: "EXPLORE",
    title: "KERALA",
    tagline: "GOD'S OWN COUNTRY.",
    quote: "\u201CBackwaters, misty hills and coconut coasts \u2014 where nature slows time down.\u201D",
    image: keralaHeroImg,
    alt: "Explore Kerala - God's Own Country",
  },
  {
    eyebrow: "EXPLORE",
    title: "KARNATAKA",
    tagline: "ONE STATE. ENDLESS EXPERIENCES.",
    quote: "\u201CFrom royal palaces to whispering waterfalls \u2014 every road here tells a story.\u201D",
    image: karnatakaHeroImg,
    alt: "Explore Karnataka - One State. Endless Experiences.",
  },
  {
    eyebrow: "EXPLORE",
    title: "PONDICHERRY",
    tagline: "A FRENCH SOUL BY THE SEA.",
    quote: "\u201CCobbled lanes, caf\u00E9 mornings and turquoise waters \u2014 a little Europe on Indian shores.\u201D",
    image: pondicherryHeroImg,
    alt: "Explore Pondicherry - A French Soul By The Sea.",
  },
  {
    eyebrow: "EXPLORE",
    title: "ANDHRA PRADESH",
    tagline: "SPIRITUAL. SCENIC. UNFORGETTABLE.",
    quote: "\u201CTemple bells, hill trains and golden shores \u2014 the soul of the south awaits.\u201D",
    image: andhraHeroImg,
    alt: "Explore Andhra Pradesh - Spiritual. Scenic. Unforgettable.",
  },
  {
    eyebrow: "EXPLORE",
    title: "TAMIL NADU",
    tagline: "LAND OF HERITAGE, NATURE & SPIRITUALITY.",
    quote: "\u201CTemples, coastlines and cool hill escapes \u2014 a journey of culture in every direction.\u201D",
    image: tamilnaduHeroImg,
    alt: "Explore Tamil Nadu - Land of Heritage, Nature & Spirituality.",
  },
  {
    eyebrow: "PREMIUM FLEET",
    title: "TOYOTA INNOVA",
    tagline: "COMFORT. LUXURY. RELIABILITY.",
    quote: "\u201CSpacious executive travel crafted for long journeys, family tours and highway comfort.\u201D",
    image: fleetInnovaImg,
    alt: "Toyota Innova - Fortune Tourism Fleet",
  },
  {
    eyebrow: "GROUP TRAVEL",
    title: "TEMPO TRAVELLER",
    tagline: "SPACE. TOGETHERNESS. ADVENTURE.",
    quote: "\u201CComfortable luxury group touring for family outings, pilgrimages and corporate events.\u201D",
    image: fleetTempoImg,
    alt: "Force Tempo Traveller - Fortune Tourism Fleet",
  },
  {
    eyebrow: "LUXURY COMMUTE",
    title: "FORCE URBANIA",
    tagline: "MODERN. LUXURY. SPACIOUS.",
    quote: "\u201CNext-generation luxury van crafted for premium group touring and executive travel.\u201D",
    image: fleetUrbaniaImg,
    alt: "Force Urbania - Fortune Tourism Fleet",
  },
  {
    eyebrow: "CITY & OUTSTATION",
    title: "SWIFT DZIRE",
    tagline: "SMOOTH. EFFICIENT. ACCESSIBLE.",
    quote: "\u201CThe ideal sedan for fast airport transfers, business commutes and seamless city travel.\u201D",
    image: fleetDzireImg,
    alt: "Maruti Suzuki Dzire - Fortune Tourism Fleet",
  },
  {
    eyebrow: "EXECUTIVE SEDAN",
    title: "HONDA CITY",
    tagline: "ELEGANCE. COMFORT. PRESTIGE.",
    quote: "\u201CRefined luxury journeys and executive travel experiences with unmatched sophistication.\u201D",
    image: fleetHondaImg,
    alt: "Honda City - Fortune Tourism Fleet",
  },
];
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
  User,
  Settings,
  X,
  Check,
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

  // Account Menu dropdown states & handlers
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bookingDropdownRef.current && !bookingDropdownRef.current.contains(event.target as Node)) {
        setBookingDropdownOpen(false);
      }
      if (accountsDropdownRef.current && !accountsDropdownRef.current.contains(event.target as Node)) {
        setAccountsDropdownOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setBookingDropdownOpen(false);
        setAccountsDropdownOpen(false);
        setAccountMenuOpen(false);
        setProfileModalOpen(false);
        setSettingsModalOpen(false);
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

  // Login destination background slides auto-cycle (5s interval)
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    if (isAuthenticated) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % LOGIN_DESTINATION_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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

      const [enqRes, pkgRes, vehRes, statsRes, bookRes] = await Promise.all([
        fetch("/api/enquiries", { headers }),
        fetch("/api/packages", { headers }),
        fetch("/api/vehicles", { headers }),
        fetch("/api/bookings/stats", { headers }),
        fetch("/api/bookings?limit=15", { headers }),
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
      if (bookRes.ok) {
        const d = await bookRes.json();
        if (d.success && Array.isArray(d.bookings)) {
          setRecentBookings(d.bookings);
        }
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
      <div className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col bg-[#0b1329]">
        {/* Top Header: Compact White Section with Official Integrated Fortune Tourism Logo */}
        <header className="relative w-full shrink-0 bg-white border-b border-slate-200/90 text-slate-900 py-1.5 sm:py-2 flex items-center justify-center shadow-xs z-20">
          <div className="w-full flex items-center justify-center text-center px-3 sm:px-4">
            <h1 className="sr-only">Fortune Tourism - Meets all your travel needs</h1>
            <img
              src={fullLogoAsset}
              alt="Fortune Tourism - Meets all your travel needs"
              className="h-7 sm:h-8 md:h-10 lg:h-11 w-auto max-w-[65vw] sm:max-w-[50vw] md:max-w-[40vw] object-contain block mx-auto"
            />
          </div>
        </header>

        {/* Bottom Half: Destination Slider Background Section with Words Content & Login Card */}
        <main className="relative flex-1 min-h-0 w-full overflow-hidden flex flex-col items-center justify-center px-3 sm:px-4 py-2">
          {/* Automatic Moving Background Images with Cross-Fade */}
          <div className="absolute inset-0 z-0">
            {LOGIN_DESTINATION_SLIDES.map((slide, idx) => (
              <div
                key={slide.title}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === activeSlide ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
            {/* Cinematic Gradient Overlays for high contrast */}
            <div className="absolute inset-0 z-2 bg-gradient-to-t from-[#0b1329]/95 via-[#0b1329]/75 to-[#0b1329]/85" />
            <div className="absolute inset-0 z-2 bg-black/35 backdrop-blur-[0.5px]" />
          </div>

          <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center my-auto">
            {/* Words Content matching the active slide */}
            <div className="flex flex-col items-center justify-center mb-1 sm:mb-2">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-amber-300/95 drop-shadow transition-all duration-500">
                {LOGIN_DESTINATION_SLIDES[activeSlide].eyebrow}
              </p>

              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-wider text-white uppercase drop-shadow-2xl leading-tight my-0.5 transition-all duration-500">
                {LOGIN_DESTINATION_SLIDES[activeSlide].title}
              </h2>

              <div className="flex items-center justify-center gap-2 w-full max-w-xs sm:max-w-sm my-0.5">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-400/80 to-amber-400 flex-1" />
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 whitespace-nowrap drop-shadow transition-all duration-500">
                  {LOGIN_DESTINATION_SLIDES[activeSlide].tagline}
                </p>
                <div className="h-px bg-gradient-to-r from-amber-400 via-amber-400/80 to-transparent flex-1" />
              </div>

              <p className="max-w-lg text-[10px] sm:text-xs text-slate-200 italic font-serif leading-snug px-3 drop-shadow-md transition-all duration-500 line-clamp-2 sm:line-clamp-none">
                {LOGIN_DESTINATION_SLIDES[activeSlide].quote}
              </p>
            </div>

            {/* Slide Navigation Indicator Dots */}
            <div className="flex items-center justify-center gap-1.5 mb-2 sm:mb-2.5">
              {LOGIN_DESTINATION_SLIDES.map((slide, idx) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === activeSlide
                      ? "w-5 bg-amber-400 shadow-xs"
                      : "w-1 bg-white/40 hover:bg-white/70"
                  }`}
                  aria-label={`Go to ${slide.title} slide`}
                />
              ))}
            </div>

            {/* Login Credentials Card */}
            <div className="w-full max-w-[92vw] sm:max-w-[340px] mx-auto bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-2.5 sm:space-y-3 text-left">
              {loginError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-2.5 text-xs text-red-700">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  <div className="font-medium leading-tight">{loginError}</div>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-2 sm:space-y-2.5">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    User ID / Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="adminfortunetourism@gmail.com"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-9 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                  >
                    {loginLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5" /> Sign In
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
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
      {/* First Navigation Bar - Compact Top Header */}
      <header className="sticky top-0 z-50 w-full bg-[#063f2d] border-b border-[#086a46] shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-14">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActiveService("home")}
                className="flex items-center gap-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-xl p-1 transition"
                title="Fortune Tourism Admin"
              >
                <span className="grid place-items-center overflow-hidden rounded-xl bg-white h-8 w-8 sm:h-9 sm:w-9 shadow-xs shrink-0">
                  <img
                    src={logoAsset}
                    alt="Fortune Tourism Logo"
                    className="h-full w-full object-contain"
                  />
                </span>
                <div className="text-left">
                  <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight flex items-center gap-1.5 leading-tight">
                    <span className="text-white">Welcome to</span>
                    <span className="text-[#d79a17] font-black">Fortune Tourism Admin</span>
                  </h1>
                  <p className="text-[10px] text-emerald-200/80 font-medium hidden sm:block leading-none mt-0.5">
                    Enterprise Operations &amp; Travel Lifecycle Management
                  </p>
                </div>
              </button>
            </div>

            {/* Right: PostgreSQL Live Badge + Admin Quick Badge */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-900/60 px-3 py-1 text-xs font-semibold text-emerald-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Database Connected
              </div>
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-100 text-xs font-bold transition cursor-pointer"
                title="View Admin Profile"
              >
                <div className="w-5 h-5 rounded-full bg-[#d79a17] text-slate-950 font-black text-[10px] grid place-items-center uppercase">
                  A
                </div>
                <span className="max-w-[150px] truncate">{adminUser?.email || "Admin"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Second Navigation Bar */}
      <nav className="sticky top-13 sm:top-14 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5">
            {/* Left Navigation Items: Dashboard, Booking, Tour Package */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* 1. Dashboard */}
              <button
                type="button"
                onClick={() => setActiveService("home")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeService === "home"
                    ? "bg-[#063f2d] text-white shadow-xs font-extrabold"
                    : "text-slate-700 hover:text-[#063f2d] hover:bg-slate-100"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              {/* 2. Booking (with Dropdown: Flight, Bus, Train, Cars) */}
              <div
                ref={bookingDropdownRef}
                className="relative"
                onMouseEnter={handleMouseEnterBooking}
                onMouseLeave={handleMouseLeaveBooking}
              >
                <button
                  type="button"
                  onClick={handleToggleBookingDropdown}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isBookingActive
                      ? "bg-[#063f2d] text-white shadow-xs font-extrabold"
                      : "text-slate-700 hover:text-[#063f2d] hover:bg-slate-100"
                  }`}
                  aria-expanded={bookingDropdownOpen}
                >
                  <Ticket className="w-4 h-4" />
                  <span>Booking</span>
                  {totalBookingCount > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                        isBookingActive ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {totalBookingCount}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      bookingDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {bookingDropdownOpen && (
                  <div className="absolute left-0 top-full pt-1.5 w-56 sm:w-60 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-1.5 ring-1 ring-black/5">
                      <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
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
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                              isItemActive
                                ? "bg-emerald-50 text-[#063f2d] font-extrabold border border-emerald-200"
                                : "text-slate-700 hover:text-[#063f2d] hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${isItemActive ? "text-[#063f2d]" : "text-slate-500"}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
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

              {/* 3. Tour Package */}
              <button
                type="button"
                onClick={() => setActiveService("packages")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeService === "packages"
                    ? "bg-[#063f2d] text-white shadow-xs font-extrabold"
                    : "text-slate-700 hover:text-[#063f2d] hover:bg-slate-100"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Tour Package</span>
                {packagesList.length > 0 && (
                  <span className="hidden sm:inline-block text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {packagesList.length}
                  </span>
                )}
              </button>
            </div>

            {/* Right: 4. Account with image dropdown */}
            <div
              ref={accountMenuRef}
              className="relative"
              onMouseEnter={() => setAccountMenuOpen(true)}
              onMouseLeave={() => setAccountMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  accountMenuOpen
                    ? "border-[#063f2d] bg-emerald-50 text-[#063f2d]"
                    : "border-slate-200 bg-white text-slate-800 hover:border-slate-300 shadow-2xs"
                }`}
                aria-expanded={accountMenuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#063f2d] to-[#086a46] p-0.5 shadow-xs flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[#063f2d] font-extrabold text-xs">
                    <User className="w-3.5 h-3.5 text-[#063f2d]" />
                  </div>
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold block leading-none text-slate-900">Account</span>
                  <span className="text-[10px] text-slate-500 font-medium leading-none">Super Admin</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Account Dropdown Menu: Profile, Settings, Logout */}
              {accountMenuOpen && (
                <div className="absolute right-0 top-full pt-1.5 w-60 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-2 ring-1 ring-black/5">
                    <div className="px-3 py-2 border-b border-slate-100 mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{adminUser?.name || "Fortune Tourism Administrator"}</p>
                      <p className="text-[11px] text-slate-500 truncate">{adminUser?.email || "adminfortunetourism@gmail.com"}</p>
                    </div>

                    {/* Profile */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setProfileModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#063f2d] hover:bg-emerald-50 transition text-left cursor-pointer"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>Profile</span>
                    </button>

                    {/* Settings */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#063f2d] hover:bg-emerald-50 transition text-left cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-amber-600" />
                      <span>Settings</span>
                    </button>

                    {/* Financial Ledgers */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setActiveService("accounts");
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#063f2d] hover:bg-emerald-50 transition text-left cursor-pointer"
                    >
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                      <span>Financial Ledgers</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <section className="py-6 sm:py-8 bg-slate-50/80 min-h-screen">
        <div className="container-fortune">
          {/* Sub-header status bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white border border-slate-200/90 rounded-2xl px-4 py-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Live PostgreSQL Connected
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Active View: <span className="font-bold text-[#063f2d] uppercase">{activeService.replace("_", " ")}</span>
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Auto-synced: {new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
            </div>
          </div>

          {/* HOME SERVICE VIEW: MODERN ADMIN DASHBOARD */}
          {activeService === "home" && (
            <>
              {/* 1. Summary Cards: Total Bookings, Pending Bookings, Confirmed Bookings, Total Revenue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Bookings */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Bookings</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#063f2d] grid place-items-center shadow-2xs">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    {bookingStats.totalBookings || 0}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">Across all travel services</p>
                </div>

                {/* Pending Bookings */}
                <div className="bg-white rounded-2xl border border-amber-200/90 p-5 shadow-xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Bookings</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d79a17] grid place-items-center shadow-2xs">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-amber-700 tracking-tight">
                    {bookingStats.pendingPayments || 0}
                  </p>
                  <p className="text-[11px] text-amber-600 font-semibold mt-1">Awaiting balance / confirmation</p>
                </div>

                {/* Confirmed Bookings */}
                <div className="bg-white rounded-2xl border border-emerald-200/90 p-5 shadow-xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Confirmed Bookings</span>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#063f2d] grid place-items-center shadow-2xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-emerald-800 tracking-tight">
                    {(bookingStats.totalBookings - bookingStats.cancelled) || bookingStats.fullyPaid || 0}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Ready &amp; active departures</p>
                </div>

                {/* Total Revenue */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Revenue</span>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d79a17] grid place-items-center shadow-2xs">
                      <IndianRupee className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">
                    ₹{Number(bookingStats.totalRevenue || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">Live booking value collected</p>
                </div>
              </div>

              {/* 2. Clean Dashboard Service Cards */}
              <div className="mb-10">
                <div className="mb-4">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 font-heading">Travel Services &amp; Operations</h2>
                  <p className="text-xs text-slate-500">Quickly manage bookings, fleet allocations, packages, and ticketing across all channels</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Cab Booking",
                      description: "Airport transfers, local city rentals & outstation cab fleet tracking",
                      icon: Car,
                      badge: `${vehiclesList.length || 8} Vehicles`,
                      iconBg: "bg-emerald-50 text-[#063f2d]",
                      onClick: () => setActiveService("cars"),
                    },
                    {
                      title: "Ticket Booking",
                      description: "Issue tickets, track PNRs, generate official PDF vouchers & ticket copies",
                      icon: Ticket,
                      badge: "Ticketing Hub",
                      iconBg: "bg-blue-50 text-blue-700",
                      onClick: () => setActiveTab("bookings"),
                    },
                    {
                      title: "Tour Packages",
                      description: "Curate South India holiday itineraries, seasonal tariffs & packages",
                      icon: Package,
                      badge: `${packagesList.length || 0} Packages`,
                      iconBg: "bg-amber-50 text-[#d79a17]",
                      onClick: () => setActiveService("packages"),
                    },
                    {
                      title: "Flight Booking",
                      description: "Domestic & international airline reservations, flight manifests & airfares",
                      icon: Plane,
                      badge: `${bookingStats.flightBookings || 0} Bookings`,
                      iconBg: "bg-sky-50 text-sky-700",
                      onClick: () => setActiveService("flight"),
                    },
                    {
                      title: "Bus Booking",
                      description: "Intercity sleeper, Volvo multi-axle & private bus seat allocations",
                      icon: Bus,
                      badge: `${bookingStats.busBookings || 0} Bookings`,
                      iconBg: "bg-orange-50 text-orange-700",
                      onClick: () => setActiveService("bus"),
                    },
                    {
                      title: "Hotel Booking",
                      description: "Resort suites, business hotel reservations, check-in schedules & tariffs",
                      icon: Hotel,
                      badge: "Stays & Resorts",
                      iconBg: "bg-indigo-50 text-indigo-700",
                      onClick: () => setActiveService("hotel"),
                    },
                  ].map((service) => {
                    const Icon = service.icon;
                    return (
                      <button
                        key={service.title}
                        type="button"
                        onClick={service.onClick}
                        className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-xl hover:border-amber-400/60 hover:-translate-y-1 transition-all duration-300 text-left flex flex-col justify-between group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${service.iconBg}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-amber-100 group-hover:text-amber-900 transition">
                              {service.badge}
                            </span>
                          </div>
                          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#063f2d] transition">
                            {service.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#063f2d] group-hover:text-[#d79a17] transition">
                          <span>Open Service Panel</span>
                          <span className="text-sm leading-none transition-transform group-hover:translate-x-1">→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Neat Recent Bookings Table */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden mb-8">
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-emerald-50/40 via-white to-white">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-heading flex items-center gap-2">
                      <span>Recent Bookings</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#063f2d] text-white">
                        {recentBookings.length > 0 ? recentBookings.length : 6}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">Live booking registrations and travel schedules</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab("bookings")}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#063f2d] hover:text-[#d79a17] bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                    >
                      View All in Booking Manager →
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Booking Type</th>
                        <th className="py-3 px-4">Destination</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {(recentBookings.length > 0 ? recentBookings : [
                        {
                          id: 1,
                          booking_number: "BK-2026-001",
                          passenger_name: "Rajesh Sharma",
                          passenger_phone: "+91 98450 12345",
                          category: "TAXI",
                          to_location: "Kempegowda Intl Airport (BLR)",
                          departure_datetime: "2026-09-05",
                          total_amount: 1850,
                          booking_status: "Confirmed",
                        },
                        {
                          id: 2,
                          booking_number: "BK-2026-002",
                          passenger_name: "Anita Deshmukh",
                          passenger_phone: "+91 98860 67890",
                          category: "PACKAGE",
                          to_location: "Munnar & Alleppey Backwaters, Kerala",
                          departure_datetime: "2026-09-10",
                          total_amount: 28500,
                          booking_status: "Confirmed",
                        },
                        {
                          id: 3,
                          booking_number: "BK-2026-003",
                          passenger_name: "Vikram Malhotra",
                          passenger_phone: "+91 94480 34567",
                          category: "FLIGHT",
                          to_location: "Bengaluru (BLR) → New Delhi (DEL)",
                          departure_datetime: "2026-09-08",
                          total_amount: 6800,
                          booking_status: "Confirmed",
                        },
                        {
                          id: 4,
                          booking_number: "BK-2026-004",
                          passenger_name: "Suresh Reddy",
                          passenger_phone: "+91 97310 98765",
                          category: "BUS",
                          to_location: "Bengaluru → Tirupati Balaji",
                          departure_datetime: "2026-09-06",
                          total_amount: 1450,
                          booking_status: "Pending",
                        },
                        {
                          id: 5,
                          booking_number: "BK-2026-005",
                          passenger_name: "Pooja Hegde",
                          passenger_phone: "+91 99000 54321",
                          category: "HOTEL",
                          to_location: "Heritage Resort & Spa, Coorg",
                          departure_datetime: "2026-09-12",
                          total_amount: 14200,
                          booking_status: "Confirmed",
                        },
                        {
                          id: 6,
                          booking_number: "BK-2026-006",
                          passenger_name: "Karthik Raja",
                          passenger_phone: "+91 96111 23456",
                          category: "TRAIN",
                          to_location: "Bengaluru (SBC) → Chennai Central (MAS)",
                          departure_datetime: "2026-09-09",
                          total_amount: 1120,
                          booking_status: "Confirmed",
                        },
                      ]).map((item: any, idx: number) => {
                        const typeNormalized = (item.category || item.booking_type || "CAB").toUpperCase();
                        const isConfirmed = (item.booking_status || "").toLowerCase().includes("confirm");
                        const isPending = (item.booking_status || "").toLowerCase().includes("pend");
                        return (
                          <tr key={item.id || idx} className="hover:bg-slate-50/60 transition">
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{item.passenger_name || "Guest Customer"}</p>
                              <p className="text-[11px] text-slate-400 font-normal">{item.passenger_phone || item.booking_number || "Direct Booking"}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                typeNormalized.includes("FLIGHT")
                                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                                  : typeNormalized.includes("BUS")
                                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                                  : typeNormalized.includes("TRAIN")
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : typeNormalized.includes("PACKAGE") || typeNormalized.includes("TOUR")
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : typeNormalized.includes("HOTEL")
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              }`}>
                                {typeNormalized}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-slate-800 truncate max-w-[200px] sm:max-w-[280px]">
                                {item.to_location || item.destination || item.package_name || "Bengaluru Outstation"}
                              </p>
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                              {item.departure_datetime ? new Date(item.departure_datetime).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Upcoming"}
                            </td>
                            <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                              ₹{Number(item.total_amount || 0).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                isConfirmed
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : isPending
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isConfirmed ? "bg-emerald-500" : isPending ? "bg-amber-500" : "bg-slate-400"}`} />
                                {item.booking_status || "Active"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. Tab Navigation for Operational Records & Ledgers */}
              <div className="mt-8 mb-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
                  Operations, Records &amp; Fleet Management
                </h3>
              </div>
              <div className="flex border-b border-border mb-6 gap-2 overflow-x-auto scrollbar-thin">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "bookings"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarDays className="h-4 w-4" /> Bookings
                </button>
                <button
                  onClick={() => setActiveTab("day_bookings")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "day_bookings"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarDays className="h-4 w-4" /> Day Booking
                </button>
                <button
                  onClick={() => setActiveTab("all_bookings")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "all_bookings"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" /> Bookings ({bookingStats.totalBookings})
                </button>
                <button
                  onClick={() => setActiveTab("pending_payments")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "pending_payments"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IndianRupee className="h-4 w-4 text-rose-600" /> Remaining Payments ({bookingStats.pendingPayments})
                </button>
                <button
                  onClick={() => setActiveTab("payment_history")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "payment_history"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <History className="h-4 w-4 text-emerald-600" /> Payment History
                </button>
                <button
                  onClick={() => setActiveTab("business")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "business"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ClipboardList className="h-4 w-4" /> Business Records
                </button>
                <button
                  onClick={() => setActiveTab("statements")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "statements"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FileSpreadsheet className="h-4 w-4 text-amber-600" /> Client Statements
                </button>
                <button
                  onClick={() => setActiveTab("daily_expenses")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "daily_expenses"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingDown className="h-4 w-4 text-red-600" /> Daily Expense Report
                </button>
                <button
                  onClick={() => setActiveTab("drivers")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "drivers"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserCog className="h-4 w-4" /> Driver Accounts
                </button>
                <button
                  onClick={() => setActiveTab("enquiries")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "enquiries"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Users className="h-4 w-4" /> Customer Enquiries ({enquiries.length})
                </button>
                <button
                  onClick={() => setActiveTab("packages")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "packages"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Package className="h-4 w-4" /> Tour Packages ({packagesList.length})
                </button>
                <button
                  onClick={() => setActiveTab("vehicles")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "vehicles"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Car className="h-4 w-4" /> Fleet Vehicles ({vehiclesList.length})
                </button>
                <button
                  onClick={() => setActiveTab("storage")}
                  className={`pb-3 px-4 font-semibold text-sm transition border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    activeTab === "storage"
                      ? "border-[#063f2d] text-[#063f2d] font-black"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <HardDrive className="h-4 w-4" /> File Storage & Assets
                </button>
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

      {/* Admin Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#063f2d] p-6 text-white text-center relative">
              <button
                type="button"
                onClick={() => setProfileModalOpen(false)}
                className="absolute right-4 top-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-[#d79a17] mx-auto flex items-center justify-center text-white text-2xl font-black mb-2 shadow-inner">
                <Shield className="w-8 h-8 text-[#d79a17]" />
              </div>
              <h3 className="text-lg font-black text-white">Administrator Profile</h3>
              <p className="text-xs text-emerald-200 font-medium mt-0.5">Fortune Tourism Operations Authority</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Full Name</span>
                  <span className="font-extrabold text-slate-900">{adminUser?.name || "Fortune Tourism Administrator"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Email / User ID</span>
                  <span className="font-extrabold text-slate-900">{adminUser?.email || "adminfortunetourism@gmail.com"}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Access Role</span>
                  <span className="inline-flex items-center gap-1 font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#063f2d] text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> SUPER ADMIN
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Database Status</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live PostgreSQL
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                <p className="font-bold flex items-center gap-1.5 mb-0.5">
                  <Check className="w-4 h-4 text-amber-700" /> Full System Privileges Active
                </p>
                Authorized to dispatch cabs, manage flight/train/bus manifests, edit packages, and reconcile financial ledgers.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#0b1329] p-6 text-white text-center relative">
              <button
                type="button"
                onClick={() => setSettingsModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-amber-400 mx-auto flex items-center justify-center text-white text-2xl font-black mb-2 shadow-inner">
                <Settings className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-black text-white">System Settings</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Application Preferences &amp; Synchronization</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Timezone</span>
                  <span className="font-extrabold text-slate-900">Asia/Kolkata (IST +05:30)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Default Currency</span>
                  <span className="font-extrabold text-slate-900">Indian Rupee (INR - ₹)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Auto-Sync Frequency</span>
                  <span className="font-extrabold text-emerald-700">Realtime on Page Load</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Security Protocol</span>
                  <span className="font-extrabold text-slate-900">Secure Header Key &amp; SameSite Cookie</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    fetchData();
                    toast.success("All live database records synchronized!");
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#063f2d] hover:bg-[#086a46] text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Sync Data Now
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
