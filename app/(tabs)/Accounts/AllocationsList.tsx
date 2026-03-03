import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { getAllocationsByAccountId } from '@/db/allocations';
import roundOff from '@/utilities';
import Allocation from '@/components/Accounts/Allocation';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useTheme } from '@/context/ThemeContext';

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
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();

    const numericCreditLimit = accountType === 'Credit' && creditLimit != null ? Number(creditLimit) : null;
    const availableLimit = accountType === 'Credit' && numericCreditLimit != null
        ? numericCreditLimit - Number(accountBalance)
        : null;

    const fetchAllocations = useCallback(async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
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

    const navigateToCategoryTransactions = (alloc: any) => {
        router.push({
            pathname: '/Accounts/CategoryTransactions',
            params: {
                accountId,
                accountName,
                allocationId: alloc.id,
                allocationName: alloc.allocation_name,
            },
        });
    };

    const navigateToAccountTransactions = () => {
        router.push({
            pathname: '/Accounts/CategoryTransactions',
            params: {
                accountId,
                accountName,
            },
        });
    };

    const navigateToCreateNewAllocation = () => {
        router.navigate('/Accounts/CreateNewAllocation');
    };

    const handleEditAllocation = (alloc: any) => {
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

    const renderAllocationRightActions = (alloc: any) => (
        <TouchableOpacity
            onPress={() => handleEditAllocation(alloc)}
            style={styles.editButton}
        >
            <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* <Button title="Back" onPress={navigateBack} color="black" /> */}
            <Text style={[styles.title, { color: theme.colors.text }]}>{accountName} - Categories</Text>

            {accountType === 'Credit' && availableLimit != null && (
                <View style={[styles.limitCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                    <View>
                        <Text style={[styles.limitLabel, { color: theme.colors.textSecondary }]}>Available limit</Text>
                        <Text
                            style={[
                                styles.limitValue,
                                { color: availableLimit < 0 ? theme.colors.expense : theme.colors.income },
                            ]}
                        >
                            ₹{roundOff(Math.abs(availableLimit))}
                            {availableLimit < 0 ? ' over limit' : ''}
                        </Text>
                    </View>
                </View>
            )}

            {loading && allocations.length === 0 ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={theme.colors.accent} />
                </View>
            ) : (
                <ScrollView style={[styles.table, { backgroundColor: theme.colors.background }]}>
                    {allocations.map((alloc: any) => (
                        <Swipeable
                            key={alloc.id}
                            renderRightActions={() => renderAllocationRightActions(alloc)}
                        >
                            <Pressable onPress={() => navigateToCategoryTransactions(alloc)}>
                                <Allocation
                                    allocation_name={alloc.allocation_name}
                                    allocation_amount={roundOff(alloc.allocation_amount)}
                                />
                            </Pressable>
                        </Swipeable>
                    ))}

                    <TouchableOpacity onPress={navigateToAccountTransactions}>
                        <Allocation
                            allocation_name={accountType === 'Credit' ? 'Outstanding Dues' : 'Others'}
                            allocation_amount={roundOff(accountType === 'Credit' ? balance : Math.abs(balance))}
                        />
                    </TouchableOpacity>
                </ScrollView>
            )}
            <View style={[styles.buttonContainer, { backgroundColor: theme.colors.background }]}>
                {accountType !== 'Credit' ? (
                    <TouchableOpacity
                        onPress={navigateToCreateNewAllocation}
                        style={{ backgroundColor: theme.colors.accent, paddingVertical: 12, paddingHorizontal: 100, borderRadius: 50 }}
                    >
                        <Text style={{ color: theme.colors.card, textAlign: 'center', fontSize: 16 }}>Create New Category</Text>
                    </TouchableOpacity>
                ) : <View style={{paddingVertical: 12, paddingHorizontal: 100, backgroundColor: theme.colors.background}}>
                        <View style={{ height: 48, backgroundColor: 'transparent' }} />
                    </View>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingTop: 16 },
    table: { marginTop: 10, height: '85%', width: '100%', paddingHorizontal: 16 },
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
        borderWidth: 1,
    },
    limitLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    limitValue: {
        fontSize: 20,
        fontWeight: '700',
        marginTop: 4,
    },
    limitMeta: {
        marginTop: 6,
        fontSize: 12,
        color: '#637588',
    },
    buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 },
    editButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 90,
        height: '100%',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    editText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    loaderContainer: {
        paddingVertical: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AllocationsList;
