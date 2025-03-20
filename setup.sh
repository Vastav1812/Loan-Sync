#!/bin/bash

# Make script executable
chmod +x setup.sh

# Install dependencies
echo "Installing dependencies..."
npm install

# iOS specific setup
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "Setting up iOS project..."
  cd ios
  pod install
  cd ..
fi

# Start the Metro bundler
echo "Starting Metro bundler..."
npm start