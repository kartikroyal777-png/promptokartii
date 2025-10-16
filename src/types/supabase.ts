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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: undefined
      }
      claim_telegram_reward: {
        Args: Record<PropertyKey, never>
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
