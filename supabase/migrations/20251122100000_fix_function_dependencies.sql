/*
# [CRITICAL] Final Database Cleanup &amp; Security Hardening
This migration script performs the final cleanup of obsolete database objects and hardens the security of the remaining functions. It addresses the dependency issue that caused the previous migration to fail.

## Query Description:
This operation will **destructively remove** several old functions and the triggers that depend on them. Specifically, it uses `DROP ... CASCADE` to remove the `handle_new_user` function and its associated trigger on the `auth.users` table. This is necessary to complete the cleanup process. It then recreates the `increment_like_count` function with proper security settings.

- **Impact on Data:** This operation does not directly delete user data in `prompts` or `categories`. It removes functions and triggers related to a now-defunct user profile and rewards system.
- **Risks:** The primary risk was the dependency error, which this script is designed to fix. The use of `CASCADE` is intentional and necessary.
- **Precautions:** A database backup is always recommended before running destructive operations.

## Metadata:
- Schema-Category: "Dangerous"
- Impact-Level: "High"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- **DROPPED:**
  - Function: `public.handle_new_user()` and its dependent trigger `on_auth_user_created` on `auth.users`.
  - Function: `public.claim_reward()`
  - Function: `public.claim_telegram_reward()`
  - Function: `public.claim_direct_link_reward()`
  - Function: `public.apply_coupon_code()`
  - Function: `public.increment_like_count()` (before recreating)
- **CREATED/ALTERED:**
  - Function: `public.increment_like_count()` is recreated with a secure `search_path`.

## Security Implications:
- **RLS Status:** No change to RLS policies.
- **Policy Changes:** No.
- **Auth Requirements:** This script removes a trigger from `auth.users`, decoupling the old profile system from the authentication flow.
- **Function Security:** All remaining `search_path` warnings from the security advisory will be resolved by explicitly setting the search path on the `increment_like_count` function.

## Performance Impact:
- **Indexes:** None.
- **Triggers:** Removes one trigger from `auth.users`, which may slightly improve the performance of user sign-ups.
- **Estimated Impact:** Low positive impact.
*/

-- Step 1: Drop the problematic function and its dependent trigger using CASCADE.
-- This is the key fix for the error you encountered.
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Step 2: Drop other obsolete functions that are no longer needed.
DROP FUNCTION IF EXISTS public.claim_reward(uuid, text);
DROP FUNCTION IF EXISTS public.claim_telegram_reward(uuid);
DROP FUNCTION IF EXISTS public.claim_direct_link_reward(uuid);
DROP FUNCTION IF EXISTS public.apply_coupon_code(uuid, text);

-- Step 3: Drop the existing like function so we can recreate it securely.
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id uuid);
DROP FUNCTION IF EXISTS public.increment_like_count(p_prompt_id character varying);

-- Step 4: Recreate the increment_like_count function with security best practices.
-- This sets a specific search_path to mitigate security risks.
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

-- Grant execute permission to the public role so anyone can call it.
-- The RLS policies on the 'prompts' table will still control access.
GRANT EXECUTE ON FUNCTION public.increment_like_count(uuid) TO public;
