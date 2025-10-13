--
-- Step 1: Create the 'categories' table if it doesn't exist, ensuring the 'name' is unique.
-- This is the foundation for our relational category system.
--
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT categories_name_unique UNIQUE (name)
);

--
-- Step 2: Insert the default categories.
-- The "ON CONFLICT (name) DO NOTHING" clause prevents duplicates if this script is run multiple times.
-- This now works because the UNIQUE constraint on 'name' was defined above.
--
INSERT INTO public.categories (name)
VALUES
    ('Men'),
    ('Women'),
    ('Abstract'),
    ('Kids'),
    ('Other')
ON CONFLICT (name) DO NOTHING;

--
-- Step 3: Add the 'category_id' foreign key column to the 'prompts' table if it's not already there.
--
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prompts'
        AND column_name = 'category_id'
    ) THEN
        ALTER TABLE public.prompts
        ADD COLUMN category_id INTEGER;
    END IF;
END $$;

--
-- Step 4: Add the foreign key constraint if it doesn't exist.
-- This formally links 'prompts' to 'categories'.
--
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'prompts_category_id_fkey'
    ) THEN
        ALTER TABLE public.prompts
        ADD CONSTRAINT prompts_category_id_fkey
        FOREIGN KEY (category_id)
        REFERENCES public.categories(id)
        ON DELETE SET NULL; -- If a category is deleted, set the prompt's category to null
    END IF;
END $$;

--
-- Step 5: Migrate data from the old text-based 'category' column to the new 'category_id' column.
-- This only runs if the old 'category' column still exists.
--
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prompts'
        AND column_name = 'category'
    ) THEN
        UPDATE public.prompts p
        SET category_id = (SELECT c.id FROM public.categories c WHERE c.name = p.category)
        WHERE p.category IS NOT NULL AND p.category_id IS NULL;
    END IF;
END $$;

--
-- Step 6: Make the 'category_id' column required (NOT NULL).
-- We do this after migrating data to avoid errors on existing rows.
--
ALTER TABLE public.prompts
ALTER COLUMN category_id SET NOT NULL;

--
-- Step 7: Drop the old 'category' column as it is now redundant.
--
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'prompts'
        AND column_name = 'category'
    ) THEN
        ALTER TABLE public.prompts
        DROP COLUMN category;
    END IF;
END $$;
