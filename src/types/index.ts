export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Prompt {
  id: string;
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

export interface AdView {
  id: string;
  user_id: string;
  prompt_id: string;
  completed_at: string;
}
