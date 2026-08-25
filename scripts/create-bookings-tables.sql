-- Bookings table: professional travel booking voucher system
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  pnr_number VARCHAR(20) UNIQUE NOT NULL,
  booking_id VARCHAR(30) UNIQUE NOT NULL,
  booking_date TIMESTAMP DEFAULT NOW(),

  -- Passenger details
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  number_of_members INTEGER NOT NULL DEFAULT 1,

  -- Package / trip details
  package_name TEXT,
  tour_type TEXT,
  trip_type TEXT,
  from_location TEXT,
  to_location TEXT,
  boarding_point TEXT,
  departure_datetime TIMESTAMP,

  -- Driver / vehicle details
  driver_name TEXT,
  driver_phone TEXT,
  taxi_number TEXT,
  vehicle_type TEXT,

  -- Payment details
  total_amount NUMERIC(12,2) DEFAULT 0,
  advance_amount NUMERIC(12,2) DEFAULT 0,
  amount_paid NUMERIC(12,2) DEFAULT 0,
  balance_amount NUMERIC(12,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'Pending',
  booking_status TEXT DEFAULT 'Confirmed',

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Booking payments: immutable payment history
CREATE TABLE IF NOT EXISTS booking_payments (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id VARCHAR(50),
  gateway_order_id VARCHAR(100),
  transaction_id VARCHAR(100),
  amount NUMERIC(12,2) NOT NULL,
  payment_method TEXT DEFAULT 'UPI',
  payment_status TEXT DEFAULT 'Success',
  paid_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_ticket ON bookings(ticket_number);
CREATE INDEX IF NOT EXISTS idx_bookings_pnr ON bookings(pnr_number);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger ON bookings(passenger_name);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(passenger_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_departure ON bookings(departure_datetime);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_booking_payments_booking ON booking_payments(booking_id);
