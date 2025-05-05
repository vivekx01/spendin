import { View } from 'react-native';
import React from 'react';
import Spend from './Spend';

// Type definition for spend object (matches getAllSpends)
interface SpendItem {
  id: string;
  spendCategory: string | null;
  spendSource: string;
  spendAmount: number;
  spendDatetime: number;
  spendName: string;
  spendNotes: string | null;
  accountName: string | null;
  allocationName: string | null;
  transactionType: 'Income' | 'Expense'; // <-- Added this explicitly
}

interface RecentSpendsProps {
  spends: SpendItem[];
}

const RecentSpends: React.FC<RecentSpendsProps> = ({ spends }) => {
  return (
    <View style={{ marginTop: 10, height: '90%' }}>
      {spends.map((spend) => (
        <Spend
          key={spend.id}
          type={spend.transactionType.toLowerCase()} // Ensure 'income' | 'expense' (lowercase if Spend component expects lowercase)
          name={spend.spendName}
          amount={spend.spendAmount}
        />
      ))}
    </View>
  );
};

export default RecentSpends;
