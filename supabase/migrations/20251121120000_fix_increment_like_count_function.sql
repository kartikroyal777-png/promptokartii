/*
# [Fix] Recreate `increment_like_count` Function
This migration corrects an issue with the `increment_like_count` function by dropping the old version and recreating it with the correct parameter name. This also hardens the function's security by setting the search_path.

## Query Description:
This operation safely drops the existing `increment_like_count` function if it exists and then creates a new, secure version. This ensures the function signature matches what the application expects, fixing the "like" functionality. There is no risk to existing data.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by recreating the old function if needed)

## Structure Details:
- Drops function: `public.increment_like_count(uuid)`
- Creates function: `public.increment_like_count(p_prompt_id uuid)`

## Security Implications:
- RLS Status: Not applicable.
- Policy Changes: No
- Auth Requirements: Callable by authenticated users.
- Security Hardening: Sets a fixed `search_path` to mitigate potential hijacking vulnerabilities.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/

-- Drop the old function to allow for recreation with a new parameter name.
-- This is the fix suggested by the PostgreSQL error hint.
DROP FUNCTION IF EXISTS public.increment_like_count(uuid);

-- Recreate the function with the correct parameter name `p_prompt_id` and a secure search_path.
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;
