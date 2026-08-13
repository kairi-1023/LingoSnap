import { studyRepository } from '../../infrastructure/supabase/studyRepository';
import { useStudyStore, QuizQuestion } from '../stores/useStudyStore';
import { WordEntity } from '../../domain/entities/Word';
import { SrsRating } from '../../domain/repositories/IStudyRepository';
import { useAuthStore } from '../stores/useAuthStore';
import { queryClient } from '../utils/queryClient';
import { shuffle } from '../utils/arrayUtils';
import { supabase } from '../../infrastructure/supabase/client';

export class StudyService {
  private finishSessionInProgress = false;
  private favoriteTogglesInProgress = new Set<string>();
  async fetchTodayStudy(nativeLang?: string, targetLang?: string, category?: string): Promise<WordEntity[]> {
    const sessionId = useAuthStore.getState().sessionId;
    const user = useAuthStore.getState().user;
    const resolvedNative = nativeLang || user?.nativeLang || 'ko';
    const resolvedTarget = targetLang || user?.targetLang || 'en';
    const resolvedCategory = category || 'all';

    let words: WordEntity[] = [];

    if (user?.id && user.id !== 'guest_user') {
      try {
        const todayStatus = await studyRepository.checkTodayStudyLog(user.id);
        if (todayStatus.isCompleted) {
          const studiedWords = await studyRepository.getTodayStudiedWords(user.id, resolvedNative, resolvedTarget);
          if (studiedWords && studiedWords.length > 0) {
            words = studiedWords.map((w) => ({ ...w, isReview: true }));
          }
        }
      } catch (err) {
        console.warn('[studyService] Failed to check today study status in fetchTodayStudy:', err);
      }
    }

    if (words.length === 0) {
      words = await studyRepository.getTodayWords(resolvedNative, resolvedTarget, resolvedCategory, user?.id);
    }

    if (useAuthStore.getState().sessionId !== sessionId) return words;
    useStudyStore.getState().setTodayWords(words);
    return words;
  }

