import React from 'react';
import { ActivityIndicator, Image, Pressable, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../shared/components/Typography';
import { spacing } from '../../../shared/theme/spacing';
import { palette } from '../../../shared/theme/colors';
import { ThemeColors, useThemeStore } from '../../../shared/stores/useThemeStore';
import { WordEntity } from '../../../domain/entities/Word';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';


import { Card } from '../../../shared/components/Card';

interface ReviewWordsCardProps {
  theme: ThemeColors;
  words: WordEntity[];
  isLoading: boolean;
  onSelectWord: (word: WordEntity) => void;
}

export const ReviewWordsCard: React.FC<ReviewWordsCardProps> = ({ theme, words, isLoading, onSelectWord }) => {
  const { t } = useTranslation();
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const visibleWords = words.slice(0, 6);

  return (
    <Card
      radius="large"
      padding="md"
      bg={theme.cardBackground}
      borderColor={theme.border}
      elevation="soft"
      style={styles.section}
    >
      <View style={styles.header} onLayout={(e) => console.log('[LayoutTrace] Header layout:', e.nativeEvent.layout)}>
        <View style={styles.titleRow}>
          <View style={[styles.headerIcon, { backgroundColor: theme.fillSubtle }]}>
            <BookOpen size={17} color={theme.textSecondary} />
          </View>
          <Typography variant="cardTitle" style={{ color: theme.textPrimary, marginLeft: 8 }}>
            {t('home.learnedWords')}
          </Typography>
        </View>
        {words.length > 0 && (
          <Typography variant="caption" style={[styles.countBadge, { backgroundColor: theme.fillSubtle, color: theme.textSecondary }]}>
            {t('home.learnedWordsCount', { count: words.length })}
          </Typography>
        )}
      </View>

      {isLoading ? (
        <View style={styles.emptyState}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : visibleWords.length === 0 ? (
        <View style={styles.emptyState}>
          <Typography variant="body" style={{ color: theme.textPrimary }}>
            {t('home.noLearnedWords')}
          </Typography>
          <Typography variant="caption" style={{ color: theme.textSecondary, marginTop: 4 }}>
            {t('home.noLearnedWordsSubtitle')}
          </Typography>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.wordList}
          nestedScrollEnabled
          onLayout={(e) => console.log('[LayoutTrace] ScrollView layout:', e.nativeEvent.layout)}
        >
          {visibleWords.map((word, idx) => {
            const imageUrl = getVocabularyImageUrl(word.imageWord || word.wordTarget || word.conceptId || word.id);
            return (
              <View
                key={word.id}
                style={[styles.wordCardWrapper, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                onLayout={(e) => idx === 0 && console.log('[LayoutTrace] first wordCardWrapper layout:', e.nativeEvent.layout)}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.wordCardInner,
                    pressed && Platform.OS !== 'android' && { opacity: 0.85 },
                  ]}
                  android_ripple={{
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    borderless: false,
                  }}
                  onPress={() => onSelectWord(word)}
                  accessibilityRole="button"
                  accessibilityLabel={word.wordTarget}
                  onLayout={(e) => idx === 0 && console.log('[LayoutTrace] first wordCardInner layout:', e.nativeEvent.layout)}
                >
                  <View style={styles.wordCardContent}>
                    <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
                    <View style={styles.imageFrame} onLayout={(e) => idx === 0 && console.log('[LayoutTrace] first imageFrame layout:', e.nativeEvent.layout)}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.image}
                          resizeMode="contain"
                          onError={(event) => console.warn('[ReviewWordsCard IMAGE FAILED]', {
                            imageUrl,
                            error: event.nativeEvent?.error,
                          })}
                        />
                      ) : null}
                    </View>
                    <View style={styles.textContent}>
                      <Typography variant="cardTitle" numberOfLines={1} style={[styles.wordTargetTitle, { color: theme.textPrimary }]}>
                        {word.wordTarget}
                      </Typography>
                      <Typography variant="caption" numberOfLines={1} style={[styles.wordNativeText, { color: theme.textSecondary }]}>
                        {word.wordNative}
                      </Typography>
                    </View>
                  </View>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: 'hidden',
  },
  wordList: {
    gap: spacing.sm,
    paddingVertical: 2,
    paddingRight: 4,
  },
  wordCardWrapper: {
    width: 124,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  wordCardInner: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  wordCardContent: {
    padding: 10,
  },
  statusDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 2,
  },
  imageFrame: {
    width: '100%',
    height: 82,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContent: {
    marginTop: 8,
  },
  wordTargetTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 19,
  },
  wordNativeText: {
    fontSize: 13,
    lineHeight: 16,
    marginTop: 2,
  },
  emptyState: {
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
