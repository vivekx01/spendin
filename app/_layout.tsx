import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="white" style="dark"></StatusBar>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}
