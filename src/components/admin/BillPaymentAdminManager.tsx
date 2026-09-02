import { useState } from "react";
import {
  Receipt,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  FileText,
  Zap,
  Printer,
  X,
  Building,
  Flame,
  Droplets,
  CreditCard,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";

interface BillPaymentTxn {
  id: string;
  billRef: string;
  consumerNumber: string;
  consumerName: string;
  billerName: string;
  category: "Electricity" | "Water" | "Gas" | "FASTag" | "Broadband" | "Municipal Tax";
  dueDate: string;
  paymentDate: string;
  billAmount: number;
  convenienceFee: number;
  paymentMethod: "UPI" | "Cash" | "NetBanking" | "Debit Card";
  status: "Paid" | "Processing" | "Failed";
  bbpsRef: string;
}

const INITIAL_BILL_PAYMENTS: BillPaymentTxn[] = [
  {
    id: "BIL-501",
    billRef: "BBPS-FT-2026-9011",
    consumerNumber: "BESCOM-551029384",
    consumerName: "K. Narayana Murthy",
    billerName: "BESCOM (Bangalore Electricity)",
    category: "Electricity",
    dueDate: "2026-09-08",
    paymentDate: "2026-09-02 11:30 AM",
    billAmount: 3420,
    convenienceFee: 10,
    paymentMethod: "UPI",
    status: "Paid",
    bbpsRef: "BBPSET998822331",
  },
  {
    id: "BIL-502",
    billRef: "BBPS-FT-2026-9012",
    consumerNumber: "BWSSB-77210982",
    consumerName: "S. Geetha",
    billerName: "BWSSB Water Board",
    category: "Water",
    dueDate: "2026-09-12",
    paymentDate: "2026-09-02 10:15 AM",
    billAmount: 840,
    convenienceFee: 5,
    paymentMethod: "Cash",
    status: "Paid",
    bbpsRef: "BBPSWT445566772",
  },
  {
    id: "BIL-503",
    billRef: "BBPS-FT-2026-9013",
    consumerNumber: "INDANE-66228811",
    consumerName: "Vinod R. Nair",
    billerName: "Indane LPG Cylinder Booking",
    category: "Gas",
    dueDate: "2026-09-04",
    paymentDate: "2026-09-02 09:40 AM",
    billAmount: 895,
    convenienceFee: 10,
    paymentMethod: "UPI",
    status: "Paid",
    bbpsRef: "BBPSGS112233994",
  },
  {
    id: "BIL-504",
    billRef: "BBPS-FT-2026-9014",
    consumerNumber: "FASTAG-KA01MH7788",
    consumerName: "Fortune Fleet Vehicle 04",
    billerName: "ICICI Bank FASTag",
    category: "FASTag",
    dueDate: "Immediate",
    paymentDate: "2026-09-02 08:20 AM",
    billAmount: 2000,
    convenienceFee: 0,
    paymentMethod: "NetBanking",
    status: "Paid",
    bbpsRef: "BBPSFT776655441",
  },
  {
    id: "BIL-505",
    billRef: "BBPS-FT-2026-9015",
    consumerNumber: "ACT-BLR-992100",
    consumerName: "Admin Office",
    billerName: "ACT Fibernet Broadband",
    category: "Broadband",
    dueDate: "2026-09-10",
    paymentDate: "2026-09-01 05:10 PM",
    billAmount: 1415,
    convenienceFee: 0,
    paymentMethod: "UPI",
    status: "Paid",
    bbpsRef: "BBPSBB887766552",
  },
  {
    id: "BIL-506",
    billRef: "BBPS-FT-2026-9016",
    consumerNumber: "TNEB-33100293",
    consumerName: "M. Balaji",
    billerName: "TANGEDCO (Tamil Nadu Electricity)",
    category: "Electricity",
    dueDate: "2026-09-15",
    paymentDate: "2026-09-01 02:45 PM",
    billAmount: 2180,
    convenienceFee: 10,
    paymentMethod: "Debit Card",
    status: "Processing",
    bbpsRef: "BBPS_PENDING_GATEWAY",
  },
];

export function BillPaymentAdminManager() {
  const [bills, setBills] = useState<BillPaymentTxn[]>(INITIAL_BILL_PAYMENTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [newBill, setNewBill] = useState({
    consumerNumber: "",
    consumerName: "",
    billerName: "BESCOM (Bangalore Electricity)",
    category: "Electricity" as BillPaymentTxn["category"],
    billAmount: 1250,
    paymentMethod: "UPI" as BillPaymentTxn["paymentMethod"],
  });

  const filtered = bills.filter((b) => {
    const matchesCategory = categoryFilter === "All" || b.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      b.consumerNumber.toLowerCase().includes(q) ||
      b.consumerName.toLowerCase().includes(q) ||
      b.billerName.toLowerCase().includes(q) ||
      b.billRef.toLowerCase().includes(q) ||
      b.bbpsRef.toLowerCase().includes(q);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalCollected = bills.reduce((s, b) => s + b.billAmount, 0);
  const totalFees = bills.reduce((s, b) => s + b.convenienceFee, 0);
  const paidCount = bills.filter((b) => b.status === "Paid").length;

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBill.consumerNumber || !newBill.billAmount) {
      toast.error("Please fill in consumer number and amount");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      const entry: BillPaymentTxn = {
        id: `BIL-${500 + bills.length + 1}`,
        billRef: `BBPS-FT-2026-${9010 + bills.length + 1}`,
        consumerNumber: newBill.consumerNumber,
        consumerName: newBill.consumerName || "Walk-in Customer",
        billerName: newBill.billerName,
        category: newBill.category,
        dueDate: "Paid Instantly",
        paymentDate: "Just Now",
        billAmount: Number(newBill.billAmount),
        convenienceFee: 10,
        paymentMethod: newBill.paymentMethod,
        status: "Paid",
        bbpsRef: `BBPS${Math.floor(100000000 + Math.random() * 900000000)}`,
      };
      setBills([entry, ...bills]);
      setIsProcessing(false);
      setShowModal(false);
      toast.success(`Bill payment of ₹${entry.billAmount} for ${entry.consumerNumber} collected!`);
      setNewBill({
        consumerNumber: "",
        consumerName: "",
        billerName: "BESCOM (Bangalore Electricity)",
        category: "Electricity",
        billAmount: 1250,
        paymentMethod: "UPI",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#101e46] to-[#0b1329] rounded-2xl p-6 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold mb-2">
              <Receipt className="w-3.5 h-3.5" />
              BHARAT BILL PAYMENT SYSTEM (BBPS)
            </div>
            <h2 className="text-2xl font-black text-white">Bill Payment Management Section</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Centralized utility billing counter for electricity, piped gas, water boards, FASTag tolls, and municipal taxes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Collect Utility Bill
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-500">Total Utility Collections</p>
            <IndianRupee className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{totalCollected.toLocaleString("en-IN")}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{bills.length} bills processed</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-500">Bills Paid &amp; Settled</p>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700 mt-2">{paidCount}</p>
          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">100% BBPS verified</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-500">Electricity &amp; Power</p>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-2">
            ₹{bills.filter((b) => b.category === "Electricity").reduce((s, b) => s + b.billAmount, 0).toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">BESCOM, TNEB, APCPDCL</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase text-slate-500">Convenience Fees Earned</p>
            <Receipt className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">₹{totalFees.toFixed(2)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Service charges retained</p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["All", "Electricity", "Water", "Gas", "FASTag", "Broadband"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              categoryFilter === cat
                ? "bg-[#0b1329] text-amber-400 shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search and Status Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Consumer ID, Biller, BBPS Ref..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {["All", "Paid", "Processing", "Failed"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? "bg-[#0b1329] text-amber-400"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Bill Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-4 py-3">Receipt Ref / Date</th>
                <th className="px-4 py-3">Consumer ID &amp; Name</th>
                <th className="px-4 py-3">Biller &amp; Category</th>
                <th className="px-4 py-3">Amount Paid</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400 font-medium">
                    No bill payment records found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3.5 font-bold font-mono text-slate-900">
                      {b.billRef}
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">{b.paymentDate}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-extrabold text-slate-900 font-mono">{b.consumerNumber}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{b.consumerName}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-800">{b.billerName}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        {b.category === "Electricity" && <Zap className="w-3 h-3 text-amber-500" />}
                        {b.category === "Water" && <Droplets className="w-3 h-3 text-blue-500" />}
                        {b.category === "Gas" && <Flame className="w-3 h-3 text-orange-500" />}
                        {b.category === "FASTag" && <CreditCard className="w-3 h-3 text-emerald-500" />}
                        {b.category === "Broadband" && <Wifi className="w-3 h-3 text-indigo-500" />}
                        {b.category}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-black text-slate-900 text-sm">₹{b.billAmount.toLocaleString("en-IN")}</div>
                      {b.convenienceFee > 0 && (
                        <div className="text-[10px] text-slate-400">+ ₹{b.convenienceFee} fee</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">
                      <span className="bg-slate-100 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-600">
                        {b.paymentMethod}
                      </span>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-[120px]">
                        {b.bbpsRef}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          b.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : b.status === "Processing"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {b.status === "Paid" && <CheckCircle2 className="w-3 h-3" />}
                        {b.status === "Processing" && <Clock className="w-3 h-3" />}
                        {b.status === "Failed" && <AlertCircle className="w-3 h-3" />}
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => toast.info(`Printing BBPS Tax Invoice & Receipt for ${b.billRef}`)}
                        title="Print Official BBPS Receipt"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Bill Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-600" /> Collect Utility Bill Payment
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Utility Category *</label>
                <select
                  value={newBill.category}
                  onChange={(e) =>
                    setNewBill({ ...newBill, category: e.target.value as BillPaymentTxn["category"] })
                  }
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none font-bold"
                >
                  <option>Electricity</option>
                  <option>Water</option>
                  <option>Gas</option>
                  <option>FASTag</option>
                  <option>Broadband</option>
                  <option>Municipal Tax</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Biller Name *</label>
                <input
                  type="text"
                  required
                  value={newBill.billerName}
                  onChange={(e) => setNewBill({ ...newBill, billerName: e.target.value })}
                  placeholder="e.g. BESCOM / TNEB / Indane / BWSSB"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consumer / CA Number *</label>
                <input
                  type="text"
                  required
                  value={newBill.consumerNumber}
                  onChange={(e) => setNewBill({ ...newBill, consumerNumber: e.target.value })}
                  placeholder="e.g. 551029384"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Consumer Name</label>
                <input
                  type="text"
                  value={newBill.consumerName}
                  onChange={(e) => setNewBill({ ...newBill, consumerName: e.target.value })}
                  placeholder="Customer Name (Optional)"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bill Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newBill.billAmount}
                    onChange={(e) => setNewBill({ ...newBill, billAmount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none font-black text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={newBill.paymentMethod}
                    onChange={(e) =>
                      setNewBill({ ...newBill, paymentMethod: e.target.value as BillPaymentTxn["paymentMethod"] })
                    }
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>NetBanking</option>
                    <option>Debit Card</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Collect Payment →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
