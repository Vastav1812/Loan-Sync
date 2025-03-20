#!/bin/bash

# Make script executable
chmod +x fix-expo-setup.sh

echo "Fixing Expo setup for LoanSync..."

# Install expo-datetime-picker
echo "Installing expo-datetime-picker..."
npm install expo-datetime-picker

# Create a simple app.json if it doesn't exist
if [ ! -f "app.json" ]; then
  echo "Creating app.json..."
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
fi

# Create assets directory if it doesn't exist
if [ ! -d "assets" ]; then
  echo "Creating assets directory..."
  mkdir -p assets
  echo "Creating placeholder images..."
  echo "This is a placeholder image file" > assets/icon.png
  echo "This is a placeholder image file" > assets/splash.png
  echo "This is a placeholder image file" > assets/adaptive-icon.png
fi

# Create babel.config.js if it doesn't exist
if [ ! -f "babel.config.js" ]; then
  echo "Creating babel.config.js..."
  cat > babel.config.js << EOL
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
EOL
fi

# Update package.json scripts
echo "Updating package.json scripts..."
npm pkg set scripts.start="expo start"
npm pkg set scripts.android="expo start --android"
npm pkg set scripts.ios="expo start --ios"
npm pkg set scripts.web="expo start --web"

echo "Expo setup fixed! You can now run the app with:"
echo "npm start"