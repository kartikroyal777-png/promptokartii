/*
# [SECURITY] Harden Database Functions
This migration sets the `search_path` for all public functions to `public`. This is a security best practice that prevents potential context-switching attacks by ensuring functions only resolve objects within the intended schema.

## Query Description: 
This operation modifies the configuration of existing database functions. It is a non-destructive change that does not affect data or function logic. It enhances security by explicitly defining the schema search path.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by resetting the search_path)

## Structure Details:
- Affects functions:
    - claim_ad_reward(integer)
    - claim_coupon_reward(character varying)
    - claim_link_reward(integer)
    - claim_telegram_reward()
    - increment_like_count(uuid)
    - purchase_prompt(uuid, integer)

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None
- Mitigates: "Function Search Path Mutable" security advisory.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. May provide a minor performance improvement in function execution by reducing schema search overhead.
*/

ALTER FUNCTION public.claim_ad_reward(p_reward_slot integer) SET search_path = 'public';

ALTER FUNCTION public.claim_coupon_reward(p_coupon_code character varying) SET search_path = 'public';

ALTER FUNCTION public.claim_link_reward(p_link_id integer) SET search_path = 'public';

ALTER FUNCTION public.claim_telegram_reward() SET search_path = 'public';

ALTER FUNCTION public.increment_like_count(p_prompt_id uuid) SET search_path = 'public';

ALTER FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer) SET search_path = 'public';
