import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addNewAccount } from '@/db';
import { router } from 'expo-router';

export default function AddNewAccount() {
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('Bank');
  const [accountBalance, setAccountBalance] = useState('');

  const handleSave = async() => {
    if (!accountName || !accountBalance) {
      Alert.alert('Please fill all fields');
      return;
    }

    // You can handle saving to DB here
    let isSuccess = await addNewAccount({
      accountName,
      accountType,
      accountBalance: parseFloat(accountBalance),
    });

    if (isSuccess) {
      Alert.alert('Account saved successfully!');
      // Reset fields after saving
      setAccountName('');
      setAccountType('Bank');
      setAccountBalance('');
      router.navigate('/Accounts');
    } else {
      Alert.alert('Failed to save account. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
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
        onValueChange={(itemValue) => setAccountType(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Bank" value="Bank" />
        <Picker.Item label="Credit" value="Credit" />
      </Picker>

      <Text style={styles.label}>Account Balance</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter balance"
        keyboardType="numeric"
        value={accountBalance}
        onChangeText={setAccountBalance}
      />

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