  generateQuizzes(words: WordEntity[], _userFirstName = 'You'): QuizQuestion[] {
    if (!words || words.length === 0) return [];

    return words.map((word) => {
      const target = word.wordTarget.trim();
      const sentence = (word.exampleTarget || word.exampleSentence || '').trim();
      const nativeSentence = (word.exampleNative || '').trim();

      const hasValidExample = !!sentence && sentence.toLowerCase().includes(target.toLowerCase());

      if (hasValidExample) {
        const escapedTarget = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedTarget, 'gi');
        const maskedSentence = sentence.replace(regex, '___');

        const wrongTargets = words
          .filter((w) => w.id !== word.id && w.wordTarget.trim().toLowerCase() !== target.toLowerCase())
          .map((w) => w.wordTarget.trim())
          .filter(Boolean);

        const uniqueWrongTargets = Array.from(new Set(wrongTargets)).slice(0, 3);
        const options = shuffle([target, ...uniqueWrongTargets]);

        return {
          word,
          type: 'cloze',
          scenarioQuestion: maskedSentence,
          translationHint: nativeSentence ? nativeSentence : undefined,
          options,
          correctAnswer: target,
        };
      }

      // Meaning quiz fallback
      const wrongWords = words.filter((w) => w.id !== word.id);

      const optionItems = shuffle([
        { target: word.wordTarget, native: word.wordNative, phonetic: word.phonetic },
        ...wrongWords.slice(0, 3).map((w) => ({ target: w.wordTarget, native: w.wordNative, phonetic: w.phonetic })),
      ]);

      const formattedOptions = optionItems.map((opt) => opt.target);

      const correctAnswerFormatted = word.wordTarget;

      return {
        word,
        type: 'meaning',
        scenarioQuestion: word.wordNative,
        options: formattedOptions,
        correctAnswer: correctAnswerFormatted,
      };
    });
  }

  async finishStudySession(userId: string) {
    if (this.finishSessionInProgress) {
      console.log('[studyService] finishStudySession already in progress, skipping duplicate.');
      return;
    }
    this.finishSessionInProgress = true;
    try {
      const sessionId = useAuthStore.getState().sessionId;
      const todayWords = useStudyStore.getState().todayWords;
      const conceptIds = todayWords.map((w) => w.conceptId || w.id).filter(Boolean);
      if (todayWords.length > 0) {
        studyRepository.markWordsAsStudied(userId, todayWords.map((w) => w.id)).catch(() => {});
      }

      const result = await studyRepository.saveStudyCompletion(userId, 100, conceptIds);
      if (useAuthStore.getState().sessionId !== sessionId) return result;
      useStudyStore.getState().setCompleted(result.xpGained);

      queryClient.invalidateQueries({ queryKey: ['todayStudyStatus', userId] });
      return result;
    } finally {
      this.finishSessionInProgress = false;
    }
  }

  async fetchStreak() {
    return { currentStreak: 0, lastStudyDate: null, studiedToday: false, studiedYesterday: false };
  }

  async checkTodayStudyStatus(userId: string) {
    const sessionId = useAuthStore.getState().sessionId;
    const status = await studyRepository.checkTodayStudyLog(userId);
    if (useAuthStore.getState().sessionId !== sessionId) return status;
    useStudyStore.setState({
      isCompleted: status.isCompleted,
      xpEarned: status.xpEarned,
    });
    if (status.isCompleted) {
      const studiedWords = await this.fetchTodayStudiedWords(userId);
      if (useAuthStore.getState().sessionId !== sessionId) return status;
      if (studiedWords && studiedWords.length > 0) {
        useStudyStore.getState().setTodayWords(studiedWords);
      }
    }
    return status;
  }

  async getDueReviewWords(userId?: string, nativeLang?: string, targetLang?: string) {
    const user = useAuthStore.getState().user;
    if (!userId && !user?.id) return [];
    const resolvedUserId = userId || user!.id;
    const resolvedNative = nativeLang || user?.nativeLang || 'ko';
    const resolvedTarget = targetLang || user?.targetLang || 'en';
    return studyRepository.getDueReviewWords(resolvedUserId, resolvedNative, resolvedTarget);
  }

  async fetchTodayStudiedWords(userId?: string, nativeLang?: string, targetLang?: string) {
    const user = useAuthStore.getState().user;
    if (!userId && !user?.id) return [];
    const resolvedUserId = userId || user!.id;
    const resolvedNative = nativeLang || user?.nativeLang || 'ko';
    const resolvedTarget = targetLang || user?.targetLang || 'en';
    const words = await studyRepository.getTodayStudiedWords(resolvedUserId, resolvedNative, resolvedTarget);
    if (words && words.length > 0) {
      useStudyStore.getState().setTodayWords(words);
    }
    return words;
  }

  async fetchStudiedWords(userId: string, nativeLang?: string, targetLang?: string, offset?: number, limit?: number) {
    const user = useAuthStore.getState().user;
    const resolvedNative = nativeLang || user?.nativeLang || 'ko';
    const resolvedTarget = targetLang || user?.targetLang || 'en';
    return studyRepository.getStudiedWords(userId, resolvedNative, resolvedTarget, offset, limit);
  }

  async fetchStudiedWordsCount(userId?: string): Promise<number> {
    const user = useAuthStore.getState().user;
    const resolvedUserId = userId || user?.id;
    if (!resolvedUserId) return 0;
    return studyRepository.getStudiedWordsCount(resolvedUserId);
  }

  async fetchLessonProgressMap(userId: string, lessonIds: string[]): Promise<Record<string, number>> {
    return studyRepository.getLessonProgressMap(userId, lessonIds);
  }

  async getAllVocabulary(nativeLang?: string, targetLang?: string, offset?: number, limit?: number) {
    const user = useAuthStore.getState().user;
    const resolvedNative = nativeLang || user?.nativeLang || 'ko';
    const resolvedTarget = targetLang || user?.targetLang || 'en';
    return studyRepository.getAllVocabulary(resolvedNative, resolvedTarget, offset, limit);
  }

  async toggleFavorite(userId: string, wordId: string) {
    if (this.favoriteTogglesInProgress.has(wordId)) {
      console.log('[studyService] toggleFavorite already in progress for word:', wordId);
      return;
    }
    this.favoriteTogglesInProgress.add(wordId);
    try {
      return await studyRepository.toggleFavoriteWord(userId, wordId);
    } finally {
      this.favoriteTogglesInProgress.delete(wordId);
    }
  }

  async getFavoriteWords(userId: string, nativeLang?: string, targetLang?: string) {
    const user = useAuthStore.getState().user;
    const resolvedNative = nativeLang || user?.nativeLang || 'ko';
    const resolvedTarget = targetLang || user?.targetLang || 'en';
    return studyRepository.getFavoriteWords(userId, resolvedNative, resolvedTarget);
  }

  async updateWordSrsResult(userId: string, conceptId: string, rating: SrsRating): Promise<void> {
    return studyRepository.updateWordSrs(userId, conceptId, rating);
  }
}

export const studyService = new StudyService();
