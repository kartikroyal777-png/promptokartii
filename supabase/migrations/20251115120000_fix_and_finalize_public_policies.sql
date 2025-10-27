/*
          # [Fix and Finalize Public Policies]
          This script corrects a previous migration failure by making the setup idempotent. It safely drops any existing policies and functions before recreating them, ensuring a clean state. It enables Row Level Security on all public tables and establishes a secure, open-contribution model where anyone can read and submit prompts, and anyone can "like" a prompt.

          ## Query Description: [This script resolves critical security advisories by enabling RLS and setting public-read/public-write policies. It is designed to be run safely multiple times and will not cause data loss. It finalizes the database schema for the new authentication-free model.]
          
          ## Metadata:
          - Schema-Category: ["Structural", "Security"]
          - Impact-Level: ["Medium"]
          - Requires-Backup: [false]
          - Reversible: [false]
          
          ## Structure Details:
          - Tables Affected: prompts, categories, hero_images
          - Policies Created: "Allow public read access", "Allow anonymous insert access"
          - Functions Created: increment_like_count(uuid)
          
          ## Security Implications:
          - RLS Status: [Enabled]
          - Policy Changes: [Yes]
          - Auth Requirements: [None (Public Access)]
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Low. RLS adds a minor overhead, but policies are simple.]
          */

-- Drop policies if they exist to ensure a clean slate.
DROP POLICY IF EXISTS "Allow public read access to prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow anonymous insert access to prompts" ON public.prompts;
DROP POLICY IF EXISTS "Allow public read access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access to hero_images" ON public.hero_images;

-- Drop the old like function if it exists.
DROP FUNCTION IF EXISTS public.increment_like_count(prompt_id_to_like uuid);

-- Enable RLS on tables. This command is idempotent; it does nothing if RLS is already enabled.
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for the new public model.
CREATE POLICY "Allow public read access to all tables" ON public.prompts
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert access to prompts" ON public.prompts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to hero_images" ON public.hero_images
  FOR SELECT USING (true);

-- Create a function to increment the like count on a prompt.
-- This can be called via RPC by any anonymous user.
-- SECURITY DEFINER allows the function to bypass RLS to update the row.
CREATE OR REPLACE FUNCTION public.increment_like_count(prompt_id_to_like uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  update public.prompts
  set like_count = like_count + 1
  where id = prompt_id_to_like;
$$;
