import { IAIQuizRepository } from '../../domain/repositories/IAIQuizRepository';
import { AIQuizEntity, AIQuizQuestionEntity } from '../../domain/entities/AIQuiz';
import { aiQuizRepository } from '../../infrastructure/supabase/aiQuizRepository';

export class QuizService {
  constructor(private readonly quizRepo: IAIQuizRepository = aiQuizRepository) {}

  async createQuiz(quiz: Omit<AIQuizEntity, 'id' | 'createdAt'>): Promise<AIQuizEntity> {
    return this.quizRepo.createQuiz(quiz);
  }

  async getQuizById(quizId: string): Promise<AIQuizEntity | null> {
    return this.quizRepo.getQuizById(quizId);
  }

  async getQuizQuestions(quizId: string): Promise<AIQuizQuestionEntity[]> {
    return this.quizRepo.getQuizQuestions(quizId);
  }

  async addQuizQuestion(question: Omit<AIQuizQuestionEntity, 'id' | 'createdAt'>): Promise<AIQuizQuestionEntity> {
    return this.quizRepo.addQuizQuestion(question);
  }

  async submitQuizScore(quizId: string, score: number): Promise<void> {
    return this.quizRepo.submitQuizScore(quizId, score);
  }
}

export const quizService = new QuizService();
