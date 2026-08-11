export interface AIQuizEntity {
  id: string;
  lessonId: string;
  userId: string;
  score: number;
  completed: boolean;
  createdAt: string;
}

export type QuizQuestionType =
  | 'IMAGE_TO_WORD'
  | 'WORD_TO_IMAGE'
  | 'SENTENCE_COMPLETION'
  | 'image_to_word'
  | 'word_to_image'
  | 'cloze_sentence';

export interface AIQuizQuestionEntity {
  id: string;
  quizId: string;
  questionType: QuizQuestionType;
  questionText: string | null;
  questionData: Record<string, any> | null;
  options: any[] | null;
  correctAnswer: string;
  createdAt: string;
}
