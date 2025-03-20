import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, differenceInMonths } from 'date-fns';

type LoanDetailScreenRouteProp = RouteProp<HomeStackParamList, 'LoanDetail'>;
type LoanDetailScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'LoanDetail'>;

const LoanDetailScreen = () => {
  const route = useRoute<LoanDetailScreenRouteProp>();
  const navigation = useNavigation<LoanDetailScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { loans, deleteLoan } = useLoan();
  
  const { loanId } = route.params;
  const loan = loans.find(l => l.id === loanId);
  
  const [showFullHistory, setShowFullHistory] = useState(false);
  
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
  
  // Calculate progress
  const totalPaid = loan.totalAmount - loan.remainingAmount;
  const progressPercentage = (totalPaid / loan.totalAmount) * 100;
  
  // Calculate time progress
  const startDate = new Date(loan.startDate);
  const endDate = new Date(loan.endDate);
  const currentDate = new Date();
  
  const totalMonths = differenceInMonths(endDate, startDate);
  const monthsElapsed = differenceInMonths(currentDate, startDate);
  const monthsRemaining = totalMonths - monthsElapsed;
  
  const handleDeleteLoan = () => {
    Alert.alert(
      'Delete Loan',
      'Are you sure you want to delete this loan? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteLoan(loanId);
            navigation.goBack();
          },
        },
      ]
    );
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
        <View style={styles.header}>
          <View
            style={[
              styles.loanIconContainer,
              { backgroundColor: getLoanTypeColor(loan.type) + '20' },
            ]}
          >
            <Icon
              name={getLoanTypeIcon(loan.type)}
              size={32}
              color={getLoanTypeColor(loan.type)}
            />
          </View>
          
          <Text style={[styles.loanName, { color: theme.text }]}>{loan.name}</Text>
          <Text style={[styles.loanLender, { color: theme.text }]}>
            {loan.lender}
          </Text>
          
          {loan.accountNumber && (
            <Text style={[styles.accountNumber, { color: theme.text }]}>
              Account: {loan.accountNumber}
            </Text>
          )}
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardRow}>
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Total Amount
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                ₹{loan.totalAmount.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Remaining
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                ₹{loan.remainingAmount.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.disabled }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progressPercentage}%`, backgroundColor: theme.primary },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {progressPercentage.toFixed(1)}% paid
            </Text>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardRow}>
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Interest Rate
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                {loan.interestRate}% p.a.
              </Text>
            </View>
            
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Monthly EMI
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                ₹{loan.emiAmount.toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardRow}>
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Start Date
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                {format(new Date(loan.startDate), 'dd MMM yyyy')}
              </Text>
            </View>
            
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                End Date
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                {format(new Date(loan.endDate), 'dd MMM yyyy')}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardRow}>
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Next Payment
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                {format(new Date(loan.nextPaymentDate), 'dd MMM yyyy')}
              </Text>
            </View>
            
            <View style={styles.cardColumn}>
              <Text style={[styles.cardLabel, { color: theme.text }]}>
                Months Remaining
              </Text>
              <Text style={[styles.cardValue, { color: theme.text }]}>
                {monthsRemaining > 0 ? monthsRemaining : 0}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Payment History
            </Text>
            
            {loan.paymentHistory.length > 3 && (
              <TouchableOpacity onPress={() => setShowFullHistory(!showFullHistory)}>
                <Text style={[styles.viewAllText, { color: theme.primary }]}>
                  {showFullHistory ? 'Show Less' : 'View All'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {loan.paymentHistory.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Icon name="history" size={32} color={theme.disabled} />
              <Text style={[styles.emptyHistoryText, { color: theme.text }]}>
                No payment history yet
              </Text>
            </View>
          ) : (
            <>
              {(showFullHistory
                ? loan.paymentHistory
                : loan.paymentHistory.slice(0, 3)
              ).map((payment, index) => (
                <View
                  key={payment.id}
                  style={[
                    styles.paymentHistoryItem,
                    index !== 0 && styles.paymentHistoryItemBorder,
                    { borderTopColor: theme.border },
                  ]}
                >
                  <View style={styles.paymentHistoryLeft}>
                    <Text style={[styles.paymentHistoryDate, { color: theme.text }]}>
                      {format(new Date(payment.date), 'dd MMM yyyy')}
                    </Text>
                    {payment.method && (
                      <Text
                        style={[styles.paymentHistoryMethod, { color: theme.text }]}
                      >
                        via {payment.method.toUpperCase()}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.paymentHistoryRight}>
                    <Text
                      style={[styles.paymentHistoryAmount, { color: theme.text }]}
                    >
                      ₹{payment.amount.toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.paymentHistoryStatus,
                        {
                          color:
                            payment.status === 'completed'
                              ? theme.success
                              : payment.status === 'pending'
                              ? theme.warning
                              : theme.error,
                        },
                      ]}
                    >
                      {payment.status.charAt(0).toUpperCase() +
                        payment.status.slice(1)}
                    </Text>
                  </View>
                </View>
              ))}
              
              {!showFullHistory && loan.paymentHistory.length > 3 && (
                <TouchableOpacity
                  style={[
                    styles.viewAllButton,
                    { borderTopColor: theme.border, borderBottomColor: theme.border },
                  ]}
                  onPress={() => setShowFullHistory(true)}
                >
                  <Text style={[styles.viewAllButtonText, { color: theme.primary }]}>
                    View All {loan.paymentHistory.length} Payments
                  </Text>
                  <Icon name="chevron-down" size={20} color={theme.primary} />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primary }]}
            onPress={() =>
              navigation.navigate('PaymentStack', {
                screen: 'PaymentConfirmation',
                params: { loanId: loan.id, amount: loan.emiAmount },
              })
            }
          >
            <Icon name="credit-card-outline" size={20} color="white" />
            <Text style={styles.actionButtonText}>Make Payment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.error }]}
            onPress={handleDeleteLoan}
          >
            <Icon name="delete-outline" size={20} color="white" />
            <Text style={styles.actionButtonText}>Delete Loan</Text>
          </TouchableOpacity>
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loanIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loanLender: {
    fontSize: 16,
    marginBottom: 8,
  },
  accountNumber: {
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardColumn: {},
  cardLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyHistoryText: {
    marginTop: 8,
    fontSize: 14,
  },
  paymentHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  paymentHistoryItemBorder: {
    borderTopWidth: 1,
  },
  paymentHistoryLeft: {},
  paymentHistoryDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  paymentHistoryMethod: {
    fontSize: 12,
  },
  paymentHistoryRight: {
    alignItems: 'flex-end',
  },
  paymentHistoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentHistoryStatus: {
    fontSize: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  viewAllButtonText: {
    fontSize: 14,
    marginRight: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
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

export default LoanDetailScreen;