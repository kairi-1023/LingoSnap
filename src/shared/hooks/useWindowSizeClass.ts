import { useWindowDimensions } from 'react-native';

export type WidthSizeClass = 'compact' | 'medium' | 'expanded';

export interface WindowSizeClassInfo {
  width: number;
  height: number;
  widthClass: WidthSizeClass;
  isCompact: boolean;     // width < 600dp (일반 스마트폰 세로)
  isMedium: boolean;      // 600dp <= width < 840dp (폴더블 펼침, 소형 태블릿, 가로 모드)
  isExpanded: boolean;    // width >= 840dp (대형 태블릿, DeX/Desktop)
  isLandscape: boolean;   // width > height (가로 모드)
  isSmallWidth: boolean;  // width < 360dp (초소형 폰)
  isShortHeight: boolean; // height < 680dp (세로 길이가 짧은 폰)
}

/**
 * Global Standardized Responsive Hook (Material 3 Window Size Classes)
 * Automatically triggers component re-render on Orientation Change, Split Screen, or Window Resize.
 */
export function useWindowSizeClass(): WindowSizeClassInfo {
  const { width, height } = useWindowDimensions();

  const widthClass: WidthSizeClass =
    width < 600 ? 'compact' : width < 840 ? 'medium' : 'expanded';

  return {
    width,
    height,
    widthClass,
    isCompact: widthClass === 'compact',
    isMedium: widthClass === 'medium',
    isExpanded: widthClass === 'expanded',
    isLandscape: width > height,
    isSmallWidth: width < 360,
    isShortHeight: height < 680,
  };
}

export default useWindowSizeClass;
