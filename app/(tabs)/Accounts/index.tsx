import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import React, { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getAllAccounts, deleteAccountById } from '@/db';
import AccountsSummary from '@/components/Accounts/AccountsSummary';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';

const index = () => {
  const { theme } = useTheme();
  const [summary, setSummary] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict mode by default
  });
  const navigateToAddNewAccount = () => {
    router.navigate('/Accounts/AddNewAccount');
  };

  const navigateToAllocations = (
    accountId: string,
    accountName: string,
    accountBalance: number,
    accountType: string
  ) => {
    router.navigate({
      pathname: '/Accounts/AllocationsList',
      params: { accountId, accountName, accountBalance, accountType },
    });
  };

  const navigateToAccountType = (accountType: string) => {
    switch (accountType) {
      case "bank":
        router.navigate('/Accounts/BankAccounts');
        break;
      case "credit":
        router.navigate('/Accounts/CreditAccounts');
        break;
      default:
        router.navigate('/Accounts/BankAccounts');
        break;
    }
  }

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const accounts = await getAllAccounts();
      const nextSummary: any = {
        bank: {
          count: 0,
          totalBalance: 0,
        },
        credit: {
          count: 0,
          totalBalance: 0,
        },
      };

      accounts.forEach((account: any) => {
        const type = account.account_type === 'Credit' ? 'credit' : 'bank';
        nextSummary[type].count += 1;
        nextSummary[type].totalBalance += account.account_balance;
      });
      setSummary(nextSummary);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const success = await deleteAccountById(accountId);
          if (success) {
            fetchAccounts(); // Refresh list
          } else {
            Alert.alert('Error', 'Failed to delete account');
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  return (
    <View style={{ backgroundColor: theme.colors.background, height: '100%' }}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Accounts</Text>
      {loading && !summary ? (
        <View style={{ paddingVertical: 24, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="small" color={theme.colors.accent} />
        </View>
      ) : (
        <View style={{ gap: 8, marginTop: 10 }}>
          {Object.keys(summary).map((accountType: any) => (
            <Pressable key={accountType} style={{ padding: 12 }} onPress={() => navigateToAccountType(accountType)}>
              <AccountsSummary accountType={accountType} accountSummary={summary[accountType]}></AccountsSummary>
            </Pressable>
          ))}
        </View>
      )}
      {/* <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 20, paddingHorizontal: 16 }}>Your accounts</Text> */}

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={navigateToAddNewAccount}
          style={{ backgroundColor: '#187ce4', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Add Account</Text>
        </TouchableOpacity>
      </View> */}
      {/* <Button title="Create New Allocation" onPress={navigateToCreateNewAllocation} /> */}
      <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          onPress={navigateToAddNewAccount}
          style={{
            backgroundColor: theme.colors.text,
            paddingVertical: 12,
            paddingHorizontal: 120,
            borderRadius: 50,
          }}
        >
          <Text style={{ color: theme.colors.background, textAlign: 'center', fontSize: 16 }}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingTop: 16 },
  table: { marginTop: 10, height: '78%', width: '100%', paddingHorizontal: 16 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }
});

export default index;
