import React, { useState, useCallback } from 'react';
import { StyleSheet, TextInput, View, Button, Alert, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAccounts } from '@/db';
import { getAllocationsByAccountId } from '@/db/allocations';
import { addNewSpend } from '@/db';
import { router } from 'expo-router';
import TransactionTypeToggle from '@/components/AddNewSpend/TransactionTypeToggle';
import AmountInput from '@/components/AddNewSpend/AmountInput';
import AccountPicker from '@/components/AddNewSpend/AccountPicker';
import AllocationPicker from '@/components/AddNewSpend/AllocationPicker';
import NotesInput from '@/components/AddNewSpend/NotesInput';
import SpendNameInput from '@/components/AddNewSpend/SpendNameInput';

interface Account {
  id: string;
  account_name: string;
  balance: number;
  account_type: 'Bank' | 'Credit';
  credit_limit?: number | null;
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

  useFocusEffect(
    useCallback(() => {
      const fetchAccounts = async () => {
        const result = await getAllAccounts();
        setAccounts(result);
      };
      fetchAccounts();
    }, [])
  );

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

    const selectedAccount = accounts.find(acc => acc.id === selectedAccountId);
    if (!selectedAccount) {
      Alert.alert('Error', 'Selected account not found.');
      return;
    }

    const success = await addNewSpend({
      spendSource: selectedAccountId,
      spendCategory: selectedAllocationId || undefined,
      amount,
      accountType : selectedAccount.account_type,
      transactionType,
      datetime,
      name: spendName.trim() || transactionType,
      notes,
    });

    if (success === true) {
      const selectedAllocation = allocations.find(a => a.id === selectedAllocationId);

      Alert.alert(
        'Transaction Added',
        `Type: ${transactionType}\nName: ${spendName.trim() || transactionType}\nAmount: ${amount}\nAccount: ${selectedAccount.account_name}\nCategory: ${selectedAllocation?.allocation_name || 'None'}\nNotes: ${notes || 'None'}`
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

  const navigateToSelfTransfer = () => {
    router.push("/AddNewSpend/SelfTransfer");
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      <TransactionTypeToggle onChange={(type:'Expense' | 'Income') => setTransactionType(type)} />
      <AmountInput number={number} setNumber={setNumber} />
      <SpendNameInput spendName={spendName} setSpendName={setSpendName} />
      <AccountPicker
        selectedAccountId={selectedAccountId}
        setSelectedAccountId={setSelectedAccountId}
        setSelectedAllocationId={setSelectedAllocationId}
        accounts={accounts}
      />
      {allocations.length > 0 && (
        <AllocationPicker
          selectedAllocationId={selectedAllocationId}
          setSelectedAllocationId={setSelectedAllocationId}
          allocations={allocations}
        />
      )}
      <NotesInput notes={notes} setNotes={setNotes} />
      <View style={styles.buttonContainer}
      >
        <TouchableOpacity onPress={handlePress} style={styles.button}>
          <Text style={{color:'white', textAlign:'center', fontSize: 16}}>
            Add Transaction
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToSelfTransfer} style={styles.selftransferbutton}>
          <Text style={{color:'white', textAlign:'center', fontSize: 16}}>
            Self Transfer
          </Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.pickerWrapper}>
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
            <Picker.Item label="Select Allocation Category (Optional)" value="" style={styles.pickerItem} />
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
      <View
        style={{
          marginTop: 8,
          gap: 8,
          width: '100%',
        }}
      >
        <Button title="Add Transaction" onPress={handlePress} color={'black'} />
        <Button title="Self Transfer" onPress={navigateToSelfTransfer} color={'black'} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: '100%'
  },
  title: {
    textAlign: 'center',
    padding: 16,
    fontSize: 18, 
    fontWeight: 'bold'
  },
  buttonContainer: {backgroundColor:'white', flexDirection:'column', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 16, gap: 10},
  button: {backgroundColor:'#187ce4', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
  selftransferbutton: {backgroundColor:'#388e3c', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50}
});
// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     justifyContent: 'center',
//     height: '100%',
//   },
//   input: {
//     height: 50,
//     marginBottom: 12,
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//     borderColor: '#000',
//     backgroundColor: '#fff',
//   },
//   pickerWrapper: {
//     height: 50,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderRadius: 5,
//     borderColor: '#000',
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   picker: {
//     height: 50,
//   },
//   pickerItem: {
//     fontSize: 14,
//   },
// });

export default AddNewSpend;
