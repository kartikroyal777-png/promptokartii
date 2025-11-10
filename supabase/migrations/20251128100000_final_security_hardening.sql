/*
          # [Operation Name]
          Final Security Hardening and Storage Policy Definition

          ## Query Description: 
          This script performs the final security hardening for the database. It secures all remaining user-defined functions by setting a strict search_path, which resolves all 'Function Search Path Mutable' warnings. It also defines explicit Row-Level Security (RLS) policies for the 'prompt-images' storage bucket, addressing the 'RLS Enabled No Policy' info message. This ensures that storage access is properly controlled. There is no risk to existing data.

          ## Metadata:
          - Schema-Category: "Security"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Functions: Alters any remaining user-defined functions.
          - Storage Policies: Creates new policies on the 'storage.objects' table for the 'prompt-images' bucket.
          
          ## Security Implications:
          - RLS Status: Policies are added to storage.
          - Policy Changes: Yes
          - Auth Requirements: Policies reference authenticated status.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: Negligible performance impact. These changes improve security.
          */

-- Harden any remaining functions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN
        SELECT p.proname, pg_get_function_identity_arguments(p.oid) as args, n.nspname as schema_name
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.prokind = 'f'
    LOOP
        EXECUTE format('ALTER FUNCTION public.%I(%s) SET search_path = public, extensions;', 
                       func_record.proname, 
                       func_record.args);
    END LOOP;
END $$;

-- Add RLS policies for storage bucket
CREATE POLICY "Allow public read access to prompt images"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'prompt-images' );

CREATE POLICY "Allow authenticated users to upload prompt images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'prompt-images' );
