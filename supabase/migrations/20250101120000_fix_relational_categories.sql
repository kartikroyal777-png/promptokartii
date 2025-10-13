-- Step 1: Create the categories table with a UNIQUE constraint on the name.
-- This is the key fix for the "ON CONFLICT" error.
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- Step 2: Insert the default categories.
-- ON CONFLICT(name) DO NOTHING ensures this is safe to re-run and won't create duplicates.
INSERT INTO public.categories (name)
VALUES
  ('Men'),
  ('Women'),
  ('Abstract'),
  ('Kids'),
  ('Other')
ON CONFLICT (name) DO NOTHING;

-- Step 3: Add the category_id foreign key column to the prompts table if it doesn't exist.
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES public.categories(id);

-- Step 4: Populate the new category_id based on the old text-based category column.
-- This runs only for rows that haven't been updated yet.
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'prompts' AND column_name = 'category') THEN
    UPDATE public.prompts p
    SET category_id = (SELECT id FROM public.categories c WHERE c.name = p.category)
    WHERE p.category_id IS NULL;
  END IF;
END $$;

-- Step 5: If all prompts have a category_id, we can now make the column non-nullable.
-- We check if any are NULL before applying the constraint to avoid errors on existing data.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.prompts WHERE category_id IS NULL) THEN
    ALTER TABLE public.prompts
    ALTER COLUMN category_id SET NOT NULL;
  END IF;
END $$;

-- Step 6: Clean up by dropping the old 'category' column and enum type if they exist.
ALTER TABLE public.prompts
DROP COLUMN IF EXISTS category;

DROP TYPE IF EXISTS public.prompt_category;
