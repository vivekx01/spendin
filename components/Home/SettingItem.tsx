import { View, Text } from "react-native";
import React from "react";
import RightArrowIcon from "./RightArrowIcon";
import { useTheme } from "@/context/ThemeContext";

const SettingItem = ({ label }: { label: string }) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        padding: 16,
        backgroundColor: theme.colors.card,
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontSize: 16, color: theme.colors.text }}>{label}</Text>
      <RightArrowIcon />
    </View>
  );
};

export default SettingItem