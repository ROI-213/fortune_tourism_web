import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { 
  Search, 
  IndianRupee, 
  Eye, 
  Plus, 
  CreditCard,
  RefreshCw,
  Filter
} from "lucide-react";
import { formatCurrency, formatDate, calculatePaymentStatus } from "@/lib/booking-utils";
import { BookingDetailDrawer } from "./BookingDetailDrawer";

export function PaymentHistoryManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [search, setSearch] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  // Action Modals
  const [drawerId, setDrawerId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  // Payment Form State
  const [payForm, setPayForm] = useState({
    amount: "",
    method: "CASH",
    reference_number: "",
    payment_date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const loadBookings = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch("/api/bookings?limit=500", {
        headers: { "x-admin-key": key },
      });
      const data = await res.json();
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        if (!silent) toast.error("Failed to load bookings");
      }
    } catch (err) {
      if (!silent) toast.error("Error loading bookings");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBookings(true);
    setRefreshing(false);
  };

  const submitPayment = async () => {
    const amt = Number(payForm.amount);
    if (!amt || amt <= 0 || !selectedBooking) {
      toast.error("Enter a valid amount.");
      return;
    }
    
    try {
      const key = sessionStorage.getItem("fortune_admin_key") || "";
      const res = await fetch(`/api/bookings/${selectedBooking.id}/payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": key,
        },
        body: JSON.stringify({
          amount: amt,
          payment_method: payForm.method,
          reference_number: payForm.reference_number || null,
          payment_date: payForm.payment_date || null,
          received_by: "Admin",
          notes: payForm.notes || null,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Payment of ${formatCurrency(amt)} recorded successfully.`);
        setShowPaymentForm(false);
        setPayForm({
          amount: "",
          method: "CASH",
          reference_number: "",
          payment_date: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setSelectedBooking(null);
        await loadBookings(true);
      } else {
        toast.error(data.error || "Failed to record payment");
      }
    } catch (err) {
      toast.error("Error saving payment");
    }
  };

  // Derived state for filtering and stats
  const filteredBookings = useMemo(() => {
    return bookings.filter((bk) => {
      // Search filter
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        !search || 
        bk.passenger_name?.toLowerCase().includes(searchLower) ||
        bk.passenger_phone?.toLowerCase().includes(searchLower) ||
        bk.booking_number?.toLowerCase().includes(searchLower);
        
      // Payment status filter
      const pStatus = String(bk.payment_status || "").toUpperCase();
      const matchesStatus = 
        paymentStatusFilter === "All" ||
        (paymentStatusFilter === "Unpaid" && ["PENDING", "UNPAID"].includes(pStatus)) ||
        (paymentStatusFilter === "Partially Paid" && pStatus === "PARTIALLY PAID") ||
        (paymentStatusFilter === "Fully Paid" && pStatus === "FULLY PAID");
        
      // Category filter
      const matchesCategory = 
        categoryFilter === "All" || 
        String(bk.category).toUpperCase() === categoryFilter.toUpperCase();
        
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [bookings, search, paymentStatusFilter, categoryFilter]);

  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalCollected = 0;
    let totalOutstanding = 0;
    let fullyPaidCount = 0;
    let partiallyPaidCount = 0;

    bookings.forEach((bk) => {
      const total = Number(bk.total_amount) || 0;
      const paid = Number(bk.paid_total ?? bk.amount_paid ?? 0);
      const remaining = Number(bk.remaining_amount ?? bk.balance_amount ?? 0);
      
      if (String(bk.booking_status).toUpperCase() !== "CANCELLED") {
        totalRevenue += total;
        totalCollected += paid;
        totalOutstanding += remaining;
        
        const pStatus = String(bk.payment_status || "").toUpperCase();
        if (pStatus === "FULLY PAID") fullyPaidCount++;
        if (pStatus === "PARTIALLY PAID") partiallyPaidCount++;
      }
    });

    return {
      totalRevenue,
      totalCollected,
      totalOutstanding,
      fullyPaidCount,
      partiallyPaidCount
    };
  }, [bookings]);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
      {/* Header & Stats */}
      <div className="p-5 border-b border-border bg-slate-50/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-heading text-xl font-bold text-[color:var(--color-navy)]">Payment History</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage all booking payments and outstanding balances
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 disabled:opacity-50 inline-flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Revenue</p>
            <p className="font-heading text-xl font-bold text-[color:var(--color-navy)]">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">Total Collected</p>
            <p className="font-heading text-xl font-bold text-emerald-800">
              {formatCurrency(stats.totalCollected)}
            </p>
          </div>
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-1">Outstanding</p>
            <p className="font-heading text-xl font-bold text-rose-800">
              {formatCurrency(stats.totalOutstanding)}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Fully Paid</p>
            <p className="font-heading text-xl font-bold text-slate-700">{stats.fullyPaidCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Partially Paid</p>
            <p className="font-heading text-xl font-bold text-slate-700">{stats.partiallyPaidCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-border bg-white flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or booking ref..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select 
            className="flex-1 sm:w-40 rounded-lg border border-slate-300 py-2 px-3 text-sm"
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Fully Paid">Fully Paid</option>
          </select>
          <select 
            className="flex-1 sm:w-32 rounded-lg border border-slate-300 py-2 px-3 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="CAR">Car / Taxi</option>
            <option value="BUS">Bus</option>
            <option value="TRAIN">Train</option>
            <option value="FLIGHT">Flight</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground flex flex-col items-center">
            <RefreshCw className="h-6 w-6 animate-spin mb-2 text-slate-400" />
            Loading payment data...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard className="mx-auto mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm text-muted-foreground">No payment records found matching your filters.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-100 z-10 text-left text-xs uppercase tracking-wider text-muted-foreground shadow-sm">
              <tr>
                <th className="px-4 py-3">Booking Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-right">Paid</th>
                <th className="px-4 py-3 text-right">Balance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredBookings.map((bk) => {
                const total = Number(bk.total_amount) || 0;
                const paid = Number(bk.paid_total ?? bk.amount_paid ?? 0);
                const remaining = Number(bk.remaining_amount ?? bk.balance_amount ?? 0);
                const pStatus = String(bk.payment_status || "").toUpperCase();
                
                return (
                  <tr key={bk.id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-[color:var(--color-navy)]">
                        {bk.booking_number || `#${bk.id}`}
                      </span>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDate(bk.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{bk.passenger_name}</p>
                      <p className="text-xs text-muted-foreground">{bk.passenger_phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-medium">
                        {bk.category || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {formatCurrency(total)}
                    </td>
                    <td className="px-4 py-3 text-right text-emerald-700 font-medium">
                      {formatCurrency(paid)}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${remaining > 0 ? "text-rose-600" : "text-slate-500"}`}>
                      {formatCurrency(remaining)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          pStatus === "FULLY PAID"
                            ? "bg-emerald-100 text-emerald-800"
                            : pStatus === "PARTIALLY PAID"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {bk.payment_status || "UNPAID"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          title="View Booking Details"
                          onClick={() => {
                            setDrawerId(bk.id);
                            setDrawerOpen(true);
                          }}
                          className="rounded p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {remaining > 0 && String(bk.booking_status).toUpperCase() !== "CANCELLED" && (
                          <button
                            title="Record Payment"
                            onClick={() => {
                              setSelectedBooking(bk);
                              setPayForm({
                                amount: String(remaining),
                                method: "CASH",
                                reference_number: "",
                                payment_date: new Date().toISOString().split("T")[0],
                                notes: "",
                              });
                              setShowPaymentForm(true);
                            }}
                            className="rounded p-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Record Payment Modal */}
      {showPaymentForm && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-border bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-emerald-600" /> 
                Record Payment
              </h3>
              <button 
                onClick={() => setShowPaymentForm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                <p className="text-xs text-slate-500 mb-1">Booking Ref: <span className="font-mono font-bold text-slate-700">{selectedBooking.booking_number}</span></p>
                <p className="text-xs text-slate-500">Customer: <span className="font-bold text-slate-700">{selectedBooking.passenger_name}</span></p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between">
                  <span className="text-xs font-semibold text-slate-600">Balance Due:</span>
                  <span className="text-sm font-bold text-rose-600">
                    {formatCurrency(Number(selectedBooking.remaining_amount ?? selectedBooking.balance_amount ?? 0))}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Amount ₹ *
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/40"
                  value={payForm.amount}
                  onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                  placeholder="Enter amount"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                    Payment Method
                  </label>
                  <select
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/40"
                    value={payForm.method}
                    onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                  >
                    <option value="CASH">CASH</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK TRANSFER">BANK TRANSFER</option>
                    <option value="CARD">CARD</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/40"
                    value={payForm.payment_date}
                    onChange={(e) => setPayForm({ ...payForm, payment_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/40"
                  value={payForm.reference_number}
                  onChange={(e) => setPayForm({ ...payForm, reference_number: e.target.value })}
                  placeholder="UPI Ref / Txn ID (Optional)"
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold uppercase text-muted-foreground block mb-1">
                  Notes
                </label>
                <textarea
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500/40"
                  rows={2}
                  value={payForm.notes}
                  onChange={(e) => setPayForm({ ...payForm, notes: e.target.value })}
                  placeholder="Additional notes (Optional)"
                />
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Detail Drawer */}
      <BookingDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        bookingId={drawerId}
        onEdit={(id) => {
          setDrawerOpen(false);
          toast.info("Please edit from the Bookings Manager tab.");
        }}
        onChanged={() => loadBookings(true)}
      />
    </div>
  );
}
