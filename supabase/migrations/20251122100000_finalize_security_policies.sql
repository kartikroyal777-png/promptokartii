/*
          # [Finalize Security Policies]
          This migration resolves the final code-related security advisories by creating explicit RLS policies for the storage bucket and hardening the remaining database function.

          ## Query Description: 
          This operation is safe and non-destructive. It first removes any potentially conflicting old policies or functions and then recreates them with the correct, secure settings. This ensures the storage and database functions are protected against common vulnerabilities.

          ## Metadata:
          - Schema-Category: ["Security", "Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Affects RLS policies on `storage.objects`.
          - Affects the `increment_like_count` function in the `public` schema.
          
          ## Security Implications:
          - RLS Status: Creates required policies for the `prompt-images` bucket.
          - Policy Changes: Yes, adds SELECT and INSERT policies for storage.
          - Auth Requirements: Policies are designed for public anonymous access.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact.
          */

-- Drop existing policies if they exist to prevent "already exists" errors
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads to prompt images" ON storage.objects;

-- Create secure policies for the 'prompt-images' bucket
-- Allows anyone to view images in the bucket.
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prompt-images');

-- Allows anyone (including anonymous users) to upload to the bucket.
CREATE POLICY "Allow anonymous uploads to prompt images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prompt-images');

-- Recreate the function with security best practices
-- This DROP is for idempotency, ensuring the script can be re-run.
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id uuid);

-- Create the function with a secure search_path
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set a secure search_path to prevent hijacking.
  SET search_path = '';
  
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;

-- Grant execute permission to the public roles
GRANT EXECUTE ON FUNCTION public.increment_like_count(uuid) TO anon, authenticated;
