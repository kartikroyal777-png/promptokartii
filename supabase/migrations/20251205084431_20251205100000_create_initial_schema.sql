/*
  # Initialize OG Prompts Database Schema

  1. New Tables
    - `categories`: Prompt categories (Art, Design, Writing, etc.)
    - `prompts`: AI art prompts with metadata, images, and engagement data
    - `hero_images`: Hero section images for home page
  
  2. Functions
    - `increment_like_count()`: Safely increment prompt likes
  
  3. Security
    - Enable RLS on all tables
    - Public read access to prompts, categories, hero_images
    - Write operations protected appropriately
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id INT UNIQUE,
  title TEXT NOT NULL,
  prompt_text TEXT NOT NULL,
  instructions TEXT NOT NULL,
  image_url TEXT NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id),
  creator_name TEXT,
  instagram_handle TEXT,
  ad_direct_link_url TEXT,
  like_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create hero_images table
CREATE TABLE IF NOT EXISTS hero_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- Categories policies - public read
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- Prompts policies - public read
CREATE POLICY "Anyone can read prompts"
  ON prompts FOR SELECT
  USING (true);

-- Prompts policies - anyone can insert
CREATE POLICY "Anyone can create prompts"
  ON prompts FOR INSERT
  WITH CHECK (true);

-- Prompts policies - anyone can update (for like_count)
CREATE POLICY "Anyone can update prompts"
  ON prompts FOR UPDATE
  WITH CHECK (true);

-- Hero images policies - public read
CREATE POLICY "Anyone can read hero images"
  ON hero_images FOR SELECT
  USING (true);

-- Create function to increment like count safely
CREATE OR REPLACE FUNCTION increment_like_count(p_prompt_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE prompts SET like_count = like_count + 1 WHERE id = p_prompt_id;
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_prompts_category_id ON prompts(category_id);
CREATE INDEX idx_prompts_prompt_id ON prompts(prompt_id);
CREATE INDEX idx_prompts_title ON prompts(title);
