import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { withTranslation, WithTranslation } from 'react-i18next';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Typography } from './Typography';

interface ErrorBoundaryProps extends WithTranslation {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Unhandled error:', error.message, errorInfo.componentStack);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Typography variant="sectionTitle" color="textPrimary" align="center" style={{ marginBottom: 8 }}>
            {t('errors.errorBoundaryTitle')}
          </Typography>
          <Typography variant="body" color="textSecondary" align="center" style={{ marginBottom: 24 }}>
            {this.state.error?.message || t('errors.errorBoundaryMessage')}
          </Typography>
          <TouchableOpacity style={styles.button} onPress={this.handleReset} activeOpacity={0.7}>
            <Typography variant="bodyLarge" color="white" style={{ fontWeight: '600' }}>
              {t('errors.tryAgain')}
            </Typography>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundary = withTranslation()(ErrorBoundaryInner);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFDF7',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2F3437',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
