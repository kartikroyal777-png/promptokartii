/*
# [POLICY] Grant Public Read Access to Categories
This migration ensures that the `categories` table is publicly readable, which is essential for the prompt upload and filtering features to function correctly.

## Query Description:
This operation enables Row Level Security (RLS) on the `categories` table and creates a policy that allows any user (including anonymous visitors) to read the list of categories. It is a non-destructive, safe operation that does not affect any existing data. It simply grants read permissions.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: `public.categories`
- Operation: Enables RLS and adds a `SELECT` policy.

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes, adds a `SELECT` policy.
- Auth Requirements: None, this policy is for public access.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. RLS adds a very small overhead to queries, but it is necessary for security and will not be noticeable for a small table like `categories`.
*/

-- Step 1: Enable Row Level Security on the categories table if it's not already.
-- This is a safe, idempotent command.
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop the policy if it exists, to ensure this script can be run multiple times without error.
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;

-- Step 3: Create the policy to allow all users to read from the categories table.
-- This is necessary for the frontend to populate the category dropdowns.
CREATE POLICY "Allow public read access to categories"
ON public.categories
FOR SELECT
USING (true);
