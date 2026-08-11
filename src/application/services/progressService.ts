import { IAIProgressRepository } from '../../domain/repositories/IAIProgressRepository';
import { AIProgressEntity } from '../../domain/entities/AIProgress';
import { aiProgressRepository } from '../../infrastructure/supabase/aiProgressRepository';

export class ProgressService {
  constructor(private readonly progressRepo: IAIProgressRepository = aiProgressRepository) {}

  async getUserProgress(userId: string, lessonId?: string): Promise<AIProgressEntity | null> {
    return this.progressRepo.getUserProgress(userId, lessonId);
  }

  async getAllProgress(userId: string): Promise<AIProgressEntity[]> {
    return this.progressRepo.getAllProgress(userId);
  }

  async updateLessonProgress(userId: string, lessonId: string, quizScore: number): Promise<AIProgressEntity> {
    return this.progressRepo.updateLessonProgress(userId, lessonId, quizScore);
  }

}

export const progressService = new ProgressService();
