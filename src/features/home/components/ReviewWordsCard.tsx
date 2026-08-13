import React from 'react';
import { ActivityIndicator, Image, Pressable, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../shared/components/Typography';
import { spacing } from '../../../shared/theme/spacing';
import { palette } from '../../../shared/theme/colors';
import { ThemeColors } from '../../../shared/stores/useThemeStore';
import { WordEntity } from '../../../domain/entities/Word';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';


interface ReviewWordsCardProps {
  theme: ThemeColors;
  words: WordEntity[];
  isLoading: boolean;
  onSelectWord: (word: WordEntity) => void;
}

export const ReviewWordsCard: React.FC<ReviewWordsCardProps> = ({ theme, words, isLoading, onSelectWord }) => {
  const { t } = useTranslation();
  const visibleWords = words.slice(0, 6);

  return (
    <View style={[styles.section, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.header}>
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
        >
          {visibleWords.map((word) => {
            const imageUrl = getVocabularyImageUrl(word.imageWord || word.wordTarget || word.conceptId || word.id);
            return (
              <View
                key={word.id}
                style={[styles.wordCardWrapper, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.wordCardInner,
                    pressed && Platform.OS !== 'android' && { opacity: 0.85 },
                  ]}
                  android_ripple={{
                    color: theme.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
                    borderless: false,
                  }}
                  onPress={() => onSelectWord(word)}
                  accessibilityRole="button"
                  accessibilityLabel={word.wordTarget}
                >
                  <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
                  <View style={styles.imageFrame}>
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
                  <Typography variant="cardTitle" numberOfLines={1} style={styles.wordTargetTitle}>
                    {word.wordTarget}
                  </Typography>
                  <Typography variant="caption" numberOfLines={1} style={{ color: theme.textSecondary, marginTop: 1 }}>
                    {word.wordNative}
                  </Typography>
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 12,
    padding: spacing.md,
    borderRadius: 18,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
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
    paddingRight: 12,
  },
  wordCardWrapper: {
    width: 118,
    height: 148,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  wordCardInner: {
    padding: 8,
    flex: 1,
  },
  statusDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 2,
  },
  imageFrame: {
    width: '100%',
    height: 72,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wordTargetTitle: {
    color: palette.charcoal,
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
  },
  emptyState: {
    minHeight: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



