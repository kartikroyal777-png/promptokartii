/*
          # [Operation Name]
          Add Public ID to Prompts

          ## Query Description: This script adds a unique, 5-digit public-facing ID to the `prompts` table. It creates a sequence starting at 10000 to automatically assign a new ID to each prompt. This change is non-destructive and will backfill the ID for all existing prompts. This ID will be used for user-friendly searching and identification.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table `prompts`: Adds a new column `public_id` (INTEGER, UNIQUE, NOT NULL).
          - Sequence `prompts_public_id_seq`: A new sequence to auto-generate IDs.
          
          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: Admin privileges to alter table.
          
          ## Performance Impact:
          - Indexes: A unique index will be automatically created for the `public_id` column.
          - Triggers: None
          - Estimated Impact: Negligible impact on read/write performance. Will improve lookup performance when searching by ID.
          */

CREATE SEQUENCE IF NOT EXISTS prompts_public_id_seq START 10000;

ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS public_id INT UNIQUE;

-- We use a transaction to ensure atomicity
DO $$
BEGIN
  -- Backfill existing prompts that don't have a public_id yet
  UPDATE public.prompts
  SET public_id = nextval('prompts_public_id_seq')
  WHERE public_id IS NULL;

  -- Set the default for new rows
  ALTER TABLE public.prompts
  ALTER COLUMN public_id SET DEFAULT nextval('prompts_public_id_seq');

  -- Now that all rows are populated, we can enforce the NOT NULL constraint
  ALTER TABLE public.prompts
  ALTER COLUMN public_id SET NOT NULL;
END $$;
