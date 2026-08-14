import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

interface LogoProps {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'contain' | 'cover' | 'center' | 'stretch';
}

export const Logo: React.FC<LogoProps> = ({
  width = 180,
  height = 150,
  style,
  resizeMode = 'contain',
}) => {
  return (
    <Image
      source={require('../../../assets/images/adaptive-icon.png')}
      style={[{ width, height }, style]}
      resizeMode={resizeMode}
    />
  );
};

