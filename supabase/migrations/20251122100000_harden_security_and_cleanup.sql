/*
# [Security Hardening and Database Cleanup]
This migration enables Row-Level Security (RLS) on all public tables, adds appropriate access policies, and removes obsolete tables and functions from the previous credit-based system.

## Query Description: [This is a critical security update and cleanup operation.
1. **Data Deletion:** This script will permanently delete the following tables and all their data: `profiles`, `unlocked_prompts`, `daily_ad_claims`, `daily_link_claims`, `user_coupon_claims`, and `app_config`.
2. **Security Enhancement:** It enables Row-Level Security on `prompts`, `categories`, and `hero_images` to prevent unauthorized access. Public read and insert permissions are then selectively granted.
3. **Function Hardening:** Secures the `increment_like_count` function and removes unused database functions.

**Recommendation:** A database backup is strongly recommended before applying this migration due to the destructive nature of dropping tables.]

## Metadata:
- Schema-Category: ["Dangerous", "Structural"]
- Impact-Level: ["High"]
- Requires-Backup: true
- Reversible: false

## Structure Details:
- **Tables Dropped:** `profiles`, `unlocked_prompts`, `daily_ad_claims`, `daily_link_claims`, `user_coupon_claims`, `app_config`
- **Functions Dropped:** `claim_ad_reward`, `claim_coupon_reward`, `claim_link_reward`, `claim_telegram_reward`, `purchase_prompt`
- **Functions Modified:** `increment_like_count` (hardened)
- **Tables Altered:** `prompts`, `categories`, `hero_images` (RLS enabled)

## Security Implications:
- RLS Status: Enabled on all public-facing tables.
- Policy Changes: Yes, new policies are created to control access.
- Auth Requirements: Policies are defined for public access. The `increment_like_count` function is updated to be a `SECURITY DEFINER` to work with RLS.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: RLS introduces a minor performance overhead on queries, but it is essential for security.
*/

-- Step 1: Drop obsolete tables from the old system.
DROP TABLE IF EXISTS public.profiles;
DROP TABLE IF EXISTS public.unlocked_prompts;
DROP TABLE IF EXISTS public.daily_ad_claims;
DROP TABLE IF EXISTS public.daily_link_claims;
DROP TABLE IF EXISTS public.user_coupon_claims;
DROP TABLE IF EXISTS public.app_config;

-- Step 2: Drop obsolete functions from the old system.
DROP FUNCTION IF EXISTS public.claim_ad_reward(p_reward_slot integer);
DROP FUNCTION IF EXISTS public.claim_coupon_reward(p_coupon_code character varying);
DROP FUNCTION IF EXISTS public.claim_link_reward(p_link_id integer);
DROP FUNCTION IF EXISTS public.claim_telegram_reward();
DROP FUNCTION IF EXISTS public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer);

-- Step 3: Enable Row Level Security on remaining public tables.
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any existing (potentially insecure) policies before creating new ones.
DROP POLICY IF EXISTS "Allow public read access to prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow public insert access to prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access to hero_images" ON public.hero_images;

-- Step 5: Create new, secure RLS policies.
-- Prompts can be read and created by anyone. Updates/Deletes are restricted to admin (service_role).
CREATE POLICY "Allow public read access to prompts" ON public.prompts FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to prompts" ON public.prompts FOR INSERT WITH CHECK (true);

-- Categories can be read by anyone.
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);

-- Hero images can be read by anyone.
CREATE POLICY "Allow public read access to hero_images" ON public.hero_images FOR SELECT USING (true);

-- Step 6: Harden the like count function.
-- This function is set as SECURITY DEFINER to bypass RLS for the specific action of incrementing a like count.
-- The search_path is explicitly set to 'public' to prevent search path hijacking vulnerabilities.
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  SET search_path = 'public';
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;
