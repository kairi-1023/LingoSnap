import { IAIProgressRepository } from '../../domain/repositories/IAIProgressRepository';
import { AIProgressEntity } from '../../domain/entities/AIProgress';
import { supabase } from './client';
import { Database } from '../../types/database.types';

type ProgressRow = Database['public']['Tables']['ai_user_progress']['Row'];

function mapRowToProgressEntity(row: ProgressRow): AIProgressEntity {
  return {
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id,
    completedCount: row.completed_count,
    quizScore: row.quiz_score,
    lastStudiedAt: row.last_studied_at,
    updatedAt: row.updated_at,
    createdAt: row.created_at,
  };
}

let isProgressTableAvailable = false;

export class AIProgressRepository implements IAIProgressRepository {
  async getUserProgress(userId: string, lessonId?: string): Promise<AIProgressEntity | null> {
    if (!isProgressTableAvailable) return null;
    try {
      let query = supabase
        .from('ai_user_progress')
        .select('*')
        .eq('user_id', userId);

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      } else {
        query = query.is('lesson_id', null);
      }

      const { data, error } = await query.single();
      if (error || !data) {
        if (error?.code === '42P01' || error?.status === 400) {
          isProgressTableAvailable = false;
        }
        return null;
      }
      return mapRowToProgressEntity(data);
    } catch (err) {
      isProgressTableAvailable = false;
      return null;
    }
  }

  async getAllProgress(userId: string): Promise<AIProgressEntity[]> {
    if (!isProgressTableAvailable) return [];
    try {
      const { data, error } = await supabase
        .from('ai_user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error || !data) return [];
      return data.map(mapRowToProgressEntity);
    } catch (err) {
      isProgressTableAvailable = false;
      return [];
    }
  }

  async updateLessonProgress(userId: string, lessonId: string, quizScore: number): Promise<AIProgressEntity> {
    const now = new Date().toISOString();
    if (isProgressTableAvailable) {
      try {
        const existing = await this.getUserProgress(userId, lessonId);
        const completedCount = (existing?.completedCount || 0) + 1;
        const bestScore = Math.max(existing?.quizScore || 0, quizScore);

        const { data, error } = await supabase
          .from('ai_user_progress')
          .upsert(
            {
              user_id: userId,
              lesson_id: lessonId,
              completed_count: completedCount,
              quiz_score: bestScore,
              last_studied_at: now,
              updated_at: now,
            },
            { onConflict: 'user_id,lesson_id' }
          )
          .select()
          .single();

        if (!error && data) return mapRowToProgressEntity(data);
        if (error) isProgressTableAvailable = false;
      } catch (err) {
        isProgressTableAvailable = false;
      }
    }

    return {
      id: `prog_${Date.now()}`,
      userId,
      lessonId,
      completedCount: 1,
      quizScore,
      lastStudiedAt: now,
      updatedAt: now,
      createdAt: now,
    };
  }
}

export const aiProgressRepository = new AIProgressRepository();
