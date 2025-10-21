import { Database } from './supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  categories: { name: string } | null;
};
export type HeroImage = Database['public']['Tables']['hero_images']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
