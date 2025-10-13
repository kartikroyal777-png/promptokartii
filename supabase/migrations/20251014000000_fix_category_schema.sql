-- Step 1: Create the categories table with UNIQUE constraints on 'name' and 'slug'.
-- This is the crucial part that fixes the "ON CONFLICT" error.
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

-- Step 2: Insert the default categories.
-- The ON CONFLICT now works because the 'name' column is UNIQUE.
INSERT INTO public.categories (name, slug)
VALUES
    ('Men', 'men'),
    ('Women', 'women'),
    ('Abstract', 'abstract'),
    ('Kids', 'kids'),
    ('Other', 'other')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add the category_id column to the prompts table if it doesn't exist.
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS category_id UUID;

-- Step 4: Add a foreign key constraint to link prompts and categories.
-- First, drop any old constraint that might exist from a failed run.
ALTER TABLE public.prompts
DROP CONSTRAINT IF EXISTS prompts_category_id_fkey;

-- Then add the new, correct constraint.
ALTER TABLE public.prompts
ADD CONSTRAINT prompts_category_id_fkey
FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

-- Step 5: Update existing prompts to use the new category_id.
-- This maps the old text values to the new foreign keys.
-- It only runs if the old 'category' column still exists.
DO $$
BEGIN
   IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='prompts' AND column_name='category') THEN
      UPDATE public.prompts p
      SET category_id = (SELECT c.id FROM public.categories c WHERE c.name = p.category)
      WHERE p.category IS NOT NULL AND p.category_id IS NULL;
   END IF;
END $$;

-- Step 6: Drop the old, now redundant 'category' column.
ALTER TABLE public.prompts
DROP COLUMN IF EXISTS category;

-- Step 7: Re-enable RLS on the new categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Step 8: Create RLS policies for the new categories table
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow admin full access to categories" ON public.categories;
CREATE POLICY "Allow admin full access to categories"
ON public.categories
FOR ALL
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');

-- Step 9: Ensure prompts policies are still correct
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to prompts" ON public.prompts;
CREATE POLICY "Allow public read access to prompts"
ON public.prompts
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow admin full access to prompts" ON public.prompts;
CREATE POLICY "Allow admin full access to prompts"
ON public.prompts
FOR ALL
USING (auth.email() = 'kartikroyal777@gmail.com')
WITH CHECK (auth.email() = 'kartikroyal777@gmail.com');
