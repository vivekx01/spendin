import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, Button, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAccounts } from '@/db';
import { getAllocationsByAccountId } from '@/db/allocations';
import { addNewSpend } from '@/db';

interface Account {
  id: string;
  account_name: string;
  balance: number;
}

interface Allocation {
  id: string;
  allocation_name: string;
  allocation_balance: number;
}

const AddNewSpend = () => {
  const [number, setNumber] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [selectedAllocationId, setSelectedAllocationId] = useState('');
  const [transactionType, setTransactionType] = useState<'Expense' | 'Income'>('Expense');
  const [notes, setNotes] = useState('');
  const [spendName, setSpendName] = useState('Expense');

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  // Fetch accounts on screen focus
  useFocusEffect(
    useCallback(() => {
      const fetchAccounts = async () => {
        const result = await getAllAccounts();
        setAccounts(result);
      };
      fetchAccounts();
    }, [])
  );

  // Fetch allocations when selectedAccountId changes (and screen is focused)
  useFocusEffect(
    useCallback(() => {
      const fetchAllocations = async () => {
        if (selectedAccountId) {
          const result = await getAllocationsByAccountId(selectedAccountId);
          setAllocations(result);
        } else {
          setAllocations([]);
        }
      };
      fetchAllocations();
    }, [selectedAccountId])
  );

  // Sync spendName default when transactionType changes (and screen is focused)
  useFocusEffect(
    useCallback(() => {
      if (spendName.trim() === '' || spendName === 'Expense' || spendName === 'Income') {
        setSpendName(transactionType);
      }
    }, [transactionType])
  );

  const handlePress = async () => {
    if (!number || isNaN(Number(number))) {
      Alert.alert('Validation Error', 'Please enter a valid amount.');
      return;
    }
    if (!selectedAccountId) {
      Alert.alert('Validation Error', 'Please select an account.');
      return;
    }

    const amount = parseFloat(number);
    const datetime = Date.now();

    const success = await addNewSpend({
      spendSource: selectedAccountId,
      spendCategory: selectedAllocationId || null,
      amount,
      transactionType,
      datetime,
      name: spendName.trim() || transactionType,
      notes,
    });

    if (success === true) {
      const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
      const selectedAllocation = allocations.find(a => a.id === selectedAllocationId);

      Alert.alert(
        'Transaction Added',
        `Type: ${transactionType}\nName: ${spendName.trim() || transactionType}\nAmount: ${amount}\nAccount: ${selectedAccount?.account_name || ''}\nCategory: ${selectedAllocation?.allocation_name || 'None'}\nNotes: ${notes || 'None'}`
      );

      // Reset form
      setNumber('');
      setSelectedAccountId('');
      setSelectedAllocationId('');
      setNotes('');
      setTransactionType('Expense');
      setSpendName('Expense');
    } else {
      Alert.alert('Error', 'Failed to add transaction. Error: ' + success);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={transactionType}
          onValueChange={(value: 'Expense' | 'Income') => setTransactionType(value)}
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

      <TextInput
        style={styles.input}
        onChangeText={setSpendName}
        value={spendName}
        placeholder="Enter transaction name (optional)"
      />

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedAccountId}
          onValueChange={(itemValue: string) => {
            setSelectedAccountId(itemValue);
            setSelectedAllocationId('');
          }}
          style={styles.picker}
          mode="dialog"
        >
          <Picker.Item label="Select Account" value="" style={styles.pickerItem} />
          {accounts.map(account => (
            <Picker.Item key={account.id} label={account.account_name} value={account.id} style={styles.pickerItem} />
          ))}
        </Picker>
      </View>

      {allocations.length > 0 && (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedAllocationId}
            onValueChange={(itemValue: string) => setSelectedAllocationId(itemValue)}
            style={styles.picker}
            mode="dialog"
          >
            <Picker.Item label="Select Allocation Category" value="" style={styles.pickerItem} />
            {allocations.map(alloc => (
              <Picker.Item key={alloc.id} label={alloc.allocation_name} value={alloc.id} style={styles.pickerItem} />
            ))}
          </Picker>
        </View>
      )}

      <TextInput
        style={styles.input}
        onChangeText={setNotes}
        value={notes}
        placeholder="Enter any notes (optional)"
      />

      <Button title="Add Transaction" onPress={handlePress} color={'black'} />
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

export default AddNewSpend;
