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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      ai_lessons: {
        Row: {
          ai_caption: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          description_en: string | null
          description_ko: string | null
          description_tl: string | null
          id: string
          image_url: string
          title: string | null
          title_en: string | null
          title_ko: string | null
          title_tl: string | null
          user_id: string | null
        }
        Insert: {
          ai_caption?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ko?: string | null
          description_tl?: string | null
          id?: string
          image_url: string
          title?: string | null
          title_en?: string | null
          title_ko?: string | null
          title_tl?: string | null
          user_id?: string | null
        }
        Update: {
          ai_caption?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          description_ko?: string | null
          description_tl?: string | null
          id?: string
          image_url?: string
          title?: string | null
          title_en?: string | null
          title_ko?: string | null
          title_tl?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          options: Json
          question_text: string
          quiz_id: string
          type: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          options: Json
          question_text: string
          quiz_id: string
          type: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          options?: Json
          question_text?: string
          quiz_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "ai_quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_quizzes: {
        Row: {
          created_at: string
          id: string
          lesson_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lesson_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lesson_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "ai_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_review_items: {
        Row: {
          created_at: string
          id: string
          last_reviewed_at: string | null
          next_review_at: string
          review_count: number
          srs_stage: number
          user_id: string
          vocabulary_id: string
          wrong_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_reviewed_at?: string | null
          next_review_at: string
          review_count?: number
          srs_stage?: number
          user_id: string
          vocabulary_id: string
          wrong_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string
          review_count?: number
          srs_stage?: number
          user_id?: string
          vocabulary_id?: string
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_review_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_user_progress: {
        Row: {
          current_streak: number
          last_study_at: string | null
          total_learned_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak?: number
          last_study_at?: string | null
          total_learned_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak?: number
          last_study_at?: string | null
          total_learned_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_words: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          word_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          word_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          word_id?: string
        }
        Relationships: []
      }
      study_logs: {
        Row: {
          completed_at: string | null
          concept_ids: Json | null
          couple_id: string | null
          created_at: string | null
          id: string
          local_date: string
          user_id: string
          xp_gained: number | null
        }
        Insert: {
          completed_at?: string | null
          concept_ids?: Json | null
          couple_id?: string | null
          created_at?: string | null
          id?: string
          local_date: string
          user_id: string
          xp_gained?: number | null
        }
        Update: {
          completed_at?: string | null
          concept_ids?: Json | null
          couple_id?: string | null
          created_at?: string | null
          id?: string
          local_date?: string
          user_id?: string
          xp_gained?: number | null
        }
        Relationships: []
      }
      study_vocabularies: {
        Row: {
          category: string
          concept_code: string
          created_at: string | null
          difficulty_level: string
          example_en: string | null
          example_ko: string | null
          example_tl: string | null
          id: string
          image_source: string | null
          lesson_id: string | null
          phonetic_en: string | null
          phonetic_ko: string | null
          phonetic_tl: string | null
          tts_audio_url: string | null
          word_en: string | null
          word_ko: string | null
          word_tl: string | null
        }
        Insert: {
          category?: string
          concept_code: string
          created_at?: string | null
          difficulty_level?: string
          example_en?: string | null
          example_ko?: string | null
          example_tl?: string | null
          id?: string
          image_source?: string | null
          lesson_id?: string | null
          phonetic_en?: string | null
          phonetic_ko?: string | null
          phonetic_tl?: string | null
          tts_audio_url?: string | null
          word_en?: string | null
          word_ko?: string | null
          word_tl?: string | null
        }
        Update: {
          category?: string
          concept_code?: string
          created_at?: string | null
          difficulty_level?: string
          example_en?: string | null
          example_ko?: string | null
          example_tl?: string | null
          id?: string
          image_source?: string | null
          lesson_id?: string | null
          phonetic_en?: string | null
          phonetic_ko?: string | null
          phonetic_tl?: string | null
          tts_audio_url?: string | null
          word_en?: string | null
          word_ko?: string | null
          word_tl?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_vocabularies_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "ai_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          couple_id: string | null
          created_at: string | null
          current_streak: number | null
          freeze_count: number | null
          id: string
          last_freeze_used_at: string | null
          last_study_date: string | null
          updated_at: string | null
          user_id: string | null
          user1_completed_today: boolean | null
          user2_completed_today: boolean | null
        }
        Insert: {
          couple_id?: string | null
          created_at?: string | null
          current_streak?: number | null
          freeze_count?: number | null
          id?: string
          last_freeze_used_at?: string | null
          last_study_date?: string | null
          updated_at?: string | null
          user_id?: string | null
          user1_completed_today?: boolean | null
          user2_completed_today?: boolean | null
        }
        Update: {
          couple_id?: string | null
          created_at?: string | null
          current_streak?: number | null
          freeze_count?: number | null
          id?: string
          last_freeze_used_at?: string | null
          last_study_date?: string | null
          updated_at?: string | null
          user_id?: string | null
          user1_completed_today?: boolean | null
          user2_completed_today?: boolean | null
        }
        Relationships: []
      }
      user_studied_words: {
        Row: {
          concept_id: string | null
          created_at: string | null
          id: string
          last_reviewed_at: string | null
          next_review_at: string | null
          review_count: number | null
          srs_stage: number | null
          updated_at: string | null
          user_id: string
          wrong_count: number | null
        }
        Insert: {
          concept_id?: string | null
          created_at?: string | null
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string | null
          review_count?: number | null
          srs_stage?: number | null
          updated_at?: string | null
          user_id: string
          wrong_count?: number | null
        }
        Update: {
          concept_id?: string | null
          created_at?: string | null
          id?: string
          last_reviewed_at?: string | null
          next_review_at?: string | null
          review_count?: number | null
          srs_stage?: number | null
          updated_at?: string | null
          user_id?: string
          wrong_count?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_couple_id: string | null
          display_name: string | null
          email: string
          id: string
          native_lang: string
          push_token: string | null
          target_lang: string
          updated_at: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_couple_id?: string | null
          display_name?: string | null
          email: string
          id: string
          native_lang?: string
          push_token?: string | null
          target_lang?: string
          updated_at?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_couple_id?: string | null
          display_name?: string | null
          email?: string
          id?: string
          native_lang?: string
          push_token?: string | null
          target_lang?: string
          updated_at?: string | null
          xp?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      postgres_fdw_disconnect: { Args: { "": string }; Returns: boolean }
      postgres_fdw_disconnect_all: { Args: never; Returns: boolean }
      postgres_fdw_get_connections: {
        Args: never
        Returns: Record<string, unknown>[]
      }
      postgres_fdw_handler: { Args: never; Returns: unknown }
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
