import { IVocabularyRepository } from '../../domain/repositories/IVocabularyRepository';
import { VocabularyEntity } from '../../domain/entities/Vocabulary';
import { vocabularyRepository } from '../../infrastructure/supabase/vocabularyRepository';

export class VocabularyService {
  constructor(private readonly vocabRepo: IVocabularyRepository = vocabularyRepository) {}

  async getVocabularyById(id: string): Promise<VocabularyEntity | null> {
    return this.vocabRepo.getVocabularyById(id);
  }

  async getVocabulariesByCategory(category: string, limit?: number, offset?: number): Promise<VocabularyEntity[]> {
    return this.vocabRepo.getVocabulariesByCategory(category, limit, offset);
  }

  async searchVocabularies(query: string, limit?: number): Promise<VocabularyEntity[]> {
    return this.vocabRepo.searchVocabularies(query, limit);
  }

  async getVocabulariesWithImages(limit?: number): Promise<VocabularyEntity[]> {
    return this.vocabRepo.getVocabulariesWithImages(limit);
  }
}

export const vocabularyService = new VocabularyService();
