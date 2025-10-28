/*
          # [Operation Name]
          Harden Database Functions and Add Prompt ID

          ## Query Description: This migration enhances security by setting a fixed `search_path` for all existing database functions, mitigating potential search path hijacking vulnerabilities as flagged in the security advisory. It also adds a user-friendly, auto-incrementing 5-digit ID to each prompt, starting from 10000, which will be used for display and search purposes.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Modifies functions: `increment_like_count`
          - Adds `prompt_id` column with a sequence to the `prompts` table.

          ## Security Implications:
          - RLS Status: Unchanged
          - Policy Changes: No
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: Adds a unique index on the new `prompt_id` column.
          - Triggers: None
          - Estimated Impact: Negligible performance impact; improves query performance for ID-based lookups.
          */

-- Add a user-friendly, auto-incrementing 5-digit ID to prompts
CREATE SEQUENCE IF NOT EXISTS public.prompts_prompt_id_seq START 10000;

ALTER TABLE public.prompts
ADD COLUMN IF NOT EXISTS prompt_id INT NOT NULL DEFAULT nextval('prompts_prompt_id_seq');

CREATE UNIQUE INDEX IF NOT EXISTS prompts_prompt_id_key ON public.prompts USING btree (prompt_id);

ALTER SEQUENCE public.prompts_prompt_id_seq OWNED BY public.prompts.prompt_id;


-- Harden the security of the like-incrementing function
ALTER FUNCTION public.increment_like_count(p_prompt_id uuid)
SET search_path = 'public';
