import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PaymentStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan, Payment, Loan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format } from 'date-fns';

type PaymentHistoryScreenRouteProp = RouteProp<PaymentStackParamList, 'PaymentHistory'>;
type PaymentHistoryScreenNavigationProp = StackNavigationProp<PaymentStackParamList, 'PaymentHistory'>;

const PaymentHistoryScreen = () => {
  const route = useRoute<PaymentHistoryScreenRouteProp>();
  const navigation = useNavigation<PaymentHistoryScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { loans } = useLoan();
  
  const loanId = route.params?.loanId;
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  
  // Get all payments or filter by loan ID
  const getAllPayments = (): { payment: Payment; loan: Loan }[] => {
    let allPayments: { payment: Payment; loan: Loan }[] = [];
    
    loans.forEach(loan => {
      if (!loanId || loan.id === loanId) {
        loan.paymentHistory.forEach(payment => {
          allPayments.push({ payment, loan });
        });
      }
    });
    
    // Sort by date (newest first)
    return allPayments.sort((a, b) => 
      new Date(b.payment.date).getTime() - new Date(a.payment.date).getTime()
    );
  };
  
  const filteredPayments = getAllPayments().filter(({ payment }) => {
    if (selectedFilter === 'all') return true;
    return payment.status === selectedFilter;
  });
  
  const renderPaymentItem = ({ item }: { item: { payment: Payment; loan: Loan } }) => {
    const { payment, loan } = item;
    
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed':
          return theme.success;
        case 'pending':
          return theme.warning;
        case 'failed':
          return theme.error;
        default:
          return theme.text;
      }
    };
    
    const getMethodIcon = (method?: string) => {
      switch (method) {
        case 'bank':
          return 'bank';
        case 'upi':
          return 'qrcode';
        case 'wallet':
          return 'wallet';
        default:
          return 'credit-card';
      }
    };
    
    return (
      <View style={[styles.paymentItem, { backgroundColor: theme.card }]}>
        <View style={styles.paymentHeader}>
          <View style={styles.paymentHeaderLeft}>
            <View
              style={[
                styles.paymentStatusIndicator,
                { backgroundColor: getStatusColor(payment.status) },
              ]}
            />
            <Text style={[styles.paymentLoanName, { color: theme.text }]}>
              {loan.name}
            </Text>
          </View>
          <Text style={[styles.paymentAmount, { color: theme.text }]}>
            ₹{payment.amount.toLocaleString()}
          </Text>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.paymentDetailItem}>
            <Icon name="calendar" size={16} color={theme.text} />
            <Text style={[styles.paymentDetailText, { color: theme.text }]}>
              {format(new Date(payment.date), 'dd MMM yyyy')}
            </Text>
          </View>
          
          {payment.method && (
            <View style={styles.paymentDetailItem}>
              <Icon name={getMethodIcon(payment.method)} size={16} color={theme.text} />
              <Text style={[styles.paymentDetailText, { color: theme.text }]}>
                {payment.method.toUpperCase()}
              </Text>
            </View>
          )}
          
          <View style={styles.paymentDetailItem}>
            <Icon
              name={
                payment.status === 'completed'
                  ? 'check-circle'
                  : payment.status === 'pending'
                  ? 'clock-outline'
                  : 'alert-circle'
              }
              size={16}
              color={getStatusColor(payment.status)}
            />
            <Text
              style={[
                styles.paymentDetailText,
                { color: getStatusColor(payment.status) },
              ]}
            >
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'all' && [
              styles.selectedFilter,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: selectedFilter === 'all' ? theme.primary : theme.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'completed' && [
              styles.selectedFilter,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setSelectedFilter('completed')}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: selectedFilter === 'completed' ? theme.primary : theme.text,
              },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'pending' && [
              styles.selectedFilter,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: selectedFilter === 'pending' ? theme.primary : theme.text,
              },
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedFilter === 'failed' && [
              styles.selectedFilter,
              { borderColor: theme.primary },
            ],
          ]}
          onPress={() => setSelectedFilter('failed')}
        >
          <Text
            style={[
              styles.filterText,
              { color: selectedFilter === 'failed' ? theme.primary : theme.text },
            ]}
          >
            Failed
          </Text>
        </TouchableOpacity>
      </View>
      
      {filteredPayments.length > 0 ? (
        <FlatList
          data={filteredPayments}
          renderItem={renderPaymentItem}
          keyExtractor={(item) => item.payment.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={64} color={theme.disabled} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No payment history found
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.text }]}>
            {loanId
              ? 'This loan has no payment records yet'
              : 'You have not made any payments yet'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedFilter: {
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  paymentItem: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentStatusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  paymentLoanName: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PaymentHistoryScreen;