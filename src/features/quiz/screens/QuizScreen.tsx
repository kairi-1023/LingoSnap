import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle2 } from 'lucide-react-native';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { ProgressBar } from '../../../shared/components/ProgressBar';
import { Typography } from '../../../shared/components/Typography';
import { useStudyStore } from '../../../shared/stores/useStudyStore';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export interface QuizScreenProps {
  onQuizComplete: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ onQuizComplete }) => {
  const quizzes = useStudyStore((state) => state.quizzes);
  const currentQuizIndex = useStudyStore((state) => state.currentQuizIndex);
  const nextQuiz = useStudyStore((state) => state.nextQuiz);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const autoNextTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoNextTimerRef.current) {
        clearTimeout(autoNextTimerRef.current);
      }
    };
  }, []);

  const currentQuiz = quizzes[currentQuizIndex];
  const progress = quizzes.length > 0 ? (currentQuizIndex + 1) / quizzes.length : 0;

  const handleNextQuiz = () => {
    if (autoNextTimerRef.current) {
      clearTimeout(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
    }
    if (currentQuizIndex < quizzes.length - 1) {
      setSelectedOption(null);
      nextQuiz();
    } else {
      onQuizComplete();
    }
  };

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);

    if (autoNextTimerRef.current) clearTimeout(autoNextTimerRef.current);
    autoNextTimerRef.current = setTimeout(() => {
      handleNextQuiz();
    }, 3000);
  };

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingBottom: Math.max(insets.bottom, 16) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.contentGroup}>
            {/* Progress Header */}
            <View style={styles.headerGroup}>
              <View style={styles.headerRow}>
                <Typography variant="caption" color="textSecondary" style={{ fontWeight: '600' }}>
                  Review Quiz
                </Typography>
                <Typography variant="caption" color="secondary" style={{ fontWeight: '700' }}>
                  {currentQuizIndex + 1} / {quizzes.length}
                </Typography>
              </View>
              <ProgressBar progress={progress} height={8} color="#FFB84D" />
            </View>

            {/* Question Word Card */}
            <View style={styles.quizContentGroup}>
              <Card padding="lg" style={styles.wordCard}>
                <Typography variant="caption" color="textSecondary" style={styles.questionGuideText}>
                  Select the correct meaning of the word
                </Typography>
                <Typography variant="hero" color="textPrimary" align="center" style={styles.wordTitleText}>
                  {currentQuiz.word.wordNative}
                </Typography>
              </Card>

              {/* 4 Options List */}
              <View style={styles.optionsList}>
                {currentQuiz.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <TouchableOpacity
                      key={idx}
                      activeOpacity={0.85}
                      onPress={() => handleSelectOption(option)}
                      style={[
                        styles.optionButton,
                        isSelected ? styles.optionButtonSelected : styles.optionButtonNormal,
                      ]}
                    >
                      <Typography
                        variant="bodyLarge"
                        color={isSelected ? 'primary' : 'textPrimary'}
                        style={{ flex: 1, marginRight: 8 }}
                      >
                        {option}
                      </Typography>

                      {isSelected && (
                        <CheckCircle2 size={20} color={colors.primary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Primary Action Button */}
          <Button
            label={currentQuizIndex < quizzes.length - 1 ? "Next Quiz" : "Complete Daily Study"}
            variant="primary"
            disabled={!selectedOption}
            onPress={handleNextQuiz}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 16,
    paddingBottom: 24,
    justifyContent: 'space-between',
    maxWidth: 560,
    width: '100%',
    alignSelf: 'center',
  },
  contentGroup: {
    flex: 1,
  },
  headerGroup: {
    gap: 8,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  quizContentGroup: {
    justifyContent: 'center',
    marginVertical: 10,
    gap: 16,
  },
  wordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  questionGuideText: {
    letterSpacing: 0.8,
    fontWeight: '700',
    marginBottom: 8,
  },
  wordTitleText: {
    letterSpacing: -0.4,
  },
  optionsList: {
    gap: 10,
    marginTop: 4,
  },
  optionButton: {
    minHeight: 52,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionButtonNormal: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  optionButtonSelected: {
    backgroundColor: 'rgba(92, 184, 92, 0.08)',
    borderColor: '#5CB85C',
  },
  actionButton: {
    marginTop: 14,
  },
});

export default QuizScreen;

