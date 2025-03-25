import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Logo from '../../components/Logo';

type WelcomeScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { biometricLogin, isBiometricAvailable } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBiometricLogin = async () => {
    if (!isBiometricAvailable) return;
    
    setIsLoading(true);
    try {
      await biometricLogin();
    } catch (error) {
      console.error('Biometric login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Check if biometric login is available on app start
    if (isBiometricAvailable) {
      handleBiometricLogin();
    }
  }, []);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Logo size="large" />
          <Text style={[styles.appName, { color: theme.text }]}>LoanSync</Text>
        </View>
        
        <Text style={[styles.tagline, { color: theme.text }]}>
          Simplify your loan management
        </Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              Track all your loans in one place
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              Get payment reminders
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Icon name="check-circle" size={24} color={theme.primary} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              View detailed financial insights
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.registerButton, { borderColor: theme.primary }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.registerButtonText, { color: theme.primary }]}>
            Create Account
          </Text>
        </TouchableOpacity>
        
        {isBiometricAvailable && (
          <TouchableOpacity
            style={[
              styles.biometricButton,
              { backgroundColor: isLoading ? theme.disabled : theme.card },
            ]}
            onPress={handleBiometricLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.primary} />
            ) : (
              <>
                <Icon name="fingerprint" size={24} color={theme.primary} />
                <Text style={[styles.biometricButtonText, { color: theme.text }]}>
                  Sign in with Biometrics
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 24 : 24,
  },
  content: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 16,
  },
  tagline: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 48,
  },
  features: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttons: {
    width: '100%',
    marginBottom: 24,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 16,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricButtonText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default WelcomeScreen;