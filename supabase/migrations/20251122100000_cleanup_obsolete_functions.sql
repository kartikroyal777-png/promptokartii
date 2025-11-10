/*
# [Operation] Automated Obsolete Function Cleanup
This script automatically discovers and removes all old, unused user-defined functions from the 'public' schema. It is designed to clean up remnants from previous application versions and resolve the remaining "Function Search Path Mutable" security warnings. The only function it will intentionally preserve is `public.increment_like_count(uuid)`, which is required by the application.

## Query Description:
This operation iterates through all functions in the public schema and drops them, with the exception of `increment_like_count`. This is a safe cleanup operation but is irreversible. It will not affect any table data.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: false

## Structure Details:
- Affects: All functions in the `public` schema except for `increment_like_count`.
- Action: `DROP FUNCTION ... CASCADE`

## Security Implications:
- RLS Status: Not applicable.
- Policy Changes: No.
- Auth Requirements: Admin privileges required to run.
- Effect: This script is designed to *improve* security by removing functions that lack a secure search path.

## Performance Impact:
- Indexes: None.
- Triggers: Any triggers depending on the dropped functions will also be removed via `CASCADE`.
- Estimated Impact: Negligible performance impact.
*/

DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- This loop iterates through all functions in the 'public' schema
    -- that are not part of a Postgres extension and are not the essential 'increment_like_count' function.
    FOR func_record IN
        SELECT
            p.proname AS function_name,
            ns.nspname AS schema_name,
            oidvectortypes(p.proargtypes) AS argument_types
        FROM pg_proc p
        JOIN pg_namespace ns ON p.pronamespace = ns.oid
        WHERE ns.nspname = 'public'
          -- IMPORTANT: We explicitly preserve the one function we need.
          AND p.proname NOT IN ('increment_like_count')
          -- Safety check: Do not drop functions that are part of an extension.
          AND NOT EXISTS (
              SELECT 1
              FROM pg_depend
              WHERE objid = p.oid AND deptype = 'e'
          )
    LOOP
        -- Build and execute the DROP FUNCTION command dynamically.
        -- Using CASCADE ensures that any dependent objects (like old triggers) are also removed.
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE;',
                       func_record.schema_name,
                       func_record.function_name,
                       func_record.argument_types);
        RAISE NOTICE 'Dropped obsolete function: %.%(%)', func_record.schema_name, func_record.function_name, func_record.argument_types;
    END LOOP;
END;
$$;
