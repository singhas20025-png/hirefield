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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          candidate_id: string | null
          category: string | null
          completed_at: string | null
          created_at: string
          id: string
          max_score: number | null
          name: string
          score: number | null
          user_id: string
        }
        Insert: {
          candidate_id?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          max_score?: number | null
          name: string
          score?: number | null
          user_id: string
        }
        Update: {
          candidate_id?: string | null
          category?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          max_score?: number | null
          name?: string
          score?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_jobs: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_jobs_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "candidate_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_profiles: {
        Row: {
          bio: string | null
          created_at: string
          email: string
          experience_years: number | null
          full_name: string
          headline: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          phone: string | null
          portfolio_url: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email: string
          experience_years?: number | null
          full_name: string
          headline?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string
          experience_years?: number | null
          full_name?: string
          headline?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      candidates: {
        Row: {
          applied_date: string | null
          avatar: string | null
          created_at: string
          education: string | null
          email: string | null
          experience: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          role: string
          score: number | null
          skills: string[] | null
          source: string | null
          stage: string
          updated_at: string
          user_id: string
        }
        Insert: {
          applied_date?: string | null
          avatar?: string | null
          created_at?: string
          education?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          role: string
          score?: number | null
          skills?: string[] | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          applied_date?: string | null
          avatar?: string | null
          created_at?: string
          education?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          score?: number | null
          skills?: string[] | null
          source?: string | null
          stage?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          brand_color: string | null
          company_name: string
          company_size: string | null
          cover_image_url: string | null
          created_at: string
          culture_description: string | null
          description: string | null
          headquarters: string | null
          id: string
          industry: string | null
          logo_url: string | null
          office_photos: string[] | null
          slug: string
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          brand_color?: string | null
          company_name: string
          company_size?: string | null
          cover_image_url?: string | null
          created_at?: string
          culture_description?: string | null
          description?: string | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          office_photos?: string[] | null
          slug: string
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          brand_color?: string | null
          company_name?: string
          company_size?: string | null
          cover_image_url?: string | null
          created_at?: string
          culture_description?: string | null
          description?: string | null
          headquarters?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          office_photos?: string[] | null
          slug?: string
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string | null
          candidate_name: string
          created_at: string
          date: string
          id: string
          interviewer: string | null
          notes: string | null
          rating: number | null
          role: string | null
          status: string | null
          time: string | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          candidate_id?: string | null
          candidate_name: string
          created_at?: string
          date: string
          id?: string
          interviewer?: string | null
          notes?: string | null
          rating?: number | null
          role?: string | null
          status?: string | null
          time?: string | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          candidate_id?: string | null
          candidate_name?: string
          created_at?: string
          date?: string
          id?: string
          interviewer?: string | null
          notes?: string | null
          rating?: number | null
          role?: string | null
          status?: string | null
          time?: string | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interviews_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          answers: Json | null
          candidate_user_id: string
          company_profile_id: string | null
          cover_letter: string | null
          created_at: string
          id: string
          job_id: string
          resume_url: string | null
          routing_step: string | null
          status: string
          updated_at: string
        }
        Insert: {
          answers?: Json | null
          candidate_user_id: string
          company_profile_id?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id: string
          resume_url?: string | null
          routing_step?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          answers?: Json | null
          candidate_user_id?: string
          company_profile_id?: string | null
          cover_letter?: string | null
          created_at?: string
          id?: string
          job_id?: string
          resume_url?: string | null
          routing_step?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_company_profile_id_fkey"
            columns: ["company_profile_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          created_at: string
          department: string | null
          description: string | null
          id: string
          location: string | null
          pipeline_stages: Json | null
          posted_date: string | null
          salary: string | null
          status: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          location?: string | null
          pipeline_stages?: Json | null
          posted_date?: string | null
          salary?: string | null
          status?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description?: string | null
          id?: string
          location?: string | null
          pipeline_stages?: Json | null
          posted_date?: string | null
          salary?: string | null
          status?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_interview_scheduled: boolean | null
          email_new_candidate: boolean | null
          email_stage_change: boolean | null
          email_weekly_digest: boolean | null
          id: string
          push_interview_reminder: boolean | null
          push_new_candidate: boolean | null
          push_offer_accepted: boolean | null
          push_team_mention: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_interview_scheduled?: boolean | null
          email_new_candidate?: boolean | null
          email_stage_change?: boolean | null
          email_weekly_digest?: boolean | null
          id?: string
          push_interview_reminder?: boolean | null
          push_new_candidate?: boolean | null
          push_offer_accepted?: boolean | null
          push_team_mention?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_interview_scheduled?: boolean | null
          email_new_candidate?: boolean | null
          email_stage_change?: boolean | null
          email_weekly_digest?: boolean | null
          id?: string
          push_interview_reminder?: boolean | null
          push_new_candidate?: boolean | null
          push_offer_accepted?: boolean | null
          push_team_mention?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          first_name: string | null
          id: string
          job_title: string | null
          last_name: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          id?: string
          job_title?: string | null
          last_name?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scheduled_interviews: {
        Row: {
          candidate_name: string
          created_at: string
          date: string
          id: string
          interview_type: string | null
          interviewer: string
          status: string | null
          time: string
          user_id: string
        }
        Insert: {
          candidate_name: string
          created_at?: string
          date: string
          id?: string
          interview_type?: string | null
          interviewer: string
          status?: string | null
          time: string
          user_id: string
        }
        Update: {
          candidate_name?: string
          created_at?: string
          date?: string
          id?: string
          interview_type?: string | null
          interviewer?: string
          status?: string | null
          time?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          avatar: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          avatar?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          avatar?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "recruiter" | "viewer"
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
    Enums: {
      app_role: ["admin", "recruiter", "viewer"],
    },
  },
} as const
