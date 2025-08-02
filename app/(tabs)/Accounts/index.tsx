import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getAllAccounts, deleteAccountById } from '@/db';
import AccountsSummary from '@/components/Accounts/AccountsSummary';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';

const index = () => {
  const [summary, setSummary] = React.useState('');
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
    const accounts = await getAllAccounts();
    const summary: any = {
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
      summary[type].count += 1;
      summary[type].totalBalance += account.account_balance;
    });
    setSummary(summary);
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
    <View style={{ backgroundColor: 'white', height: '100%' }}>
      <Text style={styles.title}>Accounts</Text>
      <View style={{ gap: 8, marginTop: 10 }}>
        {Object.keys(summary).map((accountType: any) => (
          <Pressable key={accountType} style={{ padding: 12 }} onPress={() => navigateToAccountType(accountType)}>
            <AccountsSummary accountType={accountType} accountSummary={summary[accountType]}></AccountsSummary>
          </Pressable>
        ))}
      </View>
      {/* <Text style={{ fontSize: 22, fontWeight: '700', marginTop: 20, paddingHorizontal: 16 }}>Your accounts</Text> */}

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={navigateToAddNewAccount}
          style={{ backgroundColor: '#187ce4', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Add Account</Text>
        </TouchableOpacity>
      </View> */}
      {/* <Button title="Create New Allocation" onPress={navigateToCreateNewAllocation} /> */}

    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', paddingTop: 16 },
  table: { marginTop: 10, backgroundColor: 'white', height: '78%', width: '100%', paddingHorizontal: 16 },
  buttonContainer: { backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }
});

export default index;
