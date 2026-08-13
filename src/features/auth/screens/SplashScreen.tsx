import React, { useEffect } from 'react';
import {
  View,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing as ReanimatedEasing,
} from 'react-native-reanimated';

import { spacing } from '../../../shared/theme/spacing';
import { Logo } from '../../../shared/components/Logo';
import { Typography } from '../../../shared/components/Typography';
import { useThemeStore } from '../../../shared/stores/useThemeStore';
import { styles, ILLUSTRATION_MAX_WIDTH } from './SplashScreen.styles';


interface SplashScreenProps {
  onFinishLoading?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinishLoading,
}) => {
  const { t } = useTranslation();
  const { theme } = useThemeStore();

  // -----------------------------------------
  // Animation shared values
  // -----------------------------------------

  const logoOpacity = useSharedValue(0);
  const logoTranslateY = useSharedValue(12);

  const illustrationOpacity = useSharedValue(0);
  const illustrationScale = useSharedValue(0.95);

  const footerOpacity = useSharedValue(0);
  const progressAnim = useSharedValue(0);

  // -----------------------------------------
  // Entrance animations
  // -----------------------------------------

  useEffect(() => {
    // 1. Logo entrance
    logoOpacity.value = withTiming(1, {
      duration: 600,
      easing: ReanimatedEasing.out(ReanimatedEasing.cubic),
    });

    logoTranslateY.value = withTiming(0, {
      duration: 600,
      easing: ReanimatedEasing.out(ReanimatedEasing.cubic),
    });

    // 2. Illustration entrance
    illustrationOpacity.value = withDelay(
      150,
      withTiming(1, {
        duration: 600,
        easing: ReanimatedEasing.out(ReanimatedEasing.cubic),
      })
    );

    illustrationScale.value = withDelay(
      150,
      withTiming(1, {
        duration: 600,
        easing: ReanimatedEasing.out(ReanimatedEasing.cubic),
      })
    );

    // 3. Footer entrance
    footerOpacity.value = withDelay(
      300,
      withTiming(1, {
        duration: 500,
        easing: ReanimatedEasing.out(ReanimatedEasing.cubic),
      })
    );

    // 4. Progress bar
    progressAnim.value = withTiming(1, {
      duration: 2000,
      easing: ReanimatedEasing.linear,
    });
  }, []);

  // -----------------------------------------
  // Finish loading after 2 seconds
  // -----------------------------------------

  useEffect(() => {
    if (onFinishLoading) {
      const timer = setTimeout(() => {
        onFinishLoading();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [onFinishLoading]);

  // -----------------------------------------
  // Animated styles
  // -----------------------------------------

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      {
        translateY: logoTranslateY.value,
      },
    ],
  }));

  const illustrationAnimatedStyle = useAnimatedStyle(() => ({
    opacity: illustrationOpacity.value,
    transform: [
      {
        scale: illustrationScale.value,
      },
    ],
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  const progressLineStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  // -----------------------------------------
  // Render
  // -----------------------------------------

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.isDarkMode ? theme.background : '#FFFDF7',
        },
      ]}
    >
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.isDarkMode ? theme.background : '#FFFDF7'}
      />

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.isDarkMode ? theme.background : '#FFFDF7',
          },
        ]}
      >
        {/* -----------------------------------
            Logo Section
        ----------------------------------- */}

        <Animated.View
          style={[
            styles.logoSection,
            logoAnimatedStyle,
          ]}
        >
          <Logo
            width={96}
            height={68}
          />

          <Typography
            variant="hero"
            color="textPrimary"
            align="center"
            style={styles.brandTitle}
          >
            {t('auth.welcome', 'LingoSnap')}
          </Typography>

          <Typography
            variant="caption"
            color="textSecondary"
            align="center"
            style={styles.tagline}
          >
            {t('auth.tagline', '사진 한 장으로 시작하는 5분 언어 습관')}
          </Typography>
        </Animated.View>

        {/* -----------------------------------
            Hero Illustration
        ----------------------------------- */}

        <Animated.View
          style={[
            styles.illustrationContainer,
            illustrationAnimatedStyle,
          ]}
        >
          <Image
            source={require('../../../assets/images/hero_illustration.webp')}
            style={styles.illustration}
            resizeMode="cover"
          />
        </Animated.View>

        {/* -----------------------------------
            Loading Section
        ----------------------------------- */}

        <Animated.View
          style={[
            styles.loadingSection,
            footerAnimatedStyle,
          ]}
        >
          {/* Progress Bar */}

          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor: theme.isDarkMode ? theme.fillSubtle : '#E8F5E9',
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                progressLineStyle,
                {
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>

          {/* Footer Text */}

          <Typography
            variant="caption"
            color="textSecondary"
            align="center"
            style={styles.brandFooter}
          >
            {t('auth.dailyTagline', 'LINGOSNAP • DAILY 5 MIN FLOW')}
          </Typography>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;