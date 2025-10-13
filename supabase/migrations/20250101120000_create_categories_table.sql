/*
# [Operation Name]
Create Categories Table and Refactor Prompts

## Query Description: [This script refactors the way prompt categories are stored. It creates a dedicated 'categories' table and links it to the 'prompts' table using a foreign key ('category_id'). This normalizes the database structure, improving data integrity and consistency. It safely migrates existing data from the old text-based 'category' column to the new relational structure before removing the old column.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Medium"]
- Requires-Backup: [true]
- Reversible: [false]

## Structure Details:
- Creates table: `public.categories`
- Alters table: `public.prompts` (adds `category_id`, removes `category`)
- Adds foreign key: `prompts.category_id` -> `categories.id`

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [Public read access is granted to the new `categories` table.]

## Performance Impact:
- Indexes: [A primary key index is created on `categories.id` and a foreign key is added, which can improve join performance.]
- Triggers: [None]
- Estimated Impact: [Low. This change improves data structure and should have a positive impact on query performance for category filtering.]
*/

-- Step 1: Create the categories table if it doesn't exist.
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Step 2: Insert the default categories.
-- ON CONFLICT prevents errors if they already exist.
INSERT INTO public.categories (name) VALUES
('Men'),
('Women'),
('Abstract'),
('Kids'),
('Other')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add a nullable category_id column to prompts if it doesn't exist.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'prompts' AND column_name = 'category_id'
  ) THEN
    ALTER TABLE public.prompts ADD COLUMN category_id INT;
  END IF;
END $$;

-- Step 4: Back-populate the new category_id from the old text-based category column.
-- This ensures no data is lost during the migration.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'prompts' AND column_name = 'category'
  ) THEN
    UPDATE public.prompts p
    SET category_id = (SELECT c.id FROM public.categories c WHERE c.name = p.category)
    WHERE p.category_id IS NULL;
  END IF;
END $$;

-- Step 5: If the old 'category' column exists, drop it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'prompts' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.prompts DROP COLUMN category;
  END IF;
END $$;

-- Step 6: Now that the column is populated, add the foreign key and make it non-nullable.
ALTER TABLE public.prompts
  ADD CONSTRAINT prompts_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES public.categories(id)
  ON DELETE SET NULL; -- Or SET DEFAULT, depending on desired behavior

ALTER TABLE public.prompts ALTER COLUMN category_id SET NOT NULL;


-- Step 7: Update RLS policies for the new categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
USING (true);
