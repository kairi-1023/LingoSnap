import { AILessonEntity, AILessonVocabularyEntity } from '../entities/AILesson';

export interface IAILessonRepository {
  getLessons(userId?: string, limit?: number, offset?: number): Promise<AILessonEntity[]>;
  getLessonById(lessonId: string): Promise<AILessonEntity | null>;
  getLessonVocabularies(lessonId: string): Promise<AILessonVocabularyEntity[]>;
  createLesson(lesson: Omit<AILessonEntity, 'id' | 'createdAt'>): Promise<AILessonEntity>;
  addVocabularyToLesson(
    lessonId: string,
    vocabularyId: string,
    displayOrder?: number,
    boundingBox?: Record<string, any>
  ): Promise<AILessonVocabularyEntity>;
  markLessonComplete(lessonId: string): Promise<void>;
}
