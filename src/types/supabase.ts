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
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      hero_images: {
        Row: {
          alt_text: string
          created_at: string
          id: number
          image_url: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          id?: number
          image_url: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: number
          image_url?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          ad_direct_link_url: string | null
          category_id: number
          created_at: string
          id: string
          image_url: string
          instructions: string
          prompt_text: string
          title: string
          like_count: number
          creator_name: string | null
          instagram_handle: string | null
        }
        Insert: {
          ad_direct_link_url?: string | null
          category_id: number
          created_at?: string
          id?: string
          image_url: string
          instructions: string
          prompt_text: string
          title: string
          like_count?: number
          creator_name?: string | null
          instagram_handle?: string | null
        }
        Update: {
          ad_direct_link_url?: string | null
          category_id?: number
          created_at?: string
          id?: string
          image_url?: string
          instructions?: string
          prompt_text?: string
          title?: string
          like_count?: number
          creator_name?: string | null
          instagram_handle?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prompts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_like_count: {
        Args: {
          p_prompt_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
