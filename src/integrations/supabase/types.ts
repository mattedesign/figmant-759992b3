export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      claude_insights: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          data_source: Json | null
          description: string
          id: string
          impact_area: string | null
          insight_type: string
          priority: string
          recommendations: Json | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          data_source?: Json | null
          description: string
          id?: string
          impact_area?: string | null
          insight_type: string
          priority?: string
          recommendations?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          data_source?: Json | null
          description?: string
          id?: string
          impact_area?: string | null
          insight_type?: string
          priority?: string
          recommendations?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claude_insights_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claude_prompt_analytics: {
        Row: {
          business_outcome_data: Json | null
          created_at: string
          example_id: string | null
          id: string
          response_quality_score: number | null
          response_time_ms: number | null
          tokens_used: number | null
          usage_context: string
          user_feedback: string | null
          user_id: string | null
          variation_id: string | null
        }
        Insert: {
          business_outcome_data?: Json | null
          created_at?: string
          example_id?: string | null
          id?: string
          response_quality_score?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          usage_context: string
          user_feedback?: string | null
          user_id?: string | null
          variation_id?: string | null
        }
        Update: {
          business_outcome_data?: Json | null
          created_at?: string
          example_id?: string | null
          id?: string
          response_quality_score?: number | null
          response_time_ms?: number | null
          tokens_used?: number | null
          usage_context?: string
          user_feedback?: string | null
          user_id?: string | null
          variation_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claude_prompt_analytics_example_id_fkey"
            columns: ["example_id"]
            isOneToOne: false
            referencedRelation: "claude_prompt_examples"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claude_prompt_analytics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claude_prompt_analytics_variation_id_fkey"
            columns: ["variation_id"]
            isOneToOne: false
            referencedRelation: "claude_prompt_variations"
            referencedColumns: ["id"]
          },
        ]
      }
      claude_prompt_examples: {
        Row: {
          business_domain: string | null
          category: string
          claude_response: string
          created_at: string
          created_by: string | null
          description: string | null
          effectiveness_rating: number | null
          id: string
          is_active: boolean | null
          is_template: boolean | null
          metadata: Json | null
          original_prompt: string
          prompt_variables: Json | null
          title: string
          updated_at: string
          use_case_context: string | null
        }
        Insert: {
          business_domain?: string | null
          category: string
          claude_response: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          metadata?: Json | null
          original_prompt: string
          prompt_variables?: Json | null
          title: string
          updated_at?: string
          use_case_context?: string | null
        }
        Update: {
          business_domain?: string | null
          category?: string
          claude_response?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          id?: string
          is_active?: boolean | null
          is_template?: boolean | null
          metadata?: Json | null
          original_prompt?: string
          prompt_variables?: Json | null
          title?: string
          updated_at?: string
          use_case_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claude_prompt_examples_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      claude_prompt_variations: {
        Row: {
          base_example_id: string | null
          created_at: string
          id: string
          modified_prompt: string
          performance_data: Json | null
          success_metrics: Json | null
          test_status: string | null
          updated_at: string
          variation_name: string
        }
        Insert: {
          base_example_id?: string | null
          created_at?: string
          id?: string
          modified_prompt: string
          performance_data?: Json | null
          success_metrics?: Json | null
          test_status?: string | null
          updated_at?: string
          variation_name: string
        }
        Update: {
          base_example_id?: string | null
          created_at?: string
          id?: string
          modified_prompt?: string
          performance_data?: Json | null
          success_metrics?: Json | null
          test_status?: string | null
          updated_at?: string
          variation_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "claude_prompt_variations_base_example_id_fkey"
            columns: ["base_example_id"]
            isOneToOne: false
            referencedRelation: "claude_prompt_examples"
            referencedColumns: ["id"]
          },
        ]
      }
      claude_usage_logs: {
        Row: {
          cost_usd: number | null
          created_at: string | null
          error_message: string | null
          id: string
          model_used: string | null
          request_data: Json | null
          request_type: string
          response_data: Json | null
          response_time_ms: number | null
          success: boolean | null
          tokens_used: number | null
          user_id: string | null
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          request_data?: Json | null
          request_type: string
          response_data?: Json | null
          response_time_ms?: number | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Update: {
          cost_usd?: number | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          request_data?: Json | null
          request_type?: string
          response_data?: Json | null
          response_time_ms?: number | null
          success?: boolean | null
          tokens_used?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claude_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          reference_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      design_analysis: {
        Row: {
          analysis_results: Json
          analysis_type: string
          confidence_score: number | null
          created_at: string
          design_upload_id: string
          id: string
          improvement_areas: string[] | null
          prompt_used: string
          suggestions: Json | null
          user_id: string
        }
        Insert: {
          analysis_results: Json
          analysis_type: string
          confidence_score?: number | null
          created_at?: string
          design_upload_id: string
          id?: string
          improvement_areas?: string[] | null
          prompt_used: string
          suggestions?: Json | null
          user_id: string
        }
        Update: {
          analysis_results?: Json
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string
          design_upload_id?: string
          id?: string
          improvement_areas?: string[] | null
          prompt_used?: string
          suggestions?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_analysis_design_upload_id_fkey"
            columns: ["design_upload_id"]
            isOneToOne: false
            referencedRelation: "design_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "design_analysis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      design_batch_analysis: {
        Row: {
          analysis_results: Json
          analysis_settings: Json | null
          analysis_type: string
          batch_id: string
          confidence_score: number | null
          context_summary: string | null
          created_at: string
          id: string
          key_metrics: Json | null
          modification_summary: string | null
          parent_analysis_id: string | null
          prompt_used: string
          recommendations: Json | null
          user_id: string
          version_number: number | null
          winner_upload_id: string | null
        }
        Insert: {
          analysis_results: Json
          analysis_settings?: Json | null
          analysis_type: string
          batch_id: string
          confidence_score?: number | null
          context_summary?: string | null
          created_at?: string
          id?: string
          key_metrics?: Json | null
          modification_summary?: string | null
          parent_analysis_id?: string | null
          prompt_used: string
          recommendations?: Json | null
          user_id: string
          version_number?: number | null
          winner_upload_id?: string | null
        }
        Update: {
          analysis_results?: Json
          analysis_settings?: Json | null
          analysis_type?: string
          batch_id?: string
          confidence_score?: number | null
          context_summary?: string | null
          created_at?: string
          id?: string
          key_metrics?: Json | null
          modification_summary?: string | null
          parent_analysis_id?: string | null
          prompt_used?: string
          recommendations?: Json | null
          user_id?: string
          version_number?: number | null
          winner_upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_parent_analysis_id"
            columns: ["parent_analysis_id"]
            isOneToOne: false
            referencedRelation: "design_batch_analysis"
            referencedColumns: ["id"]
          },
        ]
      }
      design_context_files: {
        Row: {
          content_preview: string | null
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          upload_id: string
          user_id: string
        }
        Insert: {
          content_preview?: string | null
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          upload_id: string
          user_id: string
        }
        Update: {
          content_preview?: string | null
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          upload_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_context_files_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "design_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      design_upload_analytics: {
        Row: {
          analysis_success: boolean | null
          created_at: string
          file_size_bytes: number | null
          file_type: string | null
          id: string
          processing_time_ms: number | null
          upload_id: string | null
          use_case: string | null
          user_id: string | null
        }
        Insert: {
          analysis_success?: boolean | null
          created_at?: string
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          processing_time_ms?: number | null
          upload_id?: string | null
          use_case?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_success?: boolean | null
          created_at?: string
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          processing_time_ms?: number | null
          upload_id?: string | null
          use_case?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_upload_analytics_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "design_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      design_uploads: {
        Row: {
          analysis_goals: string | null
          analysis_preferences: Json | null
          batch_id: string | null
          batch_name: string | null
          created_at: string
          file_name: string
          file_path: string | null
          file_size: number | null
          file_type: string | null
          id: string
          is_replacement: boolean | null
          original_batch_id: string | null
          replaced_upload_id: string | null
          source_type: string
          source_url: string | null
          status: string
          updated_at: string
          use_case: string
          user_id: string
        }
        Insert: {
          analysis_goals?: string | null
          analysis_preferences?: Json | null
          batch_id?: string | null
          batch_name?: string | null
          created_at?: string
          file_name: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_replacement?: boolean | null
          original_batch_id?: string | null
          replaced_upload_id?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          updated_at?: string
          use_case: string
          user_id: string
        }
        Update: {
          analysis_goals?: string | null
          analysis_preferences?: Json | null
          batch_id?: string | null
          batch_name?: string | null
          created_at?: string
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          id?: string
          is_replacement?: boolean | null
          original_batch_id?: string | null
          replaced_upload_id?: string | null
          source_type?: string
          source_url?: string | null
          status?: string
          updated_at?: string
          use_case?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "design_uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_replaced_upload_id"
            columns: ["replaced_upload_id"]
            isOneToOne: false
            referencedRelation: "design_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      design_use_cases: {
        Row: {
          analysis_focus: string[]
          created_at: string
          description: string
          id: string
          name: string
          prompt_template: string
          updated_at: string
        }
        Insert: {
          analysis_focus: string[]
          created_at?: string
          description: string
          id?: string
          name: string
          prompt_template: string
          updated_at?: string
        }
        Update: {
          analysis_focus?: string[]
          created_at?: string
          description?: string
          id?: string
          name?: string
          prompt_template?: string
          updated_at?: string
        }
        Relationships: []
      }
      logo_configuration: {
        Row: {
          active_logo_url: string
          created_at: string
          fallback_logo_url: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          active_logo_url: string
          created_at?: string
          fallback_logo_url: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          active_logo_url?: string
          created_at?: string
          fallback_logo_url?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_analytics: {
        Row: {
          cancelled_subscriptions: number | null
          created_at: string
          date: string
          id: string
          new_subscriptions: number | null
          revenue_usd: number | null
          total_subscribers: number | null
        }
        Insert: {
          cancelled_subscriptions?: number | null
          created_at?: string
          date: string
          id?: string
          new_subscriptions?: number | null
          revenue_usd?: number | null
          total_subscribers?: number | null
        }
        Update: {
          cancelled_subscriptions?: number | null
          created_at?: string
          date?: string
          id?: string
          new_subscriptions?: number | null
          revenue_usd?: number | null
          total_subscribers?: number | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          created_by: string | null
          credit_price: number | null
          credits: number
          description: string | null
          id: string
          is_active: boolean
          name: string
          plan_type: string
          price_annual: number | null
          price_monthly: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          credit_price?: number | null
          credits?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          plan_type?: string
          price_annual?: number | null
          price_monthly?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          credit_price?: number | null
          credits?: number
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          plan_type?: string
          price_annual?: number | null
          price_monthly?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_performance_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_unit: string | null
          metric_value: number
          timestamp: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_unit?: string | null
          metric_value: number
          timestamp?: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_unit?: string | null
          metric_value?: number
          timestamp?: string
        }
        Relationships: []
      }
      user_activity_logs: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          metadata: Json | null
          page_path: string | null
          session_duration_seconds: number | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_duration_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_duration_seconds?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          current_balance: number
          id: string
          total_purchased: number
          total_used: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_balance?: number
          id?: string
          total_purchased?: number
          total_used?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_balance?: number
          id?: string
          total_purchased?: number
          total_used?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_management_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          details: Json | null
          id: string
          target_user_id: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_manual: {
        Args: {
          p_email: string
          p_full_name: string
          p_role?: Database["public"]["Enums"]["user_role"]
        }
        Returns: Json
      }
      deduct_analysis_credits: {
        Args: {
          analysis_user_id: string
          credits_to_deduct?: number
          analysis_description?: string
        }
        Returns: boolean
      }
      get_analytics_summary: {
        Args: { days_back?: number }
        Returns: {
          total_users: number
          active_users: number
          total_uploads: number
          total_analyses: number
          avg_response_time: number
          total_tokens_used: number
          total_cost: number
          success_rate: number
        }[]
      }
      get_best_prompt_for_category: {
        Args: { category_name: string }
        Returns: {
          example_id: string
          title: string
          original_prompt: string
          avg_quality_score: number
          usage_count: number
        }[]
      }
      get_claude_settings: {
        Args: Record<PropertyKey, never>
        Returns: {
          claude_ai_enabled: boolean
          claude_model: string
          claude_system_prompt: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_page_path?: string
          p_session_duration_seconds?: number
          p_metadata?: Json
        }
        Returns: string
      }
      upsert_admin_setting: {
        Args: {
          p_setting_key: string
          p_setting_value: string
          p_description?: string
          p_updated_by?: string
        }
        Returns: Json
      }
      user_has_access: {
        Args: { user_id: string }
        Returns: boolean
      }
      validate_claude_api_key: {
        Args: { api_key: string }
        Returns: boolean
      }
      validate_claude_model: {
        Args: { model: string }
        Returns: boolean
      }
    }
    Enums: {
      subscription_status:
        | "active"
        | "inactive"
        | "cancelled"
        | "expired"
        | "free"
      user_role: "owner" | "subscriber"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      subscription_status: [
        "active",
        "inactive",
        "cancelled",
        "expired",
        "free",
      ],
      user_role: ["owner", "subscriber"],
    },
  },
} as const
