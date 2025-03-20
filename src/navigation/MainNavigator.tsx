import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../context/ThemeContext';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import PaymentScreen from '../screens/main/PaymentScreen';
import InsightsScreen from '../screens/main/InsightsScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import LoanDetailScreen from '../screens/main/LoanDetailScreen';
import AddLoanScreen from '../screens/main/AddLoanScreen';
import PaymentConfirmationScreen from '../screens/main/PaymentConfirmationScreen';
import PaymentHistoryScreen from '../screens/main/PaymentHistoryScreen';
import ProgressTrackerScreen from '../screens/main/ProgressTrackerScreen';

// Stack param lists
export type HomeStackParamList = {
  Home: undefined;
  LoanDetail: { loanId: string };
  AddLoan: undefined;
};

export type PaymentStackParamList = {
  PaymentHub: undefined;
  PaymentConfirmation: { loanId: string; amount: number };
  PaymentHistory: { loanId?: string };
};

export type InsightsStackParamList = {
  Insights: undefined;
  ProgressTracker: { loanId: string };
};

export type SettingsStackParamList = {
  Settings: undefined;
};

// Tab param list
export type MainTabParamList = {
  HomeStack: undefined;
  PaymentStack: undefined;
  InsightsStack: undefined;
  SettingsStack: undefined;
};

// Create the stack navigators
const HomeStack = createStackNavigator<HomeStackParamList>();
const PaymentStack = createStackNavigator<PaymentStackParamList>();
const InsightsStack = createStackNavigator<InsightsStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

// Stack navigators
const HomeStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <HomeStack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Dashboard' }}
      />
      <HomeStack.Screen 
        name="LoanDetail" 
        component={LoanDetailScreen} 
        options={({ route }) => ({ title: 'Loan Details' })}
      />
      <HomeStack.Screen 
        name="AddLoan" 
        component={AddLoanScreen} 
        options={{ title: 'Add New Loan' }}
      />
    </HomeStack.Navigator>
  );
};

const PaymentStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <PaymentStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <PaymentStack.Screen 
        name="PaymentHub" 
        component={PaymentScreen} 
        options={{ title: 'Payment Hub' }}
      />
      <PaymentStack.Screen 
        name="PaymentConfirmation" 
        component={PaymentConfirmationScreen} 
        options={{ title: 'Confirm Payment' }}
      />
      <PaymentStack.Screen 
        name="PaymentHistory" 
        component={PaymentHistoryScreen} 
        options={{ title: 'Payment History' }}
      />
    </PaymentStack.Navigator>
  );
};

const InsightsStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <InsightsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <InsightsStack.Screen 
        name="Insights" 
        component={InsightsScreen} 
        options={{ title: 'Financial Insights' }}
      />
      <InsightsStack.Screen 
        name="ProgressTracker" 
        component={ProgressTrackerScreen} 
        options={{ title: 'Progress Tracker' }}
      />
    </InsightsStack.Navigator>
  );
};

const SettingsStackNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: theme.background },
      }}
    >
      <SettingsStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </SettingsStack.Navigator>
  );
};

// Main tab navigator
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  const { theme, isDark } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.disabled,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          elevation: 0,
          shadowOpacity: 0,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="PaymentStack"
        component={PaymentStackNavigator}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <Icon name="credit-card" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="InsightsStack"
        component={InsightsStackNavigator}
        options={{
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-line" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;