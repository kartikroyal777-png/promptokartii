/*
          # [Operation Name]
          Refactor: Remove Credit System and Add Ad Link Field

          ## Query Description: This migration performs a major refactor of the database. It completely removes the user credit and reward system, making all prompts free. It also adds a new field for ad-related direct links on prompts.

WARNING: This is a destructive operation. The following tables and all their data will be permanently deleted: `daily_ad_claims`, `daily_link_claims`, `unlocked_prompts`, `coupon_codes`, `user_coupon_claims`. Columns related to credits will be removed from the `profiles` table.
          
          ## Metadata:
          - Schema-Category: "Dangerous"
          - Impact-Level: "High"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - DROPS Tables: `daily_ad_claims`, `daily_link_claims`, `unlocked_prompts`, `coupon_codes`, `user_coupon_claims`, `app_config`.
          - DROPS Functions: `purchase_prompt`, `claim_ad_reward`, `claim_telegram_reward`, `claim_link_reward`, `claim_coupon_reward`.
          - ALTERS Table `profiles`: Drops `credits` and `has_claimed_telegram_reward`.
          - ALTERS Table `prompts`: Adds `ad_direct_link_url` and drops the old `direct_link_url`.
          
          ## Security Implications:
          - RLS Status: Unchanged for remaining tables.
          - Policy Changes: No.
          - Auth Requirements: None for this migration.
          
          ## Performance Impact:
          - Indexes: Indexes on dropped tables will be removed.
          - Triggers: Triggers related to the credit system will be removed.
          - Estimated Impact: Positive. Removing these tables and functions will simplify queries and reduce database load.
          */

-- Step 1: Drop dependent functions
DROP FUNCTION IF EXISTS public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer);
DROP FUNCTION IF EXISTS public.claim_ad_reward(p_reward_slot integer);
DROP FUNCTION IF EXISTS public.claim_telegram_reward();
DROP FUNCTION IF EXISTS public.claim_link_reward(p_link_id integer);
DROP FUNCTION IF EXISTS public.claim_coupon_reward(p_coupon_code text);

-- Step 2: Drop tables with foreign key dependencies first
DROP TABLE IF EXISTS public.unlocked_prompts;
DROP TABLE IF EXISTS public.daily_ad_claims;
DROP TABLE IF EXISTS public.daily_link_claims;
DROP TABLE IF EXISTS public.user_coupon_claims;

-- Step 3: Drop remaining tables
DROP TABLE IF EXISTS public.coupon_codes;
DROP TABLE IF EXISTS public.app_config;

-- Step 4: Alter the profiles table to remove credit-related columns
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS credits,
DROP COLUMN IF EXISTS has_claimed_telegram_reward;

-- Step 5: Alter the prompts table to add the new ad link and remove the old one
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS ad_direct_link_url TEXT,
DROP COLUMN IF EXISTS direct_link_url;
