import { View, Text } from 'react-native';
import React from 'react';

interface TotalBalanceCardProps {
    totalIncome: number;
    totalExpense: number;
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ totalIncome, totalExpense }) => {
    const netBalance = totalIncome - totalExpense;
    return (
        <View
            style={{
                backgroundColor: 'white',
                width: '90%',
                padding: 15,
                height: '25%',
                marginTop: -130,
                borderRadius: 15,
                borderColor: '#ddd',
                borderWidth: 1,
                rowGap: 5,
                shadowColor: '#000', // correct shadow props (boxShadow doesn't work in RN)
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 5,
                elevation: 3,
            }}
        >
            <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 4 }}>Total spends this month</Text>
            <Text style={{ fontSize: 32, fontWeight: '600' }}>₹{Math.abs(netBalance)}</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Income</Text>
                    <Text style={{ fontSize: 24, fontWeight: '500', marginTop: 4, color: 'green' }}>
                        ₹{totalIncome}
                    </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Expenses</Text>
                    <Text style={{ fontSize: 24, fontWeight: '500', marginTop: 4, color: 'red' }}>
                        ₹{totalExpense}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default TotalBalanceCard;
