import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Search,
  Loader2,
  Calendar as CalendarIcon,
  FileText,
  Filter,
  X,
  Printer,
  Eye,
  SlidersHorizontal,
  Check,
  Ticket,
  AlertTriangle,
  ChevronRight,
  User,
  Phone,
  Building,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import { RecordFormDialog } from "@/components/business/RecordFormDialog";
import { ClientHistoryModal } from "@/components/business/ClientHistoryModal";
import type { ResourceConfig } from "@/lib/business-schema";

interface RowData {
  id: string | number;
  [key: string]: unknown;
}

const FRIENDLY_COLUMNS: Record<string, string> = {
  created_at: "Created",
  booking_date: "Booking Date",
  travel_date: "Travel Date",
  journey_date: "Journey Date",
  payment_date: "Payment Date",
  due_date: "Due Date",
  expense_date: "Expense Date",
  repair_date: "Repair Date",
  transaction_date: "Txn Date",
  booking_number: "Booking No.",
  serial_number: "Serial No.",
  passenger_name: "Passenger Name",
  date_of_birth: "Date of Birth (DOB)",
  dob: "Date of Birth (DOB)",
  infant: "Infant Details",
  has_infant: "Has Infant",
  from_location: "From",
  to_location: "To",
  due_amount: "Due Amount",
  paid_amount: "Paid Amount",
  remaining_amount: "Remaining",
  total_amount: "Total Amount",
  booking_amount: "Booking Amt",
  settled_amount: "Settled Amount",
  to_pay: "To Pay",
  office_advance: "Office Advance",
  vehicle_number: "Car Reg. No.",
  family_suffix: "Family Suffix",
  customer_code: "Customer ID",
  debited_months: "Debited Months",
  fine_amount: "Late Fines (₹)",
  late_payment_fine_rate: "Fine Rate (%)",
};

