-- Enable RLS on all public tables and set policies for public access.

/*
# [SECURITY] Enable RLS and Define Public Access Policies
This migration addresses critical security advisories by enabling Row Level Security (RLS) on all publicly exposed tables. It establishes a "public read-only" default and explicitly allows anonymous users to create new prompts.

## Query Description:
This operation enables RLS on the `prompts`, `categories`, and `hero_images` tables. It then applies policies to:
1.  Allow anyone to read data from these tables.
2.  Allow anyone to insert new records into the `prompts` table.
This secures the database by ensuring only intended actions are permitted, mitigating the risk of unauthorized data modification or deletion.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "High"
- Requires-Backup: false
- Reversible: true (by disabling RLS and dropping policies)

## Structure Details:
- Tables affected: `prompts`, `categories`, `hero_images`
- Policies created: "Allow public read access", "Allow anonymous prompt creation"

## Security Implications:
- RLS Status: Enabled on all key public tables.
- Policy Changes: Yes, new policies are created to enforce a secure-by-default public access model.
- Auth Requirements: Public read access requires no authentication. Prompt creation is anonymous.

## Performance Impact:
- Indexes: No changes.
- Triggers: No changes.
- Estimated Impact: Negligible. RLS can add a small overhead to queries, but the `USING (true)` clause is highly efficient.
*/

-- Enable RLS on the prompts table
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
-- Allow public read access to all prompts
CREATE POLICY "Allow public read access to prompts" ON public.prompts FOR SELECT USING (true);
-- Allow anonymous users to insert new prompts
CREATE POLICY "Allow anonymous prompt creation" ON public.prompts FOR INSERT WITH CHECK (true);

-- Enable RLS on the categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
-- Allow public read access to all categories
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);

-- Enable RLS on the hero_images table
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;
-- Allow public read access to all hero images
CREATE POLICY "Allow public read access to hero_images" ON public.hero_images FOR SELECT USING (true);

/*
# [FEATURE] Create RPC Function for Incrementing Likes
This function creates a secure way for anonymous users to "like" a prompt without granting them direct write access to the `prompts` table.

## Query Description:
This creates a PostgreSQL function `increment_like_count` that takes a `prompt_id` and increases the `like_count` for that prompt by 1. By using `security definer`, the function runs with the permissions of the user who defined it (the admin), bypassing the more restrictive RLS policies applied to anonymous users. This is a standard and secure pattern for allowing specific, limited write operations.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true (by dropping the function)

## Structure Details:
- Functions created: `increment_like_count(uuid)`

## Security Implications:
- RLS Status: This function bypasses RLS for a single, specific action due to `SECURITY DEFINER`.
- Policy Changes: No.
- Auth Requirements: Can be called by the `anon` role.

## Performance Impact:
- Estimated Impact: Negligible.
*/
CREATE OR REPLACE FUNCTION increment_like_count(prompt_id_to_inc uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = prompt_id_to_inc;
$$;

-- Grant execute permission to the anon role so anyone can call it
GRANT EXECUTE ON FUNCTION public.increment_like_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_like_count(uuid) TO authenticated;


/*
# [CLEANUP] Remove Obsolete prompt_likes Table
This operation removes the `prompt_likes` table, which is no longer needed after removing user authentication.

## Query Description:
The `prompt_likes` table was used to track which user liked which prompt. Since the application no longer has user accounts, this table is redundant. Liking is now handled by an RPC function that increments a counter on the `prompts` table. This change simplifies the schema.

## Metadata:
- Schema-Category: "Structural"
- Impact-Level: "Medium"
- Requires-Backup: true
- Reversible: false

## Structure Details:
- Tables dropped: `prompt_likes`

## Security Implications:
- RLS Status: N/A
- Policy Changes: No.

## Performance Impact:
- Estimated Impact: Positive, as it removes an unused table.
*/
DROP TABLE IF EXISTS public.prompt_likes;
