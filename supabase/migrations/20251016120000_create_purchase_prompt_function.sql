/*
          # [Function] Create `purchase_prompt`
          This function handles the logic for a user purchasing a prompt with their credits. It ensures the user has enough credits, deducts the cost, and records the unlock in a single, safe transaction.

          ## Query Description: This operation creates a new stored procedure (`purchase_prompt`) in the database. It is a non-destructive, "Safe" operation that adds new functionality. It does not alter or delete any existing data. The function is essential for the prompt unlocking feature to work correctly.
          
          ## Metadata:
          - Schema-Category: ["Safe", "Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true (The function can be dropped)
          
          ## Structure Details:
          - Creates function: `public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)`
          
          ## Security Implications:
          - RLS Status: Not applicable to function creation itself.
          - Policy Changes: No
          - Auth Requirements: The function uses `auth.uid()` to securely identify the current user, ensuring users can only spend their own credits.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible. This is a standard transactional function.
          */
CREATE OR REPLACE FUNCTION public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
  current_user_id uuid := auth.uid();
BEGIN
  -- 1. Get the user's current credits from the profiles table
  SELECT credits INTO current_credits FROM public.profiles WHERE id = current_user_id;

  -- 2. Check if the user has enough credits
  IF current_credits IS NULL OR current_credits < p_cost_in THEN
    RAISE EXCEPTION 'You do not have enough credits to unlock this prompt.';
  END IF;

  -- 3. Deduct the cost from the user's profile
  UPDATE public.profiles
  SET credits = credits - p_cost_in
  WHERE id = current_user_id;

  -- 4. Insert a record into the unlocked_prompts table
  INSERT INTO public.unlocked_prompts (user_id, prompt_id)
  VALUES (current_user_id, p_prompt_id_in);

END;
$$;
