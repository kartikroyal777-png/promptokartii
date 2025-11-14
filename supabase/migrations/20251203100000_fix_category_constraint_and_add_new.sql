/*
# [Operation Name]
Fix Category Constraint and Add New Categories

## Query Description:
This migration fixes a database issue that prevented adding new categories and then inserts the "Couple" and "Kids" categories.

1.  **Add Unique Constraint**: It adds a `UNIQUE` constraint to the `name` column in the `categories` table. This ensures no two categories can have the same name and resolves the `ON CONFLICT` error from the previous migration attempt.
2.  **Insert New Categories**: It safely inserts "Couple" and "Kids" into the `categories` table. If they already exist, the operation does nothing, preventing duplicates.

This operation is safe and essential for database integrity.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (The constraint can be dropped)

## Structure Details:
- Table: `public.categories`
- Columns Affected: `name`
- Constraints Added: `UNIQUE` constraint on `name`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Admin privileges to alter table.

## Performance Impact:
- Indexes: Adds a unique index on the `name` column, which can slightly improve lookup performance on category names.
- Triggers: None
- Estimated Impact: Negligible performance impact.
*/

-- Add a unique constraint to the category name to prevent duplicates and fix the ON CONFLICT error.
-- This is idempotent; if the constraint already exists, it will not fail.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'categories_name_key' AND conrelid = 'public.categories'::regclass
  ) THEN
    ALTER TABLE public.categories ADD CONSTRAINT categories_name_key UNIQUE (name);
  END IF;
END;
$$;


/*
# [Operation Name]
Seed New Categories: Couple and Kids

## Query Description:
This query inserts the "Couple" and "Kids" categories into the `categories` table.
The `ON CONFLICT (name) DO NOTHING` clause makes this operation idempotent, meaning it can be run multiple times without creating duplicate entries or causing errors. If a category with the same name already exists, the command will be skipped for that entry.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (Can be manually deleted)

## Structure Details:
- Table: `public.categories`
- Operation: `INSERT`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Write permissions on `public.categories`.

## Performance Impact:
- Indexes: Uses the unique index on `name`.
- Triggers: None
- Estimated Impact: Negligible.
*/

-- Insert the new categories, ignoring them if they already exist.
INSERT INTO public.categories (name, slug)
VALUES
  ('Couple', 'couple'),
  ('Kids', 'kids')
ON CONFLICT (name) DO NOTHING;
