import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

const SplashScreen = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Spendin - Spend wisely!</Text>
      <ActivityIndicator size="large" color={theme.colors.accent} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  loader: {
    marginTop: 10,
  },
});
export default SplashScreen