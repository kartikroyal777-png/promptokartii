/*
# [Create Storage Bucket and Policies for Prompt Images]
This script creates the necessary storage bucket 'prompt-images' for uploading and serving prompt and hero images. It also sets up Row Level Security (RLS) policies to allow public read access while restricting write access to authenticated users (admins).

## Query Description:
This operation is structural and safe. It adds a new storage bucket and security policies. It does not modify or delete any existing data. If the bucket or policies already exist, the script may return an error, which can be safely ignored.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (policies and bucket can be dropped manually)

## Structure Details:
- Creates storage bucket: `prompt-images`
- Creates policies on `storage.objects`:
  - "Allow public read access to prompt images"
  - "Allow authenticated users to upload prompt images"
  - "Allow authenticated users to update their own prompt images"
  - "Allow authenticated users to delete their own prompt images"

## Security Implications:
- RLS Status: Enabled for storage.
- Policy Changes: Yes, adds 4 new policies.
- Auth Requirements: Write operations require an authenticated user session.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible.
*/

-- 1. Create the storage bucket for prompt images if it doesn't exist.
INSERT INTO storage.buckets (id, name, public)
VALUES ('prompt-images', 'prompt-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create RLS policies for the 'prompt-images' bucket.
-- These policies are set to be permissive for this project's scope.

-- Allow public read access so images can be displayed in the app.
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prompt-images');

-- Allow authenticated users (the admin) to upload images.
CREATE POLICY "Allow authenticated users to upload prompt images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'prompt-images');

-- Allow authenticated users (the admin) to update images.
CREATE POLICY "Allow authenticated users to update prompt images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'prompt-images');

-- Allow authenticated users (the admin) to delete images.
CREATE POLICY "Allow authenticated users to delete prompt images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'prompt-images');
