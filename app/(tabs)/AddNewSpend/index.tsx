import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const index = () => {
  const [number, setNumber] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedAllocation, setSelectedAllocation] = useState('');
  const [transactionType, setTransactionType] = useState('Expense');
  const [notes, setNotes] = useState('');

  // Dummy account data
  const accounts = [
    { id: '1', name: 'Savings Account', allocations: ['Bills', 'Groceries', 'Emergency Fund'] },
    { id: '2', name: 'Credit Card', allocations: [] }, // No allocations
    { id: '3', name: 'Cash Wallet', allocations: ['Entertainment', 'Dining Out'] },
  ];

  // Get allocations for the selected account
  const selectedAccountData = accounts.find(acc => acc.name === selectedAccount);
  const allocations = selectedAccountData ? selectedAccountData.allocations : [];

  const handlePress = () => {
    console.log('Transaction Type:', transactionType);
    console.log('Entered Number:', number);
    console.log('Selected Account:', selectedAccount);
    console.log('Selected Allocation:', selectedAllocation);
    console.log('Notes:', notes);
    
    Alert.alert('Transaction Added', 
      `Type: ${transactionType}\nAmount: ${number}\nAccount: ${selectedAccount}\nCategory: ${selectedAllocation || 'None'}\nNotes: ${notes || 'None'}`
    );
  };

  return (
    <View style={styles.container}>
      {/* Transaction Type Selection */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={transactionType}
          onValueChange={setTransactionType}
          style={styles.picker}
          mode="dialog"
        >
          <Picker.Item label="Expense" value="Expense" style={styles.pickerItem} />
          <Picker.Item label="Income" value="Income" style={styles.pickerItem} />
        </Picker>
      </View>
      
      <TextInput
        style={styles.input}
        onChangeText={setNumber}
        value={number}
        placeholder="Enter amount"
        keyboardType="numeric"
      />

      {/* Account Selection */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedAccount}
          onValueChange={(itemValue) => {
            setSelectedAccount(itemValue);
            setSelectedAllocation(''); // Reset allocation when account changes
          }}
          style={styles.picker}
          mode="dialog"
        >
          <Picker.Item label="Select Account" value="" style={styles.pickerItem} />
          {accounts.map((account) => (
            <Picker.Item key={account.id} label={account.name} value={account.name} style={styles.pickerItem} />
          ))}
        </Picker>
      </View>

      {/* Allocation Selection (Only Show If Account Has Allocations) */}
      {allocations.length > 0 && (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedAllocation}
            onValueChange={setSelectedAllocation}
            style={styles.picker}
            mode="dialog"
          >
            <Picker.Item label="Select Allocation Category" value="" style={styles.pickerItem} />
            {allocations.map((allocation, index) => (
              <Picker.Item key={index} label={allocation} value={allocation} style={styles.pickerItem} />
            ))}
          </Picker>
        </View>
      )}

      {/* Notes Input */}
      <TextInput
        style={styles.input}
        onChangeText={setNotes}
        value={notes}
        placeholder="Enter any notes (optional)"
      />

      <Button title="Add Spend" onPress={handlePress} color={'black'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'center',
    height: '100%',
  },
  input: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    height: 50,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#000',
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  pickerItem: {
    fontSize: 14,
  },
});

export default index;
