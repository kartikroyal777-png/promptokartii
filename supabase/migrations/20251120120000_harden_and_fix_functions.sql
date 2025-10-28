/*
          # [SECURITY] Harden Database Functions
          [This migration script enhances the security of several database functions by setting a strict `search_path` and ensuring they run with the permissions of the definer. This mitigates the risk of search path hijacking attacks, resolving multiple security advisories.]

          ## Query Description: [This operation redefines existing database functions to run with elevated privileges (`SECURITY DEFINER`) and a locked-down search path. This is a safe, non-destructive operation that improves security without affecting data. It ensures that functions execute in a predictable and secure environment.]
          
          ## Metadata:
          - Schema-Category: ["Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          - Functions affected: `increment_like_count`, `purchase_prompt`, `claim_ad_reward`, `claim_telegram_reward`, `claim_link_reward`, `claim_coupon_reward`
          
          ## Security Implications:
          - RLS Status: [No Change]
          - Policy Changes: [No]
          - Auth Requirements: [Functions are now `SECURITY DEFINER`, running as the user who created them (typically `postgres`).]
          
          ## Performance Impact:
          - Indexes: [No Change]
          - Triggers: [No Change]
          - Estimated Impact: [None]
          */

-- Harden increment_like_count function
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;

-- Harden purchase_prompt function
CREATE OR REPLACE FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_credits integer;
  current_user_id uuid := auth.uid();
BEGIN
  -- Check if user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Lock the user's profile row to prevent race conditions
  SELECT credits INTO current_credits FROM profiles WHERE id = current_user_id FOR UPDATE;

  -- Check if user has enough credits
  IF current_credits < p_cost_in THEN
    RAISE EXCEPTION 'Not enough credits';
  END IF;

  -- Deduct credits
  UPDATE profiles
  SET credits = credits - p_cost_in
  WHERE id = current_user_id;

  -- Record the unlocked prompt
  INSERT INTO unlocked_prompts (user_id, prompt_id)
  VALUES (current_user_id, p_prompt_id_in);
END;
$$;

-- Harden claim_ad_reward function
CREATE OR REPLACE FUNCTION public.claim_ad_reward(p_reward_slot integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID := auth.uid();
    reward_amount INT := 3;
BEGIN
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    IF EXISTS (
        SELECT 1 FROM daily_ad_claims 
        WHERE user_id = current_user_id AND reward_slot = p_reward_slot AND claim_date = CURRENT_DATE
    ) THEN
        RAISE EXCEPTION 'Reward slot already claimed today';
    END IF;

    INSERT INTO daily_ad_claims(user_id, reward_slot, claim_date)
    VALUES (current_user_id, p_reward_slot, CURRENT_DATE);

    UPDATE profiles
    SET credits = credits + reward_amount
    WHERE id = current_user_id;
END;
$$;

-- Harden claim_telegram_reward function
CREATE OR REPLACE FUNCTION public.claim_telegram_reward()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID := auth.uid();
    reward_amount INT := 10;
BEGIN
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    IF EXISTS (SELECT 1 FROM profiles WHERE id = current_user_id AND has_claimed_telegram_reward = TRUE) THEN
        RAISE EXCEPTION 'Telegram reward already claimed';
    END IF;

    UPDATE profiles
    SET credits = credits + reward_amount,
        has_claimed_telegram_reward = TRUE
    WHERE id = current_user_id;
END;
$$;

-- Harden claim_link_reward function
CREATE OR REPLACE FUNCTION public.claim_link_reward(p_link_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID := auth.uid();
    reward_amount INT := 1;
BEGIN
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    IF EXISTS (
        SELECT 1 FROM daily_link_claims 
        WHERE user_id = current_user_id AND link_id = p_link_id AND claim_date = CURRENT_DATE
    ) THEN
        RAISE EXCEPTION 'Link reward has already been claimed today.';
    END IF;

    INSERT INTO daily_link_claims(user_id, link_id, claim_date)
    VALUES (current_user_id, p_link_id, CURRENT_DATE);

    UPDATE profiles
    SET credits = credits + reward_amount
    WHERE id = current_user_id;
END;
$$;

-- Harden claim_coupon_reward function
CREATE OR REPLACE FUNCTION public.claim_coupon_reward(p_coupon_code text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_user_id UUID := auth.uid();
    coupon RECORD;
    credits_to_award INT;
BEGIN
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated';
    END IF;

    SELECT * INTO coupon FROM coupons WHERE code = p_coupon_code;

    IF coupon IS NULL THEN
        RAISE EXCEPTION 'Invalid coupon code.';
    END IF;

    IF coupon.expires_at IS NOT NULL AND coupon.expires_at < NOW() THEN
        RAISE EXCEPTION 'This coupon has expired.';
    END IF;

    IF coupon.max_uses IS NOT NULL AND coupon.times_used >= coupon.max_uses THEN
        RAISE EXCEPTION 'This coupon has reached its maximum usage limit.';
    END IF;

    IF EXISTS (SELECT 1 FROM user_coupon_claims WHERE user_id = current_user_id AND coupon_code = p_coupon_code) THEN
        RAISE EXCEPTION 'You have already used this coupon code.';
    END IF;

    credits_to_award := coupon.credits_awarded;

    INSERT INTO user_coupon_claims(user_id, coupon_code)
    VALUES (current_user_id, p_coupon_code);

    UPDATE coupons SET times_used = times_used + 1 WHERE id = coupon.id;

    UPDATE profiles SET credits = credits + credits_to_award WHERE id = current_user_id;

    RETURN credits_to_award;
END;
$$;
