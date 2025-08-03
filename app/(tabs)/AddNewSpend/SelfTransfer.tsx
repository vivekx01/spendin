import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllAccounts } from '@/db';
import { getAllocationsByAccountId } from '@/db/allocations';
import { addNewSpend } from '@/db';

import AmountInput from '@/components/AddNewSpend/AmountInput';
import NotesInput from '@/components/AddNewSpend/NotesInput';
import AccountPicker from '@/components/AddNewSpend/AccountPicker';
import AllocationPicker from '@/components/AddNewSpend/AllocationPicker';

const SelfTransfer = () => {
    const [accounts, setAccounts] = useState([]);
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');

    const [fromAllocations, setFromAllocations] = useState([]);
    const [toAllocations, setToAllocations] = useState([]);
    const [fromAllocationId, setFromAllocationId] = useState('');
    const [toAllocationId, setToAllocationId] = useState('');

    const [amount, setAmount] = useState('');
    const [notes, setNotes] = useState('');

    // Load accounts on focus
    useFocusEffect(
        useCallback(() => {
            const fetchAccounts = async () => {
                const result = await getAllAccounts();
                setAccounts(result);
            };
            fetchAccounts();
        }, [])
    );

    // Load source allocations
    useEffect(() => {
        const fetchAllocs = async () => {
            if (fromAccountId) {
                const result = await getAllocationsByAccountId(fromAccountId);
                setFromAllocations(result);
            } else {
                setFromAllocations([]);
            }
            setFromAllocationId('');
        };
        fetchAllocs();
    }, [fromAccountId]);

    // Load destination allocations
    useEffect(() => {
        const fetchAllocs = async () => {
            if (toAccountId) {
                const result = await getAllocationsByAccountId(toAccountId);
                setToAllocations(result);
            } else {
                setToAllocations([]);
            }
            setToAllocationId('');
        };
        fetchAllocs();
    }, [toAccountId]);

    const filteredToAccounts = accounts.filter(acc => acc.id !== fromAccountId);
    const filteredToAllocations = toAllocations.filter(alloc => {
        return !(fromAccountId === toAccountId && alloc.id === fromAllocationId);
    });

    const handleSubmit = async () => {
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) {
            Alert.alert('Invalid amount');
            return;
        }

        if (!fromAccountId || !toAccountId) {
            Alert.alert('Please select both source and destination accounts');
            return;
        }

        const isSameAccount = fromAccountId === toAccountId;
        const isSameCategory = fromAllocationId === toAllocationId;

        if (isSameAccount && isSameCategory) {
            Alert.alert('Cannot transfer to the same account and category');
            return;
        }

        const now = Date.now();
        const fromAccountType = accounts.find(acc => acc.id === fromAccountId)?.account_type;
        const debit = await addNewSpend({
            spendSource: fromAccountId,
            spendCategory: fromAllocationId || null,
            amount: amt,
            accountType: fromAccountType,
            transactionType: 'Expense',
            datetime: now,
            name: 'Self Transfer - Out',
            notes,
        });

        const ToaccountType = accounts.find(acc => acc.id === toAccountId)?.account_type;

        const credit = await addNewSpend({
            spendSource: toAccountId,
            spendCategory: toAllocationId || null,
            amount: amt,
            accountType: ToaccountType,
            transactionType: 'Income',
            datetime: now,
            name: 'Self Transfer - In',
            notes,
        });

        if (debit === true && credit === true) {
            Alert.alert('Success', `₹${amt} transferred`);
            setAmount('');
            setNotes('');
            setFromAccountId('');
            setToAccountId('');
            setFromAllocationId('');
            setToAllocationId('');
        } else {
            Alert.alert('Failed to transfer');
        }
    };
    
    return (
        <ScrollView style={styles.container}>
            {/* <Button title="Back" onPress={() => router.back()} color="black" /> */}
            <Text style={styles.title}>Self Transfer</Text>
            <AmountInput number={amount} setNumber={setAmount} placeholder='Enter Amount'></AmountInput>
            <Text style={styles.subtitle}>From Account</Text>
            <AccountPicker
                selectedAccountId={fromAccountId}
                setSelectedAccountId={setFromAccountId}
                setSelectedAllocationId={setFromAllocationId}
                accounts={accounts}
            />
            {fromAllocations.length > 0 && (
                <AllocationPicker
                    selectedAllocationId={fromAllocationId}
                    setSelectedAllocationId={setFromAllocationId}
                    allocations={fromAllocations}
                />
            )}
            <Text style={styles.subtitle}>To Account</Text>
            <AccountPicker
                selectedAccountId={toAccountId}
                setSelectedAccountId={setToAccountId}
                setSelectedAllocationId={setToAllocationId}
                accounts={accounts}
            />
            {toAllocations.length > 0 && (
                <AllocationPicker
                    selectedAllocationId={toAllocationId}
                    setSelectedAllocationId={setToAllocationId}
                    allocations={toAllocations}
                />
            )}
            <NotesInput notes={notes} setNotes={setNotes} />
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
                        Transfer
                    </Text>
                </TouchableOpacity>
            </View>
            {/* <Text style={styles.label}>Amount</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
            />

            <Text style={styles.label}>From Account</Text>
            <Picker
                selectedValue={fromAccountId}
                onValueChange={setFromAccountId}
                style={styles.picker}
            >
                <Picker.Item label="Select source account" value="" />
                {accounts.map(acc => (
                    <Picker.Item key={acc.id} label={acc.account_name} value={acc.id} />
                ))}
            </Picker>

            {fromAllocations.length > 0 && (
                <>
                    <Text style={styles.label}>From Category</Text>
                    <Picker
                        selectedValue={fromAllocationId}
                        onValueChange={setFromAllocationId}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select category (Optional)" value="" />
                        {fromAllocations.map(alloc => (
                            <Picker.Item key={alloc.id} label={alloc.allocation_name} value={alloc.id} />
                        ))}
                    </Picker>
                </>
            )}

            <Text style={styles.label}>To Account</Text>
            <Picker
                selectedValue={toAccountId}
                onValueChange={setToAccountId}
                style={styles.picker}
            >
                <Picker.Item label="Select destination account" value="" />
                {accounts.map(acc => (
                    <Picker.Item key={acc.id} label={acc.account_name} value={acc.id} />
                ))}
            </Picker>

            {filteredToAllocations.length > 0 && (
                <>
                    <Text style={styles.label}>To Category</Text>
                    <Picker
                        selectedValue={toAllocationId}
                        onValueChange={setToAllocationId}
                        style={styles.picker}
                    >
                        <Picker.Item label="Select category (Optional)" value="" />
                        {filteredToAllocations.map(alloc => (
                            <Picker.Item key={alloc.id} label={alloc.allocation_name} value={alloc.id} />
                        ))}
                    </Picker>
                </>
            )}

            <Text style={styles.label}>Notes</Text>
            <TextInput
                style={styles.input}
                value={notes}
                onChangeText={setNotes}
                placeholder="Optional note"
            /> */}

            {/* <Button title="Transfer" onPress={handleSubmit} color="black" /> */}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: 'white', height: '100%' },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', paddingTop: 16 },
    subtitle: { fontSize: 16, textAlign: 'center', backgroundColor: 'white', paddingTop: 8 },
    buttonContainer: {backgroundColor:'white', flexDirection:'column', justifyContent: 'center', paddingVertical: 10, paddingHorizontal: 25, gap: 10},
    button: {backgroundColor:'#187ce4', paddingVertical: 12, paddingHorizontal: 120, borderRadius: 50},
    // label: {
    //     fontWeight: '600',
    //     fontSize: 16,
    //     marginTop: 12,
    //     marginBottom: 4,
    // },
    // input: {
    //     borderWidth: 1,
    //     borderColor: '#000',
    //     borderRadius: 8,
    //     padding: 10,
    //     marginBottom: 10,
    //     height: 48,
    // },
    // picker: {
    //     borderWidth: 1,
    //     borderColor: '#000',
    //     marginBottom: 10,
    // },
});

export default SelfTransfer;
// This code defines a SelfTransfer component that allows users to transfer money between accounts and categories.