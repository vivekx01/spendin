import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const Spend = ({ type, name, amount }) => {
  const isIncome = amount >= 0;

  return (
    <View style={styles.container}>
      {/* Transaction Type Icon */}
      <Svg width={24} height={24} viewBox="0 0 24 24">
        <Path
          d="M12 2L15 8H9L12 2ZM12 22L9 16H15L12 22ZM2 12L8 15V9L2 12ZM22 12L16 9V15L22 12Z"
          fill={isIncome ? "green" : "red"}
        />
      </Svg>

      {/* Transaction Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Transaction Amount */}
      <Text style={[styles.amount, { color: isIncome ? "green" : "red" }]}>
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
    // borderBottomWidth: 1,
    // borderBottomColor: "#ddd",
  },
  name: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Spend;
