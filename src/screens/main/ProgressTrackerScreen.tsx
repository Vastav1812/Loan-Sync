import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { InsightsStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, differenceInMonths } from 'date-fns';

type ProgressTrackerScreenRouteProp = RouteProp<InsightsStackParamList, 'ProgressTracker'>;

const ProgressTrackerScreen = () => {
  const route = useRoute<ProgressTrackerScreenRouteProp>();
  const { theme, isDark } = useTheme();
  const { loans } = useLoan();
  
  const { loanId } = route.params;
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
  
  // Calculate progress
  const totalPaid = loan.totalAmount - loan.remainingAmount;
  const progressPercentage = (totalPaid / loan.totalAmount) * 100;
  
  // Calculate time progress
  const startDate = new Date(loan.startDate);
  const endDate = new Date(loan.endDate);
  const currentDate = new Date();
  
  const totalMonths = differenceInMonths(endDate, startDate);
  const monthsElapsed = differenceInMonths(currentDate, startDate);
  const timeProgressPercentage = Math.min(100, (monthsElapsed / totalMonths) * 100);
  
  // Calculate expected progress based on time
  const expectedPaid = (loan.totalAmount * timeProgressPercentage) / 100;
  const expectedProgressPercentage = (expectedPaid / loan.totalAmount) * 100;
  
  // Determine if ahead or behind schedule
  const progressDifference = progressPercentage - expectedProgressPercentage;
  const isAhead = progressDifference > 0;
  
  // Calculate remaining payments
  const remainingPayments = Math.ceil(loan.remainingAmount / loan.emiAmount);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Loan Progress
          </Text>
          
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
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Total Amount
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                ₹{loan.totalAmount.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Paid So Far
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                ₹{totalPaid.toLocaleString()}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Remaining
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                ₹{loan.remainingAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Time Progress
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.disabled }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${timeProgressPercentage}%`, backgroundColor: theme.info },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.text }]}>
              {timeProgressPercentage.toFixed(1)}% time elapsed
            </Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Start Date
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {format(new Date(loan.startDate), 'dd MMM yyyy')}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                End Date
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {format(new Date(loan.endDate), 'dd MMM yyyy')}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: theme.text }]}>
                Remaining
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {remainingPayments} payments
              </Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>
            Payment Schedule
          </Text>
          
          <View style={styles.scheduleContainer}>
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleIconContainer}>
                <Icon
                  name={isAhead ? 'trending-up' : 'trending-down'}
                  size={24}
                  color={isAhead ? theme.success : theme.warning}
                />
              </View>
              <View style={styles.scheduleTextContainer}>
                <Text style={[styles.scheduleTitle, { color: theme.text }]}>
                  {isAhead ? 'Ahead of Schedule' : 'Behind Schedule'}
                </Text>
                <Text style={[styles.scheduleDescription, { color: theme.text }]}>
                  {isAhead
                    ? `You're ${Math.abs(progressDifference).toFixed(1)}% ahead of your payment schedule`
                    : `You're ${Math.abs(progressDifference).toFixed(1)}% behind your payment schedule`}
                </Text>
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleIconContainer}>
                <Icon name="calendar-check" size={24} color={theme.primary} />
              </View>
              <View style={styles.scheduleTextContainer}>
                <Text style={[styles.scheduleTitle, { color: theme.text }]}>
                  Next Payment
                </Text>
                <Text style={[styles.scheduleDescription, { color: theme.text }]}>
                  ₹{loan.emiAmount.toLocaleString()} due on{' '}
                  {format(new Date(loan.nextPaymentDate), 'dd MMM yyyy')}
                </Text>
              </View>
            </View>
            
            <View style={styles.scheduleItem}>
              <View style={styles.scheduleIconContainer}>
                <Icon name="cash-multiple" size={24} color={theme.success} />
              </View>
              <View style={styles.scheduleTextContainer}>
                <Text style={[styles.scheduleTitle, { color: theme.text }]}>
                  Interest Paid
                </Text>
                <Text style={[styles.scheduleDescription, { color: theme.text }]}>
                  Approximately ₹
                  {(totalPaid - (loan.totalAmount - loan.remainingAmount) / (1 + loan.interestRate / 100)).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
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
    fontSize: 14,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleContainer: {
    marginTop: 8,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  scheduleDescription: {
    fontSize: 14,
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

export default ProgressTrackerScreen;