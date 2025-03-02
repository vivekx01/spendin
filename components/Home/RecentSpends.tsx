import { View, Text } from 'react-native'
import React from 'react'
import Spend from './Spend'

const RecentSpends = () => {
    const transactions = [
        { type: "expense", name: "Groceries", amount: -500 },
        { type: "income", name: "Salary", amount: 5000 },
        { type: "expense", name: "Electricity Bill", amount: -1200 },
        { type: "income", name: "Freelance", amount: 2000 },
        { type: "expense", name: "Restaurant", amount: -800 },
        { type: "expense", name: "Online Shopping", amount: -1500 },
        { type: "income", name: "Stock Dividend", amount: 700 },
        { type: "expense", name: "Gym Membership", amount: -600 },
      ];      
    return (
        <View
            style={{
                marginTop: 10,
                height: "90%",
            }}
        >
            {transactions.map((transaction, index) => (
                <Spend
                    key={index}
                    type={transaction.type}
                    name={transaction.name}
                    amount={transaction.amount}
                />
            ))}
        </View>
    )
}

export default RecentSpends