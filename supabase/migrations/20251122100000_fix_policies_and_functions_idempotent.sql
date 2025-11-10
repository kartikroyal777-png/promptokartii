/*
# [Fix Policies and Functions - Idempotent]
This migration corrects issues from previous scripts by making them idempotent. It drops and recreates storage policies and the `increment_like_count` function to ensure they are correctly configured and to resolve any "already exists" errors during migration.

## Query Description:
- **Policies:** This script will first remove any existing policies on the `storage.objects` table related to prompt images and then recreate them with the correct permissions. This ensures that public read access and upload permissions are correctly set for the `prompt-images` bucket. There is no risk to existing data.
- **Function:** It removes and recreates the `increment_like_count` function to ensure it is defined with `SECURITY DEFINER` and has its `search_path` set correctly, resolving security warnings.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Affects policies on `storage.objects`.
- Affects function `public.increment_like_count`.

## Security Implications:
- RLS Status: Modifies RLS policies for `storage.objects`.
- Policy Changes: Yes.
- Auth Requirements: None.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible.
*/

-- Drop existing policies to ensure idempotency
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anyone to upload to prompt-images" ON storage.objects;

-- Recreate storage policies for 'prompt-images' bucket
-- Allow public read access to all images in the bucket
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'prompt-images' );

-- Allow anyone to upload images to the bucket.
-- The application logic handles prompt creation.
CREATE POLICY "Allow anyone to upload to prompt-images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'prompt-images' );


-- Harden the increment_like_count function
-- Drop if exists to ensure idempotency
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id uuid);

-- Recreate the function
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
-- Use SECURITY DEFINER to allow anonymous users to call this, bypassing RLS for this specific update.
-- The function is safe as it only performs a specific increment operation.
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;

-- Set the search path to fix the security warning
ALTER FUNCTION public.increment_like_count(p_prompt_id uuid) SET search_path = public;
