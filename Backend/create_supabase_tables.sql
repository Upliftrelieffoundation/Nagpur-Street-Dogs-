-- =============================================================
-- NSD WEBSITE — SUPABASE DATABASE SCHEMA
-- Project ID: pggruahenklvcexwpvom
-- Run this entire script in the Supabase SQL Editor
-- =============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- 1. PROFILES TABLE
-- Mirrors auth.users. When a user signs up via Supabase Auth,
-- a row is inserted here automatically via a trigger below.
-- Replaces MongoDB: UserSchema
-- =============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id       TEXT UNIQUE,                     -- custom human-readable ID (uuid v4)
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  occupation    TEXT,
  dob           DATE,
  phone         TEXT,
  image         TEXT,                            -- Cloudinary URL
  -- Address (flattened from nested object)
  address_street  TEXT,
  address_city    TEXT,
  address_state   TEXT,
  address_pincode TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile row when a new Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- 2. BLOGS TABLE
-- Replaces MongoDB: BlogSchema
-- =============================================================
CREATE TABLE IF NOT EXISTS blogs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id         TEXT UNIQUE NOT NULL,           -- human-readable slug like "user-abc123"
  title           TEXT NOT NULL,
  description     TEXT,
  banner          TEXT NOT NULL,                  -- Cloudinary URL
  content         JSONB,                          -- Editor.js JSON content (was Schema.Types.Mixed)
  tags            TEXT[] DEFAULT '{}',            -- array of tag strings
  author_id       UUID REFERENCES profiles(id) ON DELETE SET NULL,
  draft           BOOLEAN DEFAULT FALSE,
  -- Activity counters (was nested object in Mongoose)
  total_likes         INT DEFAULT 0,
  total_comments      INT DEFAULT 0,
  total_reads         INT DEFAULT 0,
  total_parent_comments INT DEFAULT 0,
  published_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 3. COMMENTS TABLE
