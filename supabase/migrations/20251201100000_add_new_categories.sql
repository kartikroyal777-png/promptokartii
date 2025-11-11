/*
# [Data] Add New Categories
This migration adds several new categories to the `categories` table to provide more options for prompt organization.

## Query Description:
This operation will insert new rows into the `public.categories` table. It includes an `ON CONFLICT` clause to prevent errors if the categories already exist, making it safe to run multiple times. No existing data will be modified or deleted.

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (can be reversed with a DELETE statement)

## Structure Details:
- Table: `public.categories`
- Columns Affected: `name`, `slug`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: None

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. A simple, fast insert operation.
*/
INSERT INTO public.categories (name, slug)
VALUES
  ('Men', 'men'),
  ('Women', 'women'),
  ('Anime', 'anime'),
  ('Cyberpunk', 'cyberpunk'),
  ('Fantasy', 'fantasy'),
  ('Sci-Fi', 'sci-fi'),
  ('Nature', 'nature'),
  ('Animals', 'animals')
ON CONFLICT (slug) DO NOTHING;
