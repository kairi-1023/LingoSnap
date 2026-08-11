import { VocabularyEntity } from '../entities/Vocabulary';

export interface IVocabularyRepository {
  getVocabularyById(id: string): Promise<VocabularyEntity | null>;
  getVocabulariesByCategory(category: string, limit?: number, offset?: number): Promise<VocabularyEntity[]>;
  getVocabulariesByLessonId?(lessonId: string): Promise<VocabularyEntity[]>;
  searchVocabularies(query: string, limit?: number): Promise<VocabularyEntity[]>;
  getVocabulariesWithImages(limit?: number): Promise<VocabularyEntity[]>;
}
