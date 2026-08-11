import { IAIQuizRepository } from '../../domain/repositories/IAIQuizRepository';
import { AIQuizEntity, AIQuizQuestionEntity, QuizQuestionType } from '../../domain/entities/AIQuiz';
import { supabase } from './client';
import { Database } from '../../types/database.types';

type QuizRow = Database['public']['Tables']['ai_quizzes']['Row'];
type QuizQuestionRow = Database['public']['Tables']['ai_quiz_questions']['Row'];

function mapRowToQuizEntity(row: QuizRow): AIQuizEntity {
  return {
    id: row.id,
    lessonId: row.lesson_id,
    userId: row.user_id,
    score: row.score,
    completed: row.completed,
    createdAt: row.created_at,
  };
}

function mapRowToQuestionEntity(row: QuizQuestionRow): AIQuizQuestionEntity {
  return {
    id: row.id,
    quizId: row.quiz_id,
    questionType: row.question_type as QuizQuestionType,
    questionText: row.question_text,
    questionData: row.question_data as Record<string, any> | null,
    options: row.options as any[] | null,
    correctAnswer: row.correct_answer,
    createdAt: row.created_at,
  };
}

let isQuizTableAvailable = true;

export class AIQuizRepository implements IAIQuizRepository {
  async createQuiz(quiz: Omit<AIQuizEntity, 'id' | 'createdAt'>): Promise<AIQuizEntity> {
    if (!isQuizTableAvailable) {
      return {
        id: `quiz_${Date.now()}`,
        lessonId: quiz.lessonId,
        userId: quiz.userId,
        score: quiz.score,
        completed: quiz.completed,
        createdAt: new Date().toISOString(),
      };
    }

    try {
      const { data, error } = await supabase
        .from('ai_quizzes')
        .insert({
          lesson_id: quiz.lessonId,
          user_id: quiz.userId,
          score: quiz.score,
          completed: quiz.completed,
        })
        .select()
        .single();

      if (error || !data) {
        isQuizTableAvailable = false;
        return {
          id: `quiz_${Date.now()}`,
          lessonId: quiz.lessonId,
          userId: quiz.userId,
          score: quiz.score,
          completed: quiz.completed,
          createdAt: new Date().toISOString(),
        };
      }
      return mapRowToQuizEntity(data);
    } catch (err) {
      isQuizTableAvailable = false;
      return {
        id: `quiz_${Date.now()}`,
        lessonId: quiz.lessonId,
        userId: quiz.userId,
        score: quiz.score,
        completed: quiz.completed,
        createdAt: new Date().toISOString(),
      };
    }
  }

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

  async addQuizQuestion(question: Omit<AIQuizQuestionEntity, 'id' | 'createdAt'>): Promise<AIQuizQuestionEntity> {
    const { data, error } = await supabase
      .from('ai_quiz_questions')
      .insert({
        quiz_id: question.quizId,
        question_type: question.questionType,
        question_text: question.questionText,
        question_data: question.questionData,
        options: question.options,
        correct_answer: question.correctAnswer,
      })
      .select()
      .single();

    if (error || !data) throw new Error(`Failed to add quiz question: ${error?.message}`);
    return mapRowToQuestionEntity(data);
  }

  async submitQuizScore(quizId: string, score: number): Promise<void> {
    try {
      await supabase
        .from('ai_quizzes')
        .update({
          score,
          completed: true,
        })
        .eq('id', quizId);
    } catch (err) {
      // Ignore DB error for offline/synthetic quizzes
    }
  }
}

export const aiQuizRepository = new AIQuizRepository();
