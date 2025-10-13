export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Prompt {
  id: number;
  title: string;
  category_id: number;
  image_url: string;
  prompt_text: string;
  instructions: string;
  created_at: string;
  created_by: string;
  categories: {
    name: string;
  } | null;
}

export interface HeroImage {
  id: number;
  image_url: string;
  alt_text: string;
  created_at: string;
}
