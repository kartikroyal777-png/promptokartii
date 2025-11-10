-- Drop policies if they exist to make the script idempotent
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous uploads to prompt images" ON storage.objects;

/*
# [Policy] Allow public read access to prompt images
[This policy allows anyone to view images within the 'prompt-images' bucket. This is necessary for the public-facing website to display prompt previews.]

## Query Description: [Grants SELECT permission to everyone for objects in the 'prompt-images' bucket. This is safe as the images are intended for public display.]

## Metadata:
- Schema-Category: ["Safe"]
- Impact-Level: ["Low"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: storage.objects
- Operation: SELECT

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [None]

## Performance Impact:
- Indexes: [N/A]
- Triggers: [N/A]
- Estimated Impact: [Low]
*/
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'prompt-images');

/*
# [Policy] Allow anonymous uploads to prompt images
[This policy allows any user, including anonymous visitors, to upload new images to the 'prompt-images' bucket. This is required for the public "Upload Prompt" feature to work.]

## Query Description: [Grants INSERT permission to everyone for objects in the 'prompt-images' bucket. This is necessary for the public upload functionality.]

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Medium"]
- Requires-Backup: [false]
- Reversible: [true]

## Structure Details:
- Table: storage.objects
- Operation: INSERT

## Security Implications:
- RLS Status: [Enabled]
- Policy Changes: [Yes]
- Auth Requirements: [None]

## Performance Impact:
- Indexes: [N/A]
- Triggers: [N/A]
- Estimated Impact: [Low]
*/
CREATE POLICY "Allow anonymous uploads to prompt images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'prompt-images');
