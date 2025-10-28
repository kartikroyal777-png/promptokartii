/*
          # [Operation Name]
          Fix `increment_like_count` function

          ## Query Description: This operation resolves a migration conflict by safely replacing the `increment_like_count` function. It first drops the existing function and then recreates it with the correct parameter name and a secure search path. This change is non-destructive and ensures that the "like" functionality remains stable and secure.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Drops function: `public.increment_like_count(p_prompt_id uuid)`
          - Creates function: `public.increment_like_count(prompt_id_to_like uuid)`
          
          ## Security Implications:
          - RLS Status: Not Applicable
          - Policy Changes: No
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible.
          */

-- Drop the existing function to allow for recreation with a new parameter name.
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id uuid);

-- Recreate the function with the intended parameter name and a secure search path.
CREATE OR REPLACE FUNCTION public.increment_like_count(prompt_id_to_like uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = prompt_id_to_like;
END;
$$;
