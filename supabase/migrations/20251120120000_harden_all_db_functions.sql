-- Harden all existing database functions by setting a secure search_path.
-- This mitigates the "Function Search Path Mutable" security advisory.

/*
          # [Function Hardening] purchase_prompt
          [This operation redefines the function to set a secure search_path, preventing potential hijacking attacks. No change in functionality.]

          ## Query Description: [This is a safe, non-destructive update that only changes the security configuration of the function.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Affects function: purchase_prompt]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [User must be authenticated]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [None]
          */
CREATE OR REPLACE FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_credits integer;
  user_id_val uuid := auth.uid();
BEGIN
  -- 1. Get current user's credits
  SELECT credits INTO current_credits FROM public.profiles WHERE id = user_id_val;

  -- 2. Check if user has enough credits
  IF current_credits IS NULL OR current_credits < p_cost_in THEN
    RAISE EXCEPTION 'Insufficient credits to unlock this prompt.';
  END IF;

  -- 3. Deduct credits
  UPDATE public.profiles
  SET credits = credits - p_cost_in
  WHERE id = user_id_val;

  -- 4. Record the unlock
  INSERT INTO public.unlocked_prompts (user_id, prompt_id)
  VALUES (user_id_val, p_prompt_id_in);
END;
$$;

/*
          # [Function Hardening] increment_like_count
          [This operation redefines the function to set a secure search_path, preventing potential hijacking attacks. No change in functionality.]

          ## Query Description: [This is a safe, non-destructive update that only changes the security configuration of the function.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Affects function: increment_like_count]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [None, public function]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [None]
          */
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;

/*
          # [Function Hardening] claim_ad_reward
          [This operation redefines the function to set a secure search_path, preventing potential hijacking attacks. No change in functionality.]

          ## Query Description: [This is a safe, non-destructive update that only changes the security configuration of the function.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Affects function: claim_ad_reward]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [User must be authenticated]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [None]
          */
CREATE OR REPLACE FUNCTION public.claim_ad_reward(p_reward_slot integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_id_val uuid := auth.uid();
    today_val date := CURRENT_DATE;
    reward_amount integer := 3; -- Amount of credits for ad reward
BEGIN
    -- Check if this ad slot has already been claimed today by the user
    IF EXISTS (
        SELECT 1
        FROM public.daily_ad_claims
        WHERE user_id = user_id_val
          AND reward_slot = p_reward_slot
          AND claim_date = today_val
    ) THEN
        RAISE EXCEPTION 'This ad reward has already been claimed today.';
    END IF;

    -- Add the credits to the user's profile
    UPDATE public.profiles
    SET credits = credits + reward_amount
    WHERE id = user_id_val;

    -- Record the claim to prevent double-dipping
    INSERT INTO public.daily_ad_claims (user_id, reward_slot, claim_date)
    VALUES (user_id_val, p_reward_slot, today_val);
END;
$$;


/*
          # [Function Hardening] claim_telegram_reward
          [This operation redefines the function to set a secure search_path, preventing potential hijacking attacks. No change in functionality.]

          ## Query Description: [This is a safe, non-destructive update that only changes the security configuration of the function.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Affects function: claim_telegram_reward]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [User must be authenticated]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [None]
          */
CREATE OR REPLACE FUNCTION public.claim_telegram_reward()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_id_val uuid := auth.uid();
    reward_amount integer := 10; -- Amount of credits for joining Telegram
BEGIN
    -- Check if the user has already claimed this one-time reward
    IF EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = user_id_val
          AND has_claimed_telegram_reward = TRUE
    ) THEN
        RAISE EXCEPTION 'Telegram reward has already been claimed.';
    END IF;

    -- Add credits and mark the reward as claimed
    UPDATE public.profiles
    SET 
        credits = credits + reward_amount,
        has_claimed_telegram_reward = TRUE
    WHERE id = user_id_val;
END;
$$;


/*
          # [Function Hardening] claim_link_reward
          [This operation redefines the function to set a secure search_path, preventing potential hijacking attacks. No change in functionality.]

          ## Query Description: [This is a safe, non-destructive update that only changes the security configuration of the function.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Affects function: claim_link_reward]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [User must be authenticated]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [None]
          */
CREATE OR REPLACE FUNCTION public.claim_link_reward(p_link_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_id_val uuid := auth.uid();
    today_val date := CURRENT_DATE;
    reward_amount integer := 1; -- Amount of credits for link reward
BEGIN
    -- Check if this link has already been claimed today by the user
    IF EXISTS (
        SELECT 1
        FROM public.daily_link_claims
        WHERE user_id = user_id_val
          AND link_id = p_link_id
          AND claim_date = today_val
    ) THEN
        RAISE EXCEPTION 'This link reward has already been claimed today.';
    END IF;

    -- Add the credits to the user's profile
    UPDATE public.profiles
    SET credits = credits + reward_amount
    WHERE id = user_id_val;

    -- Record the claim
    INSERT INTO public.daily_link_claims (user_id, link_id, claim_date)
    VALUES (user_id_val, p_link_id, today_val);
END;
$$;


/*
          # [Function Hardening] claim_coupon_reward
          [This operation redefines the function to set a secure search_path, preventing potential hijacking attacks. No change in functionality.]

          ## Query Description: [This is a safe, non-destructive update that only changes the security configuration of the function.]
          
          ## Metadata:
          - Schema-Category: ["Security"]
          - Impact-Level: ["Low"]
          - Requires-Backup: [false]
          - Reversible: [true]
          
          ## Structure Details:
          [Affects function: claim_coupon_reward]
          
          ## Security Implications:
          - RLS Status: [N/A]
          - Policy Changes: [No]
          - Auth Requirements: [User must be authenticated]
          
          ## Performance Impact:
          - Indexes: [N/A]
          - Triggers: [N/A]
          - Estimated Impact: [None]
          */
CREATE OR REPLACE FUNCTION public.claim_coupon_reward(p_coupon_code text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    user_id_val uuid := auth.uid();
    coupon_record record;
    credits_to_award integer := 0;
BEGIN
    -- Find the coupon
    SELECT * INTO coupon_record
    FROM public.coupon_codes
    WHERE code = p_coupon_code;

    -- Check if coupon exists
    IF coupon_record IS NULL THEN
        RAISE EXCEPTION 'Invalid coupon code.';
    END IF;

    -- Check if coupon is active
    IF NOT coupon_record.is_active THEN
        RAISE EXCEPTION 'This coupon is no longer active.';
    END IF;

    -- Check if the user has already claimed this coupon
    IF EXISTS (
        SELECT 1
        FROM public.user_coupon_claims
        WHERE user_id = user_id_val
          AND coupon_code = p_coupon_code
    ) THEN
        RAISE EXCEPTION 'You have already used this coupon code.';
    END IF;

    -- Check if the coupon has reached its max use limit
    IF coupon_record.max_uses > 0 THEN
      IF (SELECT count(*) FROM public.user_coupon_claims WHERE coupon_code = p_coupon_code) >= coupon_record.max_uses THEN
        RAISE EXCEPTION 'This coupon has reached its maximum number of uses.';
      END IF;
    END IF;

    -- All checks passed, award credits
    credits_to_award := coupon_record.credits_awarded;

    UPDATE public.profiles
    SET credits = credits + credits_to_award
    WHERE id = user_id_val;

    -- Record the claim
    INSERT INTO public.user_coupon_claims (user_id, coupon_code)
    VALUES (user_id_val, p_coupon_code);

    RETURN credits_to_award;
END;
$$;
