import { AIQuizEntity, AIQuizQuestionEntity } from '../entities/AIQuiz';

export interface IAIQuizRepository {
  getQuizById(quizId: string): Promise<AIQuizEntity | null>;
  getQuizQuestions(quizId: string): Promise<AIQuizQuestionEntity[]>;
}
