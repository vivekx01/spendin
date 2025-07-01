import { View, Text } from 'react-native';
import React, { useState } from 'react';
import Spend from './Spend';
import roundOff from '@/utilities';
import { getAllAccounts } from '@/db';

// Type definition for spend object (matches getAllSpends)
interface SpendItem {
  id: string;
  spendCategory: string | null;
  spendSource: string;
  spendAmount: number;
  spendDatetime: number;
  spendName: string;
  spendNotes: string | null;
  accountName: string;
  allocationName: string | null;
  transactionType: string; // <-- Added this explicitly
}

interface RecentSpendsProps {
  spends: SpendItem[];
}

const RecentSpends: React.FC<RecentSpendsProps> =  ({ spends }) => {
  return (
    <View style={{ marginTop: 2, height: '90%' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>Recent Transactions</Text>
      {spends.map((spend) => (
        <Spend
          key={spend.id}
          type={spend.transactionType.toLowerCase()} // Ensure 'income' | 'expense' (lowercase if Spend component expects lowercase)
          account = {spend.accountName}
          allocation = {spend.allocationName}
          name={spend.spendName}
          amount={roundOff(spend.spendAmount)}
        />
      ))}
    </View>
  );
};

export default RecentSpends;
