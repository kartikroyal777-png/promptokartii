/*
# [Reset and Seed Categories]
This migration resets the prompts and categories tables to fix data inconsistencies and seeds the categories table with 'Men' and 'Women' as requested.

## Query Description:
- **WARNING: This operation will delete all existing prompts and categories.**
- It first truncates the `prompts` table to remove all existing prompt data.
- It then truncates the `categories` table to remove all existing category data.
- Finally, it inserts two new categories: 'Men' and 'Women'.
- This is a destructive but necessary step to ensure a clean state for the categories. A backup is strongly recommended before applying this migration.

## Metadata:
- Schema-Category: "Dangerous"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Tables affected: `public.prompts`, `public.categories`
- Data affected: All rows will be deleted from both tables.

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Admin privileges to run TRUNCATE.

## Performance Impact:
- Indexes: Unchanged
- Triggers: Unchanged
- Estimated Impact: Low, as it's a one-time reset.
*/

-- Step 1: Clear existing prompts to resolve foreign key constraints.
-- WARNING: This deletes all data in the prompts table.
TRUNCATE public.prompts RESTART IDENTITY CASCADE;

-- Step 2: Clear existing categories.
-- WARNING: This deletes all data in the categories table.
TRUNCATE public.categories RESTART IDENTITY CASCADE;

-- Step 3: Insert the new 'Men' and 'Women' categories.
INSERT INTO public.categories (name, slug)
VALUES
    ('Men', 'men'),
    ('Women', 'women');
