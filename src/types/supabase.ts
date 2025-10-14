export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          title: string
          category_id: number
          image_url: string
          prompt_text: string
          instructions: string
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category_id: number
          image_url: string
          prompt_text: string
          instructions: string
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category_id?: number
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
      ad_views: {
        Row: {
          id: string
          user_id: string
          prompt_id: string
          payout: number | null
          country: string | null
          offer_id: string | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: string
          payout?: number | null
          country?: string | null
          offer_id?: string | null
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: string
          payout?: number | null
          country?: string | null
          offer_id?: string | null
          completed_at?: string
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
