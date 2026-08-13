import { IAIQuizRepository } from '../../domain/repositories/IAIQuizRepository';
import { AIQuizEntity, AIQuizQuestionEntity, QuizQuestionType } from '../../domain/entities/AIQuiz';
import { supabase } from './client';

function mapRowToQuizEntity(row: any): AIQuizEntity {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    userId: row.user_id || '',
    score: row.score || 0,
    completed: row.completed ?? true,
    createdAt: row.created_at,
  };
}

function mapRowToQuestionEntity(row: any): AIQuizQuestionEntity {
  return {
    id: row.id,
    quizId: row.quiz_id,
    questionType: row.type as QuizQuestionType,
    questionText: row.question_text,
    questionData: null,
    options: row.options as any[] | null,
    correctAnswer: row.correct_answer,
    createdAt: row.created_at,
  };
}

export class AIQuizRepository implements IAIQuizRepository {
  async getQuizById(quizId: string): Promise<AIQuizEntity | null> {
    const { data, error } = await supabase
      .from('ai_quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (error || !data) return null;
    return mapRowToQuizEntity(data);
  }

  async getQuizQuestions(quizId: string): Promise<AIQuizQuestionEntity[]> {
    const { data, error } = await supabase
      .from('ai_quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return data.map(mapRowToQuestionEntity);
  }
}

export const aiQuizRepository = new AIQuizRepository();
