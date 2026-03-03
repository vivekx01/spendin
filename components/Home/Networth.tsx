import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import { getAllAccounts } from '@/db';
import roundOff from '@/utilities';
import LetterAvatar from './LetterAvatar';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Networth = ({ userName }: { userName: string }) => {
  const { theme } = useTheme();
  const [networth, setNetWorth] = useState(0);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const fetchAccounts = async () => {
    const accountsData = await getAllAccounts();
    const totalBankBalance = accountsData
      .filter((account: { account_type: string }) => account.account_type === "Bank")
      .reduce((sum: number, account: { account_balance: number }) => sum + account.account_balance, 0);

    setNetWorth(totalBankBalance);
  };
  const loadAvatar = async () => {
    try {
      const uri = await AsyncStorage.getItem('@userAvatarUri');
      setAvatarUri(uri);
    } catch {
      setAvatarUri(null);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
      loadAvatar();
    }, [])
  );
  
  return (
    <View
      style={styles.container}
    >
      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.image} />
      ) : (
        <LetterAvatar letter={userName.charAt(0)} size={72} fontSize={32} />
      )}
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
  image: { width: 72, height: 72, borderRadius: 36 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  amount: { fontSize: 16, fontWeight: 'bold' },
  netWorthText: { fontSize: 14 }
});

export default Networth