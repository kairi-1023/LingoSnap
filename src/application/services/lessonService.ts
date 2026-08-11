import { IAILessonRepository } from '../../domain/repositories/IAILessonRepository';
import { AILessonEntity, AILessonVocabularyEntity } from '../../domain/entities/AILesson';
import { aiLessonRepository } from '../../infrastructure/supabase/aiLessonRepository';

export class LessonService {
  constructor(private readonly lessonRepo: IAILessonRepository = aiLessonRepository) {}

  async getLessons(userId?: string, limit?: number, offset?: number): Promise<AILessonEntity[]> {
    return this.lessonRepo.getLessons(userId, limit, offset);
  }

  async getLessonById(lessonId: string): Promise<AILessonEntity | null> {
    return this.lessonRepo.getLessonById(lessonId);
  }

  async getLessonVocabularies(lessonId: string): Promise<AILessonVocabularyEntity[]> {
    return this.lessonRepo.getLessonVocabularies(lessonId);
  }

  async createLesson(lesson: Omit<AILessonEntity, 'id' | 'createdAt'>): Promise<AILessonEntity> {
    return this.lessonRepo.createLesson(lesson);
  }

  async addVocabularyToLesson(
    lessonId: string,
    vocabularyId: string,
    displayOrder?: number,
    boundingBox?: Record<string, any>
  ): Promise<AILessonVocabularyEntity> {
    return this.lessonRepo.addVocabularyToLesson(lessonId, vocabularyId, displayOrder, boundingBox);
  }

  async markLessonComplete(lessonId: string): Promise<void> {
    return this.lessonRepo.markLessonComplete(lessonId);
  }
}

export const lessonService = new LessonService();
