/*
          # [Operation Name]
          Simplify Schema for Open Contribution

          ## Query Description: [This migration overhauls the database to support an open, unauthenticated contribution model. It removes user-specific tables and columns like `profiles` and `prompt_likes`, and adds fields for creator attribution directly to the `prompts` table. This is a destructive change to user data but simplifies the architecture significantly.]
          
          ## Metadata:
          - Schema-Category: "Dangerous"
          - Impact-Level: "High"
          - Requires-Backup: true
          - Reversible: false
          
          ## Structure Details:
          - DROPS the `prompt_likes` table.
          - DROPS the `profiles` table.
          - ALTERS the `prompts` table to:
            - DROP the `created_by` foreign key.
            - DROP the `like_count` column.
            - ADD a `creator_name` text column.
            - ADD an `instagram_handle` text column.
          
          ## Security Implications:
          - RLS Status: RLS policies on dropped tables are removed.
          - Policy Changes: Yes
          - Auth Requirements: Removes all auth-related dependencies in the schema.
          
          ## Performance Impact:
          - Indexes: Removes indexes associated with dropped tables.
          - Triggers: Removes triggers associated with dropped tables.
          - Estimated Impact: Low performance impact, simplifies query logic.
          */

-- Step 1: Drop the prompt_likes table as likes are no longer user-specific.
-- The like_count on the prompts table will be managed differently or removed.
DROP TABLE IF EXISTS public.prompt_likes;

-- Step 2: Remove the foreign key constraint from `prompts` to `profiles`
-- This is necessary before we can drop the `profiles` table.
ALTER TABLE public.prompts
DROP CONSTRAINT IF EXISTS prompts_created_by_fkey;

-- Step 3: Drop the profiles table as we are moving to an anonymous contribution model.
DROP TABLE IF EXISTS public.profiles;

-- Step 4: Alter the prompts table to remove user-specific columns and add attribution fields.
ALTER TABLE public.prompts
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS like_count,
  ADD COLUMN creator_name TEXT,
  ADD COLUMN instagram_handle TEXT;

-- Step 5: Re-add a simple like_count column to prompts, defaulting to 0.
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS like_count INT NOT NULL DEFAULT 0;

-- Step 6: Create a public function to increment the like count.
CREATE OR REPLACE FUNCTION increment_like_count(prompt_id_to_inc UUID)
RETURNS void AS $$
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = prompt_id_to_inc;
$$ LANGUAGE sql VOLATILE;
