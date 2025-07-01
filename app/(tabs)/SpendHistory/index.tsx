import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { deleteSpend, getAllSpends } from '@/db/spends';
import { useFocusEffect } from 'expo-router';
import EditSpendModal from '@/components/SpendHistory/EditSpend';
import Transaction from '@/components/SpendHistory/Transaction';
import roundOff from '@/utilities';

interface Spend {
  id: string;
  spendCategory: string | null;
  spendSource: string;
  spendAmount: number;
  spendDatetime: number;
  spendName: string;
  spendNotes: string | null;
  accountName: string;
  allocationName: string | null;
  transactionType: string;
  spendCategoryName: string | null;
}

export default function SpendHistory() {
  const [spends, setSpends] = useState<Spend[]>([]);
  const [selectedSpend, setSelectedSpend] = useState<Spend | null>(null);
  const [showModal, setShowModal] = useState(false);

  const isCurrentMonth = (timestamp: number) => {
    const spendDate = new Date(timestamp);
    const now = new Date();
    return (
      spendDate.getFullYear() === now.getFullYear() &&
      spendDate.getMonth() === now.getMonth()
    );
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}-${month}-${year}`;
  };

  const fetchSpends = async () => {
    const result = await getAllSpends();
    const currentMonthSpends = result.filter(spend => isCurrentMonth(spend.spendDatetime));
    setSpends(currentMonthSpends);
  };

  useFocusEffect(
    useCallback(() => {
      fetchSpends();
    }, [])
  );

  

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {spends.length === 0 ? (
          <Text style={styles.noData}>No transactions found for this month.</Text>
        ) : (
          spends.map((spend) => (
            <Transaction 
              key={spend.id}
              type={spend.transactionType.toLowerCase()}
              account={spend.accountName}
              allocation={spend.allocationName}
              name={spend.spendName}
              amount={roundOff(spend.spendAmount)}
              spend = {spend}
              updateSelectedSpend = {setSelectedSpend}
              updateShowModal = {setShowModal}
            ></Transaction>
          ))
        )}
      </ScrollView>

      {showModal && selectedSpend && (
        <EditSpendModal
          visible={showModal}
          spend={selectedSpend}
          setSpends = {setSpends}
          onClose={() => {
            setShowModal(false);
            setSelectedSpend(null);
          }}
          onUpdated={() => {
            setShowModal(false);
            setSelectedSpend(null);
            fetchSpends(); // refresh list
          }}
        />
      )}
    </ScrollView>
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
    textAlign: 'center'
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
  editText: {
    color: '#007bff',
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
