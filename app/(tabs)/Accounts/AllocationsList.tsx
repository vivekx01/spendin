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

            {/* {accountType === 'Credit' && (
                <Text style={styles.creditNote}>
                    Credit account – Outstanding dues will be shown for such accounts.
                </Text>
            )} */}

            <ScrollView style={styles.table}>
                {allocations.map((alloc: any) => (
                    <TouchableOpacity key={alloc.id} onPress={() => startEditing(alloc)}>
                        <Allocation allocation_name={alloc.allocation_name} allocation_amount={roundOff(alloc.allocation_amount)}></Allocation>
                    </TouchableOpacity>
                ))}

                {Math.abs(balance) > 1 && (
                    <Allocation allocation_name={accountType === 'Credit' ? 'Outstanding Dues' : 'Others'} allocation_amount={roundOff(Math.abs(balance))}></Allocation>
                    // <View>
                    //     <View style={styles.row}>
                    //         <Text style={styles.allocName}>
                    //             {accountType === 'Credit' ? 'Outstanding Dues' : 'Others'}
                    //         </Text>
                    //         <Text style={styles.allocAmount}>
                    //             ₹ {roundOff(Math.abs(balance))}
                    //         </Text>
                    //     </View>
                    // </View>
                )}
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
    buttonContainer: { backgroundColor: 'white', flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }
});

export default AllocationsList;
