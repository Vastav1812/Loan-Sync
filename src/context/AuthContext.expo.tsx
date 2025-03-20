import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  biometricLogin: () => Promise<boolean>;
  isBiometricAvailable: boolean;
  enableBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
  biometricLogin: async () => false,
  isBiometricAvailable: false,
  enableBiometric: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const available = await LocalAuthentication.hasHardwareAsync();
        setIsBiometricAvailable(available);
      } catch (error) {
        console.error('Biometric check failed:', error);
        setIsBiometricAvailable(false);
      }
    };

    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBiometrics();
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      if (email && password) {
        const mockUser = {
          id: '1',
          name: 'Demo User',
          email,
        };
        
        setUser(mockUser);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('biometricEnabled');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to register
      // For demo purposes, we'll simulate a successful registration
      if (name && email && password) {
        const mockUser = {
          id: '1',
          name,
          email,
        };
        
        setUser(mockUser);
        await AsyncStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const biometricLogin = async (): Promise<boolean> => {
    try {
      const biometricEnabled = await AsyncStorage.getItem('biometricEnabled');
      if (!biometricEnabled || biometricEnabled !== 'true') {
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to LoanSync'
      });
      
      if (result.success) {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Biometric login failed:', error);
      return false;
    }
  };

  const enableBiometric = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to enable biometric login'
      });
      
      if (result.success) {
        await AsyncStorage.setItem('biometricEnabled', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Enable biometric failed:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        biometricLogin,
        isBiometricAvailable,
        enableBiometric,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};