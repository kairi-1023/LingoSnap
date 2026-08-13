import React from 'react';
import { View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CompletionView } from '../../study/components/CompletionView';
import { colors } from '../../../shared/theme/colors';
import { spacing } from '../../../shared/theme/spacing';

export interface CompletionScreenProps {
  onGoHome?: () => void;
}

export const CompletionScreen: React.FC<CompletionScreenProps> = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, paddingHorizontal: spacing.lg }}>
        <CompletionView isReview={true} />
      </View>
    </SafeAreaView>
  );
};


export default CompletionScreen;
