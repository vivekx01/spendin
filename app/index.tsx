import { Text, View, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { setupDatabase } from "@/db/dbInit";
import * as SQLite from "expo-sqlite";
import { router } from 'expo-router'
import Button from "@/components/Button";

export default function Index() {

  useEffect(() => {
    const initDatabase = async () => {
      await setupDatabase();
      const db = await SQLite.openDatabaseAsync("expenses");

      await db.runAsync(
        "DELETE FROM userinfo;",
      );

      await db.runAsync(
        "INSERT INTO userinfo (id, name) VALUES (?, ?) ON CONFLICT(id) DO NOTHING;",
        "123e4567-e89b-12d3-a456-426614174000", "Vivek hu vai"
      );
    };

    initDatabase();
  }, []);
  const goToSetup = () => {
    router.navigate("/EnterDetails");
  };
  const goToHome = () => {
    router.navigate("/Home");
  };
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
      <Button title="Go To Setup" onPress={goToSetup} color={'black'} />
      <Button title="Go To Home" onPress={goToHome} color={'black'} />
    </View>
  );
}
