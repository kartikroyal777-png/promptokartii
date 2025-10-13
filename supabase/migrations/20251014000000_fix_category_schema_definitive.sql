/*
          # [Operation Name]
          Restructure Categories Schema

          ## Query Description:
          This script completely overhauls the category system. It creates a new 'categories' table with unique names and slugs, migrates existing prompts from a text-based category to a relational 'category_id', and then removes the old text-based column. This is a structural change that normalizes the database. No data loss is expected as it migrates existing values.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: true
          - Reversible: false

          ## Structure Details:
          - Creates table: `public.categories`
          - Adds column: `prompts.category_id` (UUID)
          - Adds foreign key: `prompts.category_id` -> `categories.id`
          - Drops column: `prompts.category` (text)

          ## Security Implications:
          - RLS Status: Enabled on `categories`
          - Policy Changes: Yes, new policies for `categories` are created.
          - Auth Requirements: Admin (`kartikroyal777@gmail.com`) gets full access.

          ## Performance Impact:
          - Indexes: Primary key and unique indexes are added to `categories`.
          - Triggers: None.
          - Estimated Impact: Low. Improves query performance for filtering by category.
*/

-- Step 1: Create the categories table with unique constraints on both name and slug.
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

-- Step 2: Insert default categories. ON CONFLICT (name) ensures this is re-runnable.
INSERT INTO public.categories (name, slug)
VALUES
  ('Men', 'men'),
  ('Women', 'women'),
  ('Abstract', 'abstract'),
  ('Kids', 'kids'),
  ('Other', 'other')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add the category_id column to the prompts table if it doesn't exist.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'prompts' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.prompts ADD COLUMN category_id UUID;
  END IF;
END $$;

-- Step 4: Update existing prompts with the correct category_id based on the old text value.
-- This is the data migration step. It checks if the old 'category' column exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'prompts' AND column_name = 'category'
  ) THEN
    UPDATE public.prompts p
    SET category_id = (SELECT id FROM public.categories c WHERE c.name = p.category)
    WHERE p.category_id IS NULL AND p.category IS NOT NULL;
  END IF;
END $$;

-- Step 5: Add the foreign key constraint if it doesn't exist.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'prompts_category_id_fkey' AND conrelid = 'public.prompts'::regclass
  ) THEN
    ALTER TABLE public.prompts
    ADD CONSTRAINT prompts_category_id_fkey
    FOREIGN KEY (category_id) REFERENCES public.categories(id)
    ON DELETE SET DEFAULT; -- Use a default category or handle deletion logic.
  END IF;
END $$;

-- Step 6: Make the new category_id column non-nullable if it's not already.
-- This is safe to run after the data migration in Step 4.
ALTER TABLE public.prompts ALTER COLUMN category_id SET NOT NULL;

-- Step 7: Drop the old 'category' column if it exists.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'prompts' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.prompts DROP COLUMN category;
  END IF;
END $$;

-- Step 8: Enable RLS on the new categories table and create policies.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to prevent errors on re-run
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin full access to categories" ON public.categories;

-- Create new policies
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
USING (true);

CREATE POLICY "Allow admin full access to categories"
ON public.categories
FOR ALL
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');
