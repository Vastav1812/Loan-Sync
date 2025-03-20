# LoanSync

A sleek, modern app for managing all your loans in one place.

## Features

- **Loan Aggregation Dashboard**: View all your loans in a unified dashboard
- **Payment Hub**: Pay EMIs directly from the app
- **Progress Tracking**: Visual progress bars showing loan payoff status
- **Financial Insights**: AI-driven tips to save on interest
- **Advanced UI**: Dark/light mode, interactive charts, and gesture-based navigation
- **Security**: Biometric authentication and data encryption

## Tech Stack

- **Frontend**: React Native with TypeScript
- **State Management**: React Context API
- **UI Components**: Custom components with theming support
- **Charts**: react-native-chart-kit
- **Authentication**: Biometric authentication with react-native-biometrics
- **Storage**: AsyncStorage for local data persistence

## Getting Started

### Prerequisites

- Node.js (>= 16)
- npm or yarn
- React Native development environment set up

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/loansync.git
   cd loansync
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the Metro bundler:
   ```
   npm start
   # or
   yarn start
   ```

4. Run the app on Android:
   ```
   npm run android
   # or
   yarn android
   ```

5. Run the app on iOS:
   ```
   npm run ios
   # or
   yarn ios
   ```

## Project Structure

```
loansync/
├── src/
│   ├── assets/           # Images, fonts, and other static assets
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context for state management
│   ├── navigation/       # Navigation configuration
│   ├── screens/          # App screens
│   │   ├── auth/         # Authentication screens
│   │   └── main/         # Main app screens
│   └── utils/            # Utility functions
├── App.tsx               # Main app component
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Usage

### Authentication

The app includes a demo authentication system. You can use any email and password to log in for demonstration purposes.

### Adding Loans

1. Navigate to the Dashboard
2. Tap the "+" button in the top right corner
3. Fill in the loan details
4. Tap "Add Loan"

### Making Payments

1. Navigate to the Payments tab
2. Select a loan from the list
3. Enter the payment amount
4. Choose a payment method
5. Confirm the payment

## Customization

### Themes

The app includes multiple themes:
- Light
- Dark
- System Default (follows device settings)
- Neon Night
- Ocean Breeze

To change the theme, go to Settings > Appearance > Theme.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React Native](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit)
- [react-native-biometrics](https://github.com/SelfLender/react-native-biometrics)