/*
# [Operation Name]
Recreate ad_views table with correct foreign key type

## Query Description: [This operation fixes a type mismatch error by recreating the `ad_views` table. The `prompt_id` column is changed from an integer to a UUID to correctly reference the `prompts` table. This change is necessary for the AdGem integration to work correctly. No data will be lost as the table was not successfully created before.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [false]

## Structure Details:
- Drops table `public.ad_views` if it exists.
- Creates table `public.ad_views` with a `prompt_id` column of type `uuid`.
- Adds a foreign key from `ad_views.prompt_id` to `prompts.id`.
- Enables Row Level Security on the new table.

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [None for this script]

## Performance Impact:
- Indexes: [Primary key index will be created]
- Triggers: [None]
- Estimated Impact: [Low]
*/

-- Drop dependent policies and the table to ensure a clean slate
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ad_views;
DROP POLICY IF EXISTS "Allow service_role to insert" ON public.ad_views;
DROP TABLE IF EXISTS public.ad_views;

-- Create the ad_views table with the correct column types
CREATE TABLE public.ad_views (
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    user_id uuid NOT NULL,
    prompt_id uuid NOT NULL,
    offer_id text NULL,
    payout numeric NULL,
    country text NULL,
    completed_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT ad_views_pkey PRIMARY KEY (id),
    CONSTRAINT ad_views_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES public.prompts(id) ON DELETE CASCADE
);

-- Add comments to the table and columns for clarity
COMMENT ON TABLE public.ad_views IS 'Tracks completed ad views for unlocking prompts.';
COMMENT ON COLUMN public.ad_views.user_id IS 'Anonymous user ID from local storage.';
COMMENT ON COLUMN public.ad_views.prompt_id IS 'The prompt that was unlocked.';

-- Enable Row Level Security
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;

-- Create policies for access
CREATE POLICY "Allow service_role to insert" ON public.ad_views FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Enable read access for all users" ON public.ad_views FOR SELECT TO anon USING (true);
