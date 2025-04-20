import { Text, View } from "react-native";
import { useEffect } from "react";
import { setupDatabase } from "@/db/dbInit";
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {

  useEffect(() => {
    const checkAndInitDatabase = async () => {
      try {
        const isFirstRun = await AsyncStorage.getItem('@isFirstRun');
        if (isFirstRun === null) {
          await setupDatabase();
          console.log("Database setup completed on first run.");
          router.navigate("/EnterDetails");
        } else {
          console.log("App has been launched before. Skipping DB setup.");
          router.navigate("/Home");
        }
      } catch (error) {
        console.error('Error checking or initializing database:', error);
      }
    };
    setTimeout(() => {
      checkAndInitDatabase();
    }, 3000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      <Text>This is splash Screen</Text>
    </View>
  );
}
