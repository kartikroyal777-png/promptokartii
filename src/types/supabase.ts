export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PromptCategory = "Men" | "Women" | "Abstract" | "Kids" | "Other"

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: number
          title: string
          category: PromptCategory
          image_url: string
          prompt_text: string
          instructions: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          category: PromptCategory
          image_url: string
          prompt_text: string
          instructions: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          category?: PromptCategory
          image_url?: string
          prompt_text?: string
          instructions?: string
          created_by?: string
          created_at?: string
        }
      }
      hero_images: {
        Row: {
          id: number
          image_url: string
          alt_text: string
          created_at: string
        }
        Insert: {
          id?: number
          image_url: string
          alt_text: string
          created_at?: string
        }
        Update: {
          id?: number
          image_url?: string
          alt_text?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      prompt_category: PromptCategory
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
