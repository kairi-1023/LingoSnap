import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookMarked } from 'lucide-react-native';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { typography } from '../../../shared/theme/typography';
import { useAuthStore } from '../../../shared/stores/useAuthStore';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { studyService } from '../../../shared/services/studyService';
import { ttsService } from '../../../shared/services/ttsService';
import { parseTtsAudioUrl } from '../../../shared/utils/ttsStorage';
import { WordEntity } from '../../../domain/entities/Word';
import { DictionaryToolbar, CategoryFilter } from './DictionaryToolbar';
import { StudyWordCardRow } from './StudyWordCardRow';

export const DictionaryView: React.FC = React.memo(() => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const favoritesMap = useStudyStore((state) => state.favoritesMap);
  const setFavoritesMap = useStudyStore((state) => state.setFavoritesMap);
  const setFavoriteStatus = useStudyStore((state) => state.setFavoriteStatus);

  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [studiedWords, setStudiedWords] = useState<WordEntity[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const recentWords = studiedWords.slice(0, 10);

  const isMountedRef = React.useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      ttsService.stop();
    };
  }, []);

  useEffect(() => {
    async function loadDictionaryData() {
      setIsLoading(true);
      try {
        const userId = user?.id || 'guest_user';
        const [words, favWords] = await Promise.all([
          studyService.fetchStudiedWords(userId, user?.nativeLang, user?.targetLang),
          user?.id ? studyService.getFavoriteWords(user.id, user?.nativeLang, user?.targetLang) : Promise.resolve([] as WordEntity[]),
        ]);
        if (isMountedRef.current) {
          setStudiedWords(words);
          const map: Record<string, boolean> = {};
          favWords.forEach((w) => {
            map[w.id] = true;
          });
          setFavoritesMap(map);
        }
      } catch (err) {
        // ignore
      } finally {
        setIsLoading(false);
      }
    }

    loadDictionaryData();
  }, [user?.id, user?.nativeLang, user?.targetLang, setFavoritesMap]);

  const toggleFavorite = useCallback(async (wordId: string) => {
    const isFav = !!favoritesMap[wordId];
    setFavoriteStatus(wordId, !isFav);

    if (user?.id) {
      try {
        await studyService.toggleFavorite(user.id, wordId);
      } catch (err) {
        setFavoriteStatus(wordId, isFav);
      }
    }
  }, [favoritesMap, user?.id, setFavoriteStatus]);

  const handleAudioPlay = useCallback((word: WordEntity) => {
    setPlayingId(word.id);
    const targetLanguage = user?.targetLang || word.targetLang || 'en';
    const audioUrl = parseTtsAudioUrl(
      word.ttsAudioUrl,
      targetLanguage,
      'word',
      word.conceptId || word.id,
      word.category,
      word.difficultyLevel,
    );
    ttsService.speak({
      text: word.wordTarget,
      language: targetLanguage,
      audioUrl,
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  }, [user?.targetLang]);

  const allWords = studiedWords;
  const filteredWords = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const sourceList = activeFilter === 'recent' ? recentWords : allWords;
    return sourceList.filter((item) => {
      const matchesSearch =
        !q ||
        item.wordNative.toLowerCase().includes(q) ||
        item.wordTarget.toLowerCase().includes(q) ||
        (item.phonetic && item.phonetic.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeFilter === 'favorites') return !!favoritesMap[item.id];
      return true;
    });
  }, [activeFilter, recentWords, allWords, searchQuery, favoritesMap]);

  const favoritesCount = React.useMemo(
    () => allWords.filter((i) => !!favoritesMap[i.id]).length,
    [allWords, favoritesMap]
  );
  const recentCount = recentWords.length;

  const keyExtractor = useCallback((item: WordEntity) => item.id, []);

  const renderItem = useCallback(({ item }: { item: WordEntity }) => {
    const isFav = !!favoritesMap[item.id];
    const catBadge = (cat?: string) => {
      switch (cat?.toLowerCase()) {
        case 'food': case 'restaurant': case 'shopping': return t('study.categoryFood');
        case 'emotions': return t('study.categoryEmotions');
        case 'travel': case 'hospital': case 'health': return t('study.categoryTravel');
        case 'social': return t('study.categorySocial');
        default: return null;
      }
    };
    const badgeLabel = catBadge(item.category);

    return (
      <StudyWordCardRow
        item={item}
        isFavorite={isFav}
        isPlaying={playingId === item.id}
        onAudioPlay={handleAudioPlay}
        onToggleFavorite={toggleFavorite}
        badgeLabel={badgeLabel}
        t={t}
      />
    );
  }, [favoritesMap, playingId, handleAudioPlay, toggleFavorite, t]);

  return (
    <View style={styles.container}>
      {/* Compact Integrated Search & Filter Toolbar */}
      <DictionaryToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        allCount={allWords.length}
        favCount={favoritesCount}
        recentCount={recentCount}
        t={t}
      />

      {/* Word Cards List */}
      {isLoading && allWords.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredWords}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={Platform.OS === 'android'}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Platform.OS === 'android' ? 64 + 16 : 64 + insets.bottom + 16 }
          ]}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <BookMarked size={36} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]} includeFontPadding={Platform.OS === 'android' ? false : undefined}>
                {activeFilter === 'favorites' ? t('study.noFavorites') : t('study.noResults')}
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]} includeFontPadding={Platform.OS === 'android' ? false : undefined}>
                {activeFilter === 'favorites' ? t('study.favoritesHint') : activeFilter === 'recent' ? t('study.recentHint') : t('study.emptyVocabularyHint')}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: 4,
  },
  emptySubtitle: {
    ...typography.caption,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default DictionaryView;
