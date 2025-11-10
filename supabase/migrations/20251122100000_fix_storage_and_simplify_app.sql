/*
          # [Operation Name]
          Fix Storage Permissions for Public Uploads

          ## Query Description: 
          This operation adjusts the Row Level Security (RLS) policies for Supabase Storage. It ensures that the 'prompt-images' bucket is publicly accessible for both reading and uploading files. This change is necessary to allow anonymous users to upload prompts without needing a profile, resolving the "relation public.profiles does not exist" error during uploads. This aligns with the application's open contribution model.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Affects: storage.objects table
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: Yes
          - Auth Requirements: This makes the 'prompt-images' bucket public for reads and inserts.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact.
          */

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Give users access to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;


-- Allow public read access to all files in the 'prompt-images' bucket
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'prompt-images' );

-- Allow anyone to upload to the 'prompt-images' bucket
CREATE POLICY "Public Uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'prompt-images' );
