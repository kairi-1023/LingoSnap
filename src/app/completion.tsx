import React from 'react';
import { useRouter } from 'expo-router';
import { CompletionScreen } from '../features/quiz/screens/CompletionScreen';

export default function CompletionModalRoute() {
  const router = useRouter();

  const handleGoHome = () => {
    // Return to Home Tab
    router.replace('/(tabs)');
  };

  return <CompletionScreen onGoHome={handleGoHome} />;
}
