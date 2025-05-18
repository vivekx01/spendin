import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { deleteSpend, getAllSpends } from '@/db/spends';
import { useFocusEffect } from 'expo-router';
import EditSpendModal from '@/components/SpendHistory/EditSpend';

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

  const handleDeleteSpend = async (spendId: string) => {
    const isSuccess = await deleteSpend(spendId);
    if (isSuccess) {
      setSpends(prevSpends => prevSpends.filter(spend => spend.id !== spendId));
      Alert.alert('Success', 'Spend deleted successfully');
    } else {
      Alert.alert('Error', 'Failed to delete spend');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>This Month's Transactions</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {spends.length === 0 ? (
          <Text style={styles.noData}>No transactions found for this month.</Text>
        ) : (
          spends.map((spend) => (
            <View key={spend.id} style={styles.spendItem}>
              <Text style={styles.amount}>₹ {spend.spendAmount}</Text>
              <Text style={styles.meta}>
                {spend.spendName} • {formatDate(spend.spendDatetime)}
              </Text>
              <Text style={styles.details}>
                Account: {spend.accountName || 'Unknown'}
              </Text>
              <Text style={styles.details}>
                Category: {spend.spendCategoryName || 'None'}
              </Text>
              {spend.spendNotes ? (
                <Text style={styles.notes}>Notes: {spend.spendNotes}</Text>
              ) : null}
              <TouchableOpacity
                onPress={() => {
                  setSelectedSpend(spend);
                  setShowModal(true);
                }}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleDeleteSpend(spend.id);
                }}
              >
                <Text style={styles.editText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {showModal && selectedSpend && (
        <EditSpendModal
          visible={showModal}
          spend={selectedSpend}
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
  editText: {
    color: '#007bff',
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
  },
});
