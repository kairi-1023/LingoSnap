import { WordEntity } from '../entities/Word';
import { CategoryId } from '../../shared/constants/categories';

export interface StudyCompletionResult {
  xpGained: number;
}

export type SrsRating = 'forgot' | 'hard' | 'easy';

export interface IStudyRepository {
  getTodayWords(nativeLang?: string, targetLang?: string, category?: CategoryId | string, userId?: string): Promise<WordEntity[]>;
  getDueReviewWords(userId: string, nativeLang?: string, targetLang?: string): Promise<WordEntity[]>;
  getTodayStudiedWords(userId: string, nativeLang?: string, targetLang?: string): Promise<WordEntity[]>;
  getStudiedWords(userId: string, nativeLang?: string, targetLang?: string, offset?: number, limit?: number): Promise<WordEntity[]>;
  getAllVocabulary(nativeLang?: string, targetLang?: string, offset?: number, limit?: number): Promise<WordEntity[]>;
  markWordsAsStudied(userId: string, conceptIds: string[]): Promise<void>;
  saveStudyCompletion(userId: string, xp: number, conceptIds?: string[]): Promise<StudyCompletionResult>;
  checkTodayStudyLog(userId: string): Promise<{ isCompleted: boolean; xpEarned: number }>;
  getFavoriteWords(userId: string, nativeLang?: string, targetLang?: string): Promise<WordEntity[]>;
  toggleFavoriteWord(userId: string, wordId: string): Promise<boolean>;
  updateWordSrs(userId: string, conceptId: string, rating: SrsRating): Promise<void>;
}
