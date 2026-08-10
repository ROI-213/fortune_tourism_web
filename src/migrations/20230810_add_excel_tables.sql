-- 20230810_add_excel_tables.sql
-- Migration to add all tables required for the Excel based admin system.
-- Dependencies are created in order so all FOREIGN KEY references resolve:
--   customers -> drivers -> accounts -> vehicles/enquiries (extended) -> the rest.
-- NOTE: the existing `enquiries` and `vehicles` tables use UUID ids (see
-- scripts/init-db.sql), so every FK column referencing those tables is UUID.
-- Tables created by this migration (customers, drivers, accounts, ...) use SERIAL ids.

BEGIN;

-- 1. customers
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    customer_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    alternate_phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. drivers (created before vehicles extension because vehicles.assigned_driver_id references it)
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    driver_name TEXT NOT NULL,
    company_name TEXT,
    state TEXT,
    city TEXT,
    area TEXT,
    phone TEXT,
    alternate_phone TEXT,
    vehicle_type TEXT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. accounts (created before expenses because expenses references it)
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_name TEXT NOT NULL,
    account_type TEXT,
    opening_balance NUMERIC(12,2) DEFAULT 0,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 4. Extend vehicles (existing table, UUID id)
ALTER TABLE vehicles
    ADD COLUMN IF NOT EXISTS vehicle_number TEXT,
    ADD COLUMN IF NOT EXISTS vehicle_type TEXT,
    ADD COLUMN IF NOT EXISTS model TEXT,
    ADD COLUMN IF NOT EXISTS variant TEXT,
    ADD COLUMN IF NOT EXISTS seating_capacity INTEGER,
    ADD COLUMN IF NOT EXISTS status TEXT,
    ADD COLUMN IF NOT EXISTS assigned_driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS purchase_date DATE,
    ADD COLUMN IF NOT EXISTS insurance_expiry DATE,
    ADD COLUMN IF NOT EXISTS permit_expiry DATE,
    ADD COLUMN IF NOT EXISTS fitness_expiry DATE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS notes TEXT;

-- 5. Extend enquiries (existing table, UUID id)
ALTER TABLE enquiries
    ADD COLUMN IF NOT EXISTS enquiry_number TEXT,
    ADD COLUMN IF NOT EXISTS enquiry_date DATE,
    ADD COLUMN IF NOT EXISTS travel_date_excel DATE,
    ADD COLUMN IF NOT EXISTS customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS enquired_for TEXT,
    ADD COLUMN IF NOT EXISTS lead_source TEXT,
    ADD COLUMN IF NOT EXISTS follow_up_status TEXT,
    ADD COLUMN IF NOT EXISTS follow_up_date DATE,
    ADD COLUMN IF NOT EXISTS important BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS booking_status TEXT,
    ADD COLUMN IF NOT EXISTS confirmed_by TEXT,
    ADD COLUMN IF NOT EXISTS attended_by TEXT,
    ADD COLUMN IF NOT EXISTS notes_excel TEXT;

