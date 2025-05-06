import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useCallback } from 'react';
import Button from '@/components/Button';
import { router, useFocusEffect } from 'expo-router';
import { getAllAccounts, deleteAccountById } from '@/db';
import roundOff from '@/utilities';

const index = () => {
  const [accounts, setAccounts] = React.useState([]);

  const navigateToAddNewAccount = () => {
    router.navigate('/Accounts/AddNewAccount');
  };

  const navigateToCreateNewAllocation = () => {
    router.navigate('/Accounts/CreateNewAllocation');
  };

  const navigateToAllocations = (accountId: string, accountName: string) => {
    router.navigate({
      pathname: '/Accounts/AllocationsList',
      params: { accountId, accountName },   // Pass params to next screen
    });
  };

  const fetchAccounts = async () => {
    const accounts = await getAllAccounts();
    setAccounts(accounts);
  };

  const handleDeleteAccount = async (accountId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this account?',
      [
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
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );

  return (
    <ScrollView>
      <Text style={styles.title}>Accounts</Text>

      {accounts.length > 0 ? (
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Type</Text>
            <Text style={[styles.cell, styles.headerCell]}>Balance</Text>
            <Text style={[styles.cell, styles.headerCell]}>Actions</Text>
          </View>

          {/* Table Rows */}
          {accounts.map((account: any) => (
            <View key={account.id} style={styles.row}>
              <Text style={styles.cell}>{account.account_name}</Text>
              <Text style={styles.cell}>{account.account_type}</Text>
              <Text style={styles.cell}>{roundOff(account.account_balance)}</Text>
              <View style={[styles.cell, { padding: 3 }]}>
                <View style={styles.buttonColumn}>
                  <Button
                    title="View"
                    onPress={() => navigateToAllocations(account.id, account.account_name)}
                  />
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteAccount(account.id)}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text>No accounts found</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Add Account" onPress={navigateToAddNewAccount} />
        <Button title="Create New Allocation" onPress={navigateToCreateNewAllocation} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: 'bold', marginTop: 16, textAlign: 'center' },
  table: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, marginTop: 16 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#ccc' },
  headerRow: { backgroundColor: '#f0f0f0' },
  cell: { flex: 1, padding: 8, textAlign: 'center' },
  headerCell: { fontWeight: 'bold' },
  buttonContainer: { marginTop: 16, padding: 16, gap: 16 },
  buttonColumn: {
    flexDirection: 'column',
    gap: 6,
  },
});

export default index;
