import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { getAllSpends } from '@/db/spends';

// TypeScript type for spend item (matches your getAllSpends result)
interface Spend {
  id: string;
  spendCategory: string | null;
  spendSource: string;
  spendAmount: number;
  spendDatetime: number;
  spendName: string;
  spendNotes: string | null;
  accountName: string | null;
  allocationName: string | null;
}

export default function SpendHistory() {
  const [spends, setSpends] = useState<Spend[]>([]);

  useEffect(() => {
    const fetchSpends = async () => {
      const result = await getAllSpends();
      setSpends(result);
    };
    fetchSpends();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {spends.length === 0 ? (
          <Text style={styles.noData}>No transactions found.</Text>
        ) : (
          spends.map((spend) => (
            <View key={spend.id} style={styles.spendItem}>
              <Text style={styles.amount}>₹ {spend.spendAmount}</Text>
              <Text style={styles.meta}>
                {spend.spendName} • {new Date(spend.spendDatetime).toLocaleDateString()}
              </Text>
              <Text style={styles.details}>
                Account: {spend.accountName || 'Unknown'}
              </Text>
              <Text style={styles.details}>
                Category: {spend.allocationName || 'None'}
              </Text>
              {spend.spendNotes ? (
                <Text style={styles.notes}>Notes: {spend.spendNotes}</Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  spendItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  meta: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },
  details: {
    fontSize: 12,
    color: '#555',
  },
  notes: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },
});
