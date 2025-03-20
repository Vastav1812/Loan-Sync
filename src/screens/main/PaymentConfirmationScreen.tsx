import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

type PaymentConfirmationScreenRouteProp = RouteProp<PaymentStackParamList, 'PaymentConfirmation'>;
type PaymentConfirmationScreenNavigationProp = StackNavigationProp<PaymentStackParamList, 'PaymentConfirmation'>;

const PaymentConfirmationScreen = () => {
  const route = useRoute<PaymentConfirmationScreenRouteProp>();
  const navigation = useNavigation<PaymentConfirmationScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { loans, makePayment } = useLoan();
  
  const { loanId, amount: initialAmount } = route.params;
  const [amount, setAmount] = useState(initialAmount.toString());
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'upi' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const loan = loans.find(l => l.id === loanId);
  
  if (!loan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.text }]}>
            Loan not found
          </Text>
        </View>
      </View>
    );
  }
  
  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid payment amount');
      return;
    }
    
    setIsProcessing(true);
    try {
      const success = await makePayment(
        loanId,
        parseFloat(amount),
        selectedMethod
      );
      
      if (success) {
        Alert.alert(
          'Payment Successful',
          `Your payment of ₹${parseFloat(amount).toLocaleString()} has been processed successfully.`,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('PaymentHub'),
            },
          ]
        );
      } else {
        Alert.alert(
          'Payment Failed',
          'There was an error processing your payment. Please try again.'
        );
      }
    } catch (error) {
      Alert.alert(
        'Payment Error',
        'An unexpected error occurred. Please try again later.'
      );
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getLoanTypeIcon = (type: string): string => {
    switch (type) {
      case 'phone':
        return 'cellphone';
      case 'car':
        return 'car';
      case 'property':
        return 'home';
      case 'personal':
        return 'account';
      default:
        return 'credit-card';
    }
  };
  
  const getLoanTypeColor = (type: string): string => {
    switch (type) {
      case 'phone':
        return '#FF6B6B';
      case 'car':
        return '#4ECDC4';
      case 'property':
        return '#5E5CE6';
      case 'personal':
        return '#FFD166';
      default:
        return '#A5A5A5';
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
        <View style={[styles.loanCard, { backgroundColor: theme.card }]}>
          <View style={styles.loanCardHeader}>
            <View
              style={[
                styles.loanIconContainer,
                { backgroundColor: getLoanTypeColor(loan.type) + '20' },
              ]}
            >
              <Icon
                name={getLoanTypeIcon(loan.type)}
                size={24}
                color={getLoanTypeColor(loan.type)}
              />
            </View>
            
            <View style={styles.loanInfo}>
              <Text style={[styles.loanName, { color: theme.text }]}>
                {loan.name}
              </Text>
              <Text style={[styles.loanLender, { color: theme.text }]}>
                {loan.lender}
              </Text>
            </View>
          </View>
          
          <View style={styles.loanDetails}>
            <View style={styles.loanDetailItem}>
              <Text style={[styles.loanDetailLabel, { color: theme.text }]}>
                EMI Amount
              </Text>
              <Text style={[styles.loanDetailValue, { color: theme.text }]}>
                ₹{loan.emiAmount.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.loanDetailItem}>
              <Text style={[styles.loanDetailLabel, { color: theme.text }]}>
                Due Date
              </Text>
              <Text style={[styles.loanDetailValue, { color: theme.text }]}>
                {format(new Date(loan.nextPaymentDate), 'dd MMM yyyy')}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.paymentCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.paymentCardTitle, { color: theme.text }]}>
            Payment Amount
          </Text>
          
          <View
            style={[
              styles.amountInputContainer,
              { borderColor: theme.border, backgroundColor: theme.background },
            ]}
          >
            <Text style={[styles.currencySymbol, { color: theme.text }]}>₹</Text>
            <TextInput
              style={[styles.amountInput, { color: theme.text }]}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="Enter amount"
              placeholderTextColor={theme.disabled}
            />
          </View>
          
          <TouchableOpacity
            style={styles.useEmiButton}
            onPress={() => setAmount(loan.emiAmount.toString())}
          >
            <Text style={[styles.useEmiButtonText, { color: theme.primary }]}>
              Use EMI Amount
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.paymentCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.paymentCardTitle, { color: theme.text }]}>
            Payment Method
          </Text>
          
          <View style={styles.paymentMethods}>
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedMethod === 'upi' && [
                  styles.selectedPaymentMethod,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedMethod('upi')}
            >
              <Icon
                name="qrcode"
                size={24}
                color={selectedMethod === 'upi' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  {
                    color: selectedMethod === 'upi' ? theme.primary : theme.text,
                  },
                ]}
              >
                UPI
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedMethod === 'bank' && [
                  styles.selectedPaymentMethod,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedMethod('bank')}
            >
              <Icon
                name="bank"
                size={24}
                color={selectedMethod === 'bank' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  {
                    color: selectedMethod === 'bank' ? theme.primary : theme.text,
                  },
                ]}
              >
                Bank
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.paymentMethodButton,
                selectedMethod === 'wallet' && [
                  styles.selectedPaymentMethod,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedMethod('wallet')}
            >
              <Icon
                name="wallet"
                size={24}
                color={selectedMethod === 'wallet' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.paymentMethodText,
                  {
                    color: selectedMethod === 'wallet' ? theme.primary : theme.text,
                  },
                ]}
              >
                Wallet
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.payButton,
            { backgroundColor: isProcessing ? theme.disabled : theme.primary },
          ]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Icon name="check-circle" size={20} color="white" />
              <Text style={styles.payButtonText}>Confirm Payment</Text>
            </>
          )}
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
  loanCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  loanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  loanInfo: {
    flex: 1,
  },
  loanName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loanLender: {
    fontSize: 14,
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanDetailItem: {},
  loanDetailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  loanDetailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 20,
    height: '100%',
  },
  useEmiButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 8,
  },
  useEmiButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentMethods: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentMethodButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  selectedPaymentMethod: {
    borderWidth: 1,
  },
  paymentMethodText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  payButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
});

export default PaymentConfirmationScreen;