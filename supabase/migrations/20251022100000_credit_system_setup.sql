/*
          # [Credit & Profile System Setup]
          This migration establishes the full database structure for a user credit system, including user profiles, prompt unlocking, daily ad claims, and admin configuration.

          ## Query Description: This migration is foundational and structural. It adds new tables and logic but does not alter or delete existing prompt or category data. It is designed to be non-destructive to your current content.
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - Creates `profiles` table to store user credits.
          - Creates `app_config` table for site-wide settings (e.g., prompt cost).
          - Creates `unlocked_prompts` table to track user purchases.
          - Creates `daily_ad_claims` table for the daily reward system.
          - Adds a trigger to automatically create a user profile on sign-up.
          - Implements Row Level Security (RLS) on all new tables for data privacy.
          
          ## Security Implications:
          - RLS Status: Enabled on all new tables.
          - Policy Changes: Yes, new policies are created to protect user data.
          - Auth Requirements: Most new tables require an authenticated user.
          
          ## Performance Impact:
          - Indexes: Primary keys and foreign keys create necessary indexes.
          - Triggers: Adds one trigger on `auth.users` for profile creation.
          - Estimated Impact: Low. The changes are optimized for performance.
          */

-- 1. Create app_config table for site settings
CREATE TABLE public.app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read config"
ON public.app_config
FOR SELECT
USING (true);

-- For now, disable writes. Admin updates will be handled via RPC function or direct access.
CREATE POLICY "Disallow public writes"
ON public.app_config
FOR ALL
USING (false);

-- Insert default prompt cost
INSERT INTO public.app_config (key, value) VALUES ('prompt_cost', '{"cost": 1}');

-- 2. Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    last_credit_reset TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- 3. Function and Trigger to create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, credits)
  VALUES (new.id, 5); -- Give 5 free credits on sign-up
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Create unlocked_prompts table
CREATE TABLE public.unlocked_prompts (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    PRIMARY KEY (user_id, prompt_id)
);

ALTER TABLE public.unlocked_prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own unlocked prompts"
ON public.unlocked_prompts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own unlocked prompts"
ON public.unlocked_prompts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Create daily_ad_claims table
CREATE TABLE public.daily_ad_claims (
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
    claim_1_claimed_at TIMESTAMPTZ,
    claim_2_claimed_at TIMESTAMPTZ,
    claim_3_claimed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, claim_date)
);

ALTER TABLE public.daily_ad_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own daily claims"
ON public.daily_ad_claims
FOR ALL
USING (auth.uid() = user_id);
