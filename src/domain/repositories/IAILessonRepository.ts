import { AILessonEntity, AILessonVocabularyEntity } from '../entities/AILesson';

export interface IAILessonRepository {
  getLessons(userId?: string, limit?: number, offset?: number): Promise<AILessonEntity[]>;
  getLessonById(lessonId: string): Promise<AILessonEntity | null>;
  getLessonVocabularies(lessonId: string): Promise<AILessonVocabularyEntity[]>;
}
