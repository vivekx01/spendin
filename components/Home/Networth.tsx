import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import { getAllAccounts } from '@/db';
import roundOff from '@/utilities';
import LetterAvatar from './LetterAvatar';
import { useTheme } from '@/context/ThemeContext';

const Networth = ({ userName }: { userName: string }) => {
  const { theme } = useTheme();
  const [networth, setNetWorth] = useState(0);
  const fetchAccounts = async () => {
    const accountsData = await getAllAccounts();
    const totalBankBalance = accountsData
      .filter((account: { account_type: string }) => account.account_type === "Bank")
      .reduce((sum: number, account: { account_balance: number }) => sum + account.account_balance, 0);

    setNetWorth(totalBankBalance);
  };
  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );
  
  return (
    <View
      style={styles.container}
    >
      {/* <Image source={require('@/assets/images/user-boy.png')} style={styles.image} /> */}
      <LetterAvatar letter={userName.charAt(0)}></LetterAvatar>
      <View>
        <Text style={[styles.userName, { color: theme.colors.text }]}>{userName}</Text>
        <Text style={[styles.amount, { color: theme.colors.text }]}>₹ {roundOff(networth)}</Text>
        <Text style={[styles.netWorthText, { color: theme.colors.textSecondary }]}>Current Net Worth</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',

    paddingVertical: 10,
    gap: 25
  },
  image: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  netWorthText: { fontSize: 14 }
});

export default Networth