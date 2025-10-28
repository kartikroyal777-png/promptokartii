/*
  # [SECURITY] Harden Function Search Paths
  This migration updates all existing database functions to explicitly set the `search_path`.
  This is a security best practice that prevents certain classes of vulnerabilities.

  ## Query Description: 
  This operation is safe and non-destructive. It modifies the metadata of existing functions but does not alter their logic or behavior. It directly addresses the "Function Search Path Mutable" warnings from the Supabase security advisor.

  ## Metadata:
  - Schema-Category: "Security"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (by unsetting the search_path)

  ## Structure Details:
  - Modifies the following functions:
    - increment_like_count(uuid)
    - purchase_prompt(uuid, integer)
    - claim_ad_reward(integer)
    - claim_telegram_reward()
    - claim_link_reward(integer)
    - claim_coupon_reward(text)

  ## Security Implications:
  - RLS Status: Unchanged
  - Policy Changes: No
  - Auth Requirements: None
  - Mitigates: Potential for search_path hijacking attacks.

  ## Performance Impact:
  - Indexes: None
  - Triggers: None
  - Estimated Impact: Negligible. This is a metadata change.
*/

ALTER FUNCTION public.increment_like_count(uuid) SET search_path = public;
ALTER FUNCTION public.purchase_prompt(uuid, integer) SET search_path = public;
ALTER FUNCTION public.claim_ad_reward(integer) SET search_path = public;
ALTER FUNCTION public.claim_telegram_reward() SET search_path = public;
ALTER FUNCTION public.claim_link_reward(integer) SET search_path = public;
ALTER FUNCTION public.claim_coupon_reward(text) SET search_path = public;
