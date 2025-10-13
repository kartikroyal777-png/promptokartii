export type PromptCategory = 'Men' | 'Women' | 'Abstract' | 'Kids' | 'Other';

export interface Prompt {
  id: number;
  title: string;
  category: PromptCategory;
  image_url: string;
  prompt_text: string;
  instructions: string;
  created_at: string;
  created_by: string;
}

export interface HeroImage {
  id: number;
  image_url: string;
  alt_text: string;
  created_at: string;
}