-- 6. enquiry_followups
CREATE TABLE IF NOT EXISTS enquiry_followups (
    id SERIAL PRIMARY KEY,
    enquiry_id UUID REFERENCES enquiries(id) ON DELETE CASCADE,
    follow_up_date DATE NOT NULL,
    status TEXT,
    remarks TEXT,
    next_follow_up_date DATE,
    created_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. day_book_entries
CREATE TABLE IF NOT EXISTS day_book_entries (
    id SERIAL PRIMARY KEY,
    serial_number TEXT,
    booking_date DATE,
    travel_date DATE,
    travel_by TEXT,
    passenger_name TEXT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    passenger_phone TEXT,
    from_location TEXT,
    to_location TEXT,
    pickup_location TEXT,
    booking_amount NUMERIC(12,2),
    office_advance NUMERIC(12,2),
    due_amount NUMERIC(12,2),
    expense_amount NUMERIC(12,2),
    total_amount NUMERIC(12,2),
    original_total_amount NUMERIC(12,2),
    calculation_discrepancy BOOLEAN DEFAULT FALSE,
    booking_reference TEXT,
    payment_method TEXT,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 8. cab_bookings
CREATE TABLE IF NOT EXISTS cab_bookings (
    id SERIAL PRIMARY KEY,
    booking_number TEXT,
    booking_date DATE,
    travel_date DATE,
    from_location TEXT,
    to_location TEXT,
    pickup_time TIME,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    driver_phone TEXT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    vehicle_number TEXT,
    vehicle_type TEXT,
    passenger_name TEXT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    passenger_phone TEXT,
    due_amount NUMERIC(12,2),
    to_pay NUMERIC(12,2),
    settled_amount NUMERIC(12,2),
    payment_date DATE,
    payment_status TEXT,
    payment_method TEXT,
    notes TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 9. package_trips
CREATE TABLE IF NOT EXISTS package_trips (
    id SERIAL PRIMARY KEY,
    trip_number TEXT,
    tour_name TEXT,
    journey_date DATE,
    return_date DATE,
    pickup_location TEXT,
    drop_location TEXT,
    passenger_name TEXT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    passenger_phone TEXT,
    total_run_km NUMERIC(12,2),
    per_km_rate NUMERIC(12,2),
    state TEXT,
    temporary_permit TEXT,
    bata NUMERIC(12,2),
    toll_expense NUMERIC(12,2),
    car_type TEXT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    driver_phone TEXT,
    due_amount NUMERIC(12,2),
    paid_amount NUMERIC(12,2),
    settled_date DATE,
    total_cost NUMERIC(12,2),
    original_total_cost NUMERIC(12,2),
    calculation_discrepancy BOOLEAN DEFAULT FALSE,
    remaining_amount NUMERIC(12,2),
    payment_phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 10. hourly_bookings
CREATE TABLE IF NOT EXISTS hourly_bookings (
    id SERIAL PRIMARY KEY,
    booking_number TEXT,
    booking_date DATE,
    travel_date DATE,
    passenger_name TEXT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    phone TEXT,
    from_location TEXT,
    to_location TEXT,
    hours INTEGER,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    taxi_number TEXT,
    toll NUMERIC(12,2),
    boarding NUMERIC(12,2),
    amount NUMERIC(12,2),
    payment_status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 11. expenses
DO $$ BEGIN
    CREATE TYPE expense_category AS ENUM (
        'Petrol','Fuel','Home','Office','Driver','Vehicle','Repairs','Toll','Rent','Loan','Recharge','Miscellaneous','Other'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    expense_date DATE,
    category expense_category,
    description TEXT,
    paid_to TEXT,
    amount NUMERIC(12,2),
    payment_method TEXT,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    booking_id INTEGER REFERENCES day_book_entries(id) ON DELETE SET NULL,
    trip_id INTEGER REFERENCES package_trips(id) ON DELETE SET NULL,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    reference TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 12. account_transactions
CREATE TABLE IF NOT EXISTS account_transactions (
    id SERIAL PRIMARY KEY,
    account_id INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
    transaction_date DATE,
    transaction_type TEXT,
    description TEXT,
    debit NUMERIC(12,2),
    credit NUMERIC(12,2),
    amount NUMERIC(12,2),
    payment_method TEXT,
    reference TEXT,
    person_name TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 13. repairs
CREATE TABLE IF NOT EXISTS repairs (
    id SERIAL PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    repair_date DATE,
    garage TEXT,
    part TEXT,
    amount NUMERIC(12,2),
    paid_by TEXT,
    payment_method TEXT,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 14. vehicle_forecasts
CREATE TABLE IF NOT EXISTS vehicle_forecasts (
    id SERIAL PRIMARY KEY,
    vehicle_type TEXT,
    car_model TEXT,
    variant TEXT,
    vehicle_price NUMERIC(12,2),
    fare NUMERIC(12,2),
    down_payment NUMERIC(12,2),
    loan_amount NUMERIC(12,2),
    interest_rate NUMERIC(5,2),
    total_due NUMERIC(12,2),
    loan_tenure INTEGER,
    emi NUMERIC(12,2),
    engine_warranty TEXT,
    km_warranty TEXT,
    vehicle_average NUMERIC(5,2),
    fuel_price NUMERIC(5,2),
    monthly_fuel_expense NUMERIC(12,2),
    monthly_expense NUMERIC(12,2),
    remaining NUMERIC(12,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 15. permits
CREATE TABLE IF NOT EXISTS permits (
    id SERIAL PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    permit_type TEXT,
    state TEXT,
    start_date DATE,
    end_date DATE,
    amount NUMERIC(12,2),
    payment_status TEXT,
    reference TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 16. rto_agents
CREATE TABLE IF NOT EXISTS rto_agents (
    id SERIAL PRIMARY KEY,
    name TEXT,
    area TEXT,
    city TEXT,
    state TEXT,
    phone TEXT,
    notes TEXT,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 17. insurance_records
CREATE TABLE IF NOT EXISTS insurance_records (
    id SERIAL PRIMARY KEY,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    provider TEXT,
    policy_number TEXT,
    insurance_type TEXT,
    start_date DATE,
    expiry_date DATE,
    premium NUMERIC(12,2),
    contact TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 18. flight_bookings & passengers
CREATE TABLE IF NOT EXISTS flight_bookings (
    id SERIAL PRIMARY KEY,
    booking_number TEXT,
    booking_date DATE,
    travel_date DATE,
    from_location TEXT,
    to_location TEXT,
    airline TEXT,
    flight_number TEXT,
    flight_time TIME,
    pnr TEXT,
    pax INTEGER,
    phone TEXT,
    amount NUMERIC(12,2),
    agent TEXT,
    issue_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS flight_passengers (
    id SERIAL PRIMARY KEY,
    flight_booking_id INTEGER REFERENCES flight_bookings(id) ON DELETE CASCADE,
    passenger_name TEXT,
    date_of_birth DATE,
    passport_number TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 19. train_bookings & passengers
CREATE TABLE IF NOT EXISTS train_bookings (
    id SERIAL PRIMARY KEY,
    booking_number TEXT,
    booking_date DATE,
    travel_date DATE,
    from_location TEXT,
    to_location TEXT,
    class TEXT,
    train_number TEXT,
    pnr TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS train_passengers (
    id SERIAL PRIMARY KEY,
    train_booking_id INTEGER REFERENCES train_bookings(id) ON DELETE CASCADE,
    passenger_name TEXT,
    age INTEGER,
    gender TEXT,
    phone TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 20. bus_bookings
CREATE TABLE IF NOT EXISTS bus_bookings (
    id SERIAL PRIMARY KEY,
    booking_number TEXT,
    booking_date DATE,
    travel_date DATE,
    from_location TEXT,
    to_location TEXT,
    travel_time TIME,
    travels TEXT,
    contact_number TEXT,
    bus_number TEXT,
    pnr TEXT,
    due_amount NUMERIC(12,2),
    to_pay NUMERIC(12,2),
    settled_amount NUMERIC(12,2),
    payment_date DATE,
    passenger_name TEXT,
    passenger_phone TEXT,
    payment_status TEXT,
    notes TEXT,
    remaining_amount NUMERIC(12,2) GENERATED ALWAYS AS (due_amount + to_pay - settled_amount) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 21. payments (centralized)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    payment_date DATE,
    amount NUMERIC(12,2),
    payment_method TEXT,
    reference TEXT,
    customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
    driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
    booking_id INTEGER,
    trip_id INTEGER,
    account_id INTEGER REFERENCES accounts(id) ON DELETE SET NULL,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 22. outstanding_entries
CREATE TABLE IF NOT EXISTS outstanding_entries (
    id SERIAL PRIMARY KEY,
    entity_type TEXT,
    entity_id INTEGER,
    reference_type TEXT,
    reference_id INTEGER,
    original_amount NUMERIC(12,2),
    paid_amount NUMERIC(12,2) DEFAULT 0,
    remaining_amount NUMERIC(12,2) GENERATED ALWAYS AS (original_amount - paid_amount) STORED,
    due_date DATE,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_day_book_date ON day_book_entries(booking_date);
CREATE INDEX IF NOT EXISTS idx_cab_booking_date ON cab_bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_vehicle_number ON vehicles(vehicle_number);
CREATE INDEX IF NOT EXISTS idx_driver_phone ON drivers(phone);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payments(payment_date);

COMMIT;
