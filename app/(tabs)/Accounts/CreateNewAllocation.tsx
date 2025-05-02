import { View, Text, TextInput, StyleSheet, Alert, Picker, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getAllAccounts } from '@/db';
import { addNewAllocation } from '@/db';
import { router } from 'expo-router';

const CreateNewAllocation = () => {
    const [allocationName, setAllocationName] = useState('');
    const [allocationAmount, setAllocationAmount] = useState('');
    const [allocationAccount, setAllocationAccount] = useState('');
    const [accounts, setAccounts] = useState([]);

    const fetchAccounts = async () => {
        const accs = await getAllAccounts();
        setAccounts(accs);
        if (accs.length > 0 && !allocationAccount) {
            setAllocationAccount(accs[0].id); // Default to first account
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleSave = async () => {
        if (!allocationName || !allocationAmount || !allocationAccount) {
            Alert.alert('Please fill all fields');
            return;
        }

        const isSuccess = await addNewAllocation({
            allocationAccount,
            allocationName,
            allocationAmount: parseFloat(allocationAmount),
        });

        if (isSuccess) {
            Alert.alert('Allocation saved successfully!');
            setAllocationName('');
            setAllocationAmount('');
            if (accounts.length > 0) setAllocationAccount(accounts[0].id);
            router.navigate('/Allocations'); // Adjust path if needed
        } else {
            Alert.alert('Failed to save allocation. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>Allocation Name</Text>
            <TextInput
                value={allocationName}
                onChangeText={setAllocationName}
                placeholder="Enter allocation name"
                style={styles.input}
            />

            <Text style={styles.label}>Allocation Amount</Text>
            <TextInput
                value={allocationAmount}
                onChangeText={setAllocationAmount}
                placeholder="Enter allocation amount"
                keyboardType="numeric"
                style={styles.input}
            />

            <Text style={styles.label}>Select Account</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={allocationAccount}
                    onValueChange={(itemValue) => setAllocationAccount(itemValue)}
                >
                    {accounts.map((acc: any) => (
                        <Picker.Item
                            label={`${acc.account_name} (${acc.account_type})`}
                            value={acc.id}
                            key={acc.id}
                        />
                    ))}
                </Picker>
            </View>

            <Button title="Save Allocation" onPress={handleSave} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 8,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        marginBottom: 16,
    },
});

export default CreateNewAllocation;
