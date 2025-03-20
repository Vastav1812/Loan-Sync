import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, logout, isBiometricAvailable, enableBiometric } = useAuth();
  
  const [isEnablingBiometric, setIsEnablingBiometric] = useState(false);
  
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };
  
  const handleEnableBiometric = async () => {
    if (!isBiometricAvailable) {
      Alert.alert(
        'Not Available',
        'Biometric authentication is not available on this device.'
      );
      return;
    }
    
    setIsEnablingBiometric(true);
    try {
      const success = await enableBiometric();
      if (success) {
        Alert.alert('Success', 'Biometric login has been enabled.');
      } else {
        Alert.alert('Failed', 'Failed to enable biometric login.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while enabling biometric login.');
      console.error(error);
    } finally {
      setIsEnablingBiometric(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileSection}>
          <View
            style={[
              styles.profileIconContainer,
              { backgroundColor: theme.primary + '20' },
            ]}
          >
            <Icon name="account" size={40} color={theme.primary} />
          </View>
          
          <Text style={[styles.profileName, { color: theme.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.text }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Appearance
          </Text>
          
          <View
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="theme-light-dark" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Dark Mode
              </Text>
            </View>
            
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.disabled, true: theme.primary + '80' }}
              thumbColor={isDark ? theme.primary : theme.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Security
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
            onPress={handleEnableBiometric}
            disabled={isEnablingBiometric || !isBiometricAvailable}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="fingerprint" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Enable Biometric Login
              </Text>
            </View>
            
            {isEnablingBiometric ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <Icon
                name="chevron-right"
                size={24}
                color={
                  isBiometricAvailable ? theme.text : theme.disabled
                }
              />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="lock-reset" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Change Password
              </Text>
            </View>
            
            <Icon name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Notifications
          </Text>
          
          <View
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="bell" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Payment Reminders
              </Text>
            </View>
            
            <Switch
              value={true}
              trackColor={{ false: theme.disabled, true: theme.primary + '80' }}
              thumbColor={true ? theme.primary : theme.card}
            />
          </View>
          
          <View
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="bell-ring" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Due Date Alerts
              </Text>
            </View>
            
            <Switch
              value={true}
              trackColor={{ false: theme.disabled, true: theme.primary + '80' }}
              thumbColor={true ? theme.primary : theme.card}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About
          </Text>
          
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="information" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                App Version
              </Text>
            </View>
            
            <Text style={[styles.versionText, { color: theme.text }]}>1.0.0</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="file-document" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Privacy Policy
              </Text>
            </View>
            
            <Icon name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: theme.border }]}
          >
            <View style={styles.settingItemLeft}>
              <Icon name="help-circle" size={24} color={theme.text} />
              <Text style={[styles.settingItemText, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            
            <Icon name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingItemText: {
    fontSize: 16,
    marginLeft: 16,
  },
  versionText: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SettingsScreen;