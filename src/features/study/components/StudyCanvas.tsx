import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '../../../shared/components/Button';
import { spacing } from '../../../shared/theme/spacing';

interface StudyCanvasProps {
  children: React.ReactNode;
  buttonLabel: string;
  onPressNext: () => void;
  buttonIcon?: React.ReactNode;
}

export const StudyCanvas: React.FC<StudyCanvasProps> = React.memo(({
  children,
  buttonLabel,
  onPressNext,
  buttonIcon,
}) => {
  return (
    <View style={styles.container}>
      {/* Upper Word Card Area */}
      <View style={styles.cardWrapper}>
        {children}
      </View>

      {/* Visually Docked Primary Action Button */}
      <View style={styles.buttonWrapper}>
        <Button
          label={buttonLabel}
          variant="primary"
          onPress={onPressNext}
          style={styles.dockedButton}
          icon={buttonIcon}
        />
      </View>
    </View>
  );
});

StudyCanvas.displayName = 'StudyCanvas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 4,
  },
  buttonWrapper: {
    marginTop: 4,
    width: '100%',
  },
  dockedButton: {
    width: '100%',
  },
});
