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
      app_config: {
        Row: {
          config_key: string
          config_value: string
          created_at: string
          id: number
        }
        Insert: {
          config_key: string
          config_value: string
          created_at?: string
          id?: number
        }
        Update: {
          config_key?: string
          config_value?: string
          created_at?: string
          id?: number
        }
        Relationships: []
      }
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
      daily_ad_claims: {
        Row: {
          claim_date: string
          claimed_at: string
          id: number
          reward_slot: number
          user_id: string
        }
        Insert: {
          claim_date: string
          claimed_at?: string
          id?: number
          reward_slot: number
          user_id: string
        }
        Update: {
          claim_date?: string
          claimed_at?: string
          id?: number
          reward_slot?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_ad_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      daily_link_claims: {
        Row: {
          claim_date: string
          claimed_at: string
          id: number
          link_id: number
          user_id: string
        }
        Insert: {
          claim_date: string
          claimed_at?: string
          id?: number
          link_id: number
          user_id: string
        }
        Update: {
          claim_date?: string
          claimed_at?: string
          id?: number
          link_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_link_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
      profiles: {
        Row: {
          credits: number
          created_at: string
          has_claimed_telegram_reward: boolean
          id: string
          role: string
        }
        Insert: {
          credits?: number
          created_at?: string
          has_claimed_telegram_reward?: boolean
          id: string
          role?: string
        }
        Update: {
          credits?: number
          created_at?: string
          has_claimed_telegram_reward?: boolean
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prompts: {
        Row: {
          ad_direct_link_url: string | null
          category_id: number
          created_at: string
          creator_name: string | null
          id: string
          image_url: string
          instagram_handle: string | null
          instructions: string
          like_count: number
          prompt_id: number
          prompt_text: string
          title: string
        }
        Insert: {
          ad_direct_link_url?: string | null
          category_id: number
          created_at?: string
          creator_name?: string | null
          id?: string
          image_url: string
          instagram_handle?: string | null
          instructions: string
          like_count?: number
          prompt_id?: number
          prompt_text: string
          title: string
        }
        Update: {
          ad_direct_link_url?: string | null
          category_id?: number
          created_at?: string
          creator_name?: string | null
          id?: string
          image_url?: string
          instagram_handle?: string | null
          instructions?: string
          like_count?: number
          prompt_id?: number
          prompt_text?: string
          title?: string
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
      unlocked_prompts: {
        Row: {
          id: number
          prompt_id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          id?: number
          prompt_id: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          id?: number
          prompt_id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlocked_prompts_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlocked_prompts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_coupon_claims: {
        Row: {
          claimed_at: string
          coupon_code: string
          id: number
          user_id: string
        }
        Insert: {
          claimed_at?: string
          coupon_code: string
          id?: number
          user_id: string
        }
        Update: {
          claimed_at?: string
          coupon_code?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_coupon_claims_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_ad_reward: {
        Args: {
          p_reward_slot: number
        }
        Returns: undefined
      }
      claim_coupon_reward: {
        Args: {
          p_coupon_code: string
        }
        Returns: number
      }
      claim_link_reward: {
        Args: {
          p_link_id: number
        }
        Returns: undefined
      }
      claim_telegram_reward: {
        Args: Record<string, never>
        Returns: undefined
      }
      increment_like_count: {
        Args: {
          p_prompt_id: string
        }
        Returns: undefined
      }
      purchase_prompt: {
        Args: {
          p_prompt_id_in: string
          p_cost_in: number
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
