import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useState, useCallback } from "react";
import { router, useFocusEffect } from 'expo-router';
const { width } = Dimensions.get("window");
import RecentSpends from "@/components/Home/RecentSpends";
import TotalBalanceCard from "@/components/Home/TotalBalanceCard";
import { getUserInfo } from "@/db";
import { getAllSpends } from "@/db/spends";
import { Ionicons } from '@expo/vector-icons';
// Type for Spend (updated to reflect new schema — has transactionType)
interface Spend {
    id: string;
    spendCategory: string | null;
    spendSource: string;
    spendAmount: number;
    spendDatetime: number;
    spendName: string;
    spendNotes: string | null;
    accountName: string | null;
    allocationName: string | null;
    transactionType: 'Income' | 'Expense';
}

export default function Home() {
    const [userName, setUserName] = useState("User");
    const [recentSpends, setRecentSpends] = useState<Spend[]>([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpense, setTotalExpense] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                const user = await getUserInfo();
                if (user) setUserName(user.name);

                const spends: Spend[] = await getAllSpends();

                // Sort spends by datetime DESC
                const sortedSpends = spends.sort((a, b) => b.spendDatetime - a.spendDatetime);

                // Set recent 6 spends directly
                setRecentSpends(sortedSpends.slice(0, 6));

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
                let income = 0;
                let expense = 0;
                currentMonthSpends.forEach((spend) => {
                    if (!spend.transactionType) {
                        spend.transactionType = 'Expense';
                    }
                    if (spend.transactionType === 'Income') {
                        income += spend.spendAmount;
                    } else if (spend.transactionType === 'Expense') {
                        expense += spend.spendAmount;
                    }
                });

                setTotalIncome(income);
                setTotalExpense(expense);
            };

            loadData();
        }, [])
    );
    const navigateToProfile = () => {
        router.push('/Home/Profile');
    }
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            {/* Header */}
            <View
                style={{
                    padding: 20,
                    backgroundColor: "black",
                    width: "100%",
                    height: "18%",
                }}
            >   
                <TouchableOpacity
                    style={{ position: "absolute", right: 16, top: 30, width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}
                    onPress={navigateToProfile}
                    hitSlop={10}   // 👈 adds 10px padding around touch area
                >
                    <Ionicons name={"person-circle"} size={55} color={"white"} />
                </TouchableOpacity>
                <Text style={{ color: "white", marginTop: 10, fontWeight: "200" }}>
                    Hello 👋,
                </Text>
                <Text style={{ color: "white", marginTop: 10, fontSize: 24, fontWeight: "bold" }}>
                    {userName}
                </Text>
            </View>
            
            {/* Curved SVG separator */}
            <Svg width={width} height={100} viewBox={`0 0 ${width} 100`} style={{ marginTop: -1 }}>
                <Path d={`M0,0 Q${width / 2},100 ${width},0`} fill="black" />
            </Svg>

            {/* Total balance + Income/Expense */}
            <TotalBalanceCard totalIncome={totalIncome} totalExpense={totalExpense} />

            {/* Transactions */}
            <View
                style={{
                    width: "90%",
                    height: "55%",
                    marginTop: 15,
                    paddingHorizontal: 5,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <Text style={{ fontSize: 18, fontWeight: "600" }}>Transactions History</Text>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: "#aaa" }}>See all</Text>
                </View>

                <RecentSpends spends={recentSpends} />
            </View>
        </View>
    );
}
