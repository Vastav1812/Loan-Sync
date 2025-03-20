import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, addMonths, differenceInMonths } from 'date-fns';

export interface Loan {
  id: string;
  name: string;
  type: 'phone' | 'car' | 'property' | 'personal' | 'other';
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  emiAmount: number;
  nextPaymentDate: string;
  paymentHistory: Payment[];
  lender: string;
  accountNumber?: string;
  isManual: boolean;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method?: 'bank' | 'upi' | 'wallet';
}

interface LoanContextType {
  loans: Loan[];
  addLoan: (loan: Omit<Loan, 'id' | 'paymentHistory'>) => Promise<void>;
  updateLoan: (id: string, loan: Partial<Loan>) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  makePayment: (loanId: string, amount: number, method: 'bank' | 'upi' | 'wallet') => Promise<boolean>;
  getTotalOutstanding: () => number;
  getUpcomingPayments: (days: number) => { loan: Loan; daysLeft: number }[];
  getLoanDistribution: () => { type: string; percentage: number }[];
  isLoading: boolean;
}

const LoanContext = createContext<LoanContextType>({
  loans: [],
  addLoan: async () => {},
  updateLoan: async () => {},
  deleteLoan: async () => {},
  makePayment: async () => false,
  getTotalOutstanding: () => 0,
  getUpcomingPayments: () => [],
  getLoanDistribution: () => [],
  isLoading: true,
});

export const useLoan = () => useContext(LoanContext);

