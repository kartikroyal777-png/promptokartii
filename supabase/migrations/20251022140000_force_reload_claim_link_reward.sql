/*
# [Function] `force_reload_claim_link_reward`
Re-applies the `claim_link_reward` function to resolve a potential schema caching issue.

## Query Description:
This operation re-runs the `CREATE OR REPLACE` statement for the `claim_link_reward` function. This is a common troubleshooting step for Supabase projects when a new function is not immediately available to the API layer (PostgREST). It forces the schema cache to refresh. The function's logic remains the same: it securely grants a 1-credit reward for visiting a daily link, once per day. No data is affected by this operation.

## Metadata:
- Schema-Category: ["Structural"]
- Impact-Level: ["Low"]
- Requires-Backup: false
- Reversible: true (The function can be dropped or replaced again)

## Structure Details:
- Function: `public.claim_link_reward(p_link_id integer)`

## Security Implications:
- RLS Status: Not applicable.
- Policy Changes: No.
- Auth Requirements: The function's internal logic remains unchanged and requires an authenticated user.

## Performance Impact:
- Indexes: None.
- Triggers: None.
- Estimated Impact: Negligible.
*/
create or replace function public.claim_link_reward(p_link_id integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
-- Version 2: Re-applying to fix schema cache.
declare
  user_id_val uuid := auth.uid();
  already_claimed boolean;
begin
  -- Check if the user has already claimed this specific link reward today
  select exists (
    select 1
    from daily_link_claims
    where user_id = user_id_val
      and link_id = p_link_id
      and claim_date = current_date
  ) into already_claimed;

  if already_claimed then
    raise exception 'You have already claimed this link reward today.';
  end if;

  -- Insert a record to mark the claim
  insert into daily_link_claims (user_id, link_id)
  values (user_id_val, p_link_id);

  -- Grant 1 credit to the user
  update profiles
  set credits = credits + 1
  where id = user_id_val;

end;
$$;
