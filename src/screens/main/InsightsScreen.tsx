import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InsightsStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, addMonths } from 'date-fns';

type InsightsScreenNavigationProp = StackNavigationProp<InsightsStackParamList, 'Insights'>;

const InsightsScreen = () => {
  const navigation = useNavigation<InsightsScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { loans, getTotalOutstanding, getLoanDistribution } = useLoan();
  
  const totalOutstanding = getTotalOutstanding();
  const distribution = getLoanDistribution();
  
  // Calculate monthly payment
  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + loan.emiAmount, 0);
  
  // Calculate upcoming payments for the next 6 months
  const getUpcomingPaymentsForMonths = (months: number) => {
    const payments = [];
    const today = new Date();
    
    for (let i = 0; i < months; i++) {
      const month = addMonths(today, i);
      const monthName = format(month, 'MMM');
      const totalForMonth = loans.reduce((sum, loan) => sum + loan.emiAmount, 0);
      
      payments.push({
        month: monthName,
        amount: totalForMonth,
      });
    }
    
    return payments;
  };
  
  const upcomingPayments = getUpcomingPaymentsForMonths(6);
  
  // Calculate distribution by lender
  const getLenderDistribution = () => {
    const lenderMap: Record<string, number> = {};
    
    loans.forEach(loan => {
      if (!lenderMap[loan.lender]) {
        lenderMap[loan.lender] = 0;
      }
      lenderMap[loan.lender] += loan.remainingAmount;
    });
    
    return Object.entries(lenderMap)
      .map(([lender, amount]) => ({
        lender,
        amount,
        percentage: (amount / totalOutstanding) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);
  };
  
  const lenderDistribution = getLenderDistribution();
  
  const getColorForIndex = (index: number) => {
    const colors = [
      theme.primary,
      '#FF6B6B',
      '#4ECDC4',
      '#FFD166',
      '#5E5CE6',
      '#A5A5A5',
    ];
    return colors[index % colors.length];
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.summaryCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.summaryTitle, { color: theme.text }]}>
            Loan Summary
          </Text>
          
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.text }]}>
                Total Outstanding
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                ₹{totalOutstanding.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.text }]}>
                Monthly Payment
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                ₹{totalMonthlyPayment.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: theme.text }]}>
                Active Loans
              </Text>
              <Text style={[styles.summaryValue, { color: theme.text }]}>
                {loans.length}
              </Text>
            </View>
          </View>
        </View>
        
        {loans.length > 0 ? (
          <>
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Loan Distribution
              </Text>
              
              <View style={styles.distributionContainer}>
                <View style={styles.distributionChart}>
                  {distribution.map((item, index) => (
                    <View
                      key={item.type}
                      style={[
                        styles.distributionBar,
                        {
                          width: `${item.percentage}%`,
                          backgroundColor: getColorForIndex(index),
                        },
                      ]}
                    />
                  ))}
                </View>
                
                <View style={styles.distributionLegend}>
                  {distribution.map((item, index) => (
                    <View key={item.type} style={styles.legendItem}>
                      <View
                        style={[
                          styles.legendColor,
                          { backgroundColor: getColorForIndex(index) },
                        ]}
                      />
                      <Text style={[styles.legendText, { color: theme.text }]}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)} (
                        {item.percentage.toFixed(1)}%)
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Upcoming Payments
              </Text>
              
              <View style={styles.paymentsContainer}>
                {upcomingPayments.map((payment, index) => (
                  <View key={index} style={styles.paymentItem}>
                    <Text style={[styles.paymentMonth, { color: theme.text }]}>
                      {payment.month}
                    </Text>
                    <View
                      style={[
                        styles.paymentBar,
                        { backgroundColor: theme.disabled },
                      ]}
                    >
                      <View
                        style={[
                          styles.paymentBarFill,
                          {
                            width: '100%',
                            backgroundColor: getColorForIndex(index),
                          },
                        ]}
                      />
                    </View>
                    <Text style={[styles.paymentAmount, { color: theme.text }]}>
                      ₹{payment.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>
                Lender Distribution
              </Text>
              
              <View style={styles.lenderContainer}>
                {lenderDistribution.map((item, index) => (
                  <View key={item.lender} style={styles.lenderItem}>
                    <View style={styles.lenderHeader}>
                      <Text style={[styles.lenderName, { color: theme.text }]}>
                        {item.lender}
                      </Text>
                      <Text style={[styles.lenderPercentage, { color: theme.text }]}>
                        {item.percentage.toFixed(1)}%
                      </Text>
                    </View>
                    
                    <View
                      style={[styles.lenderBar, { backgroundColor: theme.disabled }]}
                    >
                      <View
                        style={[
                          styles.lenderBarFill,
                          {
                            width: `${item.percentage}%`,
                            backgroundColor: getColorForIndex(index),
                          },
                        ]}
                      />
                    </View>
                    
                    <Text style={[styles.lenderAmount, { color: theme.text }]}>
                      ₹{item.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.loanProgressSection}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Loan Progress Trackers
              </Text>
              
              {loans.map(loan => {
                const progressPercentage =
                  ((loan.totalAmount - loan.remainingAmount) / loan.totalAmount) *
                  100;
                
                return (
                  <TouchableOpacity
                    key={loan.id}
                    style={[styles.progressCard, { backgroundColor: theme.card }]}
                    onPress={() =>
                      navigation.navigate('ProgressTracker', { loanId: loan.id })
                    }
                  >
                    <View style={styles.progressCardHeader}>
                      <Text style={[styles.progressCardTitle, { color: theme.text }]}>
                        {loan.name}
                      </Text>
                      <Icon name="chevron-right" size={20} color={theme.text} />
                    </View>
                    
                    <View
                      style={[
                        styles.progressBar,
                        { backgroundColor: theme.disabled },
                      ]}
                    >
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${progressPercentage}%`,
                            backgroundColor: theme.primary,
                          },
                        ]}
                      />
                    </View>
                    
                    <View style={styles.progressCardFooter}>
                      <Text
                        style={[styles.progressCardPercentage, { color: theme.text }]}
                      >
                        {progressPercentage.toFixed(1)}% paid
                      </Text>
                      <Text
                        style={[styles.progressCardAmount, { color: theme.text }]}
                      >
                        ₹{loan.remainingAmount.toLocaleString()} left
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <View style={[styles.emptyState, { borderColor: theme.border }]}>
            <Icon name="chart-line" size={64} color={theme.disabled} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              No loans to analyze
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.text }]}>
              Add loans to see financial insights
            </Text>
          </View>
        )}
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
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {},
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
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
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  distributionContainer: {
    marginBottom: 8,
  },
  distributionChart: {
    flexDirection: 'row',
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  distributionBar: {
    height: '100%',
  },
  distributionLegend: {},
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  paymentsContainer: {
    marginBottom: 8,
  },
  paymentItem: {
    marginBottom: 12,
  },
  paymentMonth: {
    fontSize: 14,
    marginBottom: 4,
  },
  paymentBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  paymentBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  paymentAmount: {
    fontSize: 12,
    textAlign: 'right',
  },
  lenderContainer: {
    marginBottom: 8,
  },
  lenderItem: {
    marginBottom: 16,
  },
  lenderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  lenderName: {
    fontSize: 14,
  },
  lenderPercentage: {
    fontSize: 14,
  },
  lenderBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  lenderBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  lenderAmount: {
    fontSize: 12,
    textAlign: 'right',
  },
  loanProgressSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressCardTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressCardPercentage: {
    fontSize: 12,
  },
  progressCardAmount: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 16,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default InsightsScreen;