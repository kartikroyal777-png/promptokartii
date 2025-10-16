/*
# [MIGRATION] Fix Credit System & User Onboarding

This migration introduces several key fixes and improvements to the credit and user management systems.

## Query Description:
1.  **Fix `purchase_prompt` Function**: The existing `purchase_prompt` function is replaced to resolve a schema cache issue that was preventing users from unlocking prompts. The new function uses different parameter names to ensure the database recognizes the change.
2.  **Set Initial Credits to Zero**: The `handle_new_user` trigger function is updated. New users will now start with 0 credits instead of 5, aligning with the new system where credits must be earned.
3.  **Implement Daily Credit Reset**: A daily cron job is scheduled to reset all user credits to zero at midnight (UTC). This enforces the "daily credits" model.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: false
- Reversible: true (with a counter-migration)

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: This migration affects the new user signup trigger.

## Performance Impact:
- The cron job will run once daily and perform a simple UPDATE on the `profiles` table. The impact should be minimal.
*/

-- 1. Update the user profile trigger to give 0 credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, credits)
  VALUES (new.id, 0); -- Changed from 5 to 0
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger to link it to the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Fix the purchase_prompt function by renaming parameters to avoid schema cache issues
DROP FUNCTION IF EXISTS public.purchase_prompt(uuid, integer);
CREATE OR REPLACE FUNCTION public.purchase_prompt(
  p_prompt_id_in uuid,
  p_cost_in integer
)
RETURNS void AS $$
DECLARE
  current_credits integer;
  current_user_id uuid := auth.uid();
BEGIN
  -- Get current credits
  SELECT credits INTO current_credits FROM public.profiles WHERE id = current_user_id;

  -- Check if user has enough credits
  IF current_credits < p_cost_in THEN
    RAISE EXCEPTION 'Not enough credits to unlock this prompt.';
  END IF;

  -- Deduct credits
  UPDATE public.profiles
  SET credits = credits - p_cost_in
  WHERE id = current_user_id;

  -- Record the unlock
  INSERT INTO public.unlocked_prompts (user_id, prompt_id)
  VALUES (current_user_id, p_prompt_id_in);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Schedule a daily cron job to reset credits to 0.
-- IMPORTANT: This requires the 'pg_cron' extension to be enabled in your Supabase project.
-- You can enable it under Database -> Extensions in your Supabase dashboard.
SELECT cron.schedule(
  'daily-credit-reset',
  '0 0 * * *', -- This runs at midnight UTC every day
  $$
    UPDATE public.profiles SET credits = 0;
  $$
);
