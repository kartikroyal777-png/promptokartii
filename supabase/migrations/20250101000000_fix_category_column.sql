/*
# [Operation] Add Category Column to Prompts
[This script ensures the 'category' column exists on the 'prompts' table, which is required for the admin panel to function correctly.]

## Query Description: [This operation is safe to run multiple times. It first checks if the 'prompt_category' type exists and creates it if not. Then, it checks if the 'category' column exists on the 'prompts' table and adds it if it's missing, setting a default value to avoid errors with existing rows. This will resolve the "schema cache" error.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Tables affected: `public.prompts`
- Columns added: `category`
- Types created: `public.prompt_category`

## Security Implications:
- RLS Status: [Not Changed]
- Policy Changes: [No]
- Auth Requirements: [Admin privileges to run ALTER TABLE]

## Performance Impact:
- Indexes: [None]
- Triggers: [None]
- Estimated Impact: [Negligible. A one-time, quick metadata update.]
*/

-- Step 1: Ensure the custom ENUM type 'prompt_category' exists.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'prompt_category') THEN
        CREATE TYPE public.prompt_category AS ENUM ('Men', 'Women', 'Abstract', 'Kids', 'Other');
        RAISE NOTICE 'Type "prompt_category" created.';
    ELSE
        RAISE NOTICE 'Type "prompt_category" already exists.';
    END IF;
END
$$;

-- Step 2: Add the 'category' column to the 'prompts' table if it doesn't already exist.
-- This is safe to run even if the column has already been added.
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS category public.prompt_category NOT NULL DEFAULT 'Other';

-- Step 3: Add a comment to the new column for clarity in database tools.
COMMENT ON COLUMN public.prompts.category IS 'The designated category for the AI prompt.';
