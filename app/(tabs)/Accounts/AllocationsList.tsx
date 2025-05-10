import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '@/components/Button';
import { getAllocationsByAccountId, updateAllocation } from '@/db/allocations';
import roundOff from '@/utilities';
const AllocationsList = () => {
    const { accountId, accountName, accountBalance } = useLocalSearchParams<{ accountId: string; accountName: string, accountBalance: string }>();
    const [allocations, setAllocations] = useState<any[]>([]);
    let [balance, setBalance] = useState(Number(accountBalance));
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedName, setEditedName] = useState('');
    const [editedAmount, setEditedAmount] = useState('');

    const fetchAllocations = async () => {
        const result = await getAllocationsByAccountId(accountId);
        setAllocations(result);
    };

    useEffect(() => {
        fetchAllocations();
    }, [accountId]);

    const navigateBack = () => {
        router.back();
    };

    const startEditing = (alloc: any) => {
        setEditingId(alloc.id);
        setEditedName(alloc.allocation_name);
        setEditedAmount(alloc.allocation_amount.toString());
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditedName('');
        setEditedAmount('');
    };

    const handleSave = async (alloc: any) => {
        if (!editedName || !editedAmount) {
            Alert.alert('Please fill all fields');
            return;
        }

        const isSuccess = await updateAllocation({
            allocationId: alloc.id,
            allocationAccountId: alloc.allocation_account,
            allocationName: editedName,
            allocationAmount: parseFloat(editedAmount),
        });

        if (isSuccess) {
            Alert.alert('Allocation updated!');
            cancelEditing();
            fetchAllocations();
        } else {
            Alert.alert('Failed to update. Try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Back" onPress={navigateBack} color="black" />
            <Text style={styles.title}>Allocations for {accountName}</Text>


            <View style={styles.allocList}>
                {
                    allocations.map((alloc: any) => {
                        balance -= alloc.allocation_amount;
                        return (
                            <View key={alloc.id} style={styles.allocItem}>
                                {editingId === alloc.id ? (
                                    <View style={{ flex: 1 }}>
                                        <TextInput
                                            value={editedName}
                                            onChangeText={setEditedName}
                                            style={styles.input}
                                            placeholder="Allocation Name"
                                            placeholderTextColor="#999"
                                        />
                                        <TextInput
                                            value={editedAmount}
                                            onChangeText={setEditedAmount}
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Amount"
                                            placeholderTextColor="#999"
                                        />
                                        <View style={styles.buttonRow}>
                                            <View style={{ flex: 1, marginRight: 8 }}>
                                                <Button title="Save" onPress={() => handleSave(alloc)} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Button title="Cancel" onPress={cancelEditing} color="gray" />
                                            </View>
                                        </View>
                                    </View>
                                ) : (
                                    <>
                                        <View style={styles.row}>
                                            <Text style={styles.allocName}>{alloc.allocation_name}</Text>
                                            <Text style={styles.allocAmount}>₹ {roundOff(alloc.allocation_amount)}</Text>
                                        </View>
                                        <Button title="Edit" onPress={() => startEditing(alloc)} />
                                    </>
                                )}
                            </View>
                        );
                    })
                }
                {balance > 1 && (
                    <View style={styles.allocItem}>
                        <>
                            <View style={styles.row}>
                                <Text style={styles.allocName}>Others</Text>
                                <Text style={styles.allocAmount}>₹ {balance}</Text>
                            </View>
                        </>
                    </View>
                )}
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    allocList: { marginTop: 8 },
    allocItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    allocName: { fontSize: 16 },
    allocAmount: { fontSize: 16, fontWeight: 'bold' },
    noAllocText: { marginTop: 16, fontStyle: 'italic', color: '#777' },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
        color: 'black', // 👈 Ensures text is visible
        fontSize: 16,
    },
    buttonRow: {
        flexDirection: 'row',
    },
});

export default AllocationsList;
