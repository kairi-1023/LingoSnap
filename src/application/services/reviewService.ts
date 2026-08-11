import { IAIReviewRepository, SrsReviewRating } from '../../domain/repositories/IAIReviewRepository';
import { AIReviewItemEntity } from '../../domain/entities/AIReviewItem';
import { aiReviewRepository } from '../../infrastructure/supabase/aiReviewRepository';

export class ReviewService {
  constructor(private readonly reviewRepo: IAIReviewRepository = aiReviewRepository) {}

  async getDueReviewItems(userId: string, limit?: number): Promise<AIReviewItemEntity[]> {
    return this.reviewRepo.getDueReviewItems(userId, limit);
  }

  async getReviewItem(userId: string, vocabularyId: string): Promise<AIReviewItemEntity | null> {
    return this.reviewRepo.getReviewItem(userId, vocabularyId);
  }

  async upsertReviewItem(userId: string, vocabularyId: string, rating: SrsReviewRating): Promise<AIReviewItemEntity> {
    return this.reviewRepo.upsertReviewItem(userId, vocabularyId, rating);
  }

  async getUserReviewStats(userId: string): Promise<{ total: number; dueToday: number; mastered: number }> {
    return this.reviewRepo.getUserReviewStats(userId);
  }
}

export const reviewService = new ReviewService();
