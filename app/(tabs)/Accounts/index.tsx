import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback } from 'react';
import Button from '@/components/Button';
import { router, useFocusEffect } from 'expo-router';
import { getAllAccounts, deleteAccountById } from '@/db';
import roundOff from '@/utilities';
import Account from '@/components/Accounts/Account';

const index = () => {
  const [accounts, setAccounts] = React.useState([]);

  const navigateToAddNewAccount = () => {
    router.navigate('/Accounts/AddNewAccount');
  };

  const navigateToCreateNewAllocation = () => {
    router.navigate('/Accounts/CreateNewAllocation');
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
    const accounts = await getAllAccounts();
    setAccounts(accounts);
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
    <View style={{backgroundColor:'white'}}>
      <Text style={styles.title}>Accounts</Text>
      <Text style={{fontSize: 22, fontWeight: '700', marginTop: 20, paddingHorizontal: 16}}>Your accounts</Text>
      {accounts.length > 0 ? (
        <ScrollView style={styles.table}>
          
          {/* Table Rows */}
          {accounts.map((account: any) => {
            const isCredit = account.account_type === 'Credit';
            const availableCredit = isCredit
              ? account.credit_limit - account.account_balance
              : 0;

            return (
              <TouchableOpacity 
                key={account.id}
                onPress={() =>
                navigateToAllocations(
                  account.id,
                  account.account_name,
                  account.account_balance,
                  account.account_type
                )}>
                <Account account_name={account.account_name} account_type={account.account_type} account_balance={account.account_type === 'Credit' ? availableCredit : account.account_balance}></Account>
              </TouchableOpacity>
              
            );
          })}
        </ScrollView>
      ) : (
        <Text>No accounts found</Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={navigateToAddNewAccount}
          style={{backgroundColor:'#187ce4', padding: 12, borderRadius: 10, marginTop: 10}}
        >
          <Text style={{color:'white', textAlign:'center', fontSize: 16}}>Add Account</Text>
        </TouchableOpacity>
        {/* <Button title="Create New Allocation" onPress={navigateToCreateNewAllocation} /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor:'white', paddingTop: 16},
  table: {marginTop: 10, backgroundColor:'white', height: '75%', width: '100%', paddingHorizontal: 16 },
  row: { flexDirection: 'row'},
  cell: { flex: 1, padding: 8, textAlign: 'center' },
  headerCell: { fontWeight: 'bold' },
  buttonContainer: { marginTop: 10, padding: 12}
});

export default index;
