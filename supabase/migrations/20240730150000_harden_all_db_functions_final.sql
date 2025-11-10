/*
# [Operation Name]
Final Database Function Cleanup and Hardening

## Query Description: 
This script performs a final cleanup of obsolete database functions and hardens the security of the remaining `increment_like_count` function. It explicitly drops several old functions related to the previous credit and reward systems to ensure they are no longer present. It then recreates the `increment_like_count` function with a secure `search_path` to resolve all "Function Search Path Mutable" warnings. This operation is safe and does not affect any user data.

## Metadata:
- Schema-Category: ["Structural", "Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: false

## Structure Details:
- Drops obsolete functions: `claim_daily_ad_reward`, `claim_direct_link_reward`, `claim_telegram_reward`, `claim_coupon_code`, `purchase_prompt`, `get_user_role`, `handle_new_user`, `force_reload_and_claim_reward`.
- Recreates the `increment_like_count` function with enhanced security.

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None
- Mitigates "Function Search Path Mutable" security warnings.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. Improves security by removing unused code and securing existing functions.
*/

-- Drop obsolete functions if they still exist
DROP FUNCTION IF EXISTS public.claim_daily_ad_reward(p_user_id uuid);
DROP FUNCTION IF EXISTS public.claim_direct_link_reward(p_user_id uuid, p_reward_type text);
DROP FUNCTION IF EXISTS public.claim_telegram_reward(p_user_id uuid);
DROP FUNCTION IF EXISTS public.claim_coupon_code(p_user_id uuid, p_code text);
DROP FUNCTION IF EXISTS public.purchase_prompt(p_prompt_id uuid, p_user_id uuid);
DROP FUNCTION IF EXISTS public.get_user_role(p_user_id uuid);
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.force_reload_and_claim_reward(p_user_id uuid, p_reward_type text);

-- Recreate the increment_like_count function with a secure search_path
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;
