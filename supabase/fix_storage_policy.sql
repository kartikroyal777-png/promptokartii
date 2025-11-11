-- ------------------------------------------------------------------------------------------------
-- FIX: Make uploaded prompt images publicly visible
-- ------------------------------------------------------------------------------------------------
--
-- PROBLEM: Images uploaded by users are not showing up on the website because the storage
--          bucket ('prompt-images') does not allow public read access.
--
-- SOLUTION: This script creates a Row Level Security (RLS) policy that grants public read-only
--           access to all objects within the 'prompt-images' bucket. This makes the script
--           safe to run multiple times.
--
-- ------------------------------------------------------------------------------------------------

-- Drop the policy if it already exists to ensure a clean re-creation.
DROP POLICY IF EXISTS "Public read access for prompt-images" ON storage.objects;

-- Create the new policy to allow public read access (SELECT) on the 'prompt-images' bucket.
CREATE POLICY "Public read access for prompt-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'prompt-images');
