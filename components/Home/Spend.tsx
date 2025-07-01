import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ArrowDownIcon from "../ArrowDownIcon";
import ArrowUpIcon from "../ArrowUpIcon";

interface SpendProps {
  type: string; // We expect lowercase from parent
  name: string;
  amount: number;
  account: string,
  allocation: string | null;
}

const Spend: React.FC<SpendProps> = ({ type, name, amount, account, allocation }) => {
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
      <View style={{flex: 1,}}>
        <Text style={styles.name}>{allocation ? allocation : `Others - ${account}`} </Text>
        <Text style={styles.category}>{name}</Text>
      </View>

      {/* Transaction Amount */}
      <Text style={[styles.amount, { color: "black" }]}>
        {isIncome ? "+ " : "- "}₹{Math.abs(amount)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  name: {
    marginLeft: 10,
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 12,
    marginLeft: 10
  }
});

export default Spend;
