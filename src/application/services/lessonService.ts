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
}

export const lessonService = new LessonService();
