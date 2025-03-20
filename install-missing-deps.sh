#!/bin/bash

# Make script executable
chmod +x install-missing-deps.sh

echo "Installing missing dependencies..."

# Install expo-datetime-picker
npm install expo-datetime-picker

# Install other potentially missing dependencies
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/stack

echo "Dependencies installed successfully!"