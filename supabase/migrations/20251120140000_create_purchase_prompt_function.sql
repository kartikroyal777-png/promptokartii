/*
  # [Function] Create Purchase Prompt Function
  [This function handles the transaction for a user purchasing a prompt with credits.]

  ## Query Description: [This operation creates a new SQL function `purchase_prompt` that allows users to unlock prompts using their credits. It checks for sufficient credits, deducts the cost, and records the transaction in the `unlocked_prompts` table. This is a critical function for the app's core monetization loop.]
  
  ## Metadata:
  - Schema-Category: ["Structural"]
  - Impact-Level: ["Medium"]
  - Requires-Backup: [false]
  - Reversible: [true]
  
  ## Structure Details:
  - Creates a new function: `public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)`
  - Reads from: `public.profiles`
  - Writes to: `public.profiles`, `public.unlocked_prompts`
  
  ## Security Implications:
  - RLS Status: [Enabled]
  - Policy Changes: [No]
  - Auth Requirements: [User must be authenticated]
  - The function runs with `SECURITY DEFINER` privileges to modify tables on behalf of the user. It is hardened by setting a strict `search_path`.
  
  ## Performance Impact:
  - Indexes: [None]
  - Triggers: [None]
  - Estimated Impact: [Low. The function performs simple lookups and updates on indexed columns.]
*/
CREATE OR REPLACE FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_user_credits integer;
BEGIN
  -- Get user's current credits
  SELECT credits INTO v_user_credits FROM public.profiles WHERE id = v_user_id;

  -- Check if user has enough credits
  IF v_user_credits IS NULL OR v_user_credits < p_cost_in THEN
    RAISE EXCEPTION 'Insufficient credits to unlock prompt.';
  END IF;

  -- Deduct credits from user's profile
  UPDATE public.profiles
  SET credits = credits - p_cost_in
  WHERE id = v_user_id;

  -- Insert record into unlocked_prompts
  INSERT INTO public.unlocked_prompts (user_id, prompt_id)
  VALUES (v_user_id, p_prompt_id_in);
END;
$$;
