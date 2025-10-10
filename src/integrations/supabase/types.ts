export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      external_links: {
        Row: {
          category: string
          created_at: string
          description: string | null
          guide_text: string | null
          id: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          guide_text?: string | null
          id?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          guide_text?: string | null
          id?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      intake_submissions: {
        Row: {
          additional_notes: string | null
          address: string | null
          allergies: Json | null
          city: string | null
          created_at: string
          criminal_history: string | null
          current_medications: Json | null
          current_mental_health_treatment: boolean | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          emergency_contact_relationship: string | null
          employment_status: string | null
          first_name: string | null
          form_data: Json | null
          id: string
          insurance_group_number: string | null
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_name: string | null
          last_use_date: string | null
          legal_issues: string | null
          medical_conditions: Json | null
          mental_health_history: string | null
          phone: string | null
          previous_treatment: string | null
          primary_physician: string | null
          probation_parole: boolean | null
          psychiatric_medications: Json | null
          reference_number: string
          referral_source: string | null
          session_id: string | null
          ssn_last_four: string | null
          state: string | null
          substances_used: Json | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          additional_notes?: string | null
          address?: string | null
          allergies?: Json | null
          city?: string | null
          created_at?: string
          criminal_history?: string | null
          current_medications?: Json | null
          current_mental_health_treatment?: boolean | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employment_status?: string | null
          first_name?: string | null
          form_data?: Json | null
          id?: string
          insurance_group_number?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string | null
          last_use_date?: string | null
          legal_issues?: string | null
          medical_conditions?: Json | null
          mental_health_history?: string | null
          phone?: string | null
          previous_treatment?: string | null
          primary_physician?: string | null
          probation_parole?: boolean | null
          psychiatric_medications?: Json | null
          reference_number: string
          referral_source?: string | null
          session_id?: string | null
          ssn_last_four?: string | null
          state?: string | null
          substances_used?: Json | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          additional_notes?: string | null
          address?: string | null
          allergies?: Json | null
          city?: string | null
          created_at?: string
          criminal_history?: string | null
          current_medications?: Json | null
          current_mental_health_treatment?: boolean | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          emergency_contact_relationship?: string | null
          employment_status?: string | null
          first_name?: string | null
          form_data?: Json | null
          id?: string
          insurance_group_number?: string | null
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string | null
          last_use_date?: string | null
          legal_issues?: string | null
          medical_conditions?: Json | null
          mental_health_history?: string | null
          phone?: string | null
          previous_treatment?: string | null
          primary_physician?: string | null
          probation_parole?: boolean | null
          psychiatric_medications?: Json | null
          reference_number?: string
          referral_source?: string | null
          session_id?: string | null
          ssn_last_four?: string | null
          state?: string | null
          substances_used?: Json | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "intake_submissions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_url: string | null
          guide_text: string | null
          id: string
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          guide_text?: string | null
          id?: string
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_url?: string | null
          guide_text?: string | null
          id?: string
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          activity_log: Json | null
          created_at: string
          duration: number | null
          end_time: string | null
          id: string
          start_time: string
        }
        Insert: {
          activity_log?: Json | null
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          start_time?: string
        }
        Update: {
          activity_log?: Json | null
          created_at?: string
          duration?: number | null
          end_time?: string | null
          id?: string
          start_time?: string
        }
        Relationships: []
      }
      submissions: {
        Row: {
          content: Json
          created_at: string
          id: string
          reference_number: string
          session_id: string | null
          type: string
        }
        Insert: {
          content: Json
          created_at?: string
          id?: string
          reference_number: string
          session_id?: string | null
          type: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          reference_number?: string
          session_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          created_at: string
          id: string
          location: string | null
          open_feedback: Json
          reference_number: string
          responses: Json
          session_id: string | null
          tenure: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          open_feedback?: Json
          reference_number: string
          responses?: Json
          session_id?: string | null
          tenure: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          open_feedback?: Json
          reference_number?: string
          responses?: Json
          session_id?: string | null
          tenure?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
