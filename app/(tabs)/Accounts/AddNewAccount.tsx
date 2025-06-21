import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addNewAccount } from '@/db';
import { router } from 'expo-router';

export default function AddNewAccount() {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState<'Bank' | 'Credit'>('Bank');
  const [accountBalance, setAccountBalance] = useState('');
  const [creditLimit, setCreditLimit] = useState(''); // New state for credit accounts

  const handleSave = async () => {
    if (!accountName || !accountBalance || (accountType === 'Credit' && !creditLimit)) {
      Alert.alert('Please fill all required fields.');
      return;
    }

    const newAccount = {
      accountName,
      accountType,
      accountBalance: parseFloat(accountBalance),
      creditLimit: accountType === 'Credit' ? parseFloat(creditLimit) : null,
    };

    const isSuccess = await addNewAccount(newAccount);

    if (isSuccess) {
      Alert.alert('Account saved successfully!');
      setAccountName('');
      setAccountType('Bank');
      setAccountBalance('');
      setCreditLimit('');
      router.back();
    } else {
      Alert.alert('Failed to save account. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => router.back()} color={'black'} />

      <Text style={styles.label}>Account Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter account name"
        value={accountName}
        onChangeText={setAccountName}
      />

      <Text style={styles.label}>Account Type</Text>
      <Picker
        selectedValue={accountType}
        onValueChange={(value) => setAccountType(value)}
        style={styles.input}
      >
        <Picker.Item label="Bank" value="Bank" />
        <Picker.Item label="Credit" value="Credit" />
      </Picker>

      <Text style={styles.label}>
        {accountType === 'Credit' ? 'Current Outstanding' : 'Account Balance'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter balance"
        keyboardType="numeric"
        value={accountBalance}
        onChangeText={setAccountBalance}
      />

      {accountType === 'Credit' && (
        <>
          <Text style={styles.label}>Credit Limit</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter credit limit"
            keyboardType="numeric"
            value={creditLimit}
            onChangeText={setCreditLimit}
          />
        </>
      )}

      <Button title="Save Account" onPress={handleSave} color={'black'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  label: {
    marginBottom: 4,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
});
