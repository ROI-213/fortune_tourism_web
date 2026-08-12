import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  X,
  Printer,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  User,
  Phone,
  Car,
  FileText,
  DollarSign,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Transaction {
  source_type: string;
  id: number;
  ref_no?: string;
  entry_date?: string;
  passenger_name?: string;
  passenger_phone?: string;
  from_location?: string;
  to_location?: string;
  total_amt?: number;
  advance_amt?: number;
  due_amt?: number;
  paid_amt?: number;
  status?: string;
  notes?: string;
}

interface Summary {
  totalBilled: number;
  totalPaid: number;
  totalDue: number;
  totalAdvance: number;
  itemCount: number;
}

interface ClientHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientInfo: {
    id?: string | number;
    name: string;
    phone?: string;
    customer_code?: string;
    type: "customer" | "driver" | "passenger";
    cab_no?: string;
    vehicle?: string;
  };
}

export function ClientHistoryModal({ isOpen, onClose, clientInfo }: ClientHistoryModalProps) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary>({
    totalBilled: 0,
    totalPaid: 0,
    totalDue: 0,
    totalAdvance: 0,
    itemCount: 0,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [familySuffix, setFamilySuffix] = useState<string>("");

  // Settle modal state
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [isFullAccountClose, setIsFullAccountClose] = useState(false);
  const [settleAmount, setSettleAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [settleNotes, setSettleNotes] = useState<string>("");
  const [isSubmittingSettle, setIsSubmittingSettle] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let params = new URLSearchParams();
      if (clientInfo.type === "driver" && clientInfo.id) {
        params.append("driverId", String(clientInfo.id));
      } else if (clientInfo.id) {
        params.append("customerId", String(clientInfo.id));
      }
      if (clientInfo.phone) {
        params.append("phone", clientInfo.phone);
      }
      if (clientInfo.name) {
        params.append("name", clientInfo.name);
      }

      const res = await fetch(`/api/business/history?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary || {});
        setTransactions(data.transactions || []);
      } else {
        toast.error(data.error || "Failed to load client history");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching transaction history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, clientInfo]);

  if (!isOpen) return null;

  const inr = (amt: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const displayCustomerId = `${clientInfo.customer_code || `CUST-${clientInfo.phone || "001"}`}${familySuffix ? `-${familySuffix}` : ""}`;

  const handleOpenSettleSingle = (txn: Transaction) => {
    setSelectedTxn(txn);
    setIsFullAccountClose(false);
    setSettleAmount(String(txn.due_amt || 0));
    setPaymentMethod("Cash");
    setSettleNotes(`Settle ${txn.source_type} #${txn.ref_no || txn.id}`);
  };

  const handleOpenSettleFullAccount = () => {
    setIsFullAccountClose(true);
    setSelectedTxn({
      source_type: "FULL_ACCOUNT",
      id: 0,
      ref_no: displayCustomerId,
      due_amt: summary.totalDue,
      total_amt: summary.totalBilled,
    });
    setSettleAmount(String(summary.totalDue || 0));
    setPaymentMethod("Cash");
    setSettleNotes(`Full Account Settlement & Closure for ${clientInfo.name}`);
  };

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTxn) return;
    setIsSubmittingSettle(true);
    try {
      const res = await fetch("/api/business/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceType: isFullAccountClose ? "FULL_ACCOUNT" : selectedTxn.source_type,
          id: selectedTxn.id,
          amountToSettle: Number(settleAmount),
          paymentMethod,
          notes: settleNotes,
          customerId: clientInfo.type === "customer" ? clientInfo.id : undefined,
          driverId: clientInfo.type === "driver" ? clientInfo.id : undefined,
          phone: clientInfo.phone,
          name: clientInfo.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isFullAccountClose ? "Account closed & all dues settled!" : "Transaction settled successfully!");
        setSelectedTxn(null);
        setIsFullAccountClose(false);
        fetchHistory();
      } else {
        toast.error(data.error || "Settlement failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing settlement");
    } finally {
      setIsSubmittingSettle(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 p-2 text-blue-700">
                <FileText className="h-5 w-5" />
              </span>
              <h2 className="font-heading text-xl font-bold text-[#12213b]">
                {clientInfo.type === "driver" ? "Driver History & Account Ledger" : clientInfo.type === "passenger" ? "Passenger Trip History & Ledger" : "Client Account History & Ledger"}
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              View individual transaction history, dues & paid breakdown, and close account.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintPDF}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <Printer className="h-4 w-4 text-slate-500" /> Print PDF Report
            </button>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto space-y-6 pt-4 flex-1">
          {/* Profile Details & Full Account Settlement Action Header */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/40 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {clientInfo.type === "driver" ? (
                <div className="space-y-1 font-mono text-sm">
                  <div className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1">
                    <Car className="h-4 w-4 text-blue-600" /> DRIVER PROFILE & VEHICLE ASSIGNMENT
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-800 pt-1">
                    <p><strong className="text-slate-500">DRIVER NAME:</strong> {clientInfo.name.toUpperCase()}</p>
                    <p><strong className="text-slate-500">PHONE:</strong> {clientInfo.phone || "7204278924"}</p>
                    <p><strong className="text-slate-500">CAB NO:</strong> {clientInfo.cab_no || "KA 03 AF 4832"}</p>
                    <p><strong className="text-slate-500">VEHICLE:</strong> {clientInfo.vehicle || "Swift Dzire"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-base">{clientInfo.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    <span>{clientInfo.phone || "No phone number"}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-2">
                    CUSTOMER TICKET ID: <span className="bg-white px-2 py-0.5 rounded border border-slate-300 font-mono text-blue-700">{displayCustomerId}</span>
                  </div>
                </div>
              )}

              {/* Family Suffix & Full Account Settlement Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                {clientInfo.type !== "driver" && (
                  <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm text-xs">
                    <Users className="h-4 w-4 text-slate-500" />
                    <label className="font-semibold text-slate-600 whitespace-nowrap">Family Suffix:</label>
                    <select
                      value={familySuffix}
                      onChange={(e) => setFamilySuffix(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none"
                    >
                      <option value="">Main</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                        <option key={n} value={String(n)}>
                          -{n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Top Close Account & Settle All Dues Button */}
                {summary.totalDue > 0 ? (
                  <button
                    onClick={handleOpenSettleFullAccount}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition animate-pulse"
                  >
                    <Zap className="h-4 w-4" /> Close & Settle Full Account ({inr(summary.totalDue)})
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 px-4 py-2 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" /> Account Fully Settled & Closed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Summary Total Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 shadow-sm">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Billed</p>
              <p className="mt-1 text-xl font-bold text-slate-900">{inr(summary.totalBilled)}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 shadow-sm">
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Total Paid / Settled</p>
              <p className="mt-1 text-xl font-bold text-emerald-600">{inr(summary.totalPaid)}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4 border border-red-200 shadow-sm">
              <p className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Total Dues (Pending)</p>
              <p className="mt-1 text-xl font-bold text-red-600">{inr(summary.totalDue)}</p>
            </div>
            <div className="rounded-2xl bg-blue-50 p-4 border border-blue-200 shadow-sm">
              <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Office Advance</p>
              <p className="mt-1 text-xl font-bold text-blue-600">{inr(summary.totalAdvance)}</p>
            </div>
          </div>

          {/* Individual Transactions Table */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-heading text-sm font-bold text-slate-900">
                Individual Transaction History ({transactions.length} entries)
              </h3>
              <span className="text-xs text-slate-500 font-semibold">Same Day or Multi-Day Ledger</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading history records...</div>
            ) : transactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No prior transactions found for this profile.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="p-3">Source</th>
                      <th className="p-3">Ref No</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Route / Details</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Due</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.map((txn, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition">
                        <td className="p-3 font-semibold text-slate-800">{txn.source_type}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{txn.ref_no || `#${txn.id}`}</td>
                        <td className="p-3 text-slate-600 font-mono">{txn.entry_date ? String(txn.entry_date).slice(0, 10) : "—"}</td>
                        <td className="p-3 text-slate-700">
                          {txn.from_location && txn.to_location
                            ? `${txn.from_location} → ${txn.to_location}`
                            : txn.passenger_name || "—"}
                        </td>
                        <td className="p-3 text-right font-bold text-slate-900">{inr(txn.total_amt || 0)}</td>
                        <td className="p-3 text-right font-bold text-emerald-600">{inr(txn.paid_amt || 0)}</td>
                        <td className="p-3 text-right font-bold text-red-600">
                          {Number(txn.due_amt || 0) > 0 ? inr(txn.due_amt || 0) : "₹0"}
                        </td>
                        <td className="p-3 text-center whitespace-nowrap">
                          {Number(txn.due_amt || 0) > 0 ? (
                            <button
                              onClick={() => handleOpenSettleSingle(txn)}
                              className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-red-700 transition"
                            >
                              Settle Txn
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settle Account Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-heading text-lg font-bold text-slate-900">
                  {isFullAccountClose ? "Close & Settle Full Account Balance" : "Settle Individual Transaction"}
                </h3>
                <p className="text-xs text-slate-500">
                  {isFullAccountClose
                    ? `Close account for ${clientInfo.name} and settle all pending dues.`
                    : `Clear due amount for ${selectedTxn.source_type} (${selectedTxn.ref_no || `#${selectedTxn.id}`}).`}
                </p>
              </div>
              <button
                onClick={() => setSelectedTxn(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSettleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Total Outstanding Dues Pending</label>
                <div className="text-xl font-extrabold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                  {inr(selectedTxn.due_amt || 0)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Amount Settled / Received (₹) *</label>
                <input
                  type="number"
                  value={settleAmount}
                  onChange={(e) => setSettleAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Credit / Debit Card</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Settlement Remarks</label>
                <input
                  type="text"
                  value={settleNotes}
                  onChange={(e) => setSettleNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter remarks..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTxn(null)}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSettle}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {isSubmittingSettle ? "Processing..." : isFullAccountClose ? "Confirm & Close Entire Account" : "Confirm Settlement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
