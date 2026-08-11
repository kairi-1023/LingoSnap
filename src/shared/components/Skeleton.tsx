import React, { useEffect } from 'react';
import { View, Animated, ViewStyle } from 'react-native';

export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
  style?: ViewStyle;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  radius = 12,
  style,
}) => {
  const opacityAnim = React.useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      className="bg-[#E5E7EB]"
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius: radius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCard: React.FC<{ style?: ViewStyle }> = ({ style }) => {
  return (
    <View
      style={style}
      className="w-full bg-white border border-[#E5E7EB] rounded-[24px] p-6 mb-4 gap-3"
    >
      <View className="flex-row items-center justify-between">
        <Skeleton width="40%" height={16} radius={8} />
        <Skeleton width={24} height={24} radius={12} />
      </View>
      <Skeleton width="80%" height={28} radius={10} />
      <Skeleton width="60%" height={20} radius={8} />
      <View className="pt-3 border-t border-[#E5E7EB] mt-1">
        <Skeleton width="100%" height={16} radius={8} />
      </View>
    </View>
  );
};
