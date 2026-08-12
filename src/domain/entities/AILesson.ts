import { VocabularyEntity } from './Vocabulary';

export interface AILessonEntity {
  id: string;
  userId: string | null;
  title: string;
  description: string | null;
  titleKo?: string | null;
  titleEn?: string | null;
  descriptionKo?: string | null;
  descriptionEn?: string | null;
  imageUrl: string | null;
  aiCaption: string | null;
  displayOrder: number;
  createdAt: string;
  completedAt: string | null;
}

export interface AILessonVocabularyEntity {
  id: string;
  lessonId: string;
  vocabularyId: string;
  displayOrder: number;
  boundingBox?: Record<string, any> | null;
  createdAt: string;
  vocabulary?: VocabularyEntity;
}
