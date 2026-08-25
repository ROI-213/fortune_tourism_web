import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  X,
  Printer,
  IndianRupee,
  ArrowLeftRight,
  Trash2,
  Pencil,
  FileDown,
  MessageCircle,
  Ban,
  History,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/booking-utils";
import { downloadInvoicePDF, downloadReceiptPDF } from "@/lib/invoice-pdf";
import { DriverAssignPanel } from "./DriverAssignPanel";
import { TicketUploadPanel } from "./TicketUploadPanel";
import { downloadSmartPDF, printSmartPDF } from "@/lib/client-pdf";

async function adminApiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const key =
    typeof window !== "undefined" ? sessionStorage.getItem("fortune_admin_key") || "" : "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (key) headers["x-admin-key"] = key;
  return fetch(url, { ...options, headers });
}

interface PaymentRow {
  id: number;
  payment_id?: string;
  transaction_id?: string;
  reference_number?: string;
  amount: number | string;
  payment_method?: string;
  payment_status?: string;
  paid_at?: string;
  payment_date?: string;
  notes?: string;
  received_by?: string;
  is_deleted?: boolean;
}

interface RefundRow {
  id: number;
  refund_reference?: string;
  amount: number | string;
  refund_method?: string;
  refund_date?: string;
  reason?: string;
}

interface PassengerRow {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  seat_berth?: string;
  ticket_number?: string;
}

interface LogRow {
  id: number;
  action: string;
  entity_ref?: string;
  old_value?: string;
  new_value?: string;
  details?: string;
  actor?: string;
  created_at: string;
}

export interface DetailBooking {
  id: number;
  booking_number?: string;
  booking_reference?: string;
  booking_type?: string;
  enquiry_number?: string;
  ticket_number?: string;
  pnr_number?: string;
  pnr_external?: string;
  ticket_confirmation?: string;
  booking_source?: string;
  category?: string;
  passenger_name?: string;
  passenger_phone?: string;
  customer_email?: string | null;
  customer_whatsapp?: string | null;
  customer_address?: string | null;
  company_name?: string | null;
  gst_number?: string | null;
  number_of_members?: number;
  package_name?: string;
  tour_type?: string;
  trip_type?: string;
  from_location?: string;
  to_location?: string;
  departure_datetime?: string;
  return_date?: string;
  return_date_flight?: string;
  pickup_time?: string;
  number_of_days?: number;
  driver_name?: string;
  driver_phone?: string;
  driver_id?: number | null;
  taxi_number?: string;
  vehicle_type?: string;
  airline?: string;
  flight_number?: string;
  cabin_class?: string;
  departure_airport?: string;
  arrival_airport?: string;
  baggage?: string;
  train_name?: string;
  train_number?: string;
  travel_class?: string;
  coach?: string;
  berth?: string;
  bus_operator?: string;
  bus_type?: string;
  bus_number?: string;
  seat_preference?: string;
  preferred_operator?: string;
  preferred_class?: string;
  ticket_cost?: number | string;
  service_charge_booking?: number | string;
  total_amount?: number | string;
  base_amount?: number | string;
  driver_allowance?: number | string;
  toll_amount?: number | string;
  parking_amount?: number | string;
  permit_amount?: number | string;
  state_tax_amount?: number | string;
  service_charge?: number | string;
  additional_charges?: number | string;
  discount_amount?: number | string;
  tax_amount?: number | string;
  gst_amount?: number | string;
  amount_paid?: number | string;
  balance_amount?: number | string;
  refunded_total?: number | string;
  remaining_amount?: number | string;
  overpaid_amount?: number | string;
  payment_status?: string;
  booking_status?: string;
  special_instructions?: string;
  admin_notes?: string;
  notes?: string;
  created_at?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  bookingId: number | null;
  onEdit: (bookingId: number) => void;
  onChanged: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-1 text-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground shrink-0">
        {label}
      </span>
      <span className="text-right font-medium">{value || "—"}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border p-4">
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[color:var(--color-navy)]">
        {title}
      </p>
      {children}
    </div>
  );
}

