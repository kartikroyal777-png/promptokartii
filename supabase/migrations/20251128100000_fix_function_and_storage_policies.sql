/*
# [Operation Name]
Fix Function Signature and Define Storage Policies

## Query Description:
This script corrects a type mismatch error in the `increment_like_count` database function that caused the previous migration to fail. It ensures the function correctly handles prompt IDs. Additionally, it re-applies the security policies for the `prompt-images` storage bucket to formally define access rules and resolve the outstanding security advisory. This operation is safe and does not affect existing data.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Modifies `public.increment_like_count` function.
- Creates RLS policies on `storage.objects` for the `prompt-images` bucket.

## Security Implications:
- RLS Status: Policies are being added to `storage.objects`.
- Policy Changes: Yes.
- Auth Requirements: Policies use `auth.role()` and `auth.jwt()`.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/

-- Step 1: Correct the increment_like_count function
-- This fixes the "uuid = text" error by changing the function parameter to the correct type (uuid).
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set a secure search path to prevent hijacking attacks with SECURITY DEFINER
  SET search_path = public;

  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;


-- Step 2: Define Storage Policies for 'prompt-images'
-- This resolves the "RLS Enabled No Policy" advisory by creating explicit access rules.

-- Drop existing policies for idempotency, in case of partial application.
DROP POLICY IF EXISTS "Allow public read access on prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload on prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin full access on prompt images" ON storage.objects;

-- Policy 1: Allow public, anonymous access to view images.
CREATE POLICY "Allow public read access on prompt images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prompt-images');

-- Policy 2: Allow any logged-in user to upload new images.
CREATE POLICY "Allow authenticated upload on prompt images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'prompt-images' AND
  auth.role() = 'authenticated'
);

-- Policy 3: Give the admin account full control over all images in the bucket.
-- This uses the hardcoded admin email from your application's AuthContext.
CREATE POLICY "Allow admin full access on prompt images"
ON storage.objects FOR ALL
USING (
  bucket_id = 'prompt-images' AND
  (select auth.jwt() ->> 'email') = 'kartikroyal777@gmail.com'
)
WITH CHECK (
  bucket_id = 'prompt-images' AND
  (select auth.jwt() ->> 'email') = 'kartikroyal777@gmail.com'
);
