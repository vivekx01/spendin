import { View, ScrollView, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { getAllocationsByAccountId } from '@/db/allocations';
import roundOff from '@/utilities';
import Allocation from '@/components/Accounts/Allocation';

const AllocationsList = () => {
    const {
        accountId,
        accountName,
        accountBalance,
        accountType,
        creditLimit,
    } = useLocalSearchParams<{
        accountId: string;
        accountName: string;
        accountBalance: string;
        accountType: string;
        creditLimit?: string;
    }>();

    const [allocations, setAllocations] = useState<any[]>([]);
    const [balance, setBalance] = useState(Number(accountBalance));

    const numericCreditLimit = accountType === 'Credit' && creditLimit != null ? Number(creditLimit) : null;
    const availableLimit = accountType === 'Credit' && numericCreditLimit != null
        ? numericCreditLimit - Number(accountBalance)
        : null;

    const fetchAllocations = useCallback(async () => {
        const result = await getAllocationsByAccountId(accountId);
        setAllocations(result);

        let totalAllocated = result.reduce(
            (sum:number, alloc:any) => sum + alloc.allocation_amount,
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

    const navigateToCreateNewAllocation = () => {
        router.navigate('/Accounts/CreateNewAllocation');
    };

    return (
        <View style={styles.container}>
            {/* <Button title="Back" onPress={navigateBack} color="black" /> */}
            <Text style={styles.title}>{accountName} - Categories</Text>

            {accountType === 'Credit' && availableLimit != null && (
                <View style={styles.limitCard}>
                    <View>
                        <Text style={styles.limitLabel}>Available limit</Text>
                        <Text
                            style={[
                                styles.limitValue,
                                availableLimit < 0 && styles.limitValueNegative,
                            ]}
                        >
                            ₹{roundOff(Math.abs(availableLimit))}
                            {availableLimit < 0 ? ' over limit' : ''}
                        </Text>
                    </View>
                </View>
            )}

            <ScrollView style={styles.table}>
                {allocations.map((alloc: any) => (
                    <TouchableOpacity key={alloc.id} onPress={() => startEditing(alloc)}>
                        <Allocation allocation_name={alloc.allocation_name} allocation_amount={roundOff(alloc.allocation_amount)}></Allocation>
                    </TouchableOpacity>
                ))}

                <Allocation allocation_name={accountType === 'Credit' ? 'Outstanding Dues' : 'Others'} allocation_amount={roundOff(accountType === 'Credit' ? balance : Math.abs(balance))}></Allocation>
            </ScrollView>
            <View style={styles.buttonContainer}>
                {accountType !== 'Credit' ? (
                    <TouchableOpacity
                        onPress={navigateToCreateNewAllocation}
                        style={{ backgroundColor: '#187ce4', paddingVertical: 12, paddingHorizontal: 100, borderRadius: 50 }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Create New Category</Text>
                    </TouchableOpacity>
                ) : <View style={{paddingVertical: 12, paddingHorizontal: 100, backgroundColor: 'white'}}>
                        <View style={{ height: 48, backgroundColor: 'transparent' }} />
                    </View>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: 'white' },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', paddingTop: 16 },
    table: { marginTop: 10, backgroundColor: 'white', height: '85%', width: '100%', paddingHorizontal: 16 },
    creditNote: {
        fontStyle: 'italic',
        color: 'gray',
        marginBottom: 8,
    },
    limitCard: {
        marginTop: 10,
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#f5f7ff',
        borderWidth: 1,
        borderColor: '#d0d8ff',
    },
    limitLabel: {
        fontSize: 12,
        color: '#637588',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    limitValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#388e3c',
        marginTop: 4,
    },
    limitValueNegative: {
        color: '#d32f2f',
    },
    limitMeta: {
        marginTop: 6,
        fontSize: 12,
        color: '#637588',
    },
    buttonContainer: { backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }
});

export default AllocationsList;
