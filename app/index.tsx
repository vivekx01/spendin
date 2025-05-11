import { useEffect } from "react";
import { logError, migrateDb, setupDatabase } from "@/db";
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from "@/components/SplashScreen";

export default function Index() {

  useEffect(() => {
    ErrorUtils.setGlobalHandler((error, isFatal) => {
      logError(error.message, error.stack);
    });

    const checkAndInitDatabase = async () => {
      try {
        const isFirstRun = await AsyncStorage.getItem('@isFirstRun');
        if (isFirstRun === null) {
          await setupDatabase();
          router.replace("/EnterDetails");
        } else {
          await migrateDb();
          router.replace("/Home");
        }
      } catch (error) {
        const e = error as Error;
        logError(e.message, e.stack);
      }
    };
    checkAndInitDatabase();
  }, []);
  return (
    <SplashScreen />
  );
}
