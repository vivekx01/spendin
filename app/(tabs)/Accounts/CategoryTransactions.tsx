import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { getAllSpends } from '@/db/spends';
import roundOff from '@/utilities';
import Transaction from '@/components/SpendHistory/Transaction';
import EditSpendModal from '@/components/SpendHistory/EditSpend';
import { useTheme } from '@/context/ThemeContext';

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
  spendSourceId: string;
}

export default function CategoryTransactions() {
  const {
    accountId,
    accountName,
    allocationId,
    allocationName,
  } = useLocalSearchParams<{
    accountId: string;
    accountName: string;
    allocationId?: string;
    allocationName?: string;
  }>();

  const [spends, setSpends] = useState<Spend[]>([]);
  const [selectedSpend, setSelectedSpend] = useState<Spend | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const isCurrentMonth = (timestamp: number) => {
    const spendDate = new Date(timestamp);
    const now = new Date();
    return (
      spendDate.getFullYear() === now.getFullYear() &&
      spendDate.getMonth() === now.getMonth()
    );
  };

  const fetchSpends = async () => {
    try {
      setLoading(true);
      const allSpends: Spend[] = await getAllSpends();

      const filtered = allSpends.filter((spend) => {
        if (!accountId) {
          return false;
        }

        // Only show current month's transactions
        if (!isCurrentMonth(spend.spendDatetime)) {
          return false;
        }

        const sameAccount = spend.spendSourceId === accountId;

        if (allocationId) {
          return sameAccount && spend.spendCategory === allocationId;
        }

        // No allocationId -> show all spends for this account
        return sameAccount;
      });

      setSpends(filtered);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSpends();
    }, [accountId, allocationId])
  );

  const title = allocationName
    ? `${allocationName} transactions`
    : 'Account transactions';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.header, { color: theme.colors.text }]}>{title}</Text>

      {loading && spends.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color={theme.colors.accent} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {spends.length === 0 ? (
            <Text style={[styles.noData, { color: theme.colors.textSecondary }]}>No transactions found.</Text>
          ) : (
            spends.map((spend) => (
              <Transaction
                key={spend.id}
                type={spend.transactionType.toLowerCase()}
                account={spend.accountName}
                allocation={spend.allocationName}
                name={spend.spendName}
                amount={roundOff(spend.spendAmount)}
                spend={spend}
                updateSelectedSpend={setSelectedSpend}
                updateShowModal={setShowModal}
              />
            ))
          )}
        </ScrollView>
      )}

      {showModal && selectedSpend && (
        <EditSpendModal
          visible={showModal}
          spend={selectedSpend}
          setSpends={setSpends}
          onClose={() => {
            setShowModal(false);
            setSelectedSpend(null);
          }}
          onUpdated={() => {
            setShowModal(false);
            setSelectedSpend(null);
            fetchSpends();
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
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 14,
    color: '#637588',
    marginBottom: 12,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  loaderContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

