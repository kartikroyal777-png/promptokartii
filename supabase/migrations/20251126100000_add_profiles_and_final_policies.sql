/*
# [Feature &amp; Security] Create Profiles Table and Finalize Policies
This migration introduces a `profiles` table to support user profiles and resolves all remaining security advisories by creating the necessary RLS policies for storage.

## Query Description: 
- **Storage Policies:** Creates RLS policies for the `prompt-images` bucket, allowing public reads and uploads while restricting modification. This resolves the `RLS Enabled No Policy` advisory.
- **Profiles Table:** Adds a `profiles` table to store public user data (username, avatar). This is a foundational step for building user profile pages and other community features.
- **Automation:** Adds a trigger (`on_auth_user_created`) that automatically creates a profile for a new user upon sign-up.
- **Security:** Enables and configures RLS on the new `profiles` table to ensure users can only manage their own data.

This is a safe, structural change. It does not affect existing data but adds new, essential functionality.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- **Tables Added:** `public.profiles`
- **Functions Added:** `public.handle_new_user`
- **Triggers Added:** `on_auth_user_created` on `auth.users`
- **Policies Added:** 
  - On `storage.objects` for `prompt-images` bucket.
  - On `public.profiles` for select, insert, and update.

## Security Implications:
- RLS Status: Enabled on `public.profiles`.
- Policy Changes: Yes, adds policies for `storage.objects` and `public.profiles`.
- Auth Requirements: Policies are linked to `auth.uid()`.

## Performance Impact:
- Indexes: A primary key and a unique index are added to `profiles`.
- Triggers: Adds a new trigger on `auth.users` table, with minimal impact on sign-up performance.
- Estimated Impact: Low.
*/

-- 1. Finalize Storage Security Policies
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;
CREATE POLICY "Allow public read access to prompt images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'prompt-images');

DROP POLICY IF EXISTS "Allow authenticated users to upload prompt images" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload prompt images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'prompt-images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow anonymous users to upload prompt images" ON storage.objects;
CREATE POLICY "Allow anonymous users to upload prompt images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'prompt-images' AND auth.role() = 'anon');


-- 2. Create the profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

COMMENT ON TABLE public.profiles IS 'Public profile information for each user.';

-- 3. Set up RLS for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);


-- 4. Create a function to handle new user sign-ups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- 5. Create a trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
