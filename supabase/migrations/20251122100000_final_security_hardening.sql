/*
          # [Final Security Hardening]
          This script resolves the last remaining security advisories by hardening database functions and storage policies.

          ## Query Description: 
          1.  **Function Hardening:** It alters the `increment_like_count` function to set a fixed, empty `search_path`. This prevents potential hijacking attacks and resolves the "Function Search Path Mutable" warning.
          2.  **Storage Policies:** It creates Row-Level Security (RLS) policies for the `storage.objects` table, specifically for the `prompt-images` bucket. This formally defines access rules, allowing public read access and authenticated uploads, which resolves the "RLS Enabled No Policy" informational advisory. This change is safe and improves security.
          
          ## Metadata:
          - Schema-Category: "Security"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Alters function: `public.increment_like_count`
          - Creates policies on table: `storage.objects`
          
          ## Security Implications:
          - RLS Status: Adds policies to an RLS-enabled table (`storage.objects`).
          - Policy Changes: Yes.
          - Auth Requirements: Policies differentiate between public and authenticated users.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible. RLS policies on storage are highly optimized.
          */

-- Harden the only remaining public function
ALTER FUNCTION public.increment_like_count(p_prompt_id uuid)
SET search_path = '';

-- Drop existing, less specific policies on storage if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;

-- Create specific RLS policies for the 'prompt-images' bucket
-- 1. Allow public, anonymous users to read/view images in the bucket
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'prompt-images' );

-- 2. Allow any authenticated user to upload new images
CREATE POLICY "Allow authenticated users to upload prompt images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'prompt-images' );

-- 3. Allow users to update their own images (optional but good practice)
CREATE POLICY "Allow users to update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid() = owner_id );

-- 4. Allow users to delete their own images (optional but good practice)
CREATE POLICY "Allow users to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( auth.uid() = owner_id );
