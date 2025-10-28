/*
  # [Function] Create `claim_ad_reward`

  This function allows a user to claim a daily ad reward for a specific slot, adding credits to their profile and preventing duplicate claims.

  ## Query Description: 
  This operation creates a new database function. It is a safe, non-destructive operation. It checks for existing claims before awarding credits to prevent abuse of the reward system.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (the function can be dropped)

  ## Security Implications:
  - RLS Status: Not applicable to function creation.
  - Policy Changes: No
  - Auth Requirements: The function uses `auth.uid()` and should only be callable by authenticated users. It is defined with `SECURITY DEFINER` to have the necessary permissions to modify tables.

  ## Performance Impact:
  - Indexes: The function will benefit from an index on `(user_id, claim_date, reward_slot)` in the `daily_ad_claims` table for faster lookups.
  - Triggers: None
  - Estimated Impact: Low. The function performs simple checks and updates.
*/
CREATE OR REPLACE FUNCTION public.claim_ad_reward(p_reward_slot integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id uuid := auth.uid();
    today_claim_exists boolean;
    reward_amount int := 3; -- Credits to be awarded
BEGIN
    -- Check if the user has already claimed this reward slot today
    SELECT EXISTS (
        SELECT 1
        FROM public.daily_ad_claims
        WHERE user_id = current_user_id
          AND reward_slot = p_reward_slot
          AND claim_date = CURRENT_DATE
    ) INTO today_claim_exists;

    IF today_claim_exists THEN
        RAISE EXCEPTION 'Reward for this slot has already been claimed today.';
    END IF;

    -- Award credits to the user
    UPDATE public.profiles
    SET credits = credits + reward_amount
    WHERE id = current_user_id;

    -- Record the claim
    INSERT INTO public.daily_ad_claims (user_id, reward_slot, claim_date)
    VALUES (current_user_id, p_reward_slot, CURRENT_DATE);

END;
$$;

/*
  # [Function] Create `claim_telegram_reward`

  This function allows a user to claim a one-time reward for joining Telegram.

  ## Query Description: 
  This operation creates a new database function. It checks if the reward has already been claimed before awarding credits.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
*/
CREATE OR REPLACE FUNCTION public.claim_telegram_reward()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id uuid := auth.uid();
    already_claimed boolean;
    reward_amount int := 10;
BEGIN
    SELECT has_claimed_telegram_reward
    INTO already_claimed
    FROM public.profiles
    WHERE id = current_user_id;

    IF already_claimed THEN
        RAISE EXCEPTION 'Telegram reward has already been claimed.';
    END IF;

    UPDATE public.profiles
    SET 
        credits = credits + reward_amount,
        has_claimed_telegram_reward = true
    WHERE id = current_user_id;
END;
$$;

/*
  # [Function] Create `claim_link_reward`

  This function allows a user to claim a daily reward for clicking a specific link.

  ## Query Description: 
  This operation creates a new database function. It checks for existing claims for the specific link on the current day before awarding credits.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true
*/
CREATE OR REPLACE FUNCTION public.claim_link_reward(p_link_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id uuid := auth.uid();
    today_claim_exists boolean;
    reward_amount int := 1;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.daily_link_claims
        WHERE user_id = current_user_id
          AND link_id = p_link_id
          AND claim_date = CURRENT_DATE
    ) INTO today_claim_exists;

    IF today_claim_exists THEN
        RAISE EXCEPTION 'Reward for this link has already been claimed today.';
    END IF;

    UPDATE public.profiles
    SET credits = credits + reward_amount
    WHERE id = current_user_id;

    INSERT INTO public.daily_link_claims (user_id, link_id, claim_date)
    VALUES (current_user_id, p_link_id, CURRENT_DATE);
END;
$$;

/*
  # [Function] Create `claim_coupon_reward`

  This function allows a user to redeem a coupon code for credits.

  ## Query Description: 
  This operation creates a new database function. It validates the coupon, checks for previous claims by the user, and then awards credits.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Medium"
  - Requires-Backup: false
  - Reversible: true
*/
CREATE OR REPLACE FUNCTION public.claim_coupon_reward(p_coupon_code text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id uuid := auth.uid();
    coupon_record record;
    user_claim_exists boolean;
    awarded_credits integer := 0;
BEGIN
    -- Find the coupon
    SELECT * INTO coupon_record
    FROM public.coupons
    WHERE code = p_coupon_code;

    -- Basic validation
    IF coupon_record IS NULL THEN
        RAISE EXCEPTION 'Invalid coupon code.';
    END IF;

    IF NOT coupon_record.is_active THEN
        RAISE EXCEPTION 'This coupon is no longer active.';
    END IF;

    IF coupon_record.expires_at IS NOT NULL AND coupon_record.expires_at < now() THEN
        RAISE EXCEPTION 'This coupon has expired.';
    END IF;

    IF coupon_record.max_uses IS NOT NULL AND coupon_record.current_uses >= coupon_record.max_uses THEN
        RAISE EXCEPTION 'This coupon has reached its maximum number of uses.';
    END IF;

    -- Check if this user has already claimed this coupon
    SELECT EXISTS (
        SELECT 1
        FROM public.user_coupon_claims
        WHERE user_id = current_user_id AND coupon_code = p_coupon_code
    ) INTO user_claim_exists;

    IF user_claim_exists THEN
        RAISE EXCEPTION 'You have already redeemed this coupon code.';
    END IF;

    -- All checks passed, award credits and record the claim
    awarded_credits := coupon_record.credit_amount;

    UPDATE public.profiles
    SET credits = credits + awarded_credits
    WHERE id = current_user_id;

    INSERT INTO public.user_coupon_claims (user_id, coupon_code)
    VALUES (current_user_id, p_coupon_code);

    UPDATE public.coupons
    SET current_uses = current_uses + 1
    WHERE id = coupon_record.id;

    RETURN awarded_credits;
END;
$$;
