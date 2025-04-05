import { Text, View, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { initDatabase } from "@/db/dbInit";
import * as SQLite from "expo-sqlite";
const { width } = Dimensions.get("window");
import RecentSpends from "@/components/Home/RecentSpends";
import TotalBalanceCard from "@/components/Home/TotalBalanceCard";

export default function Index() {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const setupDatabase = async () => {
      await initDatabase();
      const db = await SQLite.openDatabaseAsync("expenses");
      
      await db.runAsync(
        "INSERT INTO userinfo (id, name) VALUES (?, ?) ON CONFLICT(id) DO NOTHING;",
        "123e4567-e89b-12d3-a456-426614174000", "Vivek Shukla"
      );

      const user = await db.getFirstAsync<{ name: string }>("SELECT name FROM userinfo");
      if (user) setUserName(user.name);
    };

    setupDatabase();
  }, []);

  const addSpend = () => {
    console.log("addSpend");
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View
        style={{
          padding: 20,
          backgroundColor: "black",
          width: "100%",
          height: "20%",
        }}
      >
        <Text style={{ color: "white", marginTop: 10, fontWeight: "ultralight" }}>Good Afternoon,</Text>
        <Text style={{ color: "white", marginTop: 10, fontSize: 24, fontWeight: "bold" }}>{userName}</Text>
      </View>
      <Svg width={width} height={100} viewBox={`0 0 ${width} 100`} style={{ marginTop: -1 }}>
        <Path d={`M0,0 Q${width / 2},100 ${width},0`} fill="black" />
      </Svg>
      <TotalBalanceCard />
      <View
        style={{
          width: "90%",
          height: "55%",
          marginTop: 15,
          paddingHorizontal: 5,
        }}
      >
        <View style={{ 
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}>
          <Text style={{fontSize: 18, fontWeight: "600"}}>Transactions History</Text>
          <Text style={{fontSize: 14, fontWeight: "600", color: "#aaa"}}>See all</Text>
        </View>
        <RecentSpends />
      </View>
    </View>
  );
}
