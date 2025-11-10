/*
          # [Final Security Hardening]
          This migration resolves the last remaining code-related security advisories by defining explicit storage policies and hardening all user-defined database functions.

          ## Query Description: [This script is the final step in securing the database. It adds Row-Level Security (RLS) policies to the `prompt-images` storage bucket, allowing public read and upload access while preventing unauthorized modifications. It also cleans up any lingering old database functions and secures the one remaining function (`increment_like_count`) by setting its `search_path`. This script is idempotent and safe to re-run.]
          
          ## Metadata:
          - Schema-Category: ["Security", "Structural"]
          - Impact-Level: ["Low"]
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Affects RLS policies on `storage.objects`.
          - Drops and recreates the `increment_like_count` function.
          - Drops several old, unused functions.
          
          ## Security Implications:
          - RLS Status: Policies will be created for `storage.objects`.
          - Policy Changes: Yes
          - Auth Requirements: None
          
          ## Performance Impact:
          - Indexes: [None]
          - Triggers: [None]
          - Estimated Impact: [Negligible performance impact. Improves security.]
          */

-- Step 1: Clean up any old, unused functions that might be lingering.
DO $$
DECLARE
    func_name TEXT;
BEGIN
    FOR func_name IN
        SELECT proname
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND proname IN (
            'handle_new_user',
            'get_user_profile',
            'claim_reward',
            'claim_telegram_reward',
            'claim_direct_link_reward',
            'purchase_prompt',
            'get_user_credits',
            'add_credits'
        )
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(func_name) || ' CASCADE;';
    END LOOP;
END;
$$;

-- Step 2: Secure the only function we need: increment_like_count.
-- Drop both potential signatures to be safe.
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id text);
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id uuid);

-- Recreate the function with security settings and the correct type.
CREATE OR REPLACE FUNCTION public.increment_like_count(p_prompt_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE prompts
  SET like_count = like_count + 1
  WHERE id = p_prompt_id;
END;
$$;


-- Step 3: Secure storage by defining explicit policies for the 'prompt-images' bucket.
-- This resolves the "RLS Enabled No Policy" informational message.

-- Drop policies if they exist to make the script idempotent.
DROP POLICY IF EXISTS "Allow public read access to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload access to prompt images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to manage their own images" ON storage.objects;

-- Policy 1: Allow anyone to view images in the 'prompt-images' bucket.
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
USING (bucket_id = 'prompt-images');

-- Policy 2: Allow anyone (including anonymous users) to upload to the 'prompt-images' bucket.
-- This is necessary for the public upload page to function correctly.
CREATE POLICY "Allow public upload access to prompt images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'prompt-images');