// Sample data for demonstration
const sampleLoans: Loan[] = [
  {
    id: '1',
    name: 'iPhone 14 EMI',
    type: 'phone',
    totalAmount: 80000,
    remainingAmount: 60000,
    interestRate: 12,
    startDate: '2023-01-15',
    endDate: '2024-01-15',
    emiAmount: 7000,
    nextPaymentDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    paymentHistory: [
      {
        id: 'p1',
        amount: 7000,
        date: '2023-02-15',
        status: 'completed',
        method: 'upi',
      },
      {
        id: 'p2',
        amount: 7000,
        date: '2023-03-15',
        status: 'completed',
        method: 'bank',
      },
      {
        id: 'p3',
        amount: 7000,
        date: '2023-04-15',
        status: 'completed',
        method: 'wallet',
      },
    ],
    lender: 'HDFC Bank',
    accountNumber: 'XXXX1234',
    isManual: false,
  },
  {
    id: '2',
    name: 'Car Loan - Honda City',
    type: 'car',
    totalAmount: 800000,
    remainingAmount: 600000,
    interestRate: 8.5,
    startDate: '2022-10-10',
    endDate: '2027-10-10',
    emiAmount: 15000,
    nextPaymentDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    paymentHistory: [
      {
        id: 'p4',
        amount: 15000,
        date: '2022-11-10',
        status: 'completed',
        method: 'bank',
      },
      {
        id: 'p5',
        amount: 15000,
        date: '2022-12-10',
        status: 'completed',
        method: 'bank',
      },
    ],
    lender: 'SBI',
    accountNumber: 'XXXX5678',
    isManual: false,
  },
  {
    id: '3',
    name: 'Home Loan',
    type: 'property',
    totalAmount: 5000000,
    remainingAmount: 4500000,
    interestRate: 7.2,
    startDate: '2022-05-20',
    endDate: '2042-05-20',
    emiAmount: 40000,
    nextPaymentDate: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
    paymentHistory: [
      {
        id: 'p6',
        amount: 40000,
        date: '2022-06-20',
        status: 'completed',
        method: 'bank',
      },
      {
        id: 'p7',
        amount: 40000,
        date: '2022-07-20',
        status: 'completed',
        method: 'bank',
      },
    ],
    lender: 'ICICI Bank',
    accountNumber: 'XXXX9012',
    isManual: false,
  },
];

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLoans = async () => {
      try {
        const storedLoans = await AsyncStorage.getItem('loans');
        if (storedLoans) {
          setLoans(JSON.parse(storedLoans));
        } else {
          // Use sample data for first-time users
          setLoans(sampleLoans);
          await AsyncStorage.setItem('loans', JSON.stringify(sampleLoans));
        }
      } catch (error) {
        console.error('Failed to load loans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLoans();
  }, []);

  const saveLoans = async (updatedLoans: Loan[]) => {
    try {
      await AsyncStorage.setItem('loans', JSON.stringify(updatedLoans));
    } catch (error) {
      console.error('Failed to save loans:', error);
    }
  };

  const addLoan = async (loan: Omit<Loan, 'id' | 'paymentHistory'>) => {
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
      paymentHistory: [],
    };

    const updatedLoans = [...loans, newLoan];
    setLoans(updatedLoans);
    await saveLoans(updatedLoans);
  };

  const updateLoan = async (id: string, loanUpdate: Partial<Loan>) => {
    const updatedLoans = loans.map(loan => 
      loan.id === id ? { ...loan, ...loanUpdate } : loan
    );
    
    setLoans(updatedLoans);
    await saveLoans(updatedLoans);
  };

  const deleteLoan = async (id: string) => {
    const updatedLoans = loans.filter(loan => loan.id !== id);
    setLoans(updatedLoans);
    await saveLoans(updatedLoans);
  };

  const makePayment = async (
    loanId: string, 
    amount: number, 
    method: 'bank' | 'upi' | 'wallet'
  ): Promise<boolean> => {
    try {
      // In a real app, you would make an API call to process payment
      // For demo purposes, we'll simulate a successful payment
      
      const loanIndex = loans.findIndex(loan => loan.id === loanId);
      if (loanIndex === -1) return false;
      
      const loan = loans[loanIndex];
      const newPayment: Payment = {
        id: Date.now().toString(),
        amount,
        date: format(new Date(), 'yyyy-MM-dd'),
        status: 'completed',
        method,
      };
      
      const newRemainingAmount = Math.max(0, loan.remainingAmount - amount);
      const nextPaymentDate = format(
        addMonths(new Date(loan.nextPaymentDate), 1),
        'yyyy-MM-dd'
      );
      
      const updatedLoan: Loan = {
        ...loan,
        remainingAmount: newRemainingAmount,
        nextPaymentDate,
        paymentHistory: [newPayment, ...loan.paymentHistory],
      };
      
      const updatedLoans = [...loans];
      updatedLoans[loanIndex] = updatedLoan;
      
      setLoans(updatedLoans);
      await saveLoans(updatedLoans);
      
      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      return false;
    }
  };

  const getTotalOutstanding = (): number => {
    return loans.reduce((total, loan) => total + loan.remainingAmount, 0);
  };

  const getUpcomingPayments = (days: number): { loan: Loan; daysLeft: number }[] => {
    const today = new Date();
    const upcomingPayments = loans
      .map(loan => {
        const paymentDate = new Date(loan.nextPaymentDate);
        const daysLeft = Math.ceil(
          (paymentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        return { loan, daysLeft };
      })
      .filter(({ daysLeft }) => daysLeft >= 0 && daysLeft <= days)
      .sort((a, b) => a.daysLeft - b.daysLeft);

    return upcomingPayments;
  };

  const getLoanDistribution = (): { type: string; percentage: number }[] => {
    const totalOutstanding = getTotalOutstanding();
    if (totalOutstanding === 0) return [];

    const distribution: Record<string, number> = {};
    
    loans.forEach(loan => {
      if (!distribution[loan.type]) {
        distribution[loan.type] = 0;
      }
      distribution[loan.type] += loan.remainingAmount;
    });

    return Object.entries(distribution).map(([type, amount]) => ({
      type,
      percentage: (amount / totalOutstanding) * 100,
    }));
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        addLoan,
        updateLoan,
        deleteLoan,
        makePayment,
        getTotalOutstanding,
        getUpcomingPayments,
        getLoanDistribution,
        isLoading,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};