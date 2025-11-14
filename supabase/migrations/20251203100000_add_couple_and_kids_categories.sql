/*
# [Data] Add New Categories
This operation inserts two new categories, "Couple" and "Kids", into the `categories` table.

## Query Description: [This script adds new rows to the `categories` table. It uses an `ON CONFLICT` clause to prevent errors if these categories already exist, making it safe to run multiple times. No existing data will be modified or deleted.]

## Metadata:
- Schema-Category: "Data"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: public.categories
- Columns affected: name, slug

## Security Implications:
- RLS Status: Enabled (as per existing schema)
- Policy Changes: No
- Auth Requirements: None for this script.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/
INSERT INTO public.categories (name, slug)
VALUES
  ('Couple', 'couple'),
  ('Kids', 'kids')
ON CONFLICT (name) DO NOTHING;
