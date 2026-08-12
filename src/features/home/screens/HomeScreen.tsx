import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeHeader } from '../../../shared/components/HomeHeader';
import { BottomTabBar } from '../../../shared/components/BottomTabBar';
import { Typography } from '../../../shared/components/Typography';
import { spacing } from '../../../shared/theme/spacing';
import { GuestAuthModal } from '../../../shared/components/GuestAuthModal';
import { LanguageSelectModal } from '../../../shared/components/LanguageSelectModal';
import { SkeletonCard } from '../../../shared/components/Skeleton';
import { BookOpen, ArrowRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useHomeScreen } from '../hooks/useHomeScreen';

export const HomeScreen: React.FC = React.memo(() => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const {
    user,
    theme,
    isDarkMode,
    isGuestModalVisible,
    setIsGuestModalVisible,
    isLanguageModalVisible,
    setIsLanguageModalVisible,
    langPairFlags,
    lessons,
    lessonProgressMap,
    isLessonsLoading,
    isLessonsError,
    refetchLessons,
    userFirstName,
    userInitials,

    handleSaveLanguage,
    handleSelectLesson,
    handleTabPress,
    router,
  } = useHomeScreen();

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safeArea,
        { backgroundColor: theme.background },
      ]}
    >
      <StatusBar
        barStyle={theme.statusBarStyle}
        backgroundColor={theme.background}
      />

      <HomeHeader
        userName={userFirstName}
        userAvatarUrl={user?.avatarUrl || undefined}
        userInitials={userInitials}
        onProfilePress={() => router.push('/(tabs)/profile')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 64 + insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.greetingSection}>
          <View style={styles.greetingHeaderRow}>
            <Typography
              variant="sectionTitle"
              ellipsizeMode="tail"
              style={styles.greetingTitle}
            >
              {t('home.greeting', { name: userFirstName })}
            </Typography>

            <TouchableOpacity
              style={[
                styles.languageChip,
                {
                  backgroundColor: isDarkMode ? 'rgba(92, 184, 92, 0.15)' : '#F0FDF4',
                  borderColor: isDarkMode ? 'rgba(92, 184, 92, 0.3)' : '#DCFCE7',
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setIsLanguageModalVisible(true)}
            >
              <Typography
                variant="caption"
                style={[styles.languageChipText, { color: theme.primary }]}
              >
                {langPairFlags.formatted}
              </Typography>
            </TouchableOpacity>
          </View>

          <Typography
            variant="body"
            color="textSecondary"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.greetingSubtitle}
          >
            하루 5분, 시각적 어휘와 이미지 퀴즈로 성장해 보세요.
          </Typography>
        </View>

        {/* Quick Start Study CTA Card */}
        <TouchableOpacity
          style={[
            styles.quickStudyCard,
            { backgroundColor: theme.cardBackground, borderColor: theme.primary },
          ]}
          activeOpacity={0.85}
          onPress={() => router.push('/(tabs)/study')}
        >
          <View style={[styles.quickStudyIconBadge, { backgroundColor: theme.primary }]}>
            <BookOpen size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
              <Typography variant="sectionTitle" style={{ color: theme.textPrimary }}>
              {t('study.todayFiveMinuteStudy')}
            </Typography>
            <Typography variant="caption" color="textSecondary" style={{ marginTop: 4 }}>
              {t('study.tenWordsImageQuiz')} ➔
            </Typography>
          </View>
          <ArrowRight size={22} color={theme.primary} />
        </TouchableOpacity>
      </ScrollView>

      <GuestAuthModal
        visible={isGuestModalVisible}
        onClose={() => setIsGuestModalVisible(false)}
        title={t('study.syncProgress')}
        subtitle={t('study.syncSubtitle')}
      />

      <LanguageSelectModal
        visible={isLanguageModalVisible}
        nativeLang={user?.nativeLang || 'ko'}
        targetLang={user?.targetLang || 'tl'}
        onClose={() => setIsLanguageModalVisible(false)}
        onSave={handleSaveLanguage}
      />

      <BottomTabBar
        activeTab="home"
        onTabPress={handleTabPress}
      />
    </SafeAreaView>
  );
});

HomeScreen.displayName = 'HomeScreen';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
  },
  greetingSection: {
    marginTop: 14,
    marginBottom: 16,
  },
  greetingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  greetingTitle: {
    flex: 1,
    marginRight: 4,
    minWidth: 0,
    fontSize: 20,
    fontWeight: '700',
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'center',
    minHeight: 28,
  },
  languageChipText: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.3,
  },
  greetingSubtitle: {
    marginTop: 4,
    fontSize: 15,
  },
  quickStudyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    marginTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quickStudyIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
