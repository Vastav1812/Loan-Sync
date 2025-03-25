# LoanSync - A Unified Loan Management Platform

LoanSync is a React Native mobile application that allows users to track and manage all their loans from different banks in one place. The app provides a centralized dashboard for monitoring loan details, EMI payments, and overall financial health.

![LoanSync Logo](assets/icon.png)

## Current State

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

## Upcoming Features

- Account Aggregator (AA) framework integration for secure loan data access
- Bank API integrations for major Indian banks
- SMS parsing for loan updates
- Real-time loan tracking across multiple financial institutions
- UPI payment integration for EMI payments
- Multi-language support for regional Indian languages

## Prerequisites

- Node.js (v16 or newer)
- Yarn or npm
- Expo CLI
- iOS Simulator / Android Emulator or physical device for testing

## Installation

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

## Running the Application

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

## Project Structure

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

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- AsyncStorage for local data storage
- Expo Local Authentication for biometrics

## Security

The app implements several security best practices:
- Secure storage for sensitive data
- Authentication state management
- User input validation
- Error handling

Note: In a production environment, passwords would be properly hashed and all API communications would be encrypted.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Project Owner: Vastav Bishnoi
GitHub: [Vastav1812](https://github.com/Vastav1812)