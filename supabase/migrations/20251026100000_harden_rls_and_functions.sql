/*
# [SECURITY] Harden Database with RLS and Secure Functions
This migration script addresses critical security vulnerabilities by enabling Row Level Security (RLS) on all public tables and fixing function search path warnings.

## Query Description: 
This operation is critical for data protection. It restricts data access based on user roles and ownership, preventing unauthorized data exposure. It ensures that users can only see and manage their own data, while administrators retain full control. There is a low risk of data loss, but it's always best practice to back up your database before applying security changes.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: true (by disabling RLS and dropping policies)

## Structure Details:
- Enables RLS on: `profiles`, `prompts`, `categories`, `hero_images`, `unlocked_prompts`, `daily_ad_claims`, `daily_link_claims`, `coupon_codes`, `user_coupon_claims`, `app_config`.
- Creates a new security helper function: `public.is_admin(uuid)`.
- Creates SELECT, INSERT, UPDATE, DELETE policies for all affected tables.
- Alters existing database functions to set a secure `search_path`.

## Security Implications:
- RLS Status: Enabled on all public tables.
- Policy Changes: Yes, new policies are created for all tables to enforce access control.
- Auth Requirements: Policies rely on `auth.uid()` to identify the current user.

## Performance Impact:
- Indexes: None added or removed.
- Triggers: None added or removed.
- Estimated Impact: RLS introduces a minor performance overhead on queries, but this is necessary for security. The impact is generally negligible for well-designed policies.
*/

-- STEP 1: Create a helper function to check for admin role
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- STEP 2: Enable RLS on all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_ad_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_link_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupon_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop existing policies to avoid conflicts (if any)
-- (It's safe to run these even if policies don't exist)
DROP POLICY IF EXISTS "Allow admin full access" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow individual update access" ON public.profiles;

DROP POLICY IF EXISTS "Allow admin full access" ON public.prompts;
DROP POLICY IF EXISTS "Allow public read access" ON public.prompts;

DROP POLICY IF EXISTS "Allow admin full access" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;

DROP POLICY IF EXISTS "Allow admin full access" ON public.hero_images;
DROP POLICY IF EXISTS "Allow public read access" ON public.hero_images;

DROP POLICY IF EXISTS "Allow admin full access" ON public.unlocked_prompts;
DROP POLICY IF EXISTS "Allow individual access" ON public.unlocked_prompts;

DROP POLICY IF EXISTS "Allow admin full access" ON public.daily_ad_claims;
DROP POLICY IF EXISTS "Allow individual access" ON public.daily_ad_claims;

DROP POLICY IF EXISTS "Allow admin full access" ON public.daily_link_claims;
DROP POLICY IF EXISTS "Allow individual access" ON public.daily_link_claims;

DROP POLICY IF EXISTS "Allow admin full access" ON public.coupon_codes;
-- No public access for coupon_codes

DROP POLICY IF EXISTS "Allow admin full access" ON public.user_coupon_claims;
DROP POLICY IF EXISTS "Allow individual access" ON public.user_coupon_claims;

DROP POLICY IF EXISTS "Allow admin full access" ON public.app_config;
DROP POLICY IF EXISTS "Allow public read access" ON public.app_config;


-- STEP 4: Create new RLS policies

-- Table: profiles
CREATE POLICY "Allow admin full access" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow individual read access" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual update access" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Tables with public read access
CREATE POLICY "Allow public read access" ON public.prompts FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.hero_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.app_config FOR SELECT USING (true);

-- Admin policies for public tables
CREATE POLICY "Allow admin full access" ON public.prompts FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.hero_images FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.app_config FOR ALL USING (public.is_admin(auth.uid()));

-- Tables with user-specific access
CREATE POLICY "Allow individual access" ON public.unlocked_prompts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow individual access" ON public.daily_ad_claims FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow individual access" ON public.daily_link_claims FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Allow individual access" ON public.user_coupon_claims FOR ALL USING (auth.uid() = user_id);

-- Admin policies for user-specific tables
CREATE POLICY "Allow admin full access" ON public.unlocked_prompts FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.daily_ad_claims FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.daily_link_claims FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Allow admin full access" ON public.user_coupon_claims FOR ALL USING (public.is_admin(auth.uid()));

-- Table: coupon_codes (highly restricted)
CREATE POLICY "Allow admin full access" ON public.coupon_codes FOR ALL USING (public.is_admin(auth.uid()));
-- NOTE: No policy for non-admins. Access is only through secure RPC functions.


-- STEP 5: Harden database functions by setting a secure search_path
-- This mitigates the "Function Search Path Mutable" warning.
ALTER FUNCTION public.claim_ad_reward(p_reward_slot integer) SET search_path = public;
ALTER FUNCTION public.claim_coupon_reward(p_coupon_code text) SET search_path = public;
ALTER FUNCTION public.claim_link_reward(p_link_id integer) SET search_path = public;
ALTER FUNCTION public.claim_telegram_reward() SET search_path = public;
ALTER FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer) SET search_path = public;
