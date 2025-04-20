import { useEffect } from "react";
import { setupDatabase } from "@/db/dbInit";
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from "@/components/SplashScreen";

export default function Index() {

  useEffect(() => {
    const checkAndInitDatabase = async () => {
      try {
        const isFirstRun = await AsyncStorage.getItem('@isFirstRun');
        if (isFirstRun === null) {
          await setupDatabase();
          router.replace("/EnterDetails");
        } else {
          router.replace("/Home");
        }
      } catch (error) {
        console.error('Error checking or initializing database:', error);
      }
    };
    setTimeout(() => {
      checkAndInitDatabase();
    }, 500);
  }, []);
  return (
    <SplashScreen />
  );
}
