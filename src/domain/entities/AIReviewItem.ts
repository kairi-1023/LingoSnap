import { VocabularyEntity } from './Vocabulary';

export interface AIReviewItemEntity {
  id: string;
  userId: string;
  vocabularyId: string;
  srsStage: number;
  nextReviewAt: string;
  lastReviewedAt: string | null;
  correctCount: number;
  wrongCount: number;
  createdAt: string;
  vocabulary?: VocabularyEntity;
}
