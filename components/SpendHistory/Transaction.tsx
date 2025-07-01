import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ArrowDownIcon from "../ArrowDownIcon";
import ArrowUpIcon from "../ArrowUpIcon";

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

interface SpendProps {
  type: string; // We expect lowercase from parent
  name: string;
  amount: number;
  account: string,
  allocation: string | null;
  spend: any,
  updateSelectedSpend: any,
  updateShowModal: any
}

const Transaction: React.FC<SpendProps> = ({ type, name, amount, account, allocation, spend, updateSelectedSpend, updateShowModal}) => {
  const isIncome = type === 'income';
  return (
    <View style={styles.container}>
      {isIncome ? (
        // Arrow Down
        <ArrowDownIcon></ArrowDownIcon>
      ) : (
        // Arrow Up
        <ArrowUpIcon></ArrowUpIcon>
      )}

      {/* Transaction Name */}
      <View style={{ flex: 1 }}>
        <Text style={styles.amount}>₹{Math.abs(amount)}</Text>
        <Text style={styles.source}>{name} / {allocation ? allocation : `Others - ${account}`}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          updateSelectedSpend(spend);
          updateShowModal(true);
        }}
      >
        <Text style={[styles.edit, { color: "black" }]}>
          Edit
        </Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4
  },
  amount: {
    marginLeft: 10,
    fontSize: 16,
  },
  edit: {
    fontSize: 16,
    fontWeight: "bold",
  },
  source: {
    fontSize: 12,
    marginLeft: 10
  }
});

export default Transaction;
