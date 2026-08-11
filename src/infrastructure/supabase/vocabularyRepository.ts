import { IVocabularyRepository } from '../../domain/repositories/IVocabularyRepository';
import { VocabularyEntity } from '../../domain/entities/Vocabulary';
import { supabase } from './client';
import { Database } from '../../types/database.types';
import { buildTtsAudioUrlJson } from '../../shared/utils/ttsStorage';

type VocabularyRow = Database['public']['Tables']['study_vocabularies']['Row'];

export function mapRowToVocabularyEntity(row: VocabularyRow): VocabularyEntity {
  return {
    id: row.id,
    conceptCode: row.concept_code,
    category: row.category,
    difficultyLevel: row.difficulty_level,
    lessonId: (row as any).lesson_id || null,
    displayOrder: 0,
    wordEn: row.word_en,
    wordKo: row.word_ko,
    wordTl: row.word_tl,
    wordTh: row.word_th,
    wordVi: row.word_vi,
    wordJa: row.word_ja,
    exampleEn: row.example_en,
    exampleKo: row.example_ko,
    exampleTl: row.example_tl,
    exampleTh: row.example_th,
    exampleVi: row.example_vi,
    exampleJa: row.example_ja,
    phoneticEn: row.phonetic_en,
    phoneticKo: row.phonetic_ko,
    phoneticTl: row.phonetic_tl,
    phoneticTh: row.phonetic_th,
    phoneticVi: row.phonetic_vi,
    phoneticJa: row.phonetic_ja,
    imageUrl: (row as any).image_url || null,
    imageSource: (row as any).image_source || null,
    imagePrompt: (row as any).image_prompt || null,
    ttsAudioUrl: row.tts_audio_url || null,
    createdAt: row.created_at,
  };
}

export class VocabularyRepository implements IVocabularyRepository {
  async getVocabularyById(id: string): Promise<VocabularyEntity | null> {
    const { data, error } = await supabase
      .from('study_vocabularies')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapRowToVocabularyEntity(data);
  }

  async getVocabulariesByCategory(category: string, limit = 20, offset = 0): Promise<VocabularyEntity[]> {
    const { data, error } = await supabase
      .from('study_vocabularies')
      .select('*')
      .eq('category', category)
      .range(offset, offset + limit - 1);

    if (error || !data) return [];
    return data.map(mapRowToVocabularyEntity);
  }

  async getVocabulariesByLessonId(lessonId: string): Promise<VocabularyEntity[]> {
    const { data, error } = await supabase
      .from('study_vocabularies')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data.map(mapRowToVocabularyEntity);
  }

  async searchVocabularies(query: string, limit = 20): Promise<VocabularyEntity[]> {
    const { data, error } = await supabase
      .from('study_vocabularies')
      .select('*')
      .or(`word_en.ilike.%${query}%,word_ko.ilike.%${query}%,concept_code.ilike.%${query}%`)
      .limit(limit);

    if (error || !data) return [];
    return data.map(mapRowToVocabularyEntity);
  }

  async getVocabulariesWithImages(limit = 50): Promise<VocabularyEntity[]> {
    const { data, error } = await (supabase
      .from('study_vocabularies')
      .select('*') as any)
      .not('image_url', 'is', null)
      .limit(limit);

    if (error || !data) return [];
    return (data as any[]).map(mapRowToVocabularyEntity);
  }
}

export const vocabularyRepository = new VocabularyRepository();

