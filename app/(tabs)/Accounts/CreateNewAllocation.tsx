import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getAllAccounts } from '@/db';
import { addNewAllocation } from '@/db';
import { router } from 'expo-router';
import TxtInput from '@/components/Accounts/TxtInput';
import AmountInput from '@/components/AddNewSpend/AmountInput';
import AllocationAccountPicker from '@/components/Accounts/AllocationAccountPicker';

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
            {/* <Button title="Back" onPress={navigateBack} color={'black'} /> */}
            <Text style={styles.title}>Edit Allocation</Text>
            {noBankAccounts ? (
                <Text style={{ marginTop: 20, fontSize: 16, color: 'red', textAlign : 'center' }}>
                    Allocations can only be created for bank-type accounts. No bank accounts found.
                </Text>
            ) : (
                <>
                    <TxtInput text={allocationName} setText={setAllocationName} placeholder='Enter Category Name'></TxtInput>
                    <AmountInput number={allocationAmount} setNumber={setAllocationAmount} placeholder='Enter Allocated Amount'></AmountInput>
                    <AllocationAccountPicker selectedAccount={allocationAccount} setSelectedAccount={setAllocationAccount} bankAccounts={bankAccounts} placeholder='Select Account'></AllocationAccountPicker>
                    {/* <Text style={styles.label}>Allocation Name</Text>
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
                    </View> */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleSave} style={styles.button}>
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
                                Create
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.back()} style={styles.cancelbutton}>
                            <Text style={{ color: 'black', textAlign: 'center', fontSize: 16 }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <Button title="Save Allocation" onPress={handleSave} /> */}
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: 'white', height: '100%' },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', paddingTop: 16 },
    buttonContainer: {backgroundColor:'white', flexDirection:'column', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 25, gap: 10},
    button: {backgroundColor:'#187ce4', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
    cancelbutton: {backgroundColor:'#ddd', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
    // label: {
    //     marginTop: 12,
    //     marginBottom: 4,
    //     fontWeight: 'bold',
    // },
    // input: {
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     borderRadius: 4,
    //     padding: 8,
    // },
    // pickerWrapper: {
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     borderRadius: 4,
    //     marginBottom: 16,
    // },
});

export default CreateNewAllocation;
