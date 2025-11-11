-- This script ensures the database is in the correct state for prompt uploads.
-- It is idempotent and can be run safely multiple times.

/*
# [SETUP] Ensure categories exist for prompt uploads
This operation inserts the default 'Men' and 'Women' categories if they are missing. This is a safe, non-destructive check.

## Query Description: This operation will only add categories if they do not already exist based on their unique 'slug'. It will not modify or delete any existing data.
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: false (but non-destructive)

## Structure Details:
- Affects table: public.categories
*/
INSERT INTO public.categories (name, slug)
VALUES
  ('Men', 'men'),
  ('Women', 'women')
ON CONFLICT (slug) DO NOTHING;


/*
# [POLICY] Ensure public read access on categories
This operation first removes any previous version of the read policy and then creates a new, definitive one. This ensures the frontend can always fetch the category list.

## Query Description: This is a safe, non-destructive operation that grants read-only access to the categories table. It does not expose any sensitive user data.
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (the policy can be dropped)

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes (drops and creates a SELECT policy)
- Auth Requirements: None
*/
DROP POLICY IF EXISTS "Enable read access for all users on categories" ON public.categories;

CREATE POLICY "Enable read access for all users on categories"
ON public.categories
FOR SELECT
USING (true);
