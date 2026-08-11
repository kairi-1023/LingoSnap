import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { QuizScreen } from '../features/study/screens/QuizScreen';

export default function QuizModalRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId?: string; quizId?: string }>();

  return (
    <QuizScreen
      lessonId={params.lessonId || '11111111-1111-1111-1111-111111111111'}
      quizId={params.quizId || '22222222-2222-2222-2222-222222222222'}
      onBack={() => router.back()}
      onNavigateToReview={() => router.push('/(tabs)/study?tab=review')}
    />
  );
}

