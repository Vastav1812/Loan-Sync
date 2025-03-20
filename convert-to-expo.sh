#!/bin/bash

# Make script executable
chmod +x convert-to-expo.sh

echo "Converting LoanSync to an Expo project..."

# Save the current directory
CURRENT_DIR=$(pwd)

# Install expo CLI if not already installed
echo "Installing Expo CLI..."
npm install -g expo-cli

# Initialize Expo in the current project
echo "Initializing Expo in the current project..."
expo init --name LoanSync --template blank

# Install necessary Expo dependencies
echo "Installing Expo dependencies..."
npx expo install expo-status-bar expo-updates expo-splash-screen expo-local-authentication
npx expo install @react-native-async-storage/async-storage @react-navigation/bottom-tabs @react-navigation/native @react-navigation/stack
npx expo install date-fns react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npx expo install react-native-svg react-native-vector-icons
npx expo install expo-chart-kit

# Update package.json scripts
echo "Updating package.json scripts..."
sed -i '' 's/"start": "react-native start"/"start": "expo start"/' package.json
sed -i '' 's/"android": "react-native run-android"/"android": "expo start --android"/' package.json
sed -i '' 's/"ios": "react-native run-ios"/"ios": "expo start --ios"/' package.json
sed -i '' 's/"ios-fixed": "react-native run-ios --scheme loansync"/"web": "expo start --web"/' package.json

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
    "updates": {
      "fallbackToCacheTimeout": 0
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
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
EOL

# Create assets directory and placeholder images
echo "Creating assets directory and placeholder images..."
mkdir -p assets
touch assets/icon.png assets/splash.png assets/adaptive-icon.png assets/favicon.png

# Update App.tsx to use Expo
echo "Updating App.tsx to use Expo..."
sed -i '' 's/import { StatusBar, LogBox, useColorScheme } from '\''react-native'\'';/import { StatusBar, LogBox, useColorScheme } from '\''react-native'\'';\\nimport { registerRootComponent } from '\''expo'\'';/' App.tsx
echo "registerRootComponent(App);" >> App.tsx

# Update AuthContext.tsx to use Expo's LocalAuthentication instead of react-native-biometrics
echo "Updating AuthContext.tsx to use Expo's LocalAuthentication..."
sed -i '' 's/import ReactNativeBiometrics, { BiometryTypes } from '\''react-native-biometrics'\'';/import * as LocalAuthentication from '\''expo-local-authentication'\'';/' src/context/AuthContext.tsx
sed -i '' 's/const rnBiometrics = new ReactNativeBiometrics();//' src/context/AuthContext.tsx
sed -i '' 's/const { available, biometryType } = await rnBiometrics.isSensorAvailable();/const available = await LocalAuthentication.hasHardwareAsync();/' src/context/AuthContext.tsx
sed -i '' 's/setIsBiometricAvailable(available && biometryType !== BiometryTypes.NOT_AVAILABLE);/setIsBiometricAvailable(available);/' src/context/AuthContext.tsx
sed -i '' 's/const { success } = await rnBiometrics.simplePrompt({/const success = await LocalAuthentication.authenticateAsync({/' src/context/AuthContext.tsx
sed -i '' 's/promptMessage: '\''Authenticate to LoanSync'\''/promptMessage: '\''Authenticate to LoanSync'\''/' src/context/AuthContext.tsx
sed -i '' 's/const { success } = await rnBiometrics.simplePrompt({/const success = await LocalAuthentication.authenticateAsync({/' src/context/AuthContext.tsx
sed -i '' 's/promptMessage: '\''Authenticate to enable biometric login'\''/promptMessage: '\''Authenticate to enable biometric login'\''/' src/context/AuthContext.tsx

# Remove iOS and Android directories (Expo will handle these)
echo "Removing iOS and Android directories (Expo will handle these)..."
rm -rf ios android

# Create a babel.config.js file for Expo
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

echo "Conversion to Expo complete! You can now run the app with:"
echo "npm start"
echo ""
echo "Then press 'i' to open in iOS simulator or scan the QR code with the Expo Go app on your device."