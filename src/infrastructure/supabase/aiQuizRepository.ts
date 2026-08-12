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
        type: question.questionType,
        question_text: question.questionText || '',
        options: question.options || [],
        correct_answer: question.correctAnswer,
      })
      .select()
      .single();

    if (error || !data) throw new Error(`Failed to add quiz question: ${error?.message}`);
    return mapRowToQuestionEntity(data);
  }

  async submitQuizScore(quizId: string, score: number): Promise<void> {
    // Scores are persisted in ai_user_progress because ai_quizzes only stores
    // the lesson/session relation in the current database schema.
    void quizId;
    void score;
  }
}

export const aiQuizRepository = new AIQuizRepository();
