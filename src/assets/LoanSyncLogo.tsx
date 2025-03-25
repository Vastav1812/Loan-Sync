import React from 'react';
import Svg, { Path, Circle, G, Rect, LinearGradient, Stop, Defs } from 'react-native-svg';

interface LoanSyncLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

const LoanSyncLogo: React.FC<LoanSyncLogoProps> = ({
  width = 200,
  height = 200,
  color = '#5C6BC0',
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 200">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#5C6BC0" />
          <Stop offset="100%" stopColor="#3949AB" />
        </LinearGradient>
        <LinearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#42A5F5" />
          <Stop offset="100%" stopColor="#1E88E5" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="100" cy="100" r="95" fill="#F5F5F5" />
      
      {/* Main Shield Shape */}
      <Path
        d="M100,20 L160,40 C160,40 170,120 100,170 C30,120 40,40 40,40 L100,20"
        fill="url(#logoGradient)"
      />
      
      {/* Inner Circle */}
      <Circle cx="100" cy="95" r="40" fill="url(#circleGradient)" />
      
      {/* Rupee Symbol */}
      <G transform="translate(80, 77)">
        <Path
          d="M20,0 H10 M20,10 H10 M20,20 H10 M10,0 C0,0 0,20 10,20 M18,30 L12,10"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </G>
      
      {/* Arrow for Sync */}
      <Path
        d="M85,125 A25,25 0 1,1 115,125 M115,115 L115,135 L135,125 Z"
        fill="white"
        stroke="white"
        strokeWidth="1"
      />
    </Svg>
  );
};

export default LoanSyncLogo; 