import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../../navigation/MainNavigator';
import { useTheme } from '../../context/ThemeContext';
import { useLoan } from '../../context/LoanContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, addYears, addMonths } from 'date-fns';

type AddLoanScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'AddLoan'>;

const AddLoanScreen = () => {
  const navigation = useNavigation<AddLoanScreenNavigationProp>();
  const { theme, isDark } = useTheme();
  const { addLoan } = useLoan();
  
  const [name, setName] = useState('');
  const [lender, setLender] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [emiAmount, setEmiAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addYears(new Date(), 5));
  const [selectedType, setSelectedType] = useState<'phone' | 'car' | 'property' | 'personal' | 'other'>('personal');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!name || !lender || !totalAmount || !interestRate || !emiAmount) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    const totalAmountNum = parseFloat(totalAmount);
    const interestRateNum = parseFloat(interestRate);
    const emiAmountNum = parseFloat(emiAmount);
    
    if (isNaN(totalAmountNum) || isNaN(interestRateNum) || isNaN(emiAmountNum)) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for amount fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addLoan({
        name,
        lender,
        type: selectedType,
        totalAmount: totalAmountNum,
        remainingAmount: totalAmountNum,
        interestRate: interestRateNum,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        emiAmount: emiAmountNum,
        nextPaymentDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
        accountNumber: accountNumber || undefined,
        isManual: true,
      });
      
      Alert.alert(
        'Loan Added',
        'Your loan has been added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add loan. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onStartDateChange = (selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // Adjust end date if needed
      if (selectedDate > endDate) {
        setEndDate(addYears(selectedDate, 5));
      }
    }
  };

  const onEndDateChange = (selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
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
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Loan Details
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Loan Name</Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Icon name="tag" size={20} color={theme.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. Home Loan, Car Loan"
              placeholderTextColor={theme.disabled}
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Lender</Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Icon name="bank" size={20} color={theme.text} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. HDFC Bank, SBI"
              placeholderTextColor={theme.disabled}
              value={lender}
              onChangeText={setLender}
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>Loan Type</Text>
          <View style={styles.loanTypeContainer}>
            <TouchableOpacity
              style={[
                styles.loanTypeButton,
                selectedType === 'personal' && [
                  styles.selectedLoanType,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedType('personal')}
            >
              <Icon
                name="account"
                size={24}
                color={selectedType === 'personal' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.loanTypeText,
                  {
                    color: selectedType === 'personal' ? theme.primary : theme.text,
                  },
                ]}
              >
                Personal
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.loanTypeButton,
                selectedType === 'property' && [
                  styles.selectedLoanType,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedType('property')}
            >
              <Icon
                name="home"
                size={24}
                color={selectedType === 'property' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.loanTypeText,
                  {
                    color: selectedType === 'property' ? theme.primary : theme.text,
                  },
                ]}
              >
                Property
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.loanTypeButton,
                selectedType === 'car' && [
                  styles.selectedLoanType,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedType('car')}
            >
              <Icon
                name="car"
                size={24}
                color={selectedType === 'car' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.loanTypeText,
                  {
                    color: selectedType === 'car' ? theme.primary : theme.text,
                  },
                ]}
              >
                Car
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.loanTypeButton,
                selectedType === 'phone' && [
                  styles.selectedLoanType,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedType('phone')}
            >
              <Icon
                name="cellphone"
                size={24}
                color={selectedType === 'phone' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.loanTypeText,
                  {
                    color: selectedType === 'phone' ? theme.primary : theme.text,
                  },
                ]}
              >
                Phone
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.loanTypeButton,
                selectedType === 'other' && [
                  styles.selectedLoanType,
                  { borderColor: theme.primary },
                ],
              ]}
              onPress={() => setSelectedType('other')}
            >
              <Icon
                name="credit-card"
                size={24}
                color={selectedType === 'other' ? theme.primary : theme.text}
              />
              <Text
                style={[
                  styles.loanTypeText,
                  {
                    color: selectedType === 'other' ? theme.primary : theme.text,
                  },
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Financial Details
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            Total Loan Amount
          </Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Icon
              name="currency-inr"
              size={20}
              color={theme.text}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. 500000"
              placeholderTextColor={theme.disabled}
              value={totalAmount}
              onChangeText={setTotalAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            Interest Rate (% per annum)
          </Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Icon
              name="percent"
              size={20}
              color={theme.text}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. 8.5"
              placeholderTextColor={theme.disabled}
              value={interestRate}
              onChangeText={setInterestRate}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            Monthly EMI Amount
          </Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Icon
              name="cash"
              size={20}
              color={theme.text}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. 10000"
              placeholderTextColor={theme.disabled}
              value={emiAmount}
              onChangeText={setEmiAmount}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateInputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Start Date</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                { borderColor: theme.border, backgroundColor: theme.card },
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Icon name="calendar" size={20} color={theme.text} />
              <Text style={[styles.dateText, { color: theme.text }]}>
                {format(startDate, 'dd MMM yyyy')}
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateInputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>End Date</Text>
            <TouchableOpacity
              style={[
                styles.dateButton,
                { borderColor: theme.border, backgroundColor: theme.card },
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Icon name="calendar" size={20} color={theme.text} />
              <Text style={[styles.dateText, { color: theme.text }]}>
                {format(endDate, 'dd MMM yyyy')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showStartDatePicker && (
            <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDatePicker(false);
                  if (selectedDate) {
                    onStartDateChange(selectedDate);
                  }
                }}
            />
        )}

        {showEndDatePicker && (
            <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                minimumDate={startDate}
                onChange={(event, selectedDate) => {
                  setShowEndDatePicker(false);
                  if (selectedDate) {
                    onEndDateChange(selectedDate);
                  }
                }}
            />
        )}
        
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Additional Details (Optional)
        </Text>
        
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, { color: theme.text }]}>
            Account Number
          </Text>
          <View
            style={[
              styles.inputContainer,
              { borderColor: theme.border, backgroundColor: theme.card },
            ]}
          >
            <Icon
              name="identifier"
              size={20}
              color={theme.text}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="e.g. XXXX1234"
              placeholderTextColor={theme.disabled}
              value={accountNumber}
              onChangeText={setAccountNumber}
            />
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: isSubmitting ? theme.disabled : theme.primary },
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Add Loan</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  inputIcon: {
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  loanTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loanTypeButton: {
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  selectedLoanType: {
    borderWidth: 1,
  },
  loanTypeText: {
    marginTop: 4,
    fontSize: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateInputGroup: {
    width: '48%',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
    paddingHorizontal: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 14,
  },
  submitButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddLoanScreen;