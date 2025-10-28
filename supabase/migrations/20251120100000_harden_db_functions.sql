/*
# [DB Function Security Hardening]
This migration hardens existing database functions by setting a strict `search_path`. This is a critical security measure to prevent hijacking attacks by ensuring that functions resolve objects (like tables and other functions) from expected schemas only.

## Query Description:
This operation modifies the configuration of several existing functions. It does not alter the logic or data but enhances their security posture. It is a safe and recommended operation.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by altering the function to remove the setting)

## Structure Details:
- Functions affected:
  - `increment_like_count(p_prompt_id uuid)`
  - `purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)`
  - `claim_ad_reward(p_reward_slot integer)`
  - `claim_telegram_reward()`
  - `claim_link_reward(p_link_id integer)`
  - `claim_coupon_reward(p_coupon_code text)`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: This fixes a potential security vulnerability related to function execution context.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible performance impact. This is a security configuration change.
*/

-- Harden increment_like_count function
ALTER FUNCTION public.increment_like_count(p_prompt_id uuid)
SET search_path = 'public';

-- Harden purchase_prompt function (Definition inferred from usage)
ALTER FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)
SET search_path = 'public';

-- Harden claim_ad_reward function (Definition inferred from usage)
ALTER FUNCTION public.claim_ad_reward(p_reward_slot integer)
SET search_path = 'public';

-- Harden claim_telegram_reward function (Definition inferred from usage)
ALTER FUNCTION public.claim_telegram_reward()
SET search_path = 'public';

-- Harden claim_link_reward function (Definition inferred from usage)
ALTER FUNCTION public.claim_link_reward(p_link_id integer)
SET search_path = 'public';

-- Harden claim_coupon_reward function (Definition inferred from usage)
ALTER FUNCTION public.claim_coupon_reward(p_coupon_code text)
SET search_path = 'public';
