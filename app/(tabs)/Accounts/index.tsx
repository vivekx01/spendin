import { View, Text, StyleSheet } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import Button from '@/components/Button'
import { router, useFocusEffect } from 'expo-router'
import { getAllAccounts } from '@/db'

const index = () => {
  const [accounts, setAccounts] = React.useState([])
  const navigateToAddNewAccount = () => {
    router.navigate('/Accounts/AddNewAccount')
  }
  const navigateToCreateNewAllocation = () => {
    router.navigate('/Accounts/CreateNewAllocation')
  }
  const fetchAccounts = async () => {
    const accounts = await getAllAccounts()
    setAccounts(accounts)
  }
  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );
  
  return (
    <View>
      <Text>Accounts</Text>
      {accounts.length > 0 ? (
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerCell]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell]}>Type</Text>
            <Text style={[styles.cell, styles.headerCell]}>Balance</Text>
          </View>

          {/* Table Rows */}
          {accounts.map((account: any) => (
            <View key={account.id} style={styles.row}>
              <Text style={styles.cell}>{account.account_name}</Text>
              <Text style={styles.cell}>{account.account_type}</Text>
              <Text style={styles.cell}>{account.account_balance}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text>No accounts found</Text>
      )}
      <View
      style={{
        marginTop: 16,
        padding: 16,
        gap: 16,
      }}
      >
        <Button title="Add Account" onPress={navigateToAddNewAccount} />
        <Button title="Create New Allocation" onPress={navigateToCreateNewAllocation} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
  },
  headerCell: {
    fontWeight: 'bold',
  },
});

export default index