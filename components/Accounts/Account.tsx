import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import BankIcon from '../BankIcon'
import CardIcon from '../CardIcon'
import roundOff from '@/utilities'
import { useTheme } from '@/context/ThemeContext'

interface accountData {
    account_name: string,
    account_type: string,
    account_balance: number
}

const Account: React.FC<accountData> = ({ account_name, account_type, account_balance }) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
            {account_type == "Bank" ? (
                <BankIcon></BankIcon>
            ) : (
                <CardIcon></CardIcon>
            )}
            <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.colors.text }]}>{account_name}</Text>
                <Text style={[styles.category, { color: theme.colors.textSecondary }]}>{account_type === "Bank" ? "Bank Account" : "Outstanding Dues"}</Text>
            </View>
            <Text style={[styles.amount, { color: account_type === "Bank" ? theme.colors.income : theme.colors.expense }]}>
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