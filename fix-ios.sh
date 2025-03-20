#!/bin/bash

# Make script executable
chmod +x fix-ios.sh

echo "Fixing iOS integration issues..."

# Create a temporary React Native project to get the proper iOS files
echo "Creating temporary React Native project..."
cd /tmp
npx react-native init TempLoanSync --template react-native-template-typescript

# Copy the iOS folder to our project
echo "Copying iOS files to our project..."
cp -R /tmp/TempLoanSync/ios/* /Users/vastav/WebstormProjects/loansync/ios/

# Clean up
echo "Cleaning up..."
rm -rf /tmp/TempLoanSync

# Update app name in iOS files
echo "Updating app name in iOS files..."
cd /Users/vastav/WebstormProjects/loansync/ios
find . -type f -name "*.xcodeproj" -o -name "*.pbxproj" -o -name "*.plist" -o -name "*.h" -o -name "*.m" | xargs sed -i '' 's/TempLoanSync/loansync/g'

# Install pods
echo "Installing CocoaPods dependencies..."
cd /Users/vastav/WebstormProjects/loansync/ios
pod install

echo "iOS integration fixed! You can now run 'npm run ios' to launch the app in the iOS simulator."