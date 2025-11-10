/*
# [Function Security Hardening]
This migration secures the remaining database functions by explicitly setting the `search_path`. This prevents potential security vulnerabilities where a function might execute code from an untrusted schema.

## Query Description:
This operation alters the `increment_like_count` function to ensure it only operates within the `public` schema. It is a non-destructive, safe operation that improves security without affecting data or application functionality.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Affects function: `public.increment_like_count`

## Security Implications:
- RLS Status: Not applicable
- Policy Changes: No
- Auth Requirements: Admin privileges to alter functions. This change mitigates a security warning.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This is a metadata change.
*/

ALTER FUNCTION public.increment_like_count(p_prompt_id uuid) SET search_path = public;
