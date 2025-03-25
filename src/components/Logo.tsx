import React from 'react';
import { View, StyleSheet } from 'react-native';
import LoanSyncLogoSimple from '../assets/LoanSyncLogoSimple';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: object;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', style }) => {
  const getSize = () => {
    switch(size) {
      case 'small':
        return 50;
      case 'large':
        return 150;
      case 'medium':
      default:
        return 100;
    }
  };

  const logoSize = getSize();

  return (
    <View style={[styles.container, style]}>
      <LoanSyncLogoSimple width={logoSize} height={logoSize} />
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