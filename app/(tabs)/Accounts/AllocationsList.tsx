import { View, ScrollView, Text, StyleSheet, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import Button from '@/components/Button';
import { getAllocationsByAccountId, deleteAllocation } from '@/db/allocations';
import roundOff from '@/utilities';

const AllocationsList = () => {
    const {
        accountId,
        accountName,
        accountBalance,
        accountType,
    } = useLocalSearchParams<{
        accountId: string;
        accountName: string;
        accountBalance: string;
        accountType: string;
    }>();

    const [allocations, setAllocations] = useState<any[]>([]);
    const [balance, setBalance] = useState(Number(accountBalance));

    const fetchAllocations = useCallback(async () => {
        const result = await getAllocationsByAccountId(accountId);
        setAllocations(result);

        let totalAllocated = result.reduce(
            (sum, alloc) => sum + alloc.allocation_amount,
            0
        );

        // For credit accounts, we're tracking how much of the owed amount is allocated
        if (accountType === 'Credit') {
            setBalance(Number(accountBalance) - totalAllocated);
        } else {
            setBalance(Number(accountBalance) - totalAllocated);
        }
    }, [accountId, accountBalance, accountType]);

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
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this allocation?', [
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
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Button title="Back" onPress={navigateBack} color="black" />
            <Text style={styles.title}>Allocations for {accountName}</Text>

            {accountType === 'Credit' && (
                <Text style={styles.creditNote}>
                    Credit account – Outstanding dues will be shown for such accounts.
                </Text>
            )}

            <View style={styles.allocList}>
                {allocations.map((alloc: any) => (
                    <View key={alloc.id} style={styles.allocItem}>
                        <View style={styles.row}>
                            <Text style={styles.allocName}>{alloc.allocation_name}</Text>
                            <Text style={styles.allocAmount}>₹ {roundOff(alloc.allocation_amount)}</Text>
                        </View>
                        <View style={styles.actions}>
                            <Button title="Edit" onPress={() => startEditing(alloc)} />
                            <Button title="Delete" onPress={() => handleDelete(alloc.id)} />
                        </View>
                    </View>
                ))}

                {Math.abs(balance) > 1 && (
                    <View style={styles.allocItem}>
                        <View style={styles.row}>
                            <Text style={styles.allocName}>
                                {accountType === 'Credit' ? 'Outstanding Dues' : 'Others'}
                            </Text>
                            <Text style={styles.allocAmount}>
                                ₹ {roundOff(Math.abs(balance))}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: 16, backgroundColor: 'white', flex: 1 },
    title: { fontSize: 18, fontWeight: 'bold', marginVertical: 16 },
    creditNote: {
        fontStyle: 'italic',
        color: 'gray',
        marginBottom: 8,
    },
    allocList: { marginTop: 8 },
    allocItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 12,
        marginBottom: 12,
    },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    actions: {
        marginTop: 8,
        gap: 8,
        width: '100%',
    },
    allocName: { fontSize: 16 },
    allocAmount: { fontSize: 16, fontWeight: 'bold' },
});

export default AllocationsList;
