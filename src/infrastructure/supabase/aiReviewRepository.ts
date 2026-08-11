import { IAIReviewRepository, SrsReviewRating } from '../../domain/repositories/IAIReviewRepository';
import { AIReviewItemEntity } from '../../domain/entities/AIReviewItem';
import { mapRowToVocabularyEntity } from './vocabularyRepository';
import { supabase } from './client';
import { Database } from '../../types/database.types';

const SRS_INTERVAL_DAYS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

function calculateNextReviewDate(currentStage: number, rating: SrsReviewRating): { newStage: number; nextDate: Date } {
  let newStage = currentStage;
  if (rating === 'easy') {
    newStage = Math.min(currentStage + 1, 5);
  } else if (rating === 'forgot') {
    newStage = 1;
  }

  const daysToAdd = SRS_INTERVAL_DAYS[newStage] || 1;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + daysToAdd);

  return { newStage, nextDate };
}

function mapRowToReviewEntity(row: any): AIReviewItemEntity {
  return {
    id: row.id,
    userId: row.user_id,
    vocabularyId: row.vocabulary_id,
    srsStage: row.srs_stage,
    nextReviewAt: row.next_review_at,
    lastReviewedAt: row.last_reviewed_at,
    correctCount: row.correct_count,
    wrongCount: row.wrong_count,
    createdAt: row.created_at,
    vocabulary: row.study_vocabularies ? mapRowToVocabularyEntity(row.study_vocabularies) : undefined,
  };
}

function isValidUuid(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  if (id.startsWith('b1000000') || id.startsWith('guest')) return false;
  const rawId = id.includes('_') ? id.split('_').pop() || id : id;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
}

let isReviewTableAvailable = true;

export class AIReviewRepository implements IAIReviewRepository {
  async getDueReviewItems(userId: string, limit = 20): Promise<AIReviewItemEntity[]> {
    if (!isReviewTableAvailable || !isValidUuid(userId)) return [];
    const now = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from('ai_review_items')
        .select('*')
        .eq('user_id', userId)
        .lte('next_review_at', now)
        .order('next_review_at', { ascending: true })
        .limit(limit);

      if (error) {
        isReviewTableAvailable = false;
        return [];
      }
      if (!data) return [];
      return data.map(mapRowToReviewEntity);
    } catch (err) {
      isReviewTableAvailable = false;
      return [];
    }
  }

  async getReviewItem(userId: string, vocabularyId: string): Promise<AIReviewItemEntity | null> {
    if (!isReviewTableAvailable || !isValidUuid(userId) || !isValidUuid(vocabularyId)) return null;
    const targetVocabId = vocabularyId.includes('_') ? vocabularyId.split('_').pop() || vocabularyId : vocabularyId;
    try {
      const { data, error } = await supabase
        .from('ai_review_items')
        .select('*')
        .eq('user_id', userId)
        .eq('vocabulary_id', targetVocabId)
        .maybeSingle();

      if (error) {
        return null;
      }
      if (!data) return null;
      return mapRowToReviewEntity(data);
    } catch (err) {
      return null;
    }
  }

  async upsertReviewItem(userId: string, vocabularyId: string, rating: SrsReviewRating): Promise<AIReviewItemEntity> {
    const now = new Date().toISOString();
    const targetVocabId = vocabularyId.includes('_') ? vocabularyId.split('_').pop() || vocabularyId : vocabularyId;
    if (isReviewTableAvailable && isValidUuid(userId) && isValidUuid(targetVocabId)) {
      try {
        const existing = await this.getReviewItem(userId, targetVocabId);
        const currentStage = existing?.srsStage || 1;
        const { newStage, nextDate } = calculateNextReviewDate(currentStage, rating);

        const isCorrect = rating === 'easy' || rating === 'hard';
        const correctCount = (existing?.correctCount || 0) + (isCorrect ? 1 : 0);
        const wrongCount = (existing?.wrongCount || 0) + (!isCorrect ? 1 : 0);

        const payload = {
          user_id: userId,
          vocabulary_id: targetVocabId,
          srs_stage: newStage,
          next_review_at: nextDate.toISOString(),
          last_reviewed_at: now,
          correct_count: correctCount,
          wrong_count: wrongCount,
        };

        if (existing) {
          const { data, error } = await supabase
            .from('ai_review_items')
            .update(payload)
            .eq('user_id', userId)
            .eq('vocabulary_id', targetVocabId)
            .select()
            .maybeSingle();

          if (!error && data) return mapRowToReviewEntity(data);
        } else {
          const { data, error } = await supabase
            .from('ai_review_items')
            .insert(payload)
            .select()
            .maybeSingle();

          if (!error && data) return mapRowToReviewEntity(data);
          if (error && error.code === '23505') {
            const { data: updateData } = await supabase
              .from('ai_review_items')
              .update(payload)
              .eq('user_id', userId)
              .eq('vocabulary_id', targetVocabId)
              .select()
              .maybeSingle();
            if (updateData) return mapRowToReviewEntity(updateData);
          }
        }
      } catch (err) {
        console.warn('[aiReviewRepository] upsert error:', err);
      }
    }

    return {
      id: `rev_${Date.now()}`,
      userId,
      vocabularyId,
      srsStage: rating === 'easy' ? 2 : 1,
      nextReviewAt: new Date(Date.now() + 86400000).toISOString(),
      lastReviewedAt: now,
      correctCount: rating === 'easy' ? 1 : 0,
      wrongCount: rating === 'forgot' ? 1 : 0,
      createdAt: now,
    };
  }

  async getUserReviewStats(userId: string): Promise<{ total: number; dueToday: number; mastered: number }> {
    if (!isReviewTableAvailable || !isValidUuid(userId)) return { total: 0, dueToday: 0, mastered: 0 };
    const now = new Date().toISOString();
    try {
      const { data, error } = await supabase
        .from('ai_review_items')
        .select('srs_stage, next_review_at')
        .eq('user_id', userId);

      if (error) {
        isReviewTableAvailable = false;
        return { total: 0, dueToday: 0, mastered: 0 };
      }
      if (!data) return { total: 0, dueToday: 0, mastered: 0 };

      const total = data.length;
      const dueToday = data.filter((item) => new Date(item.next_review_at) <= new Date(now)).length;
      const mastered = data.filter((item) => item.srs_stage >= 5).length;

      return { total, dueToday, mastered };
    } catch (err) {
      isReviewTableAvailable = false;
      return { total: 0, dueToday: 0, mastered: 0 };
    }
  }
}

export const aiReviewRepository = new AIReviewRepository();
