// This is a simple logo component that renders a text-based logo
// In a real app, you would use an actual image file
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogoPlaceholder = ({ size = 100, color = '#4A6FFF' }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Text style={[styles.text, { color }]}>LS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    backgroundColor: 'rgba(74, 111, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
  },
});

export default LogoPlaceholder;