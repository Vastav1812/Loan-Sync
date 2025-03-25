import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoanSyncLogo from '../assets/LoanSyncLogo';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium',
  color
}) => {
  const getDimensions = () => {
    switch (size) {
      case 'small':
        return { width: 60, height: 60 };
      case 'large':
        return { width: 200, height: 200 };
      case 'medium':
      default:
        return { width: 120, height: 120 };
    }
  };

  const { width, height } = getDimensions();

  return (
    <View style={styles.container}>
      <LoanSyncLogo width={width} height={height} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Logo; 