import { Database } from './supabase';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Prompt = Database['public']['Tables']['prompts']['Row'] & {
  categories: { name: string } | null;
};
export type HeroImage = Database['public']['Tables']['hero_images']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UnlockedPrompt = Database['public']['Tables']['unlocked_prompts']['Row'];
export type DailyAdClaim = Database['public']['Tables']['daily_ad_claims']['Row'];
export type AppConfig = Database['public']['Tables']['app_config']['Row'];
