/*
# [Final Security Hardening]
This migration resolves the final outstanding security advisories by defining robust storage policies and hardening database functions.

## Query Description: 
This script is idempotent and safe to re-run. It will:
1. Drop and recreate security policies for the 'prompt-images' storage bucket to resolve the 'RLS Enabled No Policy' warning. This explicitly allows public viewing and uploading while securing update/delete operations.
2. Drop and recreate the 'increment_like_count' function to include a fixed search_path and security definer, resolving the 'Function Search Path Mutable' warning.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the created policies/functions)

## Structure Details:
- Affects RLS policies on 'storage.objects'.
- Affects the 'public.increment_like_count' function.

## Security Implications:
- RLS Status: Policies are being explicitly defined for storage.
- Policy Changes: Yes.
- Auth Requirements: Policies are defined for 'public', 'anon' and 'authenticated' roles.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible.
*/

-- 1. Secure Storage Bucket Policies for 'prompt-images'
-- Drop existing policies if they exist, to ensure a clean slate and prevent errors.
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous users to upload prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner to update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Allow owner to delete their own images" ON storage.objects;


-- Allow public, anonymous read access to all images in the 'prompt-images' bucket.
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prompt-images');

-- Allow any user (anonymous or authenticated) to upload to the 'prompt-images' bucket, as the upload page is public.
CREATE POLICY "Allow public uploads to prompt images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'prompt-images');

-- Restrict updates and deletes to the object owner. Admin operations will use the service_role key, which bypasses RLS.
CREATE POLICY "Allow owner to update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner)
WITH CHECK (auth.uid() = owner);

CREATE POLICY "Allow owner to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);


-- 2. Harden Database Functions
-- Drop the existing function to ensure a clean recreation.
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id uuid);

-- Recreate the function with security best practices.
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
-- SECURITY DEFINER allows the function to run with the permissions of the function owner.
-- This is crucial for allowing anonymous users to trigger an update on the prompts table.
SECURITY DEFINER
-- SET search_path prevents hijacking attacks by specifying the exact schema to use.
SET search_path = public
AS $$
BEGIN
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;

-- Grant execute permission to all public roles (anon and authenticated) so anyone can call it.
GRANT EXECUTE ON FUNCTION public.increment_like_count(p_prompt_id uuid) TO public;
