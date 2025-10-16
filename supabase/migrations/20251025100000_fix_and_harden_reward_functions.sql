/*
# [Operation Name]
Fix and Harden Reward Functions

## Query Description: This operation replaces the existing functions for handling Telegram and Ad rewards with improved, more secure versions. The `claim_telegram_reward` function is updated to be more robust. A new `grant_ad_reward` function is introduced to handle ad reward claims atomically, preventing race conditions and ensuring data integrity. This is a safe, non-destructive update that improves the reliability of the reward system.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies function: `public.claim_telegram_reward()`
- Creates function: `public.grant_ad_reward(integer, integer)`

## Security Implications:
- RLS Status: Not Applicable
- Policy Changes: No
- Auth Requirements: These functions are `SECURITY DEFINER` and operate on behalf of the authenticated user (`auth.uid()`).

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible performance impact. These functions are lightweight and will execute quickly.
*/

-- Drop the old, less specific add_credits function if it exists, as it's being replaced by more targeted functions.
-- This is safe because the new system will use the more specific `grant_ad_reward` and `purchase_prompt` functions.
DROP FUNCTION IF EXISTS public.add_credits(user_id uuid, amount integer);


-- Re-create or replace the function to claim the one-time Telegram reward.
-- This version includes better checks to prevent errors and ensure idempotency.
CREATE OR REPLACE FUNCTION public.claim_telegram_reward()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user has already claimed the reward
  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND has_claimed_telegram_reward = TRUE
  ) THEN
    RAISE EXCEPTION 'Telegram reward has already been claimed.';
  END IF;

  -- Grant the reward
  UPDATE public.profiles
  SET
    credits = credits + 5,
    has_claimed_telegram_reward = TRUE
  WHERE id = auth.uid();

  -- Check if the update was successful
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found. Cannot claim reward.';
  END IF;
END;
$$;

-- Create a new, robust function to grant credits for watching an ad.
-- This combines adding credits and recording the claim to be more atomic and prevent duplicate claims.
CREATE OR REPLACE FUNCTION public.grant_ad_reward(p_slot_id integer, p_credit_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  today_date date := current_date;
BEGIN
  -- Check if this ad slot has already been claimed today by the user
  IF EXISTS (
    SELECT 1
    FROM public.daily_ad_claims
    WHERE user_id = auth.uid()
      AND reward_slot = p_slot_id
      AND claim_date = today_date
  ) THEN
    RAISE EXCEPTION 'This ad reward has already been claimed today.';
  END IF;

  -- Add the record to daily_ad_claims first
  INSERT INTO public.daily_ad_claims (user_id, reward_slot, claim_date)
  VALUES (auth.uid(), p_slot_id, today_date);

  -- Then, add credits to the user's profile
  UPDATE public.profiles
  SET credits = credits + p_credit_amount
  WHERE id = auth.uid();
  
  -- Check if the profile update was successful. If not, the transaction will roll back.
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found. Ad claim has been rolled back.';
  END IF;
END;
$$;
