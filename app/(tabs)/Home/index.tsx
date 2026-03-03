import { Text, View, TouchableOpacity, Alert } from "react-native";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from "expo-router";
import Networth from "@/components/Home/Networth";
import { getUserInfo } from "@/db";
import { getAllSpends } from "@/db/spends";
import { Ionicons } from "@expo/vector-icons";
import SpendThisMonth from "@/components/Home/SpendThisMonth";
import RecentSpends from "@/components/Home/RecentSpends";
import { useTheme } from "@/context/ThemeContext";

// Type for Spend (updated to reflect new schema — has transactionType)
interface Spend {
    id: string;
    spendCategory: string | null;
    spendSource: string;
    spendAmount: number;
    spendDatetime: number;
    spendName: string;
    spendNotes: string | null;
    accountName: string;
    allocationName: string | null;
    transactionType: string;
}

export default function Home() {
    const { theme, toggleTheme } = useTheme();
    const [userName, setUserName] = useState("User");
    const [recentSpends, setRecentSpends] = useState<Spend[]>([]);
    const [maxSpends, setMaxSpends] =  useState<{ label: string; value: number }[]>([]);
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const user = await getUserInfo();
                if (user) setUserName(user.name);

                const spends: Spend[] = await getAllSpends();

                // Sort spends by datetime DESC
                const sortedSpends = spends.sort((a, b) => b.spendDatetime - a.spendDatetime);

                // Set recent 5 spends directly
                setRecentSpends(sortedSpends.slice(0, 5));

                // Filter spends in current month
                const now = new Date();
                const currentMonthSpends = sortedSpends.filter((spend) => {
                    const spendDate = new Date(spend.spendDatetime);
                    return (
                        spendDate.getFullYear() === now.getFullYear() &&
                        spendDate.getMonth() === now.getMonth()
                    );
                });

                // Calculate income & expenses based on transactionType
                let maxTransactions: Record<string, number> = {};
                currentMonthSpends.forEach((spend) => {
                    if (spend.accountName == null) return;
                    const label = spend.allocationName
                        ? spend.allocationName
                        : `Others (${spend.accountName})`;

                    maxTransactions[label] = (maxTransactions[label] || 0) + 1;
                });
                let sorted = Object.entries(maxTransactions)
                    .map(([label, value]) => ({ label, value }))
                    .sort((a, b) => b.value - a.value);
                sorted = sorted.slice(0, 4);    
                setMaxSpends(sorted);
            };

            loadData();
        }, [])
    );
    const navigateToProfile = () => {
        router.push('/Home/Settings');
    }
    const switchTheme = () => {
        toggleTheme();
    };
    return (
        <View style={{ flex: 1, alignItems: "center", backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View
                style={{
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    backgroundColor: theme.colors.header,
                    width: "100%",
                    height: "8%",
                }}
            >   
                <TouchableOpacity
                    onPress={switchTheme}
                    hitSlop={10}  
                >
                    <Ionicons
                        name={theme.mode === "dark" ? "sunny-outline" : "moon-outline"}
                        size={25}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
                <Text style={{fontSize: 18, fontWeight: 'bold', color: theme.colors.text}} >Overview</Text>
                <TouchableOpacity
                    onPress={navigateToProfile}
                    hitSlop={10} 
                >
                    <Ionicons name={"settings-outline"} size={25} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            {/* Home content */}
            <View
                style={{
                    width: "100%",
                    height: "92%",
                    paddingHorizontal: 15,
                    backgroundColor: theme.colors.background
                }}
            >
                <Networth userName={userName}></Networth>
                <SpendThisMonth data={maxSpends}></SpendThisMonth>
                <RecentSpends spends={recentSpends}></RecentSpends>
            </View>
        </View>
    );
}
