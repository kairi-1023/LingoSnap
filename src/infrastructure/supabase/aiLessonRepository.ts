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
    displayOrder: row.display_order ?? 0,
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
      const lessons = data.map(mapRowToLessonEntity);
      const { data: linkedVocabularies, error: linkError } = await supabase
        .from('study_vocabularies')
        .select('lesson_id, word_en, concept_code, created_at')
        .order('created_at', { ascending: true })
        .not('lesson_id', 'is', null);

      // Keep the lesson list usable if the vocabulary metadata query fails.
      if (linkError || !linkedVocabularies) return lessons;

      const linkedLessonIds = new Set<string>();
      const representativeWords = new Map<string, string>();
      linkedVocabularies.forEach((row: any) => {
        if (!row.lesson_id) return;
        linkedLessonIds.add(row.lesson_id);
        if (!representativeWords.has(row.lesson_id)) {
          representativeWords.set(row.lesson_id, row.word_en || row.concept_code);
        }
      });

      return lessons.filter(
        (lesson) => linkedLessonIds.has(lesson.id) && lesson.id !== '11111111-1111-1111-1111-111111111111'
      ).map((lesson) => ({
        ...lesson,
        representativeWord: representativeWords.get(lesson.id) || null,
      }));
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

      // Fill incomplete lesson links from the real vocabulary category.
      const targetCategory = LESSON_CATEGORY_MAP[lessonId];
      let combinedRows: any[] = vocabErr ? [] : [...(vocabRows || [])];
      if (targetCategory) {
        const { data: catRows } = await supabase
          .from('study_vocabularies')
          .select('*')
          .eq('category', targetCategory)
          .limit(10);

        if (catRows && catRows.length > 0) {
          const existingIds = new Set(combinedRows.map((row) => row.id));
          combinedRows = [
            ...combinedRows,
            ...catRows.filter((row: any) => !existingIds.has(row.id)),
          ].slice(0, 10);

          const idsToLink = combinedRows.map((row: any) => row.id);
          void supabase
            .from('study_vocabularies')
            .update({ lesson_id: lessonId })
            .in('id', idsToLink)
            .then(() => {});
        }
      }

      return combinedRows.map((row: any, index: number) => ({
          id: `${lessonId}_${row.id}`,
          lessonId,
          vocabularyId: row.id,
          displayOrder: index + 1,
          boundingBox: null,
          createdAt: row.created_at || new Date().toISOString(),
          vocabulary: mapRowToVocabularyEntity(row),
        }));
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
        image_url: lesson.imageUrl || '',
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
       displayOrder,
      boundingBox: boundingBox || null,
      createdAt: data.created_at || new Date().toISOString(),
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