function columnLabel(column: string): string {
  if (FRIENDLY_COLUMNS[column]) return FRIENDLY_COLUMNS[column];
  return column.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderCellContent(cfg: ResourceConfig, column: string, value: unknown) {
  if (value === null || value === undefined || value === "") return <span className="text-slate-300">—</span>;

  if (column.startsWith("ref__")) return <span>{String(value)}</span>;

  const field = cfg.fields.find((f) => f.name === column);

  if (
    field?.type === "money" ||
    column.endsWith("_amount") ||
    column === "to_pay" ||
    column === "bata" ||
    column === "toll" ||
    column === "debit" ||
    column === "credit" ||
    column === "fine_amount" ||
    column === "emi" ||
    column === "vehicle_price"
  ) {
    const n = Number(value);
    if (Number.isNaN(n)) return <span>{String(value)}</span>;
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

    if (column === "due_amount" || column === "remaining_amount" || column === "to_pay" || column === "fine_amount") {
      return (
        <span className={`inline-block font-bold text-xs ${n > 0 ? "text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200" : "text-slate-600"}`}>
          {formatted}
        </span>
      );
    }
    if (column === "paid_amount" || column === "settled_amount") {
      return (
        <span className={`inline-block font-bold text-xs ${n > 0 ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200" : "text-slate-600"}`}>
          {formatted}
        </span>
      );
    }
    if (column === "office_advance" || column === "opening_balance") {
      return (
        <span className={`inline-block font-bold text-xs ${n > 0 ? "text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200" : "text-slate-600"}`}>
          {formatted}
        </span>
      );
    }

    return <span className="font-semibold text-slate-800">{formatted}</span>;
  }

  if (field?.type === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (
    field?.type === "date" ||
    column.endsWith("_date") ||
    column.endsWith("_expiry") ||
    column.endsWith("_expiry_date")
  ) {
    return <span className="font-mono text-slate-600">{String(value).slice(0, 10)}</span>;
  }
  return <span>{String(value)}</span>;
}

export function ResourceManager({ resource }: { resource: ResourceConfig }) {
  const [rows, setRows] = useState<RowData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [hiddenCols, setHiddenCols] = useState<string[]>([]);
  const [showColMenu, setShowColMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [queryText, setQueryText] = useState("");
  const [search, setSearch] = useState("");

  // Date Range Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // View toggles (Calendar view for train_bookings)
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");

  // Dialogs & Modals
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<RowData | null>(null);

  // Client History Modal
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{
    id?: string | number;
    name: string;
    phone?: string;
    customer_code?: string;
    type: "customer" | "driver" | "passenger";
    cab_no?: string;
    vehicle?: string;
  } | null>(null);

  // Ticket Modal state
  const [ticketModalRow, setTicketModalRow] = useState<RowData | null>(null);
  const [familySuffix, setFamilySuffix] = useState<string>("");

  // Vehicle Forecast EMI & Fines Modal state
  const [forecastModalRow, setForecastModalRow] = useState<RowData | null>(null);

  // Accounts Full Transactions Modal state
  const [accountTxnModalRow, setAccountTxnModalRow] = useState<RowData | null>(null);
  const [accountTxns, setAccountTxns] = useState<RowData[]>([]);
  const [loadingTxns, setLoadingTxns] = useState(false);

  const fetchRows = useCallback(
    async (q?: string, start?: string, end?: string) => {
      setLoading(true);
      try {
        let url = `/api/business/${resource.key}?limit=500`;
        if (q) url += `&q=${encodeURIComponent(q)}`;
        if (start) url += `&startDate=${encodeURIComponent(start)}`;
        if (end) url += `&endDate=${encodeURIComponent(end)}`;

        const res = await fetch(url);
        const d = await res.json();
        if (!d.success) throw new Error(d.error || "Failed to load");
        setRows(d.rows || []);
        setColumns(d.columns || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to load records");
      } finally {
        setLoading(false);
      }
    },
    [resource.key],
  );

  useEffect(() => {
    fetchRows(search, startDate, endDate);
  }, [fetchRows, search, startDate, endDate]);

  const handleDelete = async (row: RowData) => {
    if (!confirm(`Delete this ${resource.label.toLowerCase()} record? This cannot be undone.`))
      return;
    try {
      const res = await fetch(
        `/api/business/${resource.key}?id=${encodeURIComponent(String(row.id))}`,
        {
          method: "DELETE",
        },
      );
      const d = await res.json();
      if (!d.success) throw new Error(d.error || "Delete failed");
      toast.success(`${resource.label} deleted`);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleQuickFilter = (preset: "today" | "yesterday" | "this_month" | "last_month" | "clear") => {
    const now = new Date();
    if (preset === "today") {
      const d = now.toISOString().slice(0, 10);
      setStartDate(d);
      setEndDate(d);
    } else if (preset === "yesterday") {
      const prev = new Date(now);
      prev.setDate(prev.getDate() - 1);
      const d = prev.toISOString().slice(0, 10);
      setStartDate(d);
      setEndDate(d);
    } else if (preset === "this_month") {
      const first = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      setStartDate(first);
      setEndDate(last);
    } else if (preset === "last_month") {
      const first = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
      const last = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);
      setStartDate(first);
      setEndDate(last);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const openHistoryFor = (row: RowData) => {
    if (resource.key === "drivers") {
      setSelectedClient({
        id: row.id,
        name: String(row.driver_name || "Driver"),
        phone: String(row.phone || ""),
        type: "driver",
        cab_no: String(row.vehicle_number || "KA03AF4832"),
        vehicle: String(row.vehicle_type || "Swift Dzire"),
      });
    } else if (resource.key === "customers") {
      setSelectedClient({
        id: row.id,
        name: String(row.name || "Customer"),
        phone: String(row.phone || ""),
        customer_code: String(row.customer_code || `CUST-${String(row.phone || "").replace(/\D/g, "")}`),
        type: "customer",
      });
    } else {
      setSelectedClient({
        id: row.customer_id ? String(row.customer_id) : undefined,
        name: String(row.passenger_name || row.ref__customer_id || row.driver_name || "Client"),
        phone: String(row.passenger_phone || row.driver_phone || row.phone || ""),
        type: row.driver_name ? "driver" : "customer",
      });
    }
    setHistoryModalOpen(true);
  };

  // Open Full Account Transactions
  const openAccountTransactions = async (accountRow: RowData) => {
    setAccountTxnModalRow(accountRow);
    setLoadingTxns(true);
    try {
      const res = await fetch(`/api/business/account_transactions?limit=500`);
      const d = await res.json();
      if (d.success) {
        const filtered = (d.rows || []).filter(
          (t: RowData) => String(t.account_id) === String(accountRow.id)
        );
        setAccountTxns(filtered);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load account transactions");
    } finally {
      setLoadingTxns(false);
    }
  };

  // Toggle column visibility
  const toggleColumn = (col: string) => {
    if (hiddenCols.includes(col)) {
      setHiddenCols(hiddenCols.filter((c) => c !== col));
    } else {
      setHiddenCols([...hiddenCols, col]);
    }
  };

  const visibleColumns = columns.filter((col) => !hiddenCols.includes(col));

  // Print PDF report for current table view
  const handlePrintPdfReport = () => {
    window.print();
  };

  // Currency Formatter
  const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n || 0);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden space-y-0">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border p-5 bg-slate-50/50">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-lg font-bold text-slate-900">{resource.plural}</h2>
            {resource.key === "train_bookings" && (
              <div className="inline-flex rounded-lg border border-slate-300 bg-white p-0.5 text-xs">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition ${
                    viewMode === "table" ? "bg-[color:var(--color-navy)] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                    viewMode === "calendar" ? "bg-[color:var(--color-navy)] text-white" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <CalendarIcon className="h-3 w-3" /> Calendar View
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{resource.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setSearch(queryText)}
              placeholder="Search records..."
              className="pl-9 rounded-xl border border-border bg-white px-3 py-2 text-xs w-48 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* Column Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-slate-50 transition"
              title="Select Columns to View"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-slate-600" />
              Columns ({visibleColumns.length})
            </button>
            {showColMenu && (
              <div className="absolute right-0 top-full mt-1 z-30 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl space-y-1 text-xs">
                <div className="font-bold text-slate-700 pb-2 border-b text-[11px] uppercase tracking-wider">
                  Select Dropdown Columns
                </div>
                <div className="max-h-60 overflow-y-auto space-y-1 pt-1">
                  {columns.map((col) => {
                    const isVisible = !hiddenCols.includes(col);
                    return (
                      <label
                        key={col}
                        onClick={() => toggleColumn(col)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer select-none"
                      >
                        <span className={`h-4 w-4 rounded border flex items-center justify-center ${isVisible ? "bg-[color:var(--color-navy)] border-[color:var(--color-navy)] text-white" : "border-slate-300 bg-white"}`}>
                          {isVisible && <Check className="h-3 w-3" />}
                        </span>
                        <span className="text-slate-800 font-medium">{columnLabel(col)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* PDF Print Report Button */}
          <button
            onClick={handlePrintPdfReport}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100 transition"
            title="Print PDF Report for filtered entries"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" /> PDF Print Report
          </button>

          <button
            onClick={() => fetchRows(search, startDate, endDate)}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 text-xs font-medium shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[color:var(--color-navy)] px-4 py-2 text-xs font-semibold text-white shadow transition hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Add {resource.label}
          </button>
        </div>
      </div>

      {/* Date Range Filter Bar (Day-to-day & Month-to-month) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3 text-xs print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-600 flex items-center gap-1">
            <CalendarIcon className="h-3.5 w-3.5 text-blue-600" /> Date Wise Entry View:
          </span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none"
            placeholder="From Date"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none"
            placeholder="To Date"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => handleQuickFilter("clear")}
              className="p-1 rounded text-red-500 hover:bg-red-50"
              title="Clear date filter"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Quick Date Presets */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleQuickFilter("today")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Today
          </button>
          <button
            onClick={() => handleQuickFilter("yesterday")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Yesterday
          </button>
          <button
            onClick={() => handleQuickFilter("this_month")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            This Month
          </button>
          <button
            onClick={() => handleQuickFilter("last_month")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Calendar View for Train Bookings */}
      {viewMode === "calendar" && resource.key === "train_bookings" ? (
        <div className="p-6 bg-slate-50 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-blue-600" /> Train Bookings Calendar Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((row) => (
              <div key={String(row.id)} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between border-b pb-2 mb-2">
                  <span className="font-bold text-xs text-blue-700">Train: {String(row.train_number || "Express")}</span>
                  <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                    {String(row.ticket_status || "Confirmed")}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">{String(row.passenger_name)}</p>
                <p className="text-[11px] text-slate-500">Travel Date: {String(row.travel_date || row.booking_date || "").slice(0, 10)}</p>
                <p className="text-[11px] text-slate-600 mt-1">Route: {String(row.from_location || "Source")} → {String(row.to_location || "Dest")}</p>
                <p className="text-[11px] text-slate-600">PNR: <span className="font-mono font-bold">{String(row.pnr || "N/A")}</span> | Class: {String(row.class || "SL")}</p>
                <div className="mt-3 pt-2 border-t flex justify-end gap-2">
                  <button
                    onClick={() => openHistoryFor(row)}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700"
                  >
                    Client History
                  </button>
                  <button
                    onClick={() => setTicketModalRow(row)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700"
                  >
                    <Ticket className="h-3 w-3" /> Ticket View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Main Table */
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex items-center justify-center text-muted-foreground text-xs gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading {resource.plural.toLowerCase()}...
            </div>
          ) : rows.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-xs">No records found.</div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  {visibleColumns.map((col) => (
                    <th key={col} className="px-4 py-3 whitespace-nowrap">
                      {columnLabel(col)}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right whitespace-nowrap print:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={String(row.id)} className="hover:bg-slate-50/80 transition">
                    {visibleColumns.map((col) => (
                      <td key={col} className="px-4 py-3 whitespace-nowrap max-w-[240px] truncate">
                        {renderCellContent(resource, col, row[col])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap print:hidden">
                      <div className="inline-flex items-center gap-1">
                        {/* Account Full Transactions Button */}
                        {resource.key === "accounts" && (
                          <button
                            onClick={() => openAccountTransactions(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-purple-200 bg-purple-50 px-2 py-1 text-[11px] font-bold text-purple-700 hover:bg-purple-100 transition shadow-sm"
                            title="View Full Debit/Credit Transactions"
                          >
                            <CreditCard className="h-3 w-3" /> Full Txns
                          </button>
                        )}

                        {/* Vehicle Forecast EMI Schedule & Fines Button */}
                        {resource.key === "vehicle_forecasts" && (
                          <button
                            onClick={() => setForecastModalRow(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-800 hover:bg-amber-100 transition shadow-sm"
                            title="View EMI Schedule, Debited Months & Fines"
                          >
                            <Eye className="h-3 w-3" /> EMI & Fines
                          </button>
                        )}

                        {/* Ticket View Button */}
                        {["day_book_entries", "cab_bookings", "package_trips", "train_bookings", "flight_bookings", "bus_bookings", "customers"].includes(resource.key) && (
                          <button
                            onClick={() => setTicketModalRow(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition shadow-sm"
                            title="View Printable Ticket"
                          >
                            <Ticket className="h-3 w-3" /> Ticket
                          </button>
                        )}

                        {/* Client History Button */}
                        <button
                          onClick={() => openHistoryFor(row)}
                          className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700 hover:bg-blue-100 transition shadow-sm"
                          title="View History & Ledger"
                        >
                          <FileText className="h-3 w-3" /> History
                        </button>

                        <button
                          onClick={() => {
                            setEditing(row);
                            setDialogOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-700 rounded-lg"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(row)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Record Form Dialog */}
      {dialogOpen && (
        <RecordFormDialog
          resource={resource}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          initialValues={editing ?? undefined}
          onSaved={(row) => {
            if (editing) {
              setRows((prev) => prev.map((r) => (r.id === row.id ? (row as RowData) : r)));
            } else {
              setRows((prev) => [row as RowData, ...prev]);
            }
          }}
        />
      )}

      {/* Client History Modal */}
      {historyModalOpen && selectedClient && (
        <ClientHistoryModal
          isOpen={historyModalOpen}
          onClose={() => setHistoryModalOpen(false)}
          clientInfo={selectedClient}
        />
      )}

      {/* -------------------- MODAL: TICKET VIEW -------------------- */}
      {ticketModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Ticket className="h-5 w-5 text-emerald-600" />
                Ticket Copy For Your Journey
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border text-xs">
                  <span className="text-[11px] font-semibold text-slate-600">Family ID:</span>
                  <select
                    value={familySuffix}
                    onChange={(e) => setFamilySuffix(e.target.value)}
                    className="rounded border text-[11px] font-bold px-1 py-0.5 bg-white"
                  >
                    <option value="">Main</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                      <option key={n} value={String(n)}>
                        -{n}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                >
                  <Printer className="h-3.5 w-3.5 text-blue-600" /> Print Ticket PDF
                </button>
                <button
                  onClick={() => setTicketModalRow(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Ticket Copy Sheet - Matching User Spreadsheet Screenshot */}
            <div className="statement-printable-sheet border-2 border-slate-900 bg-white p-6 space-y-4 text-xs">
              {/* Top Address & Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-3 gap-2">
                <div>
                  <h2 className="text-xl font-extrabold text-[color:var(--color-navy)] uppercase tracking-tight">
                    FORTUNE TOURISM & TRAVELS
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-700 mt-0.5">
                    Address: No.256/A next To Narayana Hospital, Health City, Bommasandra Bangalore.560099
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900">
                    Phone No: +91 9740463404
                  </p>
                  <span className="inline-block mt-1 bg-slate-900 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                    OFFICIAL VOUCHER
                  </span>
                </div>
              </div>

              {/* Title Header Bar */}
              <div className="bg-slate-900 text-white font-bold text-sm px-4 py-2 text-center tracking-wider uppercase rounded-md">
                Ticket Copy For Your Journey
              </div>

              {/* Structured Grid Table matching screenshot */}
              <div className="border border-slate-800 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <tbody className="divide-y divide-slate-300">
                    <tr className="divide-x divide-slate-300 bg-slate-50">
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100 w-1/6">Customer:</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900 w-2/6">
                        {String(ticketModalRow.passenger_name || ticketModalRow.name || "FORTUNE GROUP")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100 w-1/6">Customer Phone No.:</th>
                      <td className="py-2.5 px-3 text-slate-900 font-bold w-1/6">
                        {String(ticketModalRow.passenger_phone || ticketModalRow.phone || "9845003000")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100 w-1/6">Tour Type</th>
                      <td className="py-2.5 px-3 text-slate-900 font-bold w-1/6">
                        {String(ticketModalRow.tour_type || ticketModalRow.car_type || "LOCAL TRIP")}
                      </td>
                    </tr>

                    <tr className="divide-x divide-slate-300">
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Ticket Number:</th>
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        {String(ticketModalRow.booking_number || ticketModalRow.serial_number || ticketModalRow.ticket_number || "FT3423CZ")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">PNR Number:</th>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {String(ticketModalRow.pnr || "FC17G3423")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Departure On:</th>
                      <td className="py-2.5 px-3 text-slate-900 font-semibold">
                        {String(ticketModalRow.travel_date || ticketModalRow.booking_date || "14-07-2017").slice(0, 10)} {String(ticketModalRow.travel_time || ticketModalRow.flight_time || "10.45")}
                      </td>
                    </tr>

                    <tr className="divide-x divide-slate-300 bg-slate-50">
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Trip Type:</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {String(ticketModalRow.trip_type || ticketModalRow.category || "PACKAGE")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Type Of Car:</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {String(ticketModalRow.car_type || ticketModalRow.vehicle_type || "MARUTI SUZUKI CIAZ")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Boarding point:</th>
                      <td className="py-2.5 px-3 text-slate-900 font-semibold">
                        {String(ticketModalRow.pickup_location || ticketModalRow.from_location || "BANGALORE AIRPORT")}
                      </td>
                    </tr>

                    <tr className="divide-x divide-slate-300">
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Driver Name:</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {String(ticketModalRow.driver_name || "ZAMEER")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Phone Number:</th>
                      <td className="py-2.5 px-3 text-slate-900 font-semibold">
                        {String(ticketModalRow.driver_phone || "9740463404")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Taxi Number:</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900 font-mono">
                        {String(ticketModalRow.vehicle_number || ticketModalRow.taxi_number || ticketModalRow.bus_number || "KA 51 AA 598")}
                      </td>
                    </tr>

                    <tr className="divide-x divide-slate-300 bg-slate-50">
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Package:</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900" colSpan={1}>
                        {String(ticketModalRow.tour_name || ticketModalRow.package || "BANGALORE SIGHT SEEING ONE DAY")}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Boarding Point</th>
                      <td className="py-2.5 px-3 font-bold text-slate-900" colSpan={3}>
                        {String(ticketModalRow.boarding_point || ticketModalRow.pickup_location || "AKASH GUEST HOUSE BOMMASANDRA BANGALORE")}
                      </td>
                    </tr>

                    <tr className="divide-x divide-slate-300 font-bold">
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Advance Amount</th>
                      <td className="py-2.5 px-3 text-blue-700">
                        {inr(Number(ticketModalRow.office_advance || ticketModalRow.advance_amount || 1000))}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Balance Amount:</th>
                      <td className="py-2.5 px-3 text-red-600">
                        {inr(Number(ticketModalRow.due_amount || ticketModalRow.remaining_amount || 9000))}
                      </td>
                      <th className="py-2.5 px-3 font-bold text-slate-700 bg-slate-100">Total Amount:</th>
                      <td className="py-2.5 px-3 text-emerald-700 text-sm">
                        {inr(Number(ticketModalRow.total_amount || ticketModalRow.booking_amount || ticketModalRow.amount || 9000))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Terms And Conditions */}
              <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 space-y-1">
                <p className="font-bold text-slate-900 text-xs">Terms And Conditions</p>
                <p className="text-[11px] text-slate-700">
                  • This ticket is valid for particular journey, which service is Issued
                </p>
                <p className="text-[11px] text-slate-700">
                  • Subject To Bangalore Jurisdictions Only
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: VEHICLE PURCHASE FORECAST EMI & FINES -------------------- */}
      {forecastModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-600" />
                Vehicle Purchase Forecast & EMI Debited Months
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
                >
                  <Printer className="h-3.5 w-3.5 text-blue-600" /> Auto PDF Print
                </button>
                <button
                  onClick={() => setForecastModalRow(null)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Car Model</span>
                  <p className="font-bold text-slate-900 text-sm">{String(forecastModalRow.car_model || "Toyota Innova Crysta")}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Vehicle Price</span>
                  <p className="font-bold text-blue-900">{inr(Number(forecastModalRow.vehicle_price || 2400000))}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Monthly EMI</span>
                  <p className="font-bold text-slate-900">{inr(Number(forecastModalRow.emi || 38000))}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Debited Months Paid</span>
                  <p className="font-extrabold text-emerald-700 text-sm">
                    {Number(forecastModalRow.debited_months || 6)} Months
                  </p>
                </div>
              </div>

              {/* Late Payment Fine Card */}
              <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <span className="font-bold text-red-900 text-xs block">Late Payment Fines & Overdue Charges</span>
                    <span className="text-[11px] text-red-700">
                      Calculated @ {Number(forecastModalRow.late_payment_fine_rate || 2)}% per overdue month fine
                    </span>
                  </div>
                </div>
                <span className="text-base font-extrabold text-red-700">
                  {inr(Number(forecastModalRow.fine_amount || 4500))}
                </span>
              </div>

              {/* EMI Amortization Schedule Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-900 text-white font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Month #</th>
                      <th className="py-2.5 px-3">Due Date</th>
                      <th className="py-2.5 px-3 text-right">EMI Amount (₹)</th>
                      <th className="py-2.5 px-3 text-center">Debited Status</th>
                      <th className="py-2.5 px-3 text-right">Late Fine (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {Array.from({ length: Math.min(Number(forecastModalRow.loan_tenure || 12), 12) }).map((_, idx) => {
                      const mNum = idx + 1;
                      const isDebited = mNum <= Number(forecastModalRow.debited_months || 6);
                      const isOverdue = !isDebited && mNum === Number(forecastModalRow.debited_months || 6) + 1;
                      const emiAmt = Number(forecastModalRow.emi || 38000);
                      const fineAmt = isOverdue ? Number(forecastModalRow.fine_amount || 4500) : 0;

                      return (
                        <tr key={mNum} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 font-bold text-slate-800">Month {mNum}</td>
                          <td className="py-2.5 px-3 text-slate-600 font-mono">2026-0{Math.min(mNum, 9)}-10</td>
                          <td className="py-2.5 px-3 text-right font-bold text-slate-900">{inr(emiAmt)}</td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDebited ? "bg-emerald-100 text-emerald-800" : isOverdue ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-600"
                            }`}>
                              {isDebited ? "DEBITED (PAID)" : isOverdue ? "OVERDUE (FINE APPLIED)" : "UPCOMING"}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-red-600">
                            {fineAmt > 0 ? inr(fineAmt) : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- MODAL: ACCOUNTS FULL TRANSACTIONS -------------------- */}
      {accountTxnModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" />
                  Full Transactions Ledger — {String(accountTxnModalRow.account_name)}
                </h3>
                <p className="text-xs text-slate-500">
                  Account Type: {String(accountTxnModalRow.account_type)} | Opening Balance: {inr(Number(accountTxnModalRow.opening_balance || 0))}
                </p>
              </div>
              <button
                onClick={() => setAccountTxnModalRow(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              {loadingTxns ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading transactions...</div>
              ) : accountTxns.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No specific ledger transactions found for this account.</div>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-white font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3 text-right">Debit (₹)</th>
                      <th className="py-2.5 px-3 text-right">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {accountTxns.map((txn, idx) => (
                      <tr key={String(txn.id || idx)} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono">{String(txn.transaction_date || "").slice(0, 10)}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-700">{String(txn.transaction_type)}</td>
                        <td className="py-2.5 px-3 text-slate-800">{String(txn.description || "Account entry")}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-red-600">{Number(txn.debit) > 0 ? inr(Number(txn.debit)) : "-"}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-emerald-600">{Number(txn.credit) > 0 ? inr(Number(txn.credit)) : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
