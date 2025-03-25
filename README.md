# LoanSync - A Unified Loan Management Platform

<p align="center">
  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEElEQVR4nO1aXWhcRRT+Npu0Dd0m0SZ1E5ImabZNY5OmJNmYGm2JVRORglgQQYT6IOiLKFQQFaH44JNPBfEHihSKIPjii9nihdhSG2vd/GwSk2w2aSExdDfppk2bmZ6ZO3M3s7vZTXbv3Du7Kfng49699+zMmfPNmTlnZhV8xwMABgCMALAA1C3jWQIwD+ArgDKfAQmVJgB9Dlda+TIL4HEASc7jSwvA5JoGLnAA2ABacnwTpQB+AuBaJGrDmZqpAmA4vHkGgFbHPVlnAdhwZMBvZZrPAXgbwCOO6ggqc7JYF6qP24EJwCQU5AXKvUgTgLNQkA1gsA7sRXHZBJAK0SgLdeKvs3SQ/8Bn1G18wNnb0KV8j+I93FKUBqVXWFRdyUlWMkV6iRc4mWq/IeIJwDIUxAKQsMz5ygC+9NnYUwAqZAYlLChB4Rt8JkcW8ycHhjwEkADgogj4NwAVEWPPkQDGQ3WRNv5zFqbCCEA3F/ZXRXSlDFEXMPfvRYZ/jYPVp8JEyH4m7EsZuiqOQEYAfQfgfYeBZQzDfHKUObB/PxfWVTH6kwB+AOBy0XVj1GqPAnjLcZPHeZJSFUIXhQBU35BaAe0ARiGBRKw6QA63eYjXDkMAalQKYN1sCmIwUAdmQrAIhYlQscIH9wT/Uw34CUXKekqEtgcP1cG5kJ82Iv76AQsg06CZL9ry6E8YeI8RgN2rTULLH7Y5YdnYJ4d8gvb3mDrSWdKv6WkEgJZMVODdAaDdqe8EcORfve5tEscf1afu0up2JTW7t7rvpTyFvmHpnvGpUzdHZFCWx6dODckw9qjuHs/U9XKcmrmX59r5Pq6tO2SnRr71Jx+dkj36BmGvqX34StxKb2WPSXGc0H3JKbRoIz7lhO6bvBzWTQC2+QaE6JXtV/IVQJKtk/MImrzGfshXAOc8+pDH+HK+ApgB8KFH38ccPXhwI+G3GZcmLDKQjYF5XA93uDYBuARgn48RmwC85xhfwZ7+NeS22BHH+ARbFxhjHHIYcT/k2CBZ5jM2fSTTOBsFE5yp/z0A97LEJSsotFkA3gTwKIMfBPgJX7Pvf/gV1EFeYA+A5wCcAnALwMUiOr9HxYGNuHuMDt5VnmcRXE3KBrJ5wO5CoW2vMLhUTq/BoH1AqT3AqKx9QKmhXgCF4LmqCwL1ApDDfQEUyOmmsjVxUdcCaJDZCUbi1RO8eIBH7Kh7D+A1C/R3OgfQGRyZXeEgk6H53oC2wp7EBUB9lgCMAHgWwD025W8C+BzAd1xGWA3kAWoxI7jq4RBXJpDprzl1gLM5hkXOOdY9DlCn6JUuMgK4wPXJeMbjfVP0SheZXWAt7QZzITsOUKforXUcQG5wjRECX+PcgZrz6D/H/R7nZPPEqxPcFR6wHgc2OCHwVa4tZYpDnH3MhL7dLADY4lDYQyxzZIgG30M5HGKj8zlWkJkA8CrnSCPuA/bw9XpgEcBJdnSgC/YlLs6PsC/0rNAHAP4EcHWZ0SHwHVuSs8wwgHf5Dq8APnMGt72hg12C73Ge1yzl2XDewyhuM2zzEdyB3IXJ70dGIe9rFgDcDniCH4AXCxmwXOADvjq7TgJYDnjSccBeSPvubxr5B/dOg3vn5RsAH3ElbZNHOcv3/y9zjXCaJzYM4Lc4zPjfOWY0AvEFzQAAAABJRU5ErkJggg==" alt="LoanSync Logo" width="100" height="100"/>
</p>

<h3 align="center">Simplify Your Loan Management</h3>

LoanSync is a React Native mobile application that allows users to track and manage all their loans from different banks in one place. The app provides a centralized dashboard for monitoring loan details, EMI payments, and overall financial health.

## ✨ Current State

The application is currently in active development with the following features implemented:

- **User Authentication System**: 
  - User registration and login functionality
  - Secure password management
  - Error handling for non-registered users attempting to login
  - Biometric authentication support

- **Database Integration**:
  - Local AsyncStorage-based user database
  - Multi-level authentication checks

The app is being developed with a focus on the Indian banking market, with plans to integrate with Account Aggregator framework and various Indian banking APIs.

## 🚀 Upcoming Features

- Account Aggregator (AA) framework integration for secure loan data access
- Bank API integrations for major Indian banks
- SMS parsing for loan updates
- Real-time loan tracking across multiple financial institutions
- UPI payment integration for EMI payments
- Multi-language support for regional Indian languages

## 📋 Prerequisites

- Node.js (v18 or newer)
- Yarn or npm
- Expo CLI
- iOS Simulator / Android Emulator or physical device for testing

## 💻 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vastav1812/Loan-Sync.git
   cd Loan-Sync
   ```

2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

3. Install Expo CLI (if not already installed):
   ```bash
   npm install -g expo-cli
   ```

## 🚀 Running the Application

### Using Expo

```bash
npx expo start
```

This will start the Metro bundler and display a QR code in your terminal. You can:
- Scan the QR code with your device's camera (iOS) or the Expo Go app (Android)
- Press 'i' to open in iOS simulator
- Press 'a' to open in Android emulator

### Running on iOS

```bash
# Using Expo
npx expo start --ios

# Using React Native CLI (if ejected)
yarn ios
# or
npm run ios
```

### Running on Android

```bash
# Using Expo
npx expo start --android

# Using React Native CLI (if ejected)
yarn android
# or
npm run android
```

## 📁 Project Structure

```
loansync/
├── src/                    # Source files
│   ├── assets/             # Static assets
│   ├── components/         # Reusable components
│   ├── context/            # Context providers
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   └── main/           # Main app screens
│   └── services/           # API and service integrations
├── assets/                 # External assets
├── App.tsx                 # Main app component
├── app.json                # Expo configuration
├── babel.config.js         # Babel configuration
├── package.json            # Dependencies and scripts
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage for local data storage
- Expo Local Authentication for biometrics

## 🔒 Security

The app implements several security best practices:
- Secure storage for sensitive data
- Authentication state management
- User input validation
- Error handling

Note: In a production environment, passwords would be properly hashed and all API communications would be encrypted.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📱 Contact

Project Owner: Vastav Bishnoi  
GitHub: [Vastav1812](https://github.com/Vastav1812)