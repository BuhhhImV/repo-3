-- Enable PostGIS extension for geo queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. ENUMS & DOMAINS
CREATE TYPE user_role AS ENUM ('individual', 'business', 'logistics', 'admin');
CREATE TYPE listing_status AS ENUM ('draft', 'active', 'offered', 'reserved', 'completed', 'expired');
CREATE TYPE transaction_type AS ENUM ('free', 'sale', 'swap', 'tender', 'wanted');
CREATE TYPE condition_level AS ENUM ('scrap', 'fair', 'good', 'like-new', 'new');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected', 'countered', 'expired');
CREATE TYPE collection_method AS ENUM ('buyer', 'seller', 'logistics');

-- 2. USERS & PROFILES
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL DEFAULT 'individual',
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  is_verified_business BOOLEAN DEFAULT false,
  trust_score INTEGER DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100),
  stripe_account_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TAXONOMY & IMPACT FACTORS
CREATE TABLE public.material_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- e.g., 'Industrial', 'Construction'
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.material_impact_factors (
  material_type_id UUID PRIMARY KEY REFERENCES public.material_types(id),
  co2_per_kg NUMERIC(10,2) NOT NULL DEFAULT 0.0,
  water_per_kg NUMERIC(10,2) NOT NULL DEFAULT 0.0,
  energy_per_kg NUMERIC(10,2) NOT NULL DEFAULT 0.0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. LISTINGS
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES public.users(id),
  material_type_id UUID NOT NULL REFERENCES public.material_types(id),
  
  title TEXT NOT NULL CHECK (char_length(title) <= 80),
  description TEXT CHECK (char_length(description) <= 500),
  condition condition_level NOT NULL,
  
  quantity NUMERIC(10,2) NOT NULL,
  quantity_unit TEXT NOT NULL, -- 'kg', 'tonnes', 'units', etc.
  min_order_quantity NUMERIC(10,2),
  
  txn_type transaction_type NOT NULL,
  price_paise BIGINT, -- Using integer for cents/paise
  is_negotiable BOOLEAN DEFAULT false,
  swap_request TEXT,
  
  pickup_location GEOGRAPHY(POINT, 4326) NOT NULL,
  pickup_address_summary TEXT NOT NULL,
  collection_radius_km INTEGER NOT NULL DEFAULT 0,
  collection_methods collection_method[] NOT NULL,
  
  available_from TIMESTAMPTZ,
  available_until TIMESTAMPTZ,
  advance_notice_hours INTEGER DEFAULT 0,
  
  is_certified BOOLEAN DEFAULT false,
  weight_cert_url TEXT,
  safety_data_url TEXT,
  
  status listing_status NOT NULL DEFAULT 'draft',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. LISTING PHOTOS
CREATE TABLE public.listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  is_hero BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LISTING EVENTS (APPEND-ONLY)
CREATE TABLE public.listing_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  event_type TEXT NOT NULL, -- e.g., 'status_changed', 'edited'
  old_status listing_status,
  new_status listing_status,
  actor_id UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Prevent updates/deletes on events
CREATE RULE prevent_update_listing_events AS ON UPDATE TO public.listing_events DO INSTEAD NOTHING;
CREATE RULE prevent_delete_listing_events AS ON DELETE TO public.listing_events DO INSTEAD NOTHING;

-- 7. OFFERS
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  
  quantity NUMERIC(10,2) NOT NULL,
  proposed_price_paise BIGINT,
  message TEXT CHECK (char_length(message) <= 300),
  collection_date TIMESTAMPTZ,
  collection_method collection_method,
  
  status offer_status NOT NULL DEFAULT 'pending',
  round_count INTEGER DEFAULT 1,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TRANSACTIONS
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  offer_id UUID REFERENCES public.offers(id),
  seller_id UUID NOT NULL REFERENCES public.users(id),
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  
  final_price_paise BIGINT,
  platform_fee_paise BIGINT,
  stripe_payment_intent_id TEXT,
  
  status TEXT NOT NULL DEFAULT 'escrow_pending', -- 'escrow_pending', 'escrow_secured', 'completed', 'disputed'
  buyer_confirmed_at TIMESTAMPTZ,
  seller_confirmed_at TIMESTAMPTZ,
  actual_weight_received NUMERIC(10,2),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. IMPACT LOG (APPEND-ONLY)
CREATE TABLE public.impact_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  role_in_txn TEXT NOT NULL, -- 'buyer', 'seller'
  
  weight_diverted_kg NUMERIC(10,2) NOT NULL,
  co2_saved_kg NUMERIC(10,2) NOT NULL,
  water_saved_l NUMERIC(10,2) NOT NULL,
  energy_saved_kwh NUMERIC(10,2) NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE RULE prevent_update_impact_log AS ON UPDATE TO public.impact_log DO INSTEAD NOTHING;
CREATE RULE prevent_delete_impact_log AS ON DELETE TO public.impact_log DO INSTEAD NOTHING;

-- 10. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  reviewer_id UUID NOT NULL REFERENCES public.users(id),
  reviewee_id UUID NOT NULL REFERENCES public.users(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  seller_response TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. MESSAGES & THREADS
CREATE TABLE public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id),
  participant_one UUID NOT NULL REFERENCES public.users(id),
  participant_two UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id),
  sender_id UUID NOT NULL REFERENCES public.users(id),
  
  content TEXT NOT NULL,
  attachment_url TEXT,
  is_read BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SAVED SEARCHES (ALERTS)
CREATE TABLE public.saved_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.users(id),
  
  material_type_id UUID REFERENCES public.material_types(id),
  radius_km INTEGER DEFAULT 25,
  max_price_paise BIGINT,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. DISPUTES
CREATE TABLE public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id),
  raised_by UUID NOT NULL REFERENCES public.users(id),
  
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open', -- 'open', 'resolved_refund', 'resolved_rejected', 'escalated'
  resolution_notes TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. AUDIT LOG
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES public.users(id),
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id UUID NOT NULL,
  changes JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE RULE prevent_update_audit_log AS ON UPDATE TO public.audit_log DO INSTEAD NOTHING;
CREATE RULE prevent_delete_audit_log AS ON DELETE TO public.audit_log DO INSTEAD NOTHING;

-- Create spatial index for fast geo queries
CREATE INDEX listings_pickup_location_idx ON public.listings USING GIST (pickup_location);
