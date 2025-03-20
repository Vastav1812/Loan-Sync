import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan, Loan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, differenceInDays } from 'date-fns';

type PaymentScreenNavigationProp = StackNavigationProp<PaymentStackParamList, 'PaymentHub'>;

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { loans, getUpcomingPayments } = useLoan();
  
  const [selectedTab, setSelectedTab] = useState('upcoming');
  
  const upcomingPayments = getUpcomingPayments(30);
  
  const renderUpcomingPayment = ({ item }: { item: { loan: Loan; daysLeft: number } }) => {
    const { loan, daysLeft } = item;
    const isOverdue = daysLeft < 0;
    const isDueSoon = daysLeft <= 3 && daysLeft >= 0;
    
    return (
      <TouchableOpacity
        style={[styles.paymentCard, { backgroundColor: theme.card }]}
        onPress={() => navigation.navigate('PaymentConfirmation', { 
          loanId: loan.id, 
          amount: loan.emiAmount 
        })}
      >
        <View style={styles.paymentCardLeft}>
          <View style={[
            styles.loanIconContainer, 
            { backgroundColor: getLoanTypeColor(loan.type, 0.1) }
          ]}>
            <Icon 
              name={getLoanTypeIcon(loan.type)} 
              size={24} 
              color={getLoanTypeColor(loan.type)} 
            />
          </View>
          
          <View style={styles.paymentDetails}>
            <Text style={[styles.paymentLoanName, { color: theme.text }]}>
              {loan.name}
            </Text>
            <Text style={[styles.paymentLender, { color: theme.text }]}>
              {loan.lender}
            </Text>
          </View>
        </View>
        
        <View style={styles.paymentCardRight}>
          <Text style={[styles.paymentAmount, { color: theme.text }]}>
            ₹{loan.emiAmount.toLocaleString()}
          </Text>
          <Text style={[
            styles.paymentDueDate, 
            { 
              color: isOverdue 
                ? theme.error 
                : isDueSoon 
                ? theme.warning 
                : theme.text 
            }
          ]}>
            {isOverdue 
              ? `Overdue by ${Math.abs(daysLeft)} days` 
              : isDueSoon 
              ? `Due in ${daysLeft} days` 
              : `Due on ${format(new Date(loan.nextPaymentDate), 'dd MMM')}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderScheduledPayment = () => {
    // In a real app, this would show scheduled payments
    return (
      <View style={[styles.emptyState, { borderColor: theme.border }]}>
        <Icon name="calendar-clock" size={48} color={theme.disabled} />
        <Text style={[styles.emptyStateText, { color: theme.text }]}>
          No scheduled payments
        </Text>
        <TouchableOpacity
          style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text style={styles.emptyStateButtonText}>Schedule a Payment</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHistoryItem = () => {
    // In a real app, this would show payment history
    return (
      <View style={styles.historyContainer}>
        <TouchableOpacity
          style={[styles.viewAllHistoryButton, { borderColor: theme.border }]}
          onPress={() => navigation.navigate('PaymentHistory', {})}
        >
          <Text style={[styles.viewAllHistoryText, { color: theme.primary }]}>
            View Complete Payment History
          </Text>
          <Icon name="chevron-right" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
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

  const getLoanTypeColor = (type: string, opacity: number = 1): string => {
    const colors = {
      phone: `rgba(255, 107, 107, ${opacity})`,
      car: `rgba(78, 205, 196, ${opacity})`,
      property: `rgba(94, 92, 230, ${opacity})`,
      personal: `rgba(255, 209, 102, ${opacity})`,
      other: `rgba(165, 165, 165, ${opacity})`,
    };
    
    return colors[type as keyof typeof colors] || colors.other;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Payment Hub</Text>
      </View>
      
      <View style={[styles.tabContainer, { borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'upcoming' && [styles.activeTab, { borderBottomColor: theme.primary }],
          ]}
          onPress={() => setSelectedTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'upcoming' ? theme.primary : theme.text },
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'scheduled' && [styles.activeTab, { borderBottomColor: theme.primary }],
          ]}
          onPress={() => setSelectedTab('scheduled')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'scheduled' ? theme.primary : theme.text },
            ]}
          >
            Scheduled
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            selectedTab === 'history' && [styles.activeTab, { borderBottomColor: theme.primary }],
          ]}
          onPress={() => setSelectedTab('history')}
        >
          <Text
            style={[
              styles.tabText,
              { color: selectedTab === 'history' ? theme.primary : theme.text },
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
      
      {selectedTab === 'upcoming' && (
        <>
          {upcomingPayments.length > 0 ? (
            <FlatList
              data={upcomingPayments}
              renderItem={renderUpcomingPayment}
              keyExtractor={(item) => item.loan.id}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={[styles.emptyState, { borderColor: theme.border }]}>
              <Icon name="credit-card-check-outline" size={48} color={theme.disabled} />
              <Text style={[styles.emptyStateText, { color: theme.text }]}>
                No upcoming payments in the next 30 days
              </Text>
            </View>
          )}
        </>
      )}
      
      {selectedTab === 'scheduled' && renderScheduledPayment()}
      
      {selectedTab === 'history' && renderHistoryItem()}
      
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: theme.primary }]}
        onPress={() => {
          if (loans.length > 0) {
            navigation.navigate('PaymentConfirmation', { 
              loanId: loans[0].id, 
              amount: loans[0].emiAmount 
            });
          } else {
            Alert.alert('No Loans', 'Please add a loan first to make a payment');
          }
        }}
      >
        <Icon name="credit-card-plus-outline" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Make a Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  paymentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  paymentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loanIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    justifyContent: 'center',
  },
  paymentLoanName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentLender: {
    fontSize: 12,
  },
  paymentCardRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  paymentDueDate: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    margin: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  historyContainer: {
    padding: 16,
  },
  viewAllHistoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  viewAllHistoryText: {
    fontSize: 16,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PaymentScreen;