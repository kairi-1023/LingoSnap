export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          native_lang: string;
          target_lang: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          native_lang?: string;
          target_lang?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          native_lang?: string;
          target_lang?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      study_vocabularies: {
        Row: {
          id: string;
          lesson_id: string | null;
          display_order: number;
          concept_code: string;
          category: string;
          difficulty_level: string;
          word_en: string | null;
          word_ko: string | null;
          word_tl: string | null;
          word_th: string | null;
          word_vi: string | null;
          word_ja: string | null;
          example_en: string | null;
          example_ko: string | null;
          example_tl: string | null;
          example_th: string | null;
          example_vi: string | null;
          example_ja: string | null;
          phonetic_en: string | null;
          phonetic_ko: string | null;
          phonetic_tl: string | null;
          phonetic_th: string | null;
          phonetic_vi: string | null;
          phonetic_ja: string | null;
          image_url: string | null;
          image_source: 'manual' | 'generated' | 'external' | string | null;
          image_prompt: string | null;
          created_at: string | null;
          tts_audio_url: string | null;
        };
        Insert: {
          id?: string;
          lesson_id?: string | null;
          display_order?: number;
          concept_code: string;
          category?: string;
          difficulty_level?: string;
          word_en?: string | null;
          word_ko?: string | null;
          word_tl?: string | null;
          word_th?: string | null;
          word_vi?: string | null;
          word_ja?: string | null;
          example_en?: string | null;
          example_ko?: string | null;
          example_tl?: string | null;
          example_th?: string | null;
          example_vi?: string | null;
          example_ja?: string | null;
          phonetic_en?: string | null;
          phonetic_ko?: string | null;
          phonetic_tl?: string | null;
          phonetic_th?: string | null;
          phonetic_vi?: string | null;
          phonetic_ja?: string | null;
          image_url?: string | null;
          image_source?: 'manual' | 'generated' | 'external' | string | null;
          image_prompt?: string | null;
          created_at?: string | null;
          tts_audio_url?: string | null;
        };
        Update: {
          id?: string;
          lesson_id?: string | null;
          display_order?: number;
          concept_code?: string;
          category?: string;
          difficulty_level?: string;
          word_en?: string | null;
          word_ko?: string | null;
          word_tl?: string | null;
          word_th?: string | null;
          word_vi?: string | null;
          word_ja?: string | null;
          example_en?: string | null;
          example_ko?: string | null;
          example_tl?: string | null;
          example_th?: string | null;
          example_vi?: string | null;
          example_ja?: string | null;
          phonetic_en?: string | null;
          phonetic_ko?: string | null;
          phonetic_tl?: string | null;
          phonetic_th?: string | null;
          phonetic_vi?: string | null;
          phonetic_ja?: string | null;
          image_url?: string | null;
          image_source?: 'manual' | 'generated' | 'external' | string | null;
          image_prompt?: string | null;
          created_at?: string | null;
          tts_audio_url?: string | null;
        };
      };
      ai_lessons: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string | null;
          image_url: string | null;
          ai_caption: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string | null;
          image_url?: string | null;
          ai_caption?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          ai_caption?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      ai_lesson_vocabulary: {
        Row: {
          id: string;
          lesson_id: string;
          vocabulary_id: string;
          display_order: number;
          bounding_box: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          vocabulary_id: string;
          display_order?: number;
          bounding_box?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          vocabulary_id?: string;
          display_order?: number;
          bounding_box?: Json | null;
          created_at?: string;
        };
      };
      ai_quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          user_id: string;
          score: number;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          user_id: string;
          score?: number;
          completed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          user_id?: string;
          score?: number;
          completed?: boolean;
          created_at?: string;
        };
      };
      ai_quiz_questions: {
        Row: {
          id: string;
          quiz_id: string;
          question_type: string;
          question_text: string | null;
          question_data: Json | null;
          options: Json | null;
          correct_answer: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_id: string;
          question_type: string;
          question_text?: string | null;
          question_data?: Json | null;
          options?: Json | null;
          correct_answer: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_id?: string;
          question_type?: string;
          question_text?: string | null;
          question_data?: Json | null;
          options?: Json | null;
          correct_answer?: string;
          created_at?: string;
        };
      };
      ai_user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          completed_count: number;
          quiz_score: number;
          last_studied_at: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          completed_count?: number;
          quiz_score?: number;
          last_studied_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string | null;
          completed_count?: number;
          quiz_score?: number;
          last_studied_at?: string | null;
          updated_at?: string;
          created_at?: string;
        };
      };
      ai_review_items: {
        Row: {
          id: string;
          user_id: string;
          vocabulary_id: string;
          srs_stage: number;
          next_review_at: string;
          last_reviewed_at: string | null;
          correct_count: number;
          wrong_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          vocabulary_id: string;
          srs_stage?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          correct_count?: number;
          wrong_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          vocabulary_id?: string;
          srs_stage?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          correct_count?: number;
          wrong_count?: number;
          created_at?: string;
        };
      };
      user_studied_words: {
        Row: {
          id: string;
          user_id: string;
          concept_id: string;
          srs_stage: number;
          next_review_at: string;
          last_reviewed_at: string | null;
          review_count: number;
          wrong_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          concept_id: string;
          srs_stage?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          review_count?: number;
          wrong_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          concept_id?: string;
          srs_stage?: number;
          next_review_at?: string;
          last_reviewed_at?: string | null;
          review_count?: number;
          wrong_count?: number;
          created_at?: string;
        };
      };
      favorite_words: {
        Row: {
          user_id: string;
          word_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          word_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          word_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
