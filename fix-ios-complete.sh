#!/bin/bash

# Make script executable
chmod +x fix-ios-complete.sh

echo "Fixing iOS integration issues completely..."

# Create a new React Native project with the correct name
echo "Creating a new React Native project with the correct name..."
cd /tmp
npx react-native init loansync --template react-native-template-typescript

# Copy the iOS folder to our project
echo "Copying iOS files to our project..."
rm -rf /Users/vastav/WebstormProjects/loansync/ios
cp -R /tmp/loansync/ios /Users/vastav/WebstormProjects/loansync/

# Copy the Android folder if needed
echo "Copying Android files to our project..."
if [ ! -d "/Users/vastav/WebstormProjects/loansync/android" ]; then
  cp -R /tmp/loansync/android /Users/vastav/WebstormProjects/loansync/
fi

# Clean up
echo "Cleaning up..."
rm -rf /tmp/loansync

# Install pods
echo "Installing CocoaPods dependencies..."
cd /Users/vastav/WebstormProjects/loansync/ios
pod install

echo "iOS integration fixed! You can now run 'npm run ios' to launch the app in the iOS simulator."