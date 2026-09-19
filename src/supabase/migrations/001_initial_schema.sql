-- BeautiLyze — Initial Schema Migration
-- Creates: skin_profiles, analysis_reports, ingredients
-- Enables: pg_trgm extension + trigram index
-- Applies: RLS policies on all tables

-- ============================================================
-- 0. Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- 1. skin_profiles — one row per user, first-run gate
-- ============================================================
CREATE TABLE skin_profiles (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_type      text NOT NULL,          -- single-select: oily, dry, combination, normal, sensitive
  concerns       text[] NOT NULL DEFAULT '{}', -- multi-select: acne, aging, hyperpigmentation, redness, dehydration, texture
  allergies      text[] NOT NULL DEFAULT '{}', -- chips + free text
  age_group      text NOT NULL,          -- single-select: 18-24, 25-34, 35-44, 45+
  sensitivity_level text NOT NULL,       -- single-select: low, medium, high
  updated_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE skin_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own skin profile"
  ON skin_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own skin profile"
  ON skin_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own skin profile"
  ON skin_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own skin profile"
  ON skin_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 2. ingredients — curated INCI database (public read, admin write)
-- ============================================================
CREATE TABLE ingredients (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  inci_name      text NOT NULL UNIQUE,   -- official INCI name (e.g. "Niacinamide")
  common_name    text NOT NULL,           -- human-readable (e.g. "Vitamin B3")
  function       text NOT NULL,           -- humectant, emollient, active, preservative, fragrance, etc.
  hazard_weight  integer NOT NULL CHECK (hazard_weight BETWEEN 1 AND 5), -- 1=safe, 5=high concern
  category       text NOT NULL,           -- irritant, allergen, comedogenic, safe, unclassified
  explanation    text NOT NULL,           -- one-sentence reason for the hazard weight
  source_ref     text NOT NULL            -- source identifier (e.g. "INCIDecoder:niacinamide")
);

CREATE INDEX idx_inci_trgm ON ingredients USING gin (inci_name gin_trgm_ops);

ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read ingredients"
  ON ingredients FOR SELECT
  USING (true);

CREATE POLICY "Admin write ingredients"
  ON ingredients FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Admin update ingredients"
  ON ingredients FOR UPDATE
  USING (false);

CREATE POLICY "Admin delete ingredients"
  ON ingredients FOR DELETE
  USING (false);

-- ============================================================
-- 3. analysis_reports — scan results, one per scan
-- ============================================================
CREATE TABLE analysis_reports (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_name      text,                    -- nullable, user may not provide
  scanned_at        timestamptz NOT NULL DEFAULT now(),
  ingredients_json  jsonb NOT NULL,          -- matched ingredient data
  s_safe            integer NOT NULL,        -- intrinsic safety score (0–100)
  s_suit            integer NOT NULL,        -- personalized suitability score (0–100)
  classification    text NOT NULL,           -- "Safe", "Warning", "Not Recommended"
  penalties_json    jsonb NOT NULL,          -- list of applied penalties
  unclassified_count integer NOT NULL DEFAULT 0
);

ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own reports"
  ON analysis_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own reports"
  ON analysis_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own reports"
  ON analysis_reports FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own reports"
  ON analysis_reports FOR DELETE
  USING (auth.uid() = user_id);
