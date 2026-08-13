import React from 'react';
import { Image, Pressable, Platform, StyleSheet, View } from 'react-native';
import { ArrowRight, Sparkles, Volume2 } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../shared/components/Typography';
import { spacing } from '../../../shared/theme/spacing';
import { ThemeColors } from '../../../shared/stores/useThemeStore';
import { WordEntity } from '../../../domain/entities/Word';
import { getVocabularyImageUrl } from '../../../shared/utils/vocabularyImageMap';
import { useTtsAudio } from '../../../shared/hooks/useTtsAudio';

import { Card } from '../../../shared/components/Card';

interface TodayWordCardProps {
  theme: ThemeColors;
  word: WordEntity;
  onPress: () => void;
}

export const TodayWordCard: React.FC<TodayWordCardProps> = ({
  theme,
  word,
  onPress,
}) => {
  const { t } = useTranslation();
  const { isPlaying, play: handlePlayWord } = useTtsAudio({
    text: word.wordTarget,
    language: word.targetLang || 'en',
    ttsAudioUrl: word.ttsAudioUrl,
    conceptId: word.conceptId || word.id,
    category: word.category,
    difficultyLevel: word.difficultyLevel,
  });
  const imageUrl = getVocabularyImageUrl(word.imageWord || word.wordTarget || word.conceptId || word.id);

  return (
    <Card
      radius="large"
      padding={0}
      bg={theme.cardBackground}
      borderColor={theme.border}
      elevation="soft"
      style={styles.card}
    >
      <Pressable
        style={({ pressed }) => [
          styles.mainContent,
          pressed && Platform.OS !== 'android' && { opacity: 0.9 },
        ]}
        android_ripple={{
          color: theme.isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          borderless: false,
        }}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={word.wordTarget}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={[styles.headerIcon, { backgroundColor: theme.fillSubtle }]}>
              <Sparkles size={15} color={theme.textSecondary} />
            </View>
            <Typography variant="cardTitle" style={{ color: theme.textPrimary, marginLeft: 8 }}>
              {t('home.todayWord')}
            </Typography>
          </View>
        </View>

        <View style={styles.wordRow}>
          {/* 이미지 (충분한 크기 68x68) */}
          <View style={[styles.imageFrame, { backgroundColor: '#FFFFFF', borderColor: theme.border }]}>
            {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" /> : null}
          </View>

          {/* 어휘 정보: 단어 > 발음 > 뜻 위계 */}
          <View style={styles.content}>
            <Typography variant="cardTitle" numberOfLines={1} style={[styles.wordTargetText, { color: theme.textPrimary }]}>
              {word.wordTarget}
            </Typography>

            {/* 발음 ([phonetic]) */}
            {!!word.phonetic && (
              <Typography variant="caption" numberOfLines={1} style={{ color: theme.primary, marginTop: 1, fontSize: 13, fontWeight: '500' }}>
                {`[${word.phonetic}]`}
              </Typography>
            )}

            {/* 뜻 (translation) */}
            <Typography variant="body" numberOfLines={1} style={{ color: theme.textSecondary, marginTop: 2 }}>
              {word.wordNative}
            </Typography>
          </View>
        </View>
      </Pressable>

      {/* 우측 컨트롤 액션 영역 (Sibling 구조로 <button> 중첩 방지) */}
      <View style={styles.actionColumn}>
        <Pressable
          style={({ pressed }) => [
            styles.audioButton,
            { backgroundColor: theme.fillSubtle },
            pressed && Platform.OS !== 'android' && { opacity: 0.7 },
          ]}
          android_ripple={{
            color: 'rgba(92, 184, 92, 0.2)',
            borderless: true,
            radius: 22,
          }}
          onPress={() => handlePlayWord()}
          accessibilityRole="button"
          accessibilityLabel={t('study.playPronunciation')}
        >
          <Volume2 size={19} color={isPlaying ? theme.primary : theme.textSecondary} />
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.arrowButton,
            pressed && Platform.OS !== 'android' && { opacity: 0.7 },
          ]}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={t('common.next', { defaultValue: '이동' })}
        >
          <ArrowRight size={20} color={theme.textSecondary} />
        </Pressable>
      </View>
    </Card>
  );
};


const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 124,
    marginBottom: 12,
  },

  mainContent: {
    flex: 1,
    padding: spacing.md,
  },
  imageFrame: {
    width: 68,
    height: 68,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: spacing.xs,
  },
  wordTargetText: {
    fontSize: 18,
    fontWeight: '700',
  },
  actionColumn: {
    paddingRight: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  audioButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
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
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});






