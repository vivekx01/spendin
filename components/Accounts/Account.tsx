import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BankIcon from '../BankIcon'
import CardIcon from '../CardIcon'
import roundOff from '@/utilities'

interface accountData {
    account_name: string,
    account_type: string,
    account_balance: number
}

const Account: React.FC<accountData> = ({ account_name, account_type, account_balance }) => {
    return (
        <View style={styles.container}>
            {account_type == "Bank" ? (
                <BankIcon></BankIcon>
            ) : (
                <CardIcon></CardIcon>
            )}
            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{account_name}</Text>
                <Text style={styles.category}>{account_type == "Bank" ? "Bank Account" : "Credit Line"}</Text>
            </View>
            <Text style={[styles.amount, { color: "black" }]}>
                ₹{roundOff(account_balance)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        backgroundColor: 'white'
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

export default Account