export function BookingDetailDrawer({ open, onClose, bookingId, onEdit, onChanged }: Props) {
  const [data, setData] = useState<{
    booking: DetailBooking;
    payments: PaymentRow[];
    refunds: RefundRow[];
    passengers: PassengerRow[];
    activity_logs: LogRow[];
    enquiry?: any;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentRow | null>(null);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [payForm, setPayForm] = useState({
    amount: "",
    method: "CASH",
    txn: "",
    ref: "",
    date: "",
    received_by: "Admin",
    notes: "",
  });
  const [refundForm, setRefundForm] = useState({ amount: "", reason: "", method: "BANK TRANSFER" });

  useEffect(() => {
    if (!open || !bookingId) return;
    setLoading(true);
    adminApiFetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setData(d);
        else toast.error(d.error || "Failed to load booking");
      })
      .catch(() => toast.error("Failed to load booking"))
      .finally(() => setLoading(false));
  }, [open, bookingId]);

  if (!open) return null;

  const b = data?.booking;

  const refreshDetail = async () => {
    if (!bookingId) return;
    const r = await adminApiFetch(`/api/bookings/${bookingId}`);
    const d = await r.json();
    if (d.success) setData(d);
    onChanged();
  };

  const submitPayment = async () => {
    const amt = Number(payForm.amount);
    if (!amt || amt <= 0 || !b) {
      toast.error("Enter a valid amount.");
      return;
    }
    try {
      const url = editingPayment
        ? `/api/bookings/${b.id}/payments`
        : `/api/bookings/${b.id}/payments`;
      const res = await adminApiFetch(url, {
        method: editingPayment ? "PATCH" : "POST",
        body: JSON.stringify(
          editingPayment
            ? {
                id: editingPayment.id,
                amount: amt,
                payment_method: payForm.method,
                transaction_id: payForm.txn || undefined,
                reference_number: payForm.ref || undefined,
                received_by: payForm.received_by || undefined,
                payment_date: payForm.date || undefined,
                notes: payForm.notes || undefined,
              }
            : {
                amount: amt,
                payment_method: payForm.method,
                transaction_id: payForm.txn || null,
                reference_number: payForm.ref || null,
                payment_date: payForm.date || null,
                received_by: payForm.received_by || "Admin",
                notes: payForm.notes || null,
              },
        ),
      });
      const d = await res.json();
      if (d.success) {
        toast.success(
          d.warning ||
            (editingPayment ? "Payment updated." : `Payment of ${formatCurrency(amt)} recorded.`),
        );
        setShowPaymentForm(false);
        setEditingPayment(null);
        setPayForm({
          amount: "",
          method: "CASH",
          txn: "",
          ref: "",
          date: "",
          received_by: "Admin",
          notes: "",
        });
        await refreshDetail();
      } else {
        toast.error(d.error || "Failed to save payment.");
      }
    } catch {
      toast.error("Error saving payment.");
    }
  };

  const deletePayment = async (p: PaymentRow) => {
    if (
      !b ||
      !confirm(
        `Delete payment ${p.payment_id} (${formatCurrency(Number(p.amount))})? History is preserved.`,
      )
    )
      return;
    const res = await adminApiFetch(`/api/bookings/${b.id}/payments?paymentId=${p.id}`, {
      method: "DELETE",
    });
    const d = await res.json();
    if (d.success) {
      toast.success("Payment removed. Totals recalculated.");
      await refreshDetail();
    } else {
      toast.error(d.error || "Failed to remove payment.");
    }
  };

  const submitRefund = async () => {
    const amt = Number(refundForm.amount);
    if (!amt || amt <= 0 || !b) {
      toast.error("Enter a valid refund amount.");
      return;
    }
    const res = await adminApiFetch(`/api/bookings/${b.id}/refunds`, {
      method: "POST",
      body: JSON.stringify({
        amount: amt,
        reason: refundForm.reason || null,
        refund_method: refundForm.method,
      }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success(`Refund of ${formatCurrency(amt)} recorded.`);
      setShowRefundForm(false);
      setRefundForm({ amount: "", reason: "", method: "BANK TRANSFER" });
      await refreshDetail();
    } else {
      toast.error(d.error || "Failed to record refund.");
    }
  };

  const cancelBooking = async () => {
    if (!b || !confirm(`Cancel booking ${b.booking_number}?`)) return;
    const res = await adminApiFetch("/api/bookings", {
      method: "PUT",
      body: JSON.stringify({ id: b.id, booking_status: "CANCELLED" }),
    });
    const d = await res.json();
    if (d.success) {
      toast.success("Booking cancelled.");
      await refreshDetail();
    } else {
      toast.error(d.error || "Failed to cancel.");
    }
  };

  const whatsappCustomer = () => {
    if (!b?.passenger_phone) return;
    const digits = b.passenger_phone.replace(/\D/g, "");
    const phone = digits.length === 10 ? `91${digits}` : digits;
    const remaining = formatCurrency(Number(b.remaining_amount) || 0);
    const msg = encodeURIComponent(
      `Dear ${b.passenger_name},\n\nBooking ${b.booking_number || ""} — ${b.from_location || ""} → ${b.to_location || ""}\nDeparture: ${formatDateTime(b.departure_datetime)}\n\nTotal: ${formatCurrency(Number(b.total_amount) || 0)}\nBalance Due: ${remaining}\n\n— Fortune Tourism`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  const netPaid = b ? Math.max(Number(b.amount_paid ?? 0), 0) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-2xl overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-white/95 p-5 backdrop-blur">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading text-lg font-bold">
                {b?.booking_number || `#${b?.id ?? "…"}`}
              </h3>
              {b?.category && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase">
                  {b.category}
                </span>
              )}
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  String(b?.payment_status).toUpperCase() === "FULLY PAID"
                    ? "bg-emerald-100 text-emerald-800"
                    : String(b?.payment_status).toUpperCase() === "PENDING"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-amber-100 text-amber-800"
                }`}
              >
                {b?.payment_status || "—"}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {b?.passenger_name} · {b?.passenger_phone}
              {b?.enquiry_number && (
                <>
                  {" "}
                  · Enquiry <span className="font-mono">{b.enquiry_number}</span>
                </>
              )}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading || !data || !b ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading booking…</div>
        ) : (
          <div className="space-y-4 p-5">
            {/* Action bar */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowPaymentForm(true);
                  setEditingPayment(null);
                  setPayForm({
                    amount: String(Math.max(Number(b.remaining_amount) || 0, 0) || ""),
                    method: "CASH",
                    txn: "",
                    ref: "",
                    date: todayLocal(),
                    received_by: "Admin",
                    notes: "",
                  });
                }}
                disabled={String(b.booking_status).toUpperCase() === "CANCELLED"}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-40"
              >
                <IndianRupee className="h-3.5 w-3.5" /> Record Payment
              </button>
              <button
                onClick={() => setShowRefundForm(true)}
                disabled={netPaid <= 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-orange-300 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700 hover:bg-orange-100 disabled:opacity-40"
              >
                <ArrowLeftRight className="h-3.5 w-3.5" /> Record Refund
              </button>
              <button
                onClick={() => downloadSmartPDF(b as any)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-300 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100"
              >
                <FileDown className="h-3.5 w-3.5" /> Voucher / Ticket PDF
              </button>
              <button
                onClick={() => downloadInvoicePDF(b as any, data.payments, data.refunds)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5" /> Print Invoice
              </button>
              <button
                onClick={whatsappCustomer}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </button>
              <button
                onClick={() => onEdit(b.id)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                onClick={cancelBooking}
                disabled={["CANCELLED", "REFUNDED"].includes(
                  String(b.booking_status).toUpperCase(),
                )}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-40"
              >
                <Ban className="h-3.5 w-3.5" /> Cancel Booking
              </button>
            </div>

            {/* Financial summary */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                [
                  "TOTAL",
                  formatCurrency(Number(b.total_amount) || 0),
                  "text-[color:var(--color-navy)]",
                ],
                ["NET PAID", formatCurrency(netPaid), "text-emerald-700"],
                ["REFUNDED", formatCurrency(Number(b.refunded_total) || 0), "text-orange-600"],
                [
                  "BALANCE DUE",
                  formatCurrency(Number(b.remaining_amount) || 0),
                  Number(b.remaining_amount) > 0 ? "text-rose-600" : "text-emerald-600",
                ],
              ].map(([label, val, cls]) => (
                <div
                  key={label}
                  className="rounded-xl border border-border bg-slate-50/60 p-3 text-center"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </p>
                  <p className={`mt-1 font-heading text-base font-bold ${cls}`}>{val}</p>
                </div>
              ))}
            </div>

            {/* Customer & trip */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Section title="Customer">
                <Row label="Name" value={b.passenger_name} />
                <Row label="Phone" value={b.passenger_phone} />
                <Row label="Email" value={b.customer_email} />
                <Row label="Members" value={b.number_of_members} />
                <Row label="Source" value={b.booking_source} />
                <Row label="Created" value={b.created_at ? formatDateTime(b.created_at) : "—"} />
              </Section>
              <Section title="Trip">
                <Row label="Route" value={`${b.from_location || "—"} → ${b.to_location || "—"}`} />
                <Row label="Departure" value={formatDateTime(b.departure_datetime)} />
                <Row label="Return" value={b.return_date ? formatDate(b.return_date) : "—"} />
                <Row label="Package" value={b.package_name} />
                <Row label="Trip Type" value={b.trip_type} />
                <Row label="Days" value={b.number_of_days} />
              </Section>
            </div>

            {/* Category specifics & Management Panels */}
            {(String(b.booking_type).toUpperCase() === "TAXI" || String(b.category).toUpperCase() === "CAR") && (
              <div className="space-y-4">
                <DriverAssignPanel
                  bookingId={b.id}
                  currentDriverId={b.driver_id}
                  currentDriverName={b.driver_name}
                  currentDriverPhone={b.driver_phone}
                  currentTaxiNumber={b.taxi_number}
                  currentVehicleType={b.vehicle_type}
                  onDriverAssigned={refreshDetail}
                />
              </div>
            )}

            {["BUS", "TRAIN", "FLIGHT"].includes(String(b.booking_type || b.category).toUpperCase()) && (
              <div className="space-y-4">
                <TicketUploadPanel
                  bookingId={b.id}
                  bookingType={String(b.booking_type || b.category).toUpperCase()}
                  onDocumentUploaded={refreshDetail}
                />
              </div>
            )}

            {String(b.category).toUpperCase() === "BUS" && (
              <Section title="Bus Details">
                <div className="grid gap-x-6 sm:grid-cols-2">
                  <Row label="Operator" value={b.bus_operator || b.preferred_operator} />
                  <Row label="Bus Type" value={b.bus_type} />
                  <Row label="Bus Number" value={b.bus_number} />
                  <Row label="PNR / Ticket" value={b.pnr_external || b.pnr_number} />
                  <Row label="Seat Preference" value={b.seat_preference} />
                </div>
              </Section>
            )}
            {String(b.category).toUpperCase() === "TRAIN" && (
              <Section title="Train Details">
                <div className="grid gap-x-6 sm:grid-cols-2">
                  <Row label="Train" value={`${b.train_name || b.preferred_operator || "—"} (${b.train_number || "—"})`} />
                  <Row label="Class" value={b.travel_class || b.preferred_class} />
                  <Row label="PNR" value={b.pnr_external || b.pnr_number} />
                  <Row label="Coach / Berth" value={`${b.coach || "—"} / ${b.berth || "—"}`} />
                </div>
              </Section>
            )}
            {String(b.category).toUpperCase() === "FLIGHT" && (
              <Section title="Flight Details">
                <div className="grid gap-x-6 sm:grid-cols-2">
                  <Row label="Airline" value={b.airline || b.preferred_operator} />
                  <Row label="Flight No." value={b.flight_number} />
                  <Row label="Cabin" value={b.cabin_class || b.preferred_class} />
                  <Row label="PNR" value={b.pnr_external || b.pnr_number} />
                  <Row label="Airports" value={`${b.departure_airport || b.from_location || "—"} → ${b.arrival_airport || b.to_location || "—"}`} />
                  <Row label="Baggage" value={b.baggage} />
                </div>
              </Section>
            )}

            {data.passengers.length > 0 && (
              <Section title={`Passengers (${data.passengers.length})`}>
                <table className="w-full text-xs">
                  <thead className="text-left uppercase text-muted-foreground">
                    <tr>
                      <th className="py-1">Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Seat/Berth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.passengers.map((p) => (
                      <tr key={p.id}>
                        <td className="py-1.5 font-medium">{p.name}</td>
                        <td>{p.age ?? "—"}</td>
                        <td>{p.gender ?? "—"}</td>
                        <td>{p.seat_berth ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Section>
            )}

            {/* Payments */}
            <Section title={`Payments (${data.payments.filter((p) => !p.is_deleted).length})`}>
              {data.payments.filter((p) => !p.is_deleted).length === 0 ? (
                <p className="text-xs text-muted-foreground">No payments recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {data.payments
                    .filter((p) => !p.is_deleted)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border bg-slate-50/60 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-emerald-700">
                            {formatCurrency(Number(p.amount))}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {formatDate(p.payment_date || p.paid_at)} · {p.payment_method}
                            {p.transaction_id ? ` · Txn ${p.transaction_id}` : ""}
                            {p.received_by ? ` · by ${p.received_by}` : ""}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            title="Download receipt"
                            onClick={() => downloadReceiptPDF(b as any, p)}
                            className="rounded p-1.5 hover:bg-slate-200"
                          >
                            <FileDown className="h-4 w-4 text-slate-600" />
                          </button>
                          <button
                            title="Edit payment"
                            onClick={() => {
                              setEditingPayment(p);
                              setShowPaymentForm(true);
                              setPayForm({
                                amount: String(p.amount),
                                method: p.payment_method || "CASH",
                                txn: p.transaction_id || "",
                                ref: p.reference_number || "",
                                date: String(p.payment_date || "").slice(0, 10),
                                received_by: p.received_by || "Admin",
                                notes: p.notes || "",
                              });
                            }}
                            className="rounded p-1.5 hover:bg-slate-200"
                          >
                            <Pencil className="h-4 w-4 text-blue-600" />
                          </button>
                          <button
                            title="Delete payment"
                            onClick={() => deletePayment(p)}
                            className="rounded p-1.5 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </Section>

            {/* Refunds */}
            {data.refunds.length > 0 && (
              <Section title={`Refunds (${data.refunds.length})`}>
                <div className="space-y-2">
                  {data.refunds.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-lg border border-orange-200 bg-orange-50/60 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-bold text-orange-700">
                          − {formatCurrency(Number(r.amount))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(r.refund_date)} · {r.refund_method}
                          {r.reason ? ` · ${r.reason}` : ""}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {r.refund_reference}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Fare breakdown */}
            <Section title="Fare Breakdown">
              {[
                ["Base Fare", b.base_amount],
                ["Driver Allowance", b.driver_allowance],
                ["Toll", b.toll_amount],
                ["Parking", b.parking_amount],
                ["Permit", b.permit_amount],
                ["State Tax", b.state_tax_amount],
                ["Service Charge", b.service_charge],
                ["Additional", b.additional_charges],
              ]
                .filter(([, v]) => v != null && Number(v) !== 0)
                .map(([l, v]) => (
                  <Row key={l as string} label={l as string} value={formatCurrency(Number(v))} />
                ))}
              {Number(b.discount_amount) > 0 && (
                <Row label="Discount" value={`− ${formatCurrency(Number(b.discount_amount))}`} />
              )}
              <div className="border-t border-dashed pt-1 mt-1">
                <Row label="TOTAL" value={formatCurrency(Number(b.total_amount) || 0)} />
              </div>
            </Section>

            {(b.special_instructions || b.notes || b.admin_notes) && (
              <Section title="Notes">
                {b.special_instructions && (
                  <Row label="Instructions" value={b.special_instructions} />
                )}
                {b.notes && (
                  <Row
                    label="Internal Notes"
                    value={<span className="whitespace-pre-wrap">{b.notes}</span>}
                  />
                )}
                {b.admin_notes && (
                  <Row
                    label="Admin Notes"
                    value={<span className="whitespace-pre-wrap">{b.admin_notes}</span>}
                  />
                )}
              </Section>
            )}

            {/* Audit timeline */}
            <Section title={`Activity Timeline (${data.activity_logs.length})`}>
              {data.activity_logs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity recorded.</p>
              ) : (
                <ol className="relative space-y-3 border-l border-border pl-4">
                  {data.activity_logs.map((log) => (
                    <li key={log.id}>
                      <span className="absolute -left-[5px] mt-1.5 h-2 w-2 rounded-full bg-[color:var(--color-gold)]" />
                      <p className="text-xs font-bold">{log.action.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(log.created_at)} · {log.actor || "System"}
                        {log.old_value ? ` · was "${log.old_value}"` : ""}
                        {log.new_value ? ` → "${log.new_value}"` : ""}
                      </p>
                      {log.details && (
                        <p className="text-xs text-muted-foreground italic">{log.details}</p>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </Section>

            {/* Inline payment form */}
            {showPaymentForm && (
              <div className="rounded-xl border-2 border-emerald-500/30 bg-emerald-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold">
                    {editingPayment ? "Edit Payment" : "Record Payment"}
                  </p>
                  <button
                    onClick={() => {
                      setShowPaymentForm(false);
                      setEditingPayment(null);
                    }}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Amount ₹ *
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={payForm.amount}
                      onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                    />
                    {!editingPayment && Number(payForm.amount) > Number(b.remaining_amount) && (
                      <p className="mt-1 text-xs font-semibold text-orange-600">
                        Exceeds balance due ({formatCurrency(Number(b.remaining_amount) || 0)}) —
                        will be marked overpaid.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Method
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={payForm.method}
                      onChange={(e) => setPayForm({ ...payForm, method: e.target.value })}
                    >
                      {["CASH", "UPI", "BANK TRANSFER", "CARD", "CHEQUE"].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Transaction ID
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={payForm.txn}
                      onChange={(e) => setPayForm({ ...payForm, txn: e.target.value })}
                      placeholder="UPI ref / cheque no."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Payment Date
                    </label>
                    <input
                      type="date"
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={payForm.date}
                      onChange={(e) => setPayForm({ ...payForm, date: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  onClick={submitPayment}
                  className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  {editingPayment ? "Update Payment" : "Save Payment & Recalculate"}
                </button>
              </div>
            )}

            {/* Inline refund form */}
            {showRefundForm && (
              <div className="rounded-xl border-2 border-orange-400/30 bg-orange-50/40 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold">Record Refund (max {formatCurrency(netPaid)})</p>
                  <button
                    onClick={() => setShowRefundForm(false)}
                    className="text-xs text-muted-foreground hover:underline"
                  >
                    Cancel
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Amount ₹ *
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={netPaid}
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={refundForm.amount}
                      onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Method
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={refundForm.method}
                      onChange={(e) => setRefundForm({ ...refundForm, method: e.target.value })}
                    >
                      {["BANK TRANSFER", "CASH", "UPI", "CARD"].map((m) => (
                        <option key={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase text-muted-foreground">
                      Reason
                    </label>
                    <input
                      className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                      value={refundForm.reason}
                      onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                      placeholder="Cancellation refund etc."
                    />
                  </div>
                </div>
                <button
                  onClick={submitRefund}
                  className="mt-3 w-full rounded-lg bg-orange-500 py-2 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Save Refund
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
