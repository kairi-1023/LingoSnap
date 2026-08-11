import React from 'react';
import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface LogoProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const Logo: React.FC<LogoProps> = ({
  width = 180,
  height = 150,
  style,
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 475 401"
      fill="none"
      style={style}
    >
      <Path
        d="M20 118V103C20 49 64 20 115 20H367C412 20 439 53 412 97L306 263C287 293 305 283 330 283H455"
        stroke="#3F7D58"
        strokeWidth={40}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20 118H131C156 118 165 138 151 159L63 294C41 328 54 380 112 380"
        stroke="#3F7D58"
        strokeWidth={40}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M284 119L158 309C137 340 157 381 198 381H338C402 381 446 341 455 283"
        stroke="#3F7D58"
        strokeWidth={40}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
