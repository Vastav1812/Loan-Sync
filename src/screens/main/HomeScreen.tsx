import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { loans, getTotalOutstanding, getUpcomingPayments } = useLoan();
  const { user } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);
  
  const totalOutstanding = getTotalOutstanding();
  const upcomingPayments = getUpcomingPayments(7);
  
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
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.text }]}>
              {greeting},
            </Text>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.name || 'User'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('AddLoan')}
          >
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            Total Outstanding
          </Text>
          <Text style={[styles.summaryAmount, { color: theme.text }]}>
            ₹{totalOutstanding.toLocaleString()}
          </Text>
          
          <View style={styles.summaryDetails}>
            <View style={styles.summaryDetailItem}>
              <Text style={[styles.summaryDetailLabel, { color: theme.text }]}>
                Total Loans
              </Text>
              <Text style={[styles.summaryDetailValue, { color: theme.text }]}>
                {loans.length}
              </Text>
            </View>
            
            <View style={styles.summaryDetailItem}>
              <Text style={[styles.summaryDetailLabel, { color: theme.text }]}>
                Monthly EMI
              </Text>
              <Text style={[styles.summaryDetailValue, { color: theme.text }]}>
                ₹{loans.reduce((sum, loan) => sum + loan.emiAmount, 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        
        {upcomingPayments.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Upcoming Payments
            </Text>
            
            {upcomingPayments.map(({ loan, daysLeft }) => (
              <TouchableOpacity
                key={loan.id}
                style={[styles.paymentCard, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate('LoanDetail', { loanId: loan.id })}
              >
                <View style={styles.paymentCardContent}>
                  <View
                    style={[
                      styles.loanIconContainer,
                      { backgroundColor: theme.primary + '20' },
                    ]}
                  >
                    <Icon
                      name={getLoanTypeIcon(loan.type)}
                      size={24}
                      color={theme.primary}
                    />
                  </View>
                  
                  <View style={styles.paymentCardDetails}>
                    <Text style={[styles.paymentCardTitle, { color: theme.text }]}>
                      {loan.name}
                    </Text>
                    <Text style={[styles.paymentCardSubtitle, { color: theme.text }]}>
                      {daysLeft === 0
                        ? 'Due today'
                        : daysLeft === 1
                        ? 'Due tomorrow'
                        : `Due in ${daysLeft} days`}
                    </Text>
                  </View>
                  
                  <View style={styles.paymentCardAmount}>
                    <Text style={[styles.paymentCardAmountText, { color: theme.text }]}>
                      ₹{loan.emiAmount.toLocaleString()}
                    </Text>
                    <TouchableOpacity
                      style={[styles.payNowButton, { backgroundColor: theme.primary }]}
                      onPress={() =>
                        navigation.navigate('PaymentStack', {
                          screen: 'PaymentConfirmation',
                          params: { loanId: loan.id, amount: loan.emiAmount },
                        })
                      }
                    >
                      <Text style={styles.payNowButtonText}>Pay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Loans
          </Text>
          
          {loans.length === 0 ? (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Icon name="credit-card-outline" size={48} color={theme.disabled} />
              <Text style={[styles.emptyStateText, { color: theme.text }]}>
                You don't have any loans yet
              </Text>
              <TouchableOpacity
                style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
                onPress={() => navigation.navigate('AddLoan')}
              >
                <Text style={styles.emptyStateButtonText}>Add Your First Loan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            loans.map(loan => {
              const progressPercentage =
                ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) * 100;
              
              return (
                <TouchableOpacity
                  key={loan.id}
                  style={[styles.loanCard, { backgroundColor: theme.card }]}
                  onPress={() => navigation.navigate('LoanDetail', { loanId: loan.id })}
                >
                  <View style={styles.loanCardHeader}>
                    <View style={styles.loanCardHeaderLeft}>
                      <View
                        style={[
                          styles.loanIconContainer,
                          { backgroundColor: theme.primary + '20' },
                        ]}
                      >
                        <Icon
                          name={getLoanTypeIcon(loan.type)}
                          size={24}
                          color={theme.primary}
                        />
                      </View>
                      
                      <View>
                        <Text style={[styles.loanCardTitle, { color: theme.text }]}>
                          {loan.name}
                        </Text>
                        <Text style={[styles.loanCardSubtitle, { color: theme.text }]}>
                          {loan.lender}
                        </Text>
                      </View>
                    </View>
                    
                    <Icon name="chevron-right" size={24} color={theme.text} />
                  </View>
                  
                  <View style={styles.loanCardDetails}>
                    <View style={styles.loanCardDetailItem}>
                      <Text style={[styles.loanCardDetailLabel, { color: theme.text }]}>
                        Remaining
                      </Text>
                      <Text style={[styles.loanCardDetailValue, { color: theme.text }]}>
                        ₹{loan.remainingAmount.toLocaleString()}
                      </Text>
                    </View>
                    
                    <View style={styles.loanCardDetailItem}>
                      <Text style={[styles.loanCardDetailLabel, { color: theme.text }]}>
                        EMI
                      </Text>
                      <Text style={[styles.loanCardDetailValue, { color: theme.text }]}>
                        ₹{loan.emiAmount.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View
                      style={[styles.progressBar, { backgroundColor: theme.disabled }]}
                    >
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progressPercentage}%`,
                            backgroundColor: theme.primary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: theme.text }]}>
                      {progressPercentage.toFixed(0)}% paid
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryDetailItem: {},
  summaryDetailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  summaryDetailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentCard: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  loanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentCardDetails: {
    flex: 1,
  },
  paymentCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  paymentCardSubtitle: {
    fontSize: 14,
  },
  paymentCardAmount: {
    alignItems: 'flex-end',
  },
  paymentCardAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  payNowButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  payNowButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  loanCard: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loanCardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  loanCardSubtitle: {
    fontSize: 14,
  },
  loanCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loanCardDetailItem: {},
  loanCardDetailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  loanCardDetailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;