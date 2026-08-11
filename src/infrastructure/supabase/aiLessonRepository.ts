import { IAILessonRepository } from '../../domain/repositories/IAILessonRepository';
import { AILessonEntity, AILessonVocabularyEntity } from '../../domain/entities/AILesson';
import { mapRowToVocabularyEntity } from './vocabularyRepository';
import { supabase } from './client';
import { Database } from '../../types/database.types';
import { VocabularyEntity } from '../../domain/entities/Vocabulary';
import { buildTtsAudioUrlJson } from '../../shared/utils/ttsStorage';

type LessonRow = Database['public']['Tables']['ai_lessons']['Row'];

function mapRowToLessonEntity(row: any): AILessonEntity {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    description: row.description,
    titleKo: row.title_ko || row.title,
    titleEn: row.title_en || row.title,
    descriptionKo: row.description_ko || row.description,
    descriptionEn: row.description_en || row.description,
    imageUrl: row.image_url,
    aiCaption: row.ai_caption,
    createdAt: row.created_at,
    completedAt: row.completed_at,
  };
}

const LESSON_CATEGORY_MAP: Record<string, string> = {
  'c0000000-0000-0000-0000-000000000001': 'greetings',
  'c0000000-0000-0000-0000-000000000002': 'family',
  'c0000000-0000-0000-0000-000000000003': 'home',
  'c0000000-0000-0000-0000-000000000004': 'food',
  'c0000000-0000-0000-0000-000000000005': 'actions',
  '11111111-1111-1111-1111-111111111111': 'actions',
  'c0000000-0000-0000-0000-000000000006': 'animals',
  'c0000000-0000-0000-0000-000000000007': 'colors',
  'c0000000-0000-0000-0000-000000000008': 'places',
  'c0000000-0000-0000-0000-000000000009': 'travel',
  'c0000000-0000-0000-0000-000000000010': 'feelings',
};

export class AILessonRepository implements IAILessonRepository {
  async getLessons(userId?: string, limit = 20, offset = 0): Promise<AILessonEntity[]> {
    try {
      const isRealUser = userId && userId !== 'guest_user' && userId.includes('-');
      let query = supabase
        .from('ai_lessons')
        .select('*')
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (isRealUser) {
        query = query.or(`user_id.is.null,user_id.eq.${userId}`);
      } else {
        query = query.is('user_id', null);
      }

      const { data, error } = await query;
      if (error || !data) {
        return [];
      }
      return data.map(mapRowToLessonEntity);
    } catch {
      return [];
    }
  }

