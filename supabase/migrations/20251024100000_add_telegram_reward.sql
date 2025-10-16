/*
# [Feature] Add Telegram Join Reward
This migration adds the infrastructure for a one-time reward for users who join the Telegram channel.

## Query Description:
- Adds a new column `telegram_reward_claimed` to the `profiles` table to track if a user has claimed this one-time reward.
- Creates a new PostgreSQL function `claim_telegram_reward()` that securely handles the reward logic. This function is callable from the client-side RPC.
- The function is atomic: it checks if the reward has been claimed, adds 5 credits, and marks the reward as claimed in a single transaction. This prevents duplicate claims.

This operation is safe and does not affect existing data. It adds new, non-breaking functionality.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- **Table Modified:** `public.profiles`
  - **Column Added:** `telegram_reward_claimed` (BOOLEAN, NOT NULL, DEFAULT false)
- **Function Created:** `public.claim_telegram_reward()`
  - **Returns:** `void`
  - **Logic:**
    1. Checks if `telegram_reward_claimed` is false for the current user.
    2. If so, adds 5 credits to the user's profile.
    3. Sets `telegram_reward_claimed` to true.
    4. If already claimed, it does nothing.

## Security Implications:
- RLS Status: Not changed.
- Policy Changes: No.
- Auth Requirements: The function uses `auth.uid()` and can only be called by an authenticated user.
- The function is created with `SECURITY DEFINER` to allow it to update the `profiles` table, which is protected by RLS. The `search_path` is set to `public` for security.

## Performance Impact:
- Indexes: None added. Impact is negligible.
- Triggers: None added.
- Estimated Impact: Low. The function is simple and will execute quickly.
*/

-- Add the tracking column to the profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS telegram_reward_claimed BOOLEAN NOT NULL DEFAULT FALSE;

-- Create the function to claim the reward
CREATE OR REPLACE FUNCTION public.claim_telegram_reward()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the user has already claimed the reward
  IF EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND telegram_reward_claimed = FALSE
  ) THEN
    -- Add 5 credits and mark as claimed
    UPDATE public.profiles
    SET
      credits = credits + 5,
      telegram_reward_claimed = TRUE
    WHERE id = auth.uid();
  END IF;
END;
$$;

-- Grant execute permission to the authenticated role
GRANT EXECUTE ON FUNCTION public.claim_telegram_reward() TO authenticated;
