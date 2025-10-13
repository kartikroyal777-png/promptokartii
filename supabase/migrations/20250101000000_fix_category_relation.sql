-- Step 1: Create the categories table if it doesn't exist.
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 2: Add a UNIQUE constraint to the name column, which is required for ON CONFLICT.
-- This is the key fix for the error you were seeing.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'categories_name_unique' AND conrelid = 'public.categories'::regclass
    ) THEN
        ALTER TABLE public.categories ADD CONSTRAINT categories_name_unique UNIQUE (name);
    END IF;
END $$;

-- Step 3: Insert the default categories. ON CONFLICT is now safe to use.
INSERT INTO public.categories (name) VALUES
('Men'),
('Women'),
('Abstract'),
('Kids'),
('Other')
ON CONFLICT (name) DO NOTHING;

-- Step 4: Add the category_id column to the prompts table if it doesn't exist.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='prompts' AND column_name='category_id'
    ) THEN
        ALTER TABLE public.prompts ADD COLUMN category_id INT;
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
        FOREIGN KEY (category_id) REFERENCES public.categories(id);
    END IF;
END $$;

-- Step 6: Update existing prompts to use the new category_id.
-- This handles prompts that still have the old text-based 'category' column.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='prompts' AND column_name='category'
    ) THEN
        UPDATE public.prompts p
        SET category_id = (SELECT id FROM public.categories c WHERE c.name = p.category)
        WHERE p.category_id IS NULL;
    END IF;
END $$;

-- Step 7: Make the new category_id column non-nullable.
ALTER TABLE public.prompts ALTER COLUMN category_id SET NOT NULL;

-- Step 8: (Cleanup) Drop the old 'category' column as it's now redundant.
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='prompts' AND column_name='category'
    ) THEN
        ALTER TABLE public.prompts DROP COLUMN category;
    END IF;
END $$;
