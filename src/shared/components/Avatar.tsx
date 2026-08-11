import React from 'react';
import { View, Text, Image, Platform } from 'react-native';

type AvatarSizeName = 'sm' | 'md' | 'lg';

const SIZE_MAP: Record<AvatarSizeName, number> = {
  sm: 32,
  md: 44,
  lg: 64,
};

const FONT_SIZE_MAP: Record<AvatarSizeName, number> = {
  sm: 12,
  md: 16,
  lg: 22,
};

export interface AvatarProps {
  size?: AvatarSizeName | number;
  imageUrl?: string | null;
  fallbackText?: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 'md',
  imageUrl,
  fallbackText = 'U',
  bgColor = '#E5E7EB',
  textColor = '#2F3437',
  borderColor = '#D1D5DB',
  borderWidth = 1,
}) => {
  const dim = typeof size === 'number' ? size : SIZE_MAP[size];
  const fontSize = typeof size === 'number' ? Math.round(dim * 0.35) : FONT_SIZE_MAP[size];

  return (
    <View
      style={{
        width: dim,
        height: dim,
        borderRadius: dim / 2,
        backgroundColor: bgColor,
        borderWidth,
        borderColor,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: dim, height: dim }} resizeMode="cover" />
      ) : (
        <Text
          style={{
            fontSize,
            color: textColor,
            fontFamily: Platform.OS === 'android' ? 'Inter-SemiBold' : undefined,
            fontWeight: Platform.OS === 'android' ? undefined : '600',
          }}
          includeFontPadding={Platform.OS === 'android' ? false : undefined}
        >
          {fallbackText.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  );
};

export default Avatar;
