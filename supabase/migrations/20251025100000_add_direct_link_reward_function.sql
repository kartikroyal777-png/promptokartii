/*
# [Function] Create Direct Link Reward Claim Function
This function allows users to claim a 1-credit reward for visiting a direct link. It ensures that each link reward can only be claimed once per user per day.

## Query Description:
This script creates a new PostgreSQL function `claim_direct_link_reward`. This function is secure and idempotent for daily claims. It checks the `daily_ad_claims` table to prevent duplicate rewards on the same day for the same task. If the claim is valid, it inserts a record and updates the user's credit balance in the `profiles` table. This operation is safe and does not risk data loss.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (The function can be dropped)

## Structure Details:
- Function Created: `public.claim_direct_link_reward(p_reward_slot integer)`

## Security Implications:
- RLS Status: Not applicable to function definition.
- Policy Changes: No
- Auth Requirements: The function uses `auth.uid()` and is defined with `SECURITY DEFINER` to securely update user profiles. It runs with the privileges of the user who defines it.

## Performance Impact:
- Indexes: The function will query `daily_ad_claims`, which has indexes on `user_id` and `claim_date`.
- Triggers: None
- Estimated Impact: Low. The function performs indexed lookups and a single update.
*/
CREATE OR REPLACE FUNCTION public.claim_direct_link_reward(p_reward_slot integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_today date;
  v_reward_amount int := 1; -- All direct links give 1 credit
BEGIN
  -- 1. Get the current user's ID from the session
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- 2. Check if the provided slot is within the valid range for direct links (e.g., > 10)
  IF p_reward_slot < 11 THEN
     RAISE EXCEPTION 'Invalid reward slot for this task type.';
  END IF;

  -- 3. Get the current date in UTC
  v_today := current_date;

  -- 4. Check if the user has already claimed this reward slot today
  IF EXISTS (
    SELECT 1
    FROM public.daily_ad_claims
    WHERE user_id = v_user_id
      AND reward_slot = p_reward_slot
      AND claim_date = v_today
  ) THEN
    RAISE EXCEPTION 'Reward for this task has already been claimed today.';
  END IF;

  -- 5. Insert a record of the claim
  INSERT INTO public.daily_ad_claims (user_id, reward_slot, claim_date)
  VALUES (v_user_id, p_reward_slot, v_today);

  -- 6. Update the user's credit balance
  UPDATE public.profiles
  SET credits = credits + v_reward_amount
  WHERE id = v_user_id;

END;
$$;
