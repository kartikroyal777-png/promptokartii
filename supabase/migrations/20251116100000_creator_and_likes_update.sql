/*
          # [Creator & Likes Feature]
          This migration introduces a creator role, expands user profiles, and adds a "like" system for prompts.

          ## Query Description: This operation is structural and adds new features.
          1.  **`profiles` table:** Adds columns for `full_name`, `avatar_url`, and `bio` to allow for creator profiles.
          2.  **`prompts` table:** Adds a `like_count` column to store the number of likes for each prompt.
          3.  **`prompt_likes` table:** A new table to track individual likes from users on prompts, preventing duplicate likes.
          4.  **SQL Functions & Triggers:** Automates the process of incrementing/decrementing `like_count` when a prompt is liked or unliked.
          5.  **RLS Policies:** Updates security policies to allow users to manage their own profiles and likes, and enables creators to upload prompts.

          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Medium"
          - Requires-Backup: false
          - Reversible: true

          ## Structure Details:
          - **ALTER TABLE:** `public.profiles`, `public.prompts`
          - **CREATE TABLE:** `public.prompt_likes`
          - **CREATE FUNCTION:** `increment_prompt_like`, `decrement_prompt_like`
          - **CREATE TRIGGER:** `handle_prompt_like_insert`, `handle_prompt_like_delete`
          - **RLS POLICY:** New policies on `prompt_likes`, `prompts`, and updated policies on `profiles`.

          ## Security Implications:
          - RLS Status: Enabled/Modified
          - Policy Changes: Yes
          - Auth Requirements: Policies are based on `auth.uid()` to ensure users can only modify their own data.

          ## Performance Impact:
          - Indexes: A primary key is added to `prompt_likes` which includes an index.
          - Triggers: Adds triggers to `prompt_likes` for automatic `like_count` updates. Impact is minimal and localized to like/unlike actions.
          - Estimated Impact: Low performance impact.
          */

-- 1. Extend the profiles table for creator information
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT;

-- 2. Add like_count to prompts table
ALTER TABLE public.prompts
  ADD COLUMN IF NOT EXISTS like_count INT NOT NULL DEFAULT 0;

-- 3. Create prompt_likes table
CREATE TABLE IF NOT EXISTS public.prompt_likes (
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (prompt_id, user_id)
);

-- 4. Add RLS to the new table
ALTER TABLE public.prompt_likes ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for prompt_likes
DROP POLICY IF EXISTS "Allow public read access" ON public.prompt_likes;
CREATE POLICY "Allow public read access" ON public.prompt_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow users to insert their own likes" ON public.prompt_likes;
CREATE POLICY "Allow users to insert their own likes" ON public.prompt_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow users to delete their own likes" ON public.prompt_likes;
CREATE POLICY "Allow users to delete their own likes" ON public.prompt_likes
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Create functions to increment/decrement like count
CREATE OR REPLACE FUNCTION increment_prompt_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count + 1
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_prompt_like()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts
  SET like_count = like_count - 1
  WHERE id = OLD.prompt_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create triggers to call the functions
DROP TRIGGER IF EXISTS handle_prompt_like_insert ON public.prompt_likes;
CREATE TRIGGER handle_prompt_like_insert
  AFTER INSERT ON public.prompt_likes
  FOR EACH ROW EXECUTE PROCEDURE increment_prompt_like();

DROP TRIGGER IF EXISTS handle_prompt_like_delete ON public.prompt_likes;
CREATE TRIGGER handle_prompt_like_delete
  AFTER DELETE ON public.prompt_likes
  FOR EACH ROW EXECUTE PROCEDURE decrement_prompt_like();

-- 8. Update profiles RLS policies
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
CREATE POLICY "Allow users to update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 9. Add RLS policies for prompts for creators
DROP POLICY IF EXISTS "Allow creators to insert prompts" ON public.prompts;
CREATE POLICY "Allow creators to insert prompts" ON public.prompts
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('creator', 'admin')
  );

DROP POLICY IF EXISTS "Allow creators to update their own prompts" ON public.prompts;
CREATE POLICY "Allow creators to update their own prompts" ON public.prompts
  FOR UPDATE USING (
    auth.uid() = created_by AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('creator', 'admin')
  );

DROP POLICY IF EXISTS "Allow creators to delete their own prompts" ON public.prompts;
CREATE POLICY "Allow creators to delete their own prompts" ON public.prompts
  FOR DELETE USING (
    auth.uid() = created_by AND
    (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('creator', 'admin')
  );
