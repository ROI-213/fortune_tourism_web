import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Printer,
  Plus,
  TrendingDown,
  DollarSign,
  Fuel,
  Wrench,
  UserCheck,
  Building,
  CreditCard,
  FileText,
  Search,
  Filter,
  Loader2,
  RefreshCw,
  PlusCircle,
} from "lucide-react";

interface ExpenseRow {
  id: number | string;
  expense_date: string;
  category: string;
  amount: number;
  payment_method?: string;
  description?: string;
  paid_to?: string;
  reference?: string;
  notes?: string;
}

export function DailyExpenseReport() {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [showCalendarView, setShowCalendarView] = useState<boolean>(true);

  // New Quick Expense Form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("Fuel / Petrol");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [notes, setNotes] = useState<string>("");
  const [receiptNo, setReceiptNo] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  const fetchDailyExpenses = useCallback(async (dateStr: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/business/expenses?limit=500&startDate=${dateStr}&endDate=${dateStr}`);
      const data = await res.json();
      if (data.success) {
        setExpenses(data.rows || []);
      } else {
        toast.error(data.error || "Failed to load expenses");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load daily expenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDailyExpenses(selectedDate);
  }, [selectedDate, fetchDailyExpenses]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  const handleToday = () => {
    setSelectedDate(new Date().toISOString().slice(0, 10));
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid expense amount");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/business/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expense_date: selectedDate,
          category,
          description: notes || category,
          amount: Number(amount),
          payment_method: paymentMethod,
          reference: receiptNo || `EXP-${Date.now().toString().slice(-6)}`,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Daily expense recorded successfully!");
        setShowAddForm(false);
        setAmount("");
        setNotes("");
        setReceiptNo("");
        fetchDailyExpenses(selectedDate);
      } else {
        toast.error(data.error || "Failed to save expense");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving expense record");
    } finally {
      setSaving(false);
    }
  };

  const inr = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n || 0);

  // Calculations
  const filtered = expenses.filter(
    (e) =>
      !search ||
      String(e.category || "").toLowerCase().includes(search.toLowerCase()) ||
      String(e.description || "").toLowerCase().includes(search.toLowerCase()) ||
      String(e.paid_to || "").toLowerCase().includes(search.toLowerCase()) ||
      String(e.reference || "").toLowerCase().includes(search.toLowerCase()) ||
      String(e.notes || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalDailyExpense = filtered.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const fuelTotal = filtered
    .filter((e) => ["fuel", "petrol"].some((k) => String(e.category).toLowerCase().includes(k)))
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const driverBataTotal = filtered
    .filter((e) => ["driver", "bata"].some((k) => String(e.category).toLowerCase().includes(k)))
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const maintenanceTotal = filtered
    .filter((e) => ["repair", "maintenance", "vehicle"].some((k) => String(e.category).toLowerCase().includes(k)))
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const otherTotal = totalDailyExpense - (fuelTotal + driverBataTotal + maintenanceTotal);

  return (
    <div className="space-y-6">
      {/* Header Bar & Date Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-700">
              <TrendingDown className="h-5 w-5" />
            </span>
            <h2 className="font-heading text-xl font-bold text-slate-900">Everyday Expense Report & Log</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track daily operating expenses, driver bata, fuel, repairs, and download daily accounting sheets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          {/* Date Picker & Prev/Next Day Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={handlePrevDay}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 font-bold transition"
              title="Previous Day"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-lg font-bold text-slate-900 border border-slate-300 text-xs focus:outline-none"
            />
            <button
              onClick={handleNextDay}
              className="p-1.5 rounded-lg hover:bg-white text-slate-700 font-bold transition"
              title="Next Day"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1.5 rounded-lg bg-[color:var(--color-navy)] text-white font-bold text-[11px] shadow-sm hover:brightness-110"
            >
              Today
            </button>
          </div>

          <button
            onClick={() => setShowCalendarView((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition shadow-sm ${
              showCalendarView
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            {showCalendarView ? "Hide Calendar" : "Daily Calendar"}
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Printer className="h-3.5 w-3.5 text-blue-600" /> Print Daily PDF Report
          </button>

          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 transition"
          >
            <Plus className="h-4 w-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Interactive Daily Calendar View Section */}
      {showCalendarView && (
        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-md space-y-4 animate-fadeIn print:hidden">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-red-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Daily Expense Calendar Selector — {new Date(selectedDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click any date to switch report view</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-1 bg-slate-50 rounded-lg">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {(() => {
              const curDate = new Date(selectedDate);
              const year = curDate.getFullYear();
              const month = curDate.getMonth();
              const firstDay = new Date(year, month, 1).getDay();
              const daysInMonth = new Date(year, month + 1, 0).getDate();
              const cells = [];

              for (let i = 0; i < firstDay; i++) {
                cells.push(<div key={`blank-${i}`} className="h-12 rounded-xl bg-slate-50/50" />);
              }

              for (let d = 1; d <= daysInMonth; d++) {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === new Date().toISOString().slice(0, 10);

                cells.push(
                  <button
                    key={d}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition border ${
                      isSelected
                        ? "bg-red-600 text-white border-red-700 shadow-md ring-2 ring-red-400/40"
                        : isToday
                        ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span>{d}</span>
                    {isSelected && <span className="text-[9px] font-normal opacity-90">Selected</span>}
                  </button>
                );
              }
              return cells;
            })()}
          </div>
        </div>
      )}

      {/* Everyday Financial Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 p-4 border border-red-200 shadow-sm">
          <div className="flex items-center justify-between text-red-700 text-xs font-bold uppercase tracking-wider">
            <span>Total Daily Expense</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-extrabold text-red-700">{inr(totalDailyExpense)}</p>
          <span className="text-[10px] text-red-600 font-medium">For {selectedDate}</span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 p-4 border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold uppercase tracking-wider">
            <span>Fuel & Petrol</span>
            <Fuel className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-900">{inr(fuelTotal)}</p>
          <span className="text-[10px] text-amber-700 font-medium">{filtered.filter(e => e.category?.includes("Fuel")).length} fuel bills</span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold uppercase tracking-wider">
            <span>Driver Bata & Allowances</span>
            <UserCheck className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-900">{inr(driverBataTotal)}</p>
          <span className="text-[10px] text-blue-700 font-medium">Driver payouts</span>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between text-purple-800 text-xs font-bold uppercase tracking-wider">
            <span>Repairs & Maintenance</span>
            <Wrench className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-bold text-purple-900">{inr(maintenanceTotal)}</p>
          <span className="text-[10px] text-purple-700 font-medium">Garage & vehicle servicing</span>
        </div>
      </div>

      {/* Add Quick Expense Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-heading text-lg font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-red-600" /> Record Daily Expense ({selectedDate})
              </h3>
              <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Fuel / Petrol">Fuel / Petrol</option>
                    <option value="Driver Bata / Allowance">Driver Bata / Allowance</option>
                    <option value="Vehicle Repair & Servicing">Vehicle Repair & Servicing</option>
                    <option value="Toll & Parking Fees">Toll & Parking Fees</option>
                    <option value="Office Rent & Utilities">Office Rent & Utilities</option>
                    <option value="Loan EMI Payment">Loan EMI Payment</option>
                    <option value="Home / Personal">Home / Personal</option>
                    <option value="Miscellaneous">Miscellaneous</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expense Amount (₹) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-bold text-slate-900 text-sm focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 font-semibold focus:ring-2 focus:ring-red-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / GPay / PhonePe</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Receipt / Voucher Number</label>
                <input
                  type="text"
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                  placeholder="e.g. EXP-8849"
                  className="w-full rounded-xl border border-slate-300 p-2.5 font-mono focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Remarks</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Enter vehicle number, petrol pump, or driver details..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-300 p-2.5 focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Expense Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Everyday Expense Log Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden space-y-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 p-4 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-red-600" />
            <h3 className="font-heading text-sm font-bold text-slate-900">
              Daily Expense Line Items for <span className="text-red-600 font-mono">{selectedDate}</span> ({filtered.length} entries)
            </h3>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter daily expenses..."
                className="pl-8 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs w-44 focus:outline-none"
              />
            </div>
            <button
              onClick={() => fetchDailyExpenses(selectedDate)}
              className="p-2 rounded-xl border border-slate-300 hover:bg-slate-100"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading daily expense report...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No expenses logged for <span className="font-bold">{selectedDate}</span>. Click <span className="font-bold text-red-600">Add Expense</span> to record one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="px-4 py-3">Receipt / Voucher</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description / Details</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filtered.map((exp) => (
                  <tr key={String(exp.id)} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">
                      {exp.reference || `EXP-${exp.id}`}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 rounded-md font-bold text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      <div>{exp.description || exp.category}</div>
                      {exp.paid_to && <div className="text-[10px] text-slate-500 mt-0.5">Paid to: {exp.paid_to}</div>}
                      {exp.notes && <div className="text-[10px] text-slate-400 mt-0.5 italic">{exp.notes}</div>}
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">
                      {exp.payment_method || "Cash"}
                    </td>
                    <td className="px-4 py-3 text-right font-extrabold text-red-600 text-sm">
                      {inr(Number(exp.amount))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-900 text-white font-bold text-xs">
                <tr>
                  <td colSpan={4} className="px-4 py-3 text-right uppercase tracking-wider">
                    Total Daily Expense ({selectedDate}):
                  </td>
                  <td className="px-4 py-3 text-right text-base text-amber-400 font-extrabold">
                    {inr(totalDailyExpense)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
