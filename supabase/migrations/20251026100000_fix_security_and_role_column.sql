/*
# [Fix] Add Role Column and Apply Full RLS Policies
This migration script corrects a schema mismatch and applies comprehensive security policies to the database.

## Query Description:
This script performs two main actions:
1.  **Adds a `role` column** to the `public.profiles` table, which was missing and caused a previous migration to fail. This is a non-destructive operation.
2.  **Enables and configures Row Level Security (RLS)** across all relevant tables. This is a critical security enhancement to ensure users can only access data they are permitted to see. Existing data will not be modified, but access to it will be restricted based on these new rules.

## Metadata:
- Schema-Category: ["Structural", "Security"]
- Impact-Level: ["High"]
- Requires-Backup: true
- Reversible: true (by dropping policies and the new column)

## Structure Details:
- **Tables Modified**:
  - `public.profiles`: Adds a `role` column.
- **RLS Enabled On**: `profiles`, `prompts`, `unlocked_prompts`, `daily_ad_claims`, `daily_link_claims`, `user_coupon_claims`, `coupon_codes`, `categories`, `hero_images`, `app_config`.
- **Functions Created/Replaced**: `is_admin(uuid)`.

## Security Implications:
- RLS Status: Enabled on all public data tables.
- Policy Changes: Yes, this script creates a full set of restrictive policies.
- Auth Requirements: Policies are based on the authenticated user's ID and their role.

## Performance Impact:
- RLS policies add a small overhead to queries. This is generally negligible but necessary for security.
- The `is_admin` function is optimized for performance.
*/

-- Step 1: Add the missing 'role' column to the profiles table.
-- This is the primary fix for the migration error.
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- Step 2: Create a helper function to check if a user is an admin.
-- This function will be used in RLS policies. It is defined with SECURITY DEFINER
-- to securely check the role from the profiles table.
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_user boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin'
  ) INTO is_admin_user;
  RETURN is_admin_user;
END;
$$;

-- Revoke execute permission from public and grant it only to authenticated users.
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM public;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;


-- Step 3: Apply Row Level Security (RLS) to all tables.

-- Table: profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow authenticated users to view their own profile" ON public.profiles;
CREATE POLICY "Allow authenticated users to view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow admins full access to profiles" ON public.profiles;
CREATE POLICY "Allow admins full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: prompts
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to prompts" ON public.prompts;
CREATE POLICY "Allow public read access to prompts"
  ON public.prompts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admins full access to prompts" ON public.prompts;
CREATE POLICY "Allow admins full access to prompts"
  ON public.prompts FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: unlocked_prompts
ALTER TABLE public.unlocked_prompts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to see their own unlocked prompts" ON public.unlocked_prompts;
CREATE POLICY "Allow users to see their own unlocked prompts"
  ON public.unlocked_prompts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins full access to unlocked_prompts" ON public.unlocked_prompts;
CREATE POLICY "Allow admins full access to unlocked_prompts"
  ON public.unlocked_prompts FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
-- Note: Insertion is handled by the `purchase_prompt` function.

-- Table: daily_ad_claims
ALTER TABLE public.daily_ad_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to see their own ad claims" ON public.daily_ad_claims;
CREATE POLICY "Allow users to see their own ad claims"
  ON public.daily_ad_claims FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins full access to ad claims" ON public.daily_ad_claims;
CREATE POLICY "Allow admins full access to ad claims"
  ON public.daily_ad_claims FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: daily_link_claims
ALTER TABLE public.daily_link_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to see their own link claims" ON public.daily_link_claims;
CREATE POLICY "Allow users to see their own link claims"
  ON public.daily_link_claims FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins full access to link claims" ON public.daily_link_claims;
CREATE POLICY "Allow admins full access to link claims"
  ON public.daily_link_claims FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: coupon_codes
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow admins full access to coupon codes" ON public.coupon_codes;
CREATE POLICY "Allow admins full access to coupon codes"
  ON public.coupon_codes FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: user_coupon_claims
ALTER TABLE public.user_coupon_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow users to see their own coupon claims" ON public.user_coupon_claims;
CREATE POLICY "Allow users to see their own coupon claims"
  ON public.user_coupon_claims FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow admins full access to coupon claims" ON public.user_coupon_claims;
CREATE POLICY "Allow admins full access to coupon claims"
  ON public.user_coupon_claims FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admins full access to categories" ON public.categories;
CREATE POLICY "Allow admins full access to categories"
  ON public.categories FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: hero_images
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to hero images" ON public.hero_images;
CREATE POLICY "Allow public read access to hero images"
  ON public.hero_images FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admins full access to hero images" ON public.hero_images;
CREATE POLICY "Allow admins full access to hero images"
  ON public.hero_images FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Table: app_config
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to app_config" ON public.app_config;
CREATE POLICY "Allow public read access to app_config"
  ON public.app_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow admins full access to app_config" ON public.app_config;
CREATE POLICY "Allow admins full access to app_config"
  ON public.app_config FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));
