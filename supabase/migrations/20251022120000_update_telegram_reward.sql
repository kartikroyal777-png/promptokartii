/*
# [Function Update] Modify Telegram Reward
This migration updates the `claim_telegram_reward` function to increase the credit reward from 5 to 10.

## Query Description: 
This operation modifies an existing server-side function. It changes the business logic for how many credits a user receives for a specific task. There is no direct impact on existing user data, but it will affect the outcome of future reward claims.

## Metadata:
- Schema-Category: ["Data"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (by reverting the credit amount to 5)

## Structure Details:
- Function affected: `public.claim_telegram_reward()`

## Security Implications:
- RLS Status: Not applicable
- Policy Changes: No
- Auth Requirements: The function is `SECURITY DEFINER` and uses `auth.uid()`, so it requires an authenticated user to call.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This is a simple function update.
*/
CREATE OR REPLACE FUNCTION public.claim_telegram_reward()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_id uuid := auth.uid();
BEGIN
  -- Check if the user is authenticated
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'You must be logged in to claim this reward.';
  END IF;

  -- Check if the user has already claimed this reward
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND has_claimed_telegram_reward = true) THEN
    RAISE EXCEPTION 'You have already claimed the Telegram reward.';
  END IF;

  -- Grant the reward
  UPDATE public.profiles
  SET 
    credits = credits + 10, -- Increased reward from 5 to 10
    has_claimed_telegram_reward = true
  WHERE id = user_id;

END;
$$;
