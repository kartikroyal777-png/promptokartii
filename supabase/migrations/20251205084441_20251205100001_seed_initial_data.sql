/*
  # Seed Initial Categories and Hero Images

  1. Categories: Add default art prompt categories
  2. Hero Images: Add sample hero images for landing page
*/

-- Insert categories
INSERT INTO categories (name, slug) VALUES
  ('Abstract Art', 'abstract-art'),
  ('Character Design', 'character-design'),
  ('Landscape', 'landscape'),
  ('Portrait', 'portrait'),
  ('Digital Painting', 'digital-painting'),
  ('3D Art', '3d-art'),
  ('Photography', 'photography'),
  ('Fantasy', 'fantasy'),
  ('Sci-Fi', 'sci-fi'),
  ('Comic Art', 'comic-art')
ON CONFLICT (name) DO NOTHING;

-- Insert hero images (using placeholder images from Pexels)
INSERT INTO hero_images (image_url, alt_text) VALUES
  ('https://images.pexels.com/photos/3561339/pexels-photo-3561339.jpeg', 'Colorful abstract digital art'),
  ('https://images.pexels.com/photos/1729365/pexels-photo-1729365.jpeg', 'Digital art workspace'),
  ('https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', 'Creative design tools')
ON CONFLICT DO NOTHING;
