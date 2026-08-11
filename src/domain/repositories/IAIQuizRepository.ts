import { AIQuizEntity, AIQuizQuestionEntity } from '../entities/AIQuiz';

export interface IAIQuizRepository {
  createQuiz(quiz: Omit<AIQuizEntity, 'id' | 'createdAt'>): Promise<AIQuizEntity>;
  getQuizById(quizId: string): Promise<AIQuizEntity | null>;
  getQuizQuestions(quizId: string): Promise<AIQuizQuestionEntity[]>;
  addQuizQuestion(question: Omit<AIQuizQuestionEntity, 'id' | 'createdAt'>): Promise<AIQuizQuestionEntity>;
  submitQuizScore(quizId: string, score: number): Promise<void>;
}