-- Replaces MongoDB: CommentSchema
-- Self-referencing for replies (parent -> child)
-- =============================================================
CREATE TABLE IF NOT EXISTS comments (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blog_id       UUID REFERENCES blogs(id) ON DELETE CASCADE,
  blog_author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  comment       TEXT NOT NULL,
  commented_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_reply      BOOLEAN DEFAULT FALSE,
  parent_id     UUID REFERENCES comments(id) ON DELETE SET NULL,  -- null for top-level comments
  children      UUID[] DEFAULT '{}',             -- array of child comment IDs
  commented_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 4. NOTIFICATIONS TABLE
-- Replaces MongoDB: Notification.js
-- =============================================================
DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('like', 'comment', 'reply');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS notifications (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type                  notification_type NOT NULL,
  blog_id               UUID REFERENCES blogs(id) ON DELETE CASCADE,
  notification_for      UUID REFERENCES profiles(id) ON DELETE CASCADE, -- who receives it
  user_id               UUID REFERENCES profiles(id) ON DELETE CASCADE, -- who triggered it
  comment_id            UUID REFERENCES comments(id) ON DELETE SET NULL,
  reply_id              UUID REFERENCES comments(id) ON DELETE SET NULL,
  replied_on_comment_id UUID REFERENCES comments(id) ON DELETE SET NULL,
  seen                  BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 5. DOGS TABLE (Adoption listings)
-- Replaces MongoDB: DogSchema
-- =============================================================
DO $$ BEGIN
  CREATE TYPE dog_gender AS ENUM ('Male', 'Female');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dog_size AS ENUM ('Small', 'Medium', 'Large');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE dog_energy AS ENUM ('Low', 'Medium', 'High');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE contact_pref AS ENUM ('phone', 'email', 'both');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS dogs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  breed           TEXT NOT NULL,
  age             INT NOT NULL,                   -- age in months
  gender          dog_gender NOT NULL,
  size            dog_size NOT NULL,
  color           TEXT NOT NULL,
  description     TEXT NOT NULL,
  images          TEXT[] DEFAULT '{}',            -- array of Cloudinary URLs
  -- Health (flattened from healthStatus nested object)
  health_vaccinated   BOOLEAN DEFAULT FALSE,
  health_neutered     BOOLEAN DEFAULT FALSE,
  health_medical_history TEXT DEFAULT '',
  -- Location (flattened from location nested object)
  location_city   TEXT NOT NULL,
  location_state  TEXT NOT NULL,
  location_pincode TEXT NOT NULL,
  location_address TEXT,
  -- Owner
  owner_id        UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_adopted      BOOLEAN DEFAULT FALSE,
  adopted_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  adopted_at      TIMESTAMPTZ,
  contact_preference contact_pref DEFAULT 'both',
  urgent          BOOLEAN DEFAULT FALSE,
  -- Additional fields
  temperament     TEXT[] DEFAULT '{}',
  good_with_children BOOLEAN DEFAULT FALSE,
  good_with_cats     BOOLEAN DEFAULT FALSE,
  good_with_dogs     BOOLEAN DEFAULT FALSE,
  energy_level    dog_energy DEFAULT 'Medium',
  special_needs   TEXT DEFAULT '',
  adoption_fee    NUMERIC DEFAULT 0,
  views           INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast filtering (matches the Mongoose indexes)
CREATE INDEX IF NOT EXISTS idx_dogs_location_breed ON dogs(location_city, breed, is_adopted);
CREATE INDEX IF NOT EXISTS idx_dogs_size ON dogs(size, is_adopted);
CREATE INDEX IF NOT EXISTS idx_dogs_urgent ON dogs(urgent DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dogs_owner ON dogs(owner_id);

-- =============================================================
-- 6. DOG INQUIRIES TABLE
-- Replaces the embedded inquiries[] array in DogSchema
-- =============================================================
CREATE TABLE IF NOT EXISTS dog_inquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id      UUID REFERENCES dogs(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 7. DONATIONS TABLE
-- Replaces MongoDB: DonationSchema
-- =============================================================
DO $$ BEGIN
  CREATE TYPE donation_status AS ENUM ('created', 'paid', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS donations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id      TEXT UNIQUE NOT NULL,             -- Razorpay order ID
  payment_id    TEXT,                             -- Razorpay payment ID
  amount        NUMERIC NOT NULL,
  currency      TEXT DEFAULT 'INR',
  donor_name    TEXT NOT NULL,
  donor_email   TEXT NOT NULL,
  donor_phone   TEXT NOT NULL,
  status        donation_status DEFAULT 'created',
  signature     TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 8. LOST DOGS TABLE
-- Replaces MongoDB: LostDogSchema
-- =============================================================
DO $$ BEGIN
  CREATE TYPE lost_dog_status AS ENUM ('lost', 'found', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS lost_dogs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  description   TEXT NOT NULL,
  breed         TEXT,
  color         TEXT,
  contact       TEXT NOT NULL,
  date_lost     DATE NOT NULL,
  lat           FLOAT8 NOT NULL,                  -- latitude
  lng           FLOAT8 NOT NULL,                  -- longitude
  image         TEXT,                             -- Cloudinary URL
  reported_by   UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_found      BOOLEAN DEFAULT FALSE,
  status        lost_dog_status DEFAULT 'lost',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 9. VET CLINICS TABLE
-- Replaces MongoDB: VetClinicSchema
-- =============================================================
CREATE TABLE IF NOT EXISTS vet_clinics (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  phone         TEXT NOT NULL,
  hours         TEXT NOT NULL,
  lat           FLOAT8 NOT NULL,
  lng           FLOAT8 NOT NULL,
  added_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  is_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- 10. VOLUNTEERS TABLE
-- Replaces MongoDB: VolunteerSchema
-- =============================================================
CREATE TABLE IF NOT EXISTS volunteers (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT NOT NULL,
  address     TEXT NOT NULL,
  city        TEXT NOT NULL,
  state       TEXT NOT NULL,
  country     TEXT NOT NULL,
  pincode     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- These rules control who can read/write each table.
-- =============================================================

-- ---- PROFILES ----
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view profiles (public pages like /user/:id)
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

-- Only the owner can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- The trigger function inserts profiles (uses SECURITY DEFINER so no policy needed for INSERT)

-- ---- BLOGS ----
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Anyone can read published (non-draft) blogs
CREATE POLICY "Published blogs are public"
  ON blogs FOR SELECT USING (draft = false OR author_id = auth.uid());

-- Only logged-in users can create blogs
CREATE POLICY "Authenticated users can create blogs"
  ON blogs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only the author can update or delete their blog
CREATE POLICY "Authors can update their own blogs"
  ON blogs FOR UPDATE USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own blogs"
  ON blogs FOR DELETE USING (author_id = auth.uid());

-- ---- COMMENTS ----
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are public"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can comment"
  ON comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE USING (commented_by = auth.uid());

-- ---- NOTIFICATIONS ----
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see their own notifications"
  ON notifications FOR SELECT USING (notification_for = auth.uid());

CREATE POLICY "Authenticated users can create notifications"
  ON notifications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can mark their notifications seen"
  ON notifications FOR UPDATE USING (notification_for = auth.uid());

-- ---- DOGS ----
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All non-adopted dogs are public"
  ON dogs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can list dogs"
  ON dogs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Owners can update their dogs"
  ON dogs FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their dogs"
  ON dogs FOR DELETE USING (owner_id = auth.uid());

-- ---- DOG INQUIRIES ----
ALTER TABLE dog_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dog inquiries visible to dog owner and inquirer"
  ON dog_inquiries FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (SELECT 1 FROM dogs WHERE dogs.id = dog_id AND dogs.owner_id = auth.uid())
  );

CREATE POLICY "Authenticated users can submit inquiries"
  ON dog_inquiries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ---- DONATIONS ----
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Donations are managed server-side via service role only (no public read)
-- Users cannot directly read donation records via client SDK for privacy
CREATE POLICY "Service role manages donations"
  ON donations USING (false); -- blocked for all anon/authenticated client calls

-- ---- LOST DOGS ----
ALTER TABLE lost_dogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lost dogs are public"
  ON lost_dogs FOR SELECT USING (true);

CREATE POLICY "Authenticated users can report lost dogs"
  ON lost_dogs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Reporters can update their reports"
  ON lost_dogs FOR UPDATE USING (reported_by = auth.uid());

CREATE POLICY "Reporters can delete their reports"
  ON lost_dogs FOR DELETE USING (reported_by = auth.uid());

-- ---- VET CLINICS ----
ALTER TABLE vet_clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verified vet clinics are public"
  ON vet_clinics FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add clinics"
  ON vet_clinics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Adders can update their clinics"
  ON vet_clinics FOR UPDATE USING (added_by = auth.uid());

-- ---- VOLUNTEERS ----
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;

-- Volunteer form submissions — anyone can submit (public form)
CREATE POLICY "Anyone can submit volunteer form"
  ON volunteers FOR INSERT WITH CHECK (true);

-- Only service role (admin) can read volunteer list
CREATE POLICY "Only service role reads volunteers"
  ON volunteers FOR SELECT USING (false); -- blocked for anon/authenticated client calls

-- =============================================================
-- DONE! All tables and policies created.
-- Next step: Deploy the backend code that uses these tables.
-- =============================================================
