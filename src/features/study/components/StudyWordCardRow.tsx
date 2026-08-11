import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Volume2 } from 'lucide-react-native';
import { Typography } from '../../../shared/components/Typography';
import { FavoriteButton } from './FavoriteButton';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';
import { WordEntity } from '../../../domain/entities/Word';

interface StudyWordCardRowProps {
  item: WordEntity;
  isFavorite: boolean;
  isPlaying: boolean;
  onAudioPlay: (item: WordEntity) => void;
  onToggleFavorite: (id: string) => void;
  badgeLabel?: string | null;
  t: (...args: any[]) => any;
}

export const StudyWordCardRow: React.FC<StudyWordCardRowProps> = React.memo(({
  item,
  isFavorite,
  isPlaying,
  onAudioPlay,
  onToggleFavorite,
  badgeLabel,
  t,
}) => {
  const { theme } = useThemeStore();

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.leftContent}>
        <View style={styles.titleRow}>
          {/* Target Word */}
          <Typography variant="bodyLarge" color="textPrimary" style={styles.targetWord}>
            {item.wordTarget}
          </Typography>

          {/* Inline Phonetic Pronunciation */}
          {item.phonetic ? (
            <Typography variant="caption" color="textSecondary" style={styles.phoneticText}>
              {item.phonetic.startsWith('(') ? item.phonetic : `(${item.phonetic.replace(/[()]/g, '')})`}
            </Typography>
          ) : null}

          {/* Category Badge */}
          {badgeLabel ? (
            <View style={[styles.categoryBadge, { backgroundColor: theme.insetSurface, borderColor: theme.border }]}>
              <Typography variant="caption" color="textSecondary" style={{ fontSize: 12, fontWeight: '600' }}>
                {badgeLabel}
              </Typography>
            </View>
          ) : null}
        </View>

        {/* Native Word Meaning */}
        <Typography variant="caption" color="textSecondary" style={styles.nativeWord}>
          {item.wordNative}
        </Typography>
      </View>

      <View style={styles.rightActions}>
        {/* Audio Listen Button */}
        <TouchableOpacity
          style={[
            styles.actionIconButton,
            {
              backgroundColor: isPlaying ? theme.successBg : theme.insetSurface,
              borderColor: isPlaying ? theme.primary : theme.border,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => onAudioPlay(item)}
          accessibilityLabel={t('study.playPronunciation')}
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Volume2
            size={16}
            color={isPlaying ? colors.primary : theme.textSecondary}
          />
        </TouchableOpacity>

        {/* Favorite Heart Button */}
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => onToggleFavorite(item.id)}
          accessibilityLabel={isFavorite ? t('study.removeFromFavorites') : t('study.addToFavorites')}
        />
      </View>
    </View>
  );
});

StudyWordCardRow.displayName = 'StudyWordCardRow';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    shadowColor: '#2F3437',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  leftContent: {
    flex: 1,
    marginRight: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  targetWord: {
    fontSize: 18,
    fontWeight: '700',
  },
  phoneticText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  nativeWord: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionIconButton: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
