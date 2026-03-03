import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import Spend from './Spend';
import roundOff from '@/utilities';
import { useTheme } from '@/context/ThemeContext';

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

const RecentSpends: React.FC<RecentSpendsProps> = ({ spends }) => {
  const { theme } = useTheme();
  return (
    <View style={{ marginTop: 16, flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: theme.colors.text }}>Recent Transactions</Text>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {spends.map((spend) => (
          <Spend
            key={spend.id}
            type={spend.transactionType.toLowerCase()}
            account={spend.accountName}
            allocation={spend.allocationName}
            name={spend.spendName}
            amount={roundOff(spend.spendAmount)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentSpends;
