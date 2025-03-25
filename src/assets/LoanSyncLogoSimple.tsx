import React from 'react';
import { Svg, Circle, Path, Defs, LinearGradient, Stop, G } from 'react-native-svg';

interface LoanSyncLogoSimpleProps {
  width?: number;
  height?: number;
}

const LoanSyncLogoSimple: React.FC<LoanSyncLogoSimpleProps> = ({ 
  width = 100, 
  height = 100 
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#4054B2" />
          <Stop offset="100%" stopColor="#2D3A8C" />
        </LinearGradient>
        <LinearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FF9D00" />
          <Stop offset="100%" stopColor="#FFD54F" />
        </LinearGradient>
      </Defs>
      
      {/* Background Circle */}
      <Circle cx="50" cy="50" r="48" fill="url(#bgGradient)" />
      
      {/* Rupee Symbol */}
      <G>
        <Path 
          d="M50 20 L50 80 M37 32 L63 32 M37 52 L63 52 M45 32 L55 80" 
          stroke="white" 
          strokeWidth="5" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </G>
      
      {/* Sync Circle */}
      <Circle cx="75" cy="75" r="20" fill="url(#accentGradient)" />
      
      {/* Sync Arrows */}
      <Path
        d="M75 65 L75 75 L85 75 M75 85 L75 75 L65 75"
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LoanSyncLogoSimple; 