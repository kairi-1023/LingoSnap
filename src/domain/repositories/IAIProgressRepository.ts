import { AIProgressEntity } from '../entities/AIProgress';

export interface IAIProgressRepository {
  getUserProgress(userId: string, lessonId?: string): Promise<AIProgressEntity | null>;
  getAllProgress(userId: string): Promise<AIProgressEntity[]>;
  updateLessonProgress(userId: string, lessonId: string, quizScore: number): Promise<AIProgressEntity>;
}
