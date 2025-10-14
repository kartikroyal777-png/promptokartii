/*
  # Create ad_views table
  This migration creates the `ad_views` table to track ad completions from AdGem.

  ## Query Description:
  - Creates the `ad_views` table with columns to store user, prompt, and ad metadata.
  - Enables Row Level Security (RLS) on the table.
  - Creates policies to allow anonymous users to read data and allows all access for authenticated admins.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "Low"
  - Requires-Backup: false
  - Reversible: true (can be dropped)
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS public.ad_views (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id uuid NOT NULL,
  prompt_id integer NOT NULL,
  payout decimal(10, 4) DEFAULT 0,
  country text,
  offer_id text,
  completed_at timestamp with time zone DEFAULT now() NOT NULL,

  CONSTRAINT ad_views_prompt_id_fkey FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE
);

-- Enable RLS and replication for realtime
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ad_views;

-- Allow anonymous users to read all ad views.
-- The frontend will be responsible for filtering to the correct user.
DROP POLICY IF EXISTS "Allow anonymous read access" ON public.ad_views;
CREATE POLICY "Allow anonymous read access"
ON public.ad_views
FOR SELECT
TO anon
USING (true);

-- Allow admin full access
DROP POLICY IF EXISTS "Allow admin full access" ON public.ad_views;
CREATE POLICY "Allow admin full access"
ON public.ad_views
FOR ALL
TO authenticated
USING (
  (SELECT auth.email() = 'kartikroyal777@gmail.com')
)
WITH CHECK (
  (SELECT auth.email() = 'kartikroyal777@gmail.com')
);
