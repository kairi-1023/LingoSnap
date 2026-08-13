import { IAIQuizRepository } from '../../domain/repositories/IAIQuizRepository';
import { AIQuizEntity, AIQuizQuestionEntity } from '../../domain/entities/AIQuiz';
import { aiQuizRepository } from '../../infrastructure/supabase/aiQuizRepository';

export class QuizService {
  constructor(private readonly quizRepo: IAIQuizRepository = aiQuizRepository) {}

  async getQuizById(quizId: string): Promise<AIQuizEntity | null> {
    return this.quizRepo.getQuizById(quizId);
  }

  async getQuizQuestions(quizId: string): Promise<AIQuizQuestionEntity[]> {
    return this.quizRepo.getQuizQuestions(quizId);
  }
}

export const quizService = new QuizService();
