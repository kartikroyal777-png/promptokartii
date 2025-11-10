/*
# [DB Cleanup and Security Hardening]
This migration fixes a dependency error from the previous attempt and completes the database cleanup and security hardening process.

## Query Description:
This script will perform the following actions:
1.  **Safely Drop Obsolete Tables:** It uses `DROP TABLE ... CASCADE` to remove old tables (`profiles`, `daily_ad_claims`, etc.) and any objects that depend on them, resolving the previous migration error.
2.  **Remove Obsolete Functions:** Deletes old database functions related to the removed tables.
3.  **Enable Row-Level Security (RLS):** Activates RLS on all remaining public tables to prevent unauthorized access.
4.  **Create RLS Policies:** Establishes policies to allow public read-only access while granting full administrative control to the designated admin user.
5.  **Harden Database Functions:** Secures the `increment_like_count` function by setting its search path, addressing the security advisory warning.

This is a critical update to secure your application's data.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- **Tables Dropped:** `profiles`, `daily_ad_claims`, `ad_views`, `reward_claims`, `coupons`, `app_config`
- **Functions Dropped:** `claim_direct_link_reward`, `claim_telegram_reward`, `claim_coupon_code`
- **Tables Altered:** `prompts`, `categories`, `hero_images` (RLS enabled)
- **Policies Created:** Public read and admin access policies for `prompts`, `categories`, `hero_images`.
- **Functions Altered:** `increment_like_count`

## Security Implications:
- RLS Status: Enabled on all public tables.
- Policy Changes: Yes, new policies are created to enforce access control.
- Auth Requirements: Policies reference `auth.jwt()` for admin checks.

## Performance Impact:
- Indexes: No significant changes.
- Triggers: No changes.
- Estimated Impact: Low. The primary impact is on security, not performance.
*/

-- Step 1: Drop obsolete tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.daily_ad_claims CASCADE;
DROP TABLE IF EXISTS public.ad_views CASCADE;
DROP TABLE IF EXISTS public.reward_claims CASCADE;
DROP TABLE IF EXISTS public.coupons CASCADE;
DROP TABLE IF EXISTS public.app_config CASCADE;

-- Step 2: Drop obsolete functions
DROP FUNCTION IF EXISTS public.claim_direct_link_reward(uuid);
DROP FUNCTION IF EXISTS public.claim_telegram_reward(uuid);
DROP FUNCTION IF EXISTS public.claim_coupon_code(uuid, text);

-- Step 3: Enable Row-Level Security on remaining public tables
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop any pre-existing policies to ensure a clean slate
DROP POLICY IF EXISTS "Allow public read access" ON public.prompts;
DROP POLICY IF EXISTS "Allow admin full access" ON public.prompts;
DROP POLICY IF EXISTS "Allow public read access" ON public.categories;
DROP POLICY IF EXISTS "Allow admin full access" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access" ON public.hero_images;
DROP POLICY IF EXISTS "Allow admin full access" ON public.hero_images;

-- Step 5: Create policies for public read access
CREATE POLICY "Allow public read access" ON public.prompts
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON public.categories
  FOR SELECT USING (true);
  
CREATE POLICY "Allow public read access" ON public.hero_images
  FOR SELECT USING (true);

-- Step 6: Create policies for admin full access
-- This assumes the admin user is identified by the specific email.
CREATE POLICY "Allow admin full access" ON public.prompts
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com');

CREATE POLICY "Allow admin full access" ON public.categories
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com');

CREATE POLICY "Allow admin full access" ON public.hero_images
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'kartikroyal777@gmail.com');

-- Step 7: Harden the increment_like_count function to fix the search path warning
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;
