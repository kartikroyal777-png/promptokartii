/*
# [SECURITY] Harden Database Functions
This migration updates existing database functions to improve security by setting a fixed `search_path`.

## Query Description:
This operation updates three functions (`purchase_prompt`, `add_credits`, `reset_daily_credits`) to be more secure. It does not alter any data or table structures. By setting `search_path = ''`, it prevents a class of security vulnerabilities where a malicious user could potentially execute unintended code. This is a safe and recommended security enhancement.

## Metadata:
- Schema-Category: ["Security", "Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Functions affected:
  - `public.purchase_prompt`
  - `public.add_credits`
  - `public.reset_daily_credits`

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Unchanged
- Mitigates: `search_path` hijacking vulnerability.

## Performance Impact:
- Indexes: None
- Triggers: None
- Estimated Impact: Negligible. This is a security best practice with no performance overhead.
*/

-- Update purchase_prompt function to be more secure
create or replace function public.purchase_prompt(p_prompt_id_in uuid, p_cost_in integer)
returns void
language plpgsql
security definer
set search_path = '' -- Mitigates search_path hijacking
as $$
declare
  current_credits integer;
  current_user_id uuid := auth.uid();
begin
  -- 1. Check if user is authenticated
  if current_user_id is null then
    raise exception 'User must be authenticated to purchase prompts.';
  end if;

  -- 2. Get user's current credits
  select credits into current_credits from public.profiles where id = current_user_id;

  -- 3. Check if user has enough credits
  if current_credits is null or current_credits < p_cost_in then
    raise exception 'Insufficient credits.';
  end if;

  -- 4. Deduct credits
  update public.profiles
  set credits = credits - p_cost_in
  where id = current_user_id;

  -- 5. Record the unlocked prompt
  insert into public.unlocked_prompts (user_id, prompt_id)
  values (current_user_id, p_prompt_id_in);
end;
$$;

-- Update add_credits function to be more secure
create or replace function public.add_credits(p_user_id uuid, p_amount integer)
returns void
language plpgsql
security definer
set search_path = '' -- Mitigates search_path hijacking
as $$
begin
  update public.profiles
  set credits = credits + p_amount
  where id = p_user_id;
end;
$$;

-- Update reset_daily_credits function to be more secure
create or replace function public.reset_daily_credits()
returns void
language plpgsql
security definer
set search_path = '' -- Mitigates search_path hijacking
as $$
begin
  -- Reset credits for all users
  update public.profiles set credits = 0;
  -- Clear the daily ad claims table
  truncate table public.daily_ad_claims;
end;
$$;
