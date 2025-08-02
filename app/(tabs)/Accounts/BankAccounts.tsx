import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Pressable } from 'react-native';
import React, { useCallback } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { getAllAccounts, deleteAccountById } from '@/db';
import Account from '@/components/Accounts/Account';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import renderRightActions from '@/components/Accounts/RenderRightActions';

const BankAccounts = () => {
  const [accounts, setAccounts] = React.useState([]);

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

  const fetchAccounts = async () => {
    const allAccounts = await getAllAccounts();
    const bankAccounts = allAccounts.filter((acc: any) => acc.account_type === 'Bank');
    setAccounts(bankAccounts);
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
    <View style={{ backgroundColor: 'white' }}>
      <Text style={styles.title}>Bank Accounts</Text>

      {accounts.length > 0 ? (
        <ScrollView style={styles.table}>
          {accounts.map((account: any) => (
            <Swipeable
              key={account.id}
              renderRightActions={() => renderRightActions(account.id, handleDeleteAccount)}
            >
              <Pressable
                key={account.id}
                onPress={() =>
                  navigateToAllocations(
                    account.id,
                    account.account_name,
                    account.account_balance,
                    account.account_type
                  )
                }
              >
                <Account
                  account_name={account.account_name}
                  account_type={account.account_type}
                  account_balance={account.account_balance}
                />
              </Pressable>
            </Swipeable>
          ))}
        </ScrollView>
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No bank accounts found</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={navigateToAddNewAccount}
          style={{
            backgroundColor: '#187ce4',
            paddingVertical: 12,
            paddingHorizontal: 120,
            borderRadius: 50,
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white',
    paddingTop: 16,
  },
  table: {
    marginTop: 10,
    backgroundColor: 'white',
    height: '85%',
    width: '100%',
    paddingHorizontal: 16,
  },
  buttonContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});

export default BankAccounts;
