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
    const [monthlySpends, setMonthlySpends] =  useState<{ label: string; value: number }[]>([]);
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

                // Build monthly expense totals for the last 6 months (including current)
                const now = new Date();
                const monthsToShow = 6;
                const monthlyMap: Record<string, number> = {};

                for (let i = monthsToShow - 1; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    monthlyMap[key] = 0;
                }

                spends.forEach((spend) => {
                    if (spend.transactionType?.toLowerCase() !== "expense") return;
                    const d = new Date(spend.spendDatetime);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    if (monthlyMap[key] != null) {
                        monthlyMap[key] += spend.spendAmount;
                    }
                });

                const monthlyData: { label: string; value: number }[] = [];
                for (let i = monthsToShow - 1; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                    const key = `${d.getFullYear()}-${d.getMonth()}`;
                    const shortMonth = d.toLocaleString("default", { month: "short" });
                    // Include year suffix only if crossing year boundary
                    const label =
                        monthsToShow > 6 || d.getFullYear() !== now.getFullYear()
                            ? `${shortMonth} ${String(d.getFullYear()).slice(-2)}`
                            : shortMonth;
                    monthlyData.push({
                        label,
                        value: monthlyMap[key] || 0,
                    });
                }

                setMonthlySpends(monthlyData);
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
                <Networth userName={userName} />
                <SpendThisMonth data={monthlySpends} />
                <RecentSpends spends={recentSpends} />
            </View>
        </View>
    );
}
