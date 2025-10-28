-- Harden database functions to mitigate security warnings

/*
# [Function Security Hardening]
This migration hardens existing database functions by explicitly setting the `search_path`. This prevents potential hijacking attacks where a malicious user could create objects (like tables or functions) in a schema they control and trick a function into executing them. By setting `search_path = ''`, we force all function calls to be schema-qualified (e.g., `public.prompts`), ensuring the function executes only the code intended.

## Query Description:
- This operation modifies the configuration of several existing PostgreSQL functions.
- It does NOT alter the logic or data structures.
- It is a non-destructive security enhancement.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by unsetting the search_path)

## Structure Details:
- Modifies the following functions:
  - public.claim_ad_reward(integer)
  - public.claim_coupon_reward(text)
  - public.claim_link_reward(integer)
  - public.claim_telegram_reward()
  - public.increment_like_count(uuid)
  - public.purchase_prompt(character varying, integer)

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Unchanged
- Mitigates "Function Search Path Mutable" security advisory.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This is a security configuration change.
*/

ALTER FUNCTION public.claim_ad_reward(p_reward_slot integer) SET search_path = '';
ALTER FUNCTION public.claim_coupon_reward(p_coupon_code text) SET search_path = '';
ALTER FUNCTION public.claim_link_reward(p_link_id integer) SET search_path = '';
ALTER FUNCTION public.claim_telegram_reward() SET search_path = '';
ALTER FUNCTION public.increment_like_count(p_prompt_id uuid) SET search_path = '';
-- The purchase_prompt function was created with (character varying, integer)
ALTER FUNCTION public.purchase_prompt(p_prompt_id_in character varying, p_cost_in integer) SET search_path = '';
