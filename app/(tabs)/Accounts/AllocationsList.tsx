import { View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import Button from '@/components/Button';
import { getAllocationsByAccountId, updateAllocation } from '@/db/allocations';

const AllocationsList = () => {
    const { accountId, accountName } = useLocalSearchParams<{ accountId: string; accountName: string }>();
    const [allocations, setAllocations] = useState<any[]>([]);

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

            {allocations.length > 0 ? (
                <View style={styles.allocList}>
                    {allocations.map((alloc: any) => (
                        <View key={alloc.id} style={styles.allocItem}>
                            {editingId === alloc.id ? (
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        value={editedName}
                                        onChangeText={setEditedName}
                                        style={styles.input}
                                        placeholder="Allocation Name"
                                    />
                                    <TextInput
                                        value={editedAmount}
                                        onChangeText={setEditedAmount}
                                        style={styles.input}
                                        keyboardType="numeric"
                                        placeholder="Amount"
                                    />
                                    <View style={styles.buttonRow}>
                                        <Button title="Save" onPress={() => handleSave(alloc)} />
                                        <Button title="Cancel" onPress={cancelEditing} color="gray" />
                                    </View>
                                </View>
                            ) : (
                                <>
                                    <View style={styles.row}>
                                        <Text style={styles.allocName}>{alloc.allocation_name}</Text>
                                        <Text style={styles.allocAmount}>₹ {alloc.allocation_amount}</Text>
                                    </View>
                                    <Button title="Edit" onPress={() => startEditing(alloc)} />
                                </>
                            )}
                        </View>
                    ))}
                </View>
            ) : (
                <Text style={styles.noAllocText}>No allocations found</Text>
            )}
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
        padding: 8,
        marginBottom: 8,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
});

export default AllocationsList;
