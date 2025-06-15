import { View, ScrollView, Text, StyleSheet, TextInput, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import Button from '@/components/Button';
import { getAllocationsByAccountId, deleteAllocation } from '@/db/allocations';
import roundOff from '@/utilities';

const AllocationsList = () => {
    const { accountId, accountName, accountBalance } = useLocalSearchParams<{
        accountId: string;
        accountName: string;
        accountBalance: string;
    }>();

    const [allocations, setAllocations] = useState<any[]>([]);
    const [balance, setBalance] = useState(Number(accountBalance));

    const fetchAllocations = useCallback(async () => {
        const result = await getAllocationsByAccountId(accountId);
        setAllocations(result);

        // Reset balance each time allocations change
        let totalAllocated = result.reduce((sum, alloc) => sum + alloc.allocation_amount, 0);
        setBalance(Number(accountBalance) - totalAllocated);
    }, [accountId, accountBalance]);

    useFocusEffect(
        useCallback(() => {
            fetchAllocations();
        }, [fetchAllocations])
    );

    const navigateBack = () => {
        router.back();
    };

    const startEditing = (alloc: any) => {
        router.push({
            pathname: '/Accounts/EditAllocation',
            params: {
                allocationId: alloc.id,
                allocationName: alloc.allocation_name,
                allocationAmount: alloc.allocation_amount.toString(),
                allocationAccount: alloc.allocation_account,
            },
        });
    };

    const handleDelete = async (allocId: string) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this allocation?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        const success = await deleteAllocation(allocId);
                        if (success) {
                            Alert.alert('Deleted successfully');
                            fetchAllocations();
                        } else {
                            Alert.alert('Failed to delete');
                        }
                    },
                },
            ]
        );
    };


    return (
        <ScrollView style={styles.container}>
            <Button title="Back" onPress={navigateBack} color="black" />
            <Text style={styles.title}>Allocations for {accountName}</Text>

            <View style={styles.allocList}>
                {allocations.map((alloc: any) => (
                    <View key={alloc.id} style={styles.allocItem}>
                        <View style={styles.row}>
                            <Text style={styles.allocName}>{alloc.allocation_name}</Text>
                            <Text style={styles.allocAmount}>₹ {roundOff(alloc.allocation_amount)}</Text>
                        </View>
                        <View
                            style={{
                                marginTop: 8,
                                gap: 8,
                                width: '100%',
                            }}
                        >
                            <Button title="Edit" onPress={() => startEditing(alloc)} />
                            <Button title="Delete" onPress={() => handleDelete(alloc.id)} />
                        </View>
                    </View>
                ))}

                {balance > 1 && (
                    <View style={styles.allocItem}>
                        <View style={styles.row}>
                            <Text style={styles.allocName}>Others</Text>
                            <Text style={styles.allocAmount}>₹ {roundOff(balance)}</Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16 },
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
});

export default AllocationsList;
