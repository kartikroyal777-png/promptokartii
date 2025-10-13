/*
# [Schema Update] Add 'created_by' column to prompts
This script adds the 'created_by' column to the 'prompts' table and sets up a foreign key relationship to the 'auth.users' table. This is necessary to track which admin user created each prompt.

## Query Description:
- Adds a 'created_by' column of type UUID to the 'prompts' table.
- Adds a foreign key constraint to link 'created_by' to the 'id' of the 'auth.users' table.
- This operation is safe and will not delete any data. It only adds a new column and a constraint.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the column and constraint)

## Structure Details:
- Table affected: public.prompts
- Column added: created_by (UUID)
- Constraint added: prompts_created_by_fkey

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: This column will link prompts to authenticated users.

## Performance Impact:
- Indexes: A foreign key index will be implicitly created.
- Triggers: None
- Estimated Impact: Negligible performance impact on existing queries.
*/

-- Add the created_by column if it doesn't exist
ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS created_by UUID;

-- Add the foreign key constraint if it doesn't exist
-- We check for the constraint's existence to make the script re-runnable.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'prompts_created_by_fkey'
  ) THEN
    ALTER TABLE public.prompts
    ADD CONSTRAINT prompts_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES auth.users(id)
    ON DELETE SET NULL;
  END IF;
END;
$$;