  async getLessonById(lessonId: string): Promise<AILessonEntity | null> {
    const { data, error } = await supabase
      .from('ai_lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error || !data) return null;
    return mapRowToLessonEntity(data);
  }

  async getLessonVocabularies(lessonId: string): Promise<AILessonVocabularyEntity[]> {
    try {
      // 1. Direct 1:N query on study_vocabularies by lesson_id (sorted by created_at)
      const { data: vocabRows, error: vocabErr } = await supabase
        .from('study_vocabularies')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('created_at', { ascending: true });

      if (!vocabErr && vocabRows && vocabRows.length > 0) {
        return vocabRows.map((row: any, index: number) => ({
          id: `${lessonId}_${row.id}`,
          lessonId,
          vocabularyId: row.id,
          displayOrder: index + 1,
          boundingBox: null,
          createdAt: row.created_at || new Date().toISOString(),
          vocabulary: mapRowToVocabularyEntity(row),
        }));
      }

      // 2. Smart Subject-based Category Fallback
      const targetCategory = LESSON_CATEGORY_MAP[lessonId];
      if (targetCategory) {
        const { data: catRows } = await supabase
          .from('study_vocabularies')
          .select('*')
          .eq('category', targetCategory)
          .limit(10);

        if (catRows && catRows.length > 0) {
          // Auto-heal: Link lesson_id in background
          const idsToLink = catRows.map((r: any) => r.id);
          supabase
            .from('study_vocabularies')
            .update({ lesson_id: lessonId })
            .in('id', idsToLink)
            .then(() => {})
            .catch(() => {});

          return catRows.map((row: any, index: number) => ({
            id: `${lessonId}_${row.id}`,
            lessonId,
            vocabularyId: row.id,
            displayOrder: index + 1,
            boundingBox: null,
            createdAt: row.created_at || new Date().toISOString(),
            vocabulary: mapRowToVocabularyEntity(row),
          }));
        }
      }

      // 3. Dynamic Title Analysis Fallback
      let detectedCategory: string | null = null;
      try {
        const { data: lessonData } = await supabase
          .from('ai_lessons')
          .select('title, title_ko, title_en, description')
          .eq('id', lessonId)
          .single();

        if (lessonData) {
          const text = `${lessonData.title || ''} ${lessonData.title_ko || ''} ${lessonData.title_en || ''} ${lessonData.description || ''}`.toLowerCase();
          if (text.includes('가족') || text.includes('family')) detectedCategory = 'family';
          else if (text.includes('음식') || text.includes('food')) detectedCategory = 'food';
          else if (text.includes('행동') || text.includes('action')) detectedCategory = 'actions';
          else if (text.includes('동물') || text.includes('animal')) detectedCategory = 'animals';
          else if (text.includes('색깔') || text.includes('color')) detectedCategory = 'colors';
          else if (text.includes('장소') || text.includes('place')) detectedCategory = 'places';
          else if (text.includes('여행') || text.includes('travel')) detectedCategory = 'travel';
          else if (text.includes('집') || text.includes('home')) detectedCategory = 'home';
          else if (text.includes('인사') || text.includes('greeting')) detectedCategory = 'greetings';
          else if (text.includes('감정') || text.includes('feeling')) detectedCategory = 'feelings';
        }
      } catch (_e) {}

      if (detectedCategory) {
        const { data: dynRows } = await supabase
          .from('study_vocabularies')
          .select('*')
          .eq('category', detectedCategory)
          .limit(10);

        if (dynRows && dynRows.length > 0) {
          return dynRows.map((row: any, index: number) => ({
            id: `${lessonId}_${row.id}`,
            lessonId,
            vocabularyId: row.id,
            displayOrder: index + 1,
            boundingBox: null,
            createdAt: row.created_at || new Date().toISOString(),
            vocabulary: mapRowToVocabularyEntity(row),
          }));
        }
      }

      // 4. Guaranteed Table Fallback: Return any available 10 vocabularies from study_vocabularies
      const { data: guaranteedRows } = await supabase
        .from('study_vocabularies')
        .select('*')
        .limit(10);

      if (guaranteedRows && guaranteedRows.length > 0) {
        return guaranteedRows.map((row: any, index: number) => ({
          id: `${lessonId}_${row.id}`,
          lessonId,
          vocabularyId: row.id,
          displayOrder: index + 1,
          boundingBox: null,
          createdAt: row.created_at || new Date().toISOString(),
          vocabulary: mapRowToVocabularyEntity(row),
        }));
      }

      return [];
    } catch (err) {
      console.warn('[aiLessonRepository] getLessonVocabularies error:', err);
      return [];
    }
  }

  async createLesson(lesson: Omit<AILessonEntity, 'id' | 'createdAt'>): Promise<AILessonEntity> {
    const { data, error } = await supabase
      .from('ai_lessons')
      .insert({
        user_id: lesson.userId,
        title: lesson.title,
        description: lesson.description,
        image_url: lesson.imageUrl,
        ai_caption: lesson.aiCaption,
        completed_at: lesson.completedAt,
      })
      .select()
      .single();

    if (error || !data) throw new Error(`Failed to create lesson: ${error?.message}`);
    return mapRowToLessonEntity(data);
  }

  async addVocabularyToLesson(
    lessonId: string,
    vocabularyId: string,
    displayOrder = 0,
    boundingBox?: Record<string, any>
  ): Promise<AILessonVocabularyEntity> {
    // 1:N Direct linkage: update study_vocabularies.lesson_id
    const { data, error } = await supabase
      .from('study_vocabularies')
      .update({
        lesson_id: lessonId,
        display_order: displayOrder,
      })
      .eq('id', vocabularyId)
      .select()
      .single();

    if (error || !data) throw new Error(`Failed to add vocabulary to lesson: ${error?.message}`);

    const vocabEntity = mapRowToVocabularyEntity(data);
    return {
      id: `${lessonId}_${data.id}`,
      lessonId,
      vocabularyId: data.id,
      displayOrder: data.display_order || displayOrder,
      boundingBox: boundingBox || null,
      createdAt: data.created_at,
      vocabulary: vocabEntity,
    };
  }

  async markLessonComplete(lessonId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_lessons')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', lessonId);

    if (error) throw new Error(`Failed to mark lesson complete: ${error.message}`);
  }
}

export const aiLessonRepository = new AILessonRepository();
