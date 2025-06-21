import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Button';
import { getAllAccounts } from '@/db';
import { addNewAllocation } from '@/db';
import { router } from 'expo-router';

const CreateNewAllocation = () => {
    const [allocationName, setAllocationName] = useState('');
    const [allocationAmount, setAllocationAmount] = useState('');
    const [allocationAccount, setAllocationAccount] = useState('');
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);

    const fetchAccounts = async () => {
        const allAccounts = await getAllAccounts();
        const filtered = allAccounts.filter((acc: any) => acc.account_type === 'Bank');
        setBankAccounts(filtered);
        if (filtered.length > 0 && !allocationAccount) {
            setAllocationAccount(filtered[0].id);
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
            allocationAccountId: allocationAccount,
            allocationName,
            allocationAmount: parseFloat(allocationAmount),
        });

        if (isSuccess) {
            Alert.alert('Allocation saved successfully!');
            setAllocationName('');
            setAllocationAmount('');
            if (bankAccounts.length > 0) setAllocationAccount(bankAccounts[0].id);
            navigateBack();
        } else {
            Alert.alert('Failed to save allocation. Please try again.');
        }
    };

    const navigateBack = () => {
        router.back();
    };

    const noBankAccounts = bankAccounts.length === 0;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Button title="Back" onPress={navigateBack} color={'black'} />

            {noBankAccounts ? (
                <Text style={{ marginTop: 20, fontSize: 16, color: 'red' }}>
                    Allocations can only be created for bank-type accounts. No bank accounts found.
                </Text>
            ) : (
                <>
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
                            onValueChange={(itemValue: any) => setAllocationAccount(itemValue)}
                        >
                            {bankAccounts.map((acc: any) => (
                                <Picker.Item
                                    label={`${acc.account_name}`}
                                    value={acc.id}
                                    key={acc.id}
                                />
                            ))}
                        </Picker>
                    </View>

                    <Button title="Save Allocation" onPress={handleSave} />
                </>
            )}
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
