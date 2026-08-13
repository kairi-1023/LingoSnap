import { create } from 'zustand';
import { WordEntity } from '../../domain/entities/Word';

export interface QuizQuestion {
  word: WordEntity;
  type?: 'cloze' | 'meaning';
  options: string[];
  correctAnswer: string;
  scenarioQuestion?: string;
  translationHint?: string;
}

export interface StudyState {
  todayWords: WordEntity[];
  isCompleted: boolean;
  xpEarned: number;
  favoritesMap: Record<string, boolean>;
  
  setTodayWords: (words: WordEntity[]) => void;
  setCompleted: (xp: number) => void;
  resetSession: () => void;
  setFavoritesMap: (map: Record<string, boolean>) => void;
  setFavoriteStatus: (wordId: string, isFavorite: boolean) => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  todayWords: [],
  isCompleted: false,
  xpEarned: 0,
  favoritesMap: {},

  setTodayWords: (todayWords) => set({ todayWords }),
  setCompleted: (xpEarned) => set({ isCompleted: true, xpEarned }),
  resetSession: () => set({ isCompleted: false, xpEarned: 0 }),
  setFavoritesMap: (favoritesMap) => set({ favoritesMap }),
  setFavoriteStatus: (wordId, isFavorite) =>
    set((state) => ({
      favoritesMap: { ...state.favoritesMap, [wordId]: isFavorite },
    })),
}));
