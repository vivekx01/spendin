import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import CardIcon from '../CardIcon'

interface allocationData {
    allocation_name: string,
    allocation_amount: number
}

const Allocation: React.FC<allocationData> = ({ allocation_name, allocation_amount }) => {
    return (
        <View style={styles.container}>
            <CardIcon></CardIcon>
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{allocation_name}</Text>
                <Text style={styles.category}>
                    {allocation_name === 'Others'
                        ? 'Uncategorized / other transactions'
                        : allocation_name === 'Outstanding Dues'
                        ? 'All transactions for this account'
                        : 'Tap to view transactions'}
                </Text>
            </View>
            <Text style={[styles.amount, { color: "black" }]}>
                ₹{allocation_amount}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 0,
        backgroundColor: 'white',
        width: '100%',
    },
    name: {
        marginLeft: 15,
        fontSize: 16,
        marginBottom: 2
    },
    amount: {
        fontSize: 16,
        fontWeight: '500',
    },
    category: {
        fontSize: 12,
        marginLeft: 15
    }
});

export default Allocation