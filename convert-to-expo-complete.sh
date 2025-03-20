#!/bin/bash

# Make script executable
chmod +x convert-to-expo-complete.sh

echo "Converting LoanSync to an Expo project..."

# Install necessary Expo packages
echo "Installing Expo core packages..."
npm install expo expo-status-bar expo-updates expo-splash-screen expo-local-authentication expo-datetime-picker

# Install other dependencies through Expo
echo "Installing other dependencies through Expo..."
npm install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/stack
npm install date-fns react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npm install react-native-svg react-native-vector-icons

# Remove react-native-biometrics as we'll use expo-local-authentication instead
npm uninstall react-native-biometrics

# Create app.json for Expo
echo "Creating app.json for Expo..."
cat > app.json << EOL
{
  "expo": {
    "name": "LoanSync",
    "slug": "loansync",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      }
    }
  }
}
EOL

# Create assets directory and placeholder images
echo "Creating assets directory and placeholder images..."
mkdir -p assets
echo "This is a placeholder image file" > assets/icon.png
echo "This is a placeholder image file" > assets/splash.png
echo "This is a placeholder image file" > assets/adaptive-icon.png

# Create babel.config.js for Expo
echo "Creating babel.config.js for Expo..."
cat > babel.config.js << EOL
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOL

# Update package.json scripts
echo "Updating package.json scripts..."
npm pkg set scripts.start="expo start"
npm pkg set scripts.android="expo start --android"
npm pkg set scripts.ios="expo start --ios"
npm pkg set scripts.web="expo start --web"

# Replace App.tsx with Expo-compatible version
echo "Replacing App.tsx with Expo-compatible version..."
cp App.expo.tsx App.tsx

# Replace AuthContext.tsx with Expo-compatible version
echo "Replacing AuthContext.tsx with Expo-compatible version..."
cp src/context/AuthContext.expo.tsx src/context/AuthContext.tsx

# Create a simple index.js file for Expo
echo "Creating index.js for Expo..."
cat > index.js << EOL
import { registerRootComponent } from 'expo';
import App from './App';

// Register the main component
registerRootComponent(App);
EOL

# Remove iOS and Android directories (Expo will handle these)
echo "Removing iOS and Android directories (Expo will handle these)..."
rm -rf ios android

echo "Conversion to Expo complete! You can now run the app with:"
echo "npm start"
echo ""
echo "Then press 'i' to open in iOS simulator or scan the QR code with the Expo Go app on your device."