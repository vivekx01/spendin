import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import roundOff from '@/utilities'
import { useTheme } from '@/context/ThemeContext'

interface accountSummary {
    accountType: string,
    accountSummary: any
}

const AccountsSummary: React.FC<accountSummary> = ({accountType, accountSummary}) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: theme.colors.text }]}>
                    {accountType === 'bank'
                    ? 'Bank Accounts'
                    : accountType === 'credit'
                    ? 'Credit Cards'
                    : 'Unknown Account Type'}
                </Text>
                <Text style={[styles.accountinfo, { color: theme.colors.textSecondary }]}>
                    {accountSummary.count} accounts
                </Text>
                <Text style={[styles.accountinfo, { color: theme.colors.textSecondary }]}>
                    {accountType === 'bank'
                    ? 'Total Balance'
                    : accountType === 'credit'
                    ? 'Total Outstanding'
                    : 'Unknown Unit'}:  
                    <Text style={{ fontWeight: 'bold', color: accountType === 'credit' ? theme.colors.expense : theme.colors.income,
                    }}> ₹{roundOff(accountSummary.totalBalance)}</Text>
                </Text>
            </View>
            <Image style={{ width: 120, height: 100, borderRadius: 25 }} source={accountType === 'bank' ? require('@/assets/images/bankaccounts.png'):require('@/assets/images/creditcardaccounts.png')}></Image>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#fff',
        elevation: 2,
        height: 130
    },
    name: {
        marginLeft: 15,
        fontSize: 18,
        marginBottom: 4,
        fontWeight: 'bold'
    },
    accountinfo: {
        fontSize: 14,
        marginLeft: 15,
        marginBottom: 4,
        color: '#637588'
    }
});

export default AccountsSummary