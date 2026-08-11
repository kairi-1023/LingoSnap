import { AIReviewItemEntity } from '../entities/AIReviewItem';

export type SrsReviewRating = 'forgot' | 'hard' | 'easy';

export interface IAIReviewRepository {
  getDueReviewItems(userId: string, limit?: number): Promise<AIReviewItemEntity[]>;
  getReviewItem(userId: string, vocabularyId: string): Promise<AIReviewItemEntity | null>;
  upsertReviewItem(userId: string, vocabularyId: string, rating: SrsReviewRating): Promise<AIReviewItemEntity>;
  getUserReviewStats(userId: string): Promise<{ total: number; dueToday: number; mastered: number }>;
}
