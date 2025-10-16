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
          id: number
        }
        Insert: {
          config_key: string
          config_value: string
          id?: number
        }
        Update: {
          config_key?: string
          config_value?: string
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
      coupon_codes: {
        Row: {
          code: string
          created_at: string
          credits: number
          is_active: boolean
        }
        Insert: {
          code: string
          created_at?: string
          credits: number
          is_active?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          credits?: number
          is_active?: boolean
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
          claim_date?: string
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
          claim_date?: string
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
          has_claimed_telegram_reward: boolean
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          credits?: number
          has_claimed_telegram_reward?: boolean
          id: string
          role?: string
          updated_at?: string | null
        }
        Update: {
          credits?: number
          has_claimed_telegram_reward?: boolean
          id?: string
          role?: string
          updated_at?: string | null
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
          category_id: number
          created_at: string
          created_by: string
          id: string
          image_url: string
          instructions: string
          prompt_text: string
          title: string
        }
        Insert: {
          category_id: number
          created_at?: string
          created_by: string
          id?: string
          image_url: string
          instructions: string
          prompt_text: string
          title: string
        }
        Update: {
          category_id?: number
          created_at?: string
          created_by?: string
          id?: string
          image_url?: string
          instructions?: string
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
          },
          {
            foreignKeyName: "prompts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
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
            foreignKeyName: "user_coupon_claims_coupon_code_fkey"
            columns: ["coupon_code"]
            isOneToOne: false
            referencedRelation: "coupon_codes"
            referencedColumns: ["code"]
          },
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
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: {
          p_user_id: string
        }
        Returns: boolean
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
