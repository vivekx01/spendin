import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { addNewAccount } from '@/db';
import { router } from 'expo-router';
import TxtInput from '@/components/Accounts/TxtInput';
import AmountInput from '@/components/AddNewSpend/AmountInput';
import AccountTypePicker from '@/components/Accounts/AccountTypePicker';
import { useTheme } from '@/context/ThemeContext';

export default function AddNewAccount() {
  const { theme } = useTheme();
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* <Button title="Back" onPress={() => router.back()} color={'black'} /> */}
      <Text style={[styles.title, { color: theme.colors.text }]}>Create New Account</Text>
      <TxtInput text={accountName} setText={setAccountName} placeholder={'Enter account name'}></TxtInput>
      <AccountTypePicker selectedAccountType={accountType} setSelectedAccountType={setAccountType} accountTypes={["Bank","Credit"]}></AccountTypePicker>
      <AmountInput number={accountBalance} setNumber={setAccountBalance} placeholder= {accountType === 'Credit' ? 'Current Outstanding' : 'Account Balance'}></AmountInput>
      {accountType === 'Credit' && (
          <AmountInput number={creditLimit} setNumber={setCreditLimit} placeholder='Enter Credit Limit'></AmountInput>
      )}
      {/* <Text style={styles.label}>Account Name</Text>
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
      )} */}

      {/* <Button title="Save Account" onPress={handleSave} color={'black'} /> */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: theme.colors.text }]}>
          <Text style={{ color: theme.colors.background, textAlign: 'center', fontSize: 16 }}>
            Save Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} style={[styles.cancelbutton, { backgroundColor: theme.colors.card }]}>
          <Text style={{ color: theme.colors.text, textAlign: 'center', fontSize: 16 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: '100%' },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingTop: 16 },
  buttonContainer: { flexDirection:'column', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 25, gap: 10},
  button: { paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
  cancelbutton: { paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
  // label: {
  //   marginBottom: 4,
  //   fontWeight: 'bold',
  // },
  // input: {
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 6,
  //   padding: 8,
  //   marginBottom: 16,
  // },
});
