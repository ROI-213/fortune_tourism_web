export function generateTicketNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "FT";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generatePNR(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "FC";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateBookingId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BKG-${ts}-${rand}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }) + ", " + d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function calculatePaymentStatus(total: number, paid: number): string {
  if (paid <= 0) return "Pending";
  if (paid >= total) return "Fully Paid";
  return "Partially Paid";
}

export function calculateBalance(total: number, advance: number, paid: number): number {
  const balance = total - paid;
  return Math.max(0, balance);
}

export interface BookingData {
  id?: number;
  ticket_number?: string;
  pnr_number?: string;
  booking_id?: string;
  booking_number?: string;
  booking_reference?: string;
  booking_type?: string;
  enquiry_id?: number | null;
  enquiry_number?: string | null;
  category?: string;
  booking_source?: string;
  booking_date?: string;
  passenger_name: string;
  passenger_phone: string;
  number_of_members?: number;
  package_name?: string;
  tour_type?: string;
  trip_type?: string;
  from_location?: string;
  to_location?: string;
  boarding_point?: string;
  departure_datetime?: string;
  return_date?: string;
  pickup_time?: string;
  number_of_days?: number;
  driver_name?: string;
  driver_phone?: string;
  driver_id?: number | null;
  taxi_number?: string;
  vehicle_type?: string;
  customer_email?: string;
  total_amount: number;
  advance_amount?: number;
  amount_paid?: number;
  balance_amount?: number;
  payment_status: string;
  booking_status: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  // Transport-specific fields
  airline?: string;
  flight_number?: string;
  cabin_class?: string;
  train_name?: string;
  train_number?: string;
  travel_class?: string;
  coach?: string;
  berth?: string;
  bus_operator?: string;
  bus_type?: string;
  bus_number?: string;
  departure_time?: string;
  arrival_time?: string;
  arrival_date?: string;
  departure_airport?: string;
  arrival_airport?: string;
  pnr_external?: string;
  ticket_confirmation?: string;
  ticket_cost?: number;
  service_charge_booking?: number;
  seat_preference?: string;
  preferred_operator?: string;
  preferred_class?: string;
  return_date_flight?: string;
  special_instructions?: string;
  baggage?: string;
}

export interface BookingPayment {
  id: number;
  booking_id: number;
  payment_id: string;
  gateway_order_id?: string;
  transaction_id?: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  paid_at: string;
  payment_date?: string;
  reference_number?: string;
  notes?: string;
  received_by?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  created_at: string;
}

export const BOOKING_CATEGORIES = [
  "CAR",
  "BUS",
  "TRAIN",
  "FLIGHT",
] as const;

export const PAYMENT_METHODS = [
  "CASH",
  "UPI",
  "BANK TRANSFER",
  "CARD",
  "CHEQUE",
] as const;

export const BOOKING_SOURCES = [
  "WEBSITE",
  "WALK-IN",
  "PHONE",
  "WHATSAPP",
  "REFERRAL",
] as const;

export const TOUR_TYPES = [
  "Local Trip",
  "Outstation Trip",
  "Airport Transfer",
  "Package",
  "Corporate Trip",
  "One Way",
  "Round Trip",
  "Other",
];

export const TRIP_TYPES = [
  "Package",
  "One Way",
  "Round Trip",
  "Local",
  "Outstation",
  "Airport Transfer",
  "Corporate",
];

export const VEHICLE_TYPE_OPTIONS = [
  "Sedan",
  "SUV",
  "Innova",
  "Innova Crysta",
  "Maruti Suzuki Ciaz",
  "Hatchback",
  "Tempo Traveller",
  "Mini Bus",
  "Bus",
  "Flight",
  "Other",
];

export const PAYMENT_STATUSES = [
  "Pending",
  "Partially Paid",
  "Advance Paid",
  "Fully Paid",
  "Payment Failed",
  "Payment Cancelled",
];

export const BOOKING_STATUSES = [
  "Booking Requested",
  "Pending Confirmation",
  "Admin Processing",
  "Ticket Booked",
  "Ticket Uploaded",
  "Confirmed",
  "In Progress",
  "Completed",
  "Cancelled",
];

export const BOOKING_TYPE_OPTIONS = [
  "TAXI",
  "BUS",
  "TRAIN",
  "FLIGHT",
] as const;
