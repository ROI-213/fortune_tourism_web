-- Database schema initialization for Fortune Travels PostgreSQL

-- 1. Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  service VARCHAR(100) NOT NULL,
  pickup VARCHAR(150),
  destination VARCHAR(150),
  travel_date VARCHAR(50),
  passengers VARCHAR(20),
  notes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'New',
  package_slug VARCHAR(100),
  vehicle_slug VARCHAR(100)
);

-- 2. Tour Packages Table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  from_city VARCHAR(100) NOT NULL,
  states TEXT[] NOT NULL DEFAULT '{}',
  destinations TEXT[] NOT NULL DEFAULT '{}',
  vehicles TEXT[] NOT NULL DEFAULT '{}',
  starting_price INTEGER NOT NULL DEFAULT 0,
  image TEXT NOT NULL,
  hero_image TEXT,
  summary TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
  inclusions TEXT[] DEFAULT '{}',
  exclusions TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  seats INTEGER NOT NULL,
  luggage VARCHAR(50) NOT NULL,
  price_per_km INTEGER NOT NULL DEFAULT 0,
  base_price_local INTEGER,
  features TEXT[] NOT NULL DEFAULT '{}',
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  is_popular BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PostgreSQL Native Storage Engine Tables
CREATE TABLE IF NOT EXISTS storage_buckets (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id VARCHAR(100) NOT NULL REFERENCES storage_buckets(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT NOT NULL,
  data BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert Default Storage Buckets if not exist
INSERT INTO storage_buckets (id, name, is_public)
VALUES 
  ('images', 'General Images', TRUE),
  ('packages', 'Tour Packages Uploads', TRUE),
  ('vehicles', 'Fleet Vehicle Uploads', TRUE)
ON CONFLICT (id) DO NOTHING;
