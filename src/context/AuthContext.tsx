import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { UserDatabase, User as DatabaseUser } from '../services/UserDatabase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; isRegistered: boolean }>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; userExists: boolean }>;
  biometricLogin: () => Promise<boolean>;
  isBiometricAvailable: boolean;
  enableBiometric: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, isRegistered: false }),
  logout: async () => {},
  register: async () => ({ success: false, userExists: false }),
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
        const userData = await AsyncStorage.getItem('currentUser');
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

  const login = async (email: string, password: string): Promise<{ success: boolean; isRegistered: boolean }> => {
    try {
      // First, check if user exists
      const userExists = await UserDatabase.findUserByEmail(email);
      
      // If user doesn't exist, return failure with isRegistered = false
      if (!userExists) {
        return { success: false, isRegistered: false };
      }
      
      // Validate credentials
      const validUser = await UserDatabase.verifyCredentials(email, password);
      
      if (validUser) {
        // Create a safe user object (without password)
        const safeUser: User = {
          id: validUser.id,
          name: validUser.name,
          email: validUser.email,
        };
        
        setUser(safeUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(safeUser));
        return { success: true, isRegistered: true };
      }
      
      // Invalid password but user exists
      return { success: false, isRegistered: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, isRegistered: false };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('currentUser');
      await AsyncStorage.removeItem('biometricEnabled');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; userExists: boolean }> => {
    try {
      // Check if user already exists
      const existingUser = await UserDatabase.findUserByEmail(email);
      
      if (existingUser) {
        return { success: false, userExists: true };
      }
      
      // Create new user
      const newUser = await UserDatabase.createUser(name, email, password);
      
      if (newUser) {
        // Create a safe user object (without password)
        const safeUser: User = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        };
        
        setUser(safeUser);
        await AsyncStorage.setItem('currentUser', JSON.stringify(safeUser));
        return { success: true, userExists: false };
      }
      
      return { success: false, userExists: false };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, userExists: false };
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
        const userData = await AsyncStorage.getItem('currentUser');
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