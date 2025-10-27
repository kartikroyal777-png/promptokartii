/*
  # [Operation Name]
  Decouple Authentication and Simplify Schema

  ## Query Description: This migration removes the user authentication system by dropping dependent RLS policies, the `profiles` and `prompt_likes` tables, and the `created_by` column. It then adds `creator_name` and `instagram_handle` columns for anonymous attribution and creates a public function to handle likes. Row Level Security on the `prompts` table is disabled to allow public access.

  ## Metadata:
  - Schema-Category: "Dangerous"
  - Impact-Level: "High"
  - Requires-Backup: true
  - Reversible: false

  ## Structure Details:
  - Dropped Policies: "Allow creators to insert prompts", "Allow creators to update their own prompts", "Allow creators to delete their own prompts" on `prompts` table.
  - Dropped Tables: `public.profiles`, `public.prompt_likes`.
  - Modified Table `prompts`: Dropped `created_by` column, added `creator_name` and `instagram_handle` columns. Disabled RLS.
  - Created Function: `public.increment_like(p_prompt_id uuid)`.

  ## Security Implications:
  - RLS Status: Disabled on `prompts` table.
  - Policy Changes: Yes, all RLS policies on `prompts` are removed.
  - Auth Requirements: None. The system is now public.

  ## Performance Impact:
  - Indexes: Foreign key indexes related to `created_by` are removed.
  - Triggers: None.
  - Estimated Impact: Minimal performance impact. Simplifies query patterns.
*/

-- Step 1: Drop dependent RLS policies on the 'prompts' table.
-- These policies are no longer needed after removing the authentication system.
DROP POLICY IF EXISTS "Allow creators to insert prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow creators to update their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow creators to delete their own prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow read access to everyone" ON public.prompts;


-- Step 2: Drop the 'prompt_likes' table which depends on authenticated users.
DROP TABLE IF EXISTS public.prompt_likes;

-- Step 3: Drop the 'profiles' table. With policies removed, this will now succeed.
DROP TABLE IF EXISTS public.profiles;

-- Step 4: Modify the 'prompts' table to remove user dependency and add new fields.
-- The 'created_by' column has a foreign key to 'profiles', so it must be dropped.
ALTER TABLE public.prompts DROP COLUMN IF EXISTS created_by;

-- Add new columns for anonymous creator attribution.
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS creator_name TEXT;
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS instagram_handle TEXT;

-- Step 5: Disable Row Level Security on the 'prompts' table to allow full public access.
ALTER TABLE public.prompts DISABLE ROW LEVEL SECURITY;

-- Step 6: Create a new public function to handle likes without requiring authentication.
-- This function can be called via RPC by any anonymous user to increment a prompt's like count.
CREATE OR REPLACE FUNCTION public.increment_like(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;

-- Grant execution rights to the public anonymous role.
GRANT EXECUTE ON FUNCTION public.increment_like(uuid) TO anon;
