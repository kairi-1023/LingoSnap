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
  currentIndex: number;
  currentQuizIndex: number;
  quizzes: QuizQuestion[];
  isCompleted: boolean;
  xpEarned: number;
  seenWordIds: string[];
  favoritesMap: Record<string, boolean>;
  
  setTodayWords: (words: WordEntity[]) => void;
  setQuizzes: (quizzes: QuizQuestion[]) => void;
  nextWord: () => void;
  nextQuiz: () => void;
  setCompleted: (xp: number) => void;
  resetSession: () => void;
  markWordsSeen: (ids: string[]) => void;
  setFavoritesMap: (map: Record<string, boolean>) => void;
  setFavoriteStatus: (wordId: string, isFavorite: boolean) => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  todayWords: [],
  currentIndex: 0,
  currentQuizIndex: 0,
  quizzes: [],
  isCompleted: false,
  xpEarned: 0,
  seenWordIds: [],
  favoritesMap: {},

  setTodayWords: (todayWords) =>
    set((state) => ({
      todayWords,
      currentIndex: 0,
      isCompleted: false,
      seenWordIds: Array.from(new Set([...state.seenWordIds, ...todayWords.map((w) => w.id)])).slice(-500),
    })),
  setQuizzes: (quizzes) => set({ quizzes, currentQuizIndex: 0 }),
  nextWord: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
  nextQuiz: () => set((state) => ({ currentQuizIndex: state.currentQuizIndex + 1 })),
  setCompleted: (xpEarned) => set({ isCompleted: true, xpEarned }),
  resetSession: () => set({ currentIndex: 0, currentQuizIndex: 0, isCompleted: false, xpEarned: 0 }),
  markWordsSeen: (ids) =>
    set((state) => ({
      seenWordIds: Array.from(new Set([...state.seenWordIds, ...ids])).slice(-500),
    })),
  setFavoritesMap: (favoritesMap) => set({ favoritesMap }),
  setFavoriteStatus: (wordId, isFavorite) =>
    set((state) => ({
      favoritesMap: { ...state.favoritesMap, [wordId]: isFavorite },
    })),
}));
