import { View, Text } from 'react-native'
import React from 'react'

const TotalBalanceCard = () => {
    return (
        <View
            style={{
                backgroundColor: "white",
                width: "90%",
                padding: 15,
                height: "25%",
                marginTop: -130,
                borderRadius: 15,
                borderColor: "#ddd",
                borderWidth: 1,
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                rowGap: 5,
            }}
        >
            <Text style={{fontSize: 16, fontWeight: '600', marginTop: 4}}>Total spends this month</Text>
            <Text style={{fontSize: 32, fontWeight: '600'}}>₹5000</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>Income</Text>
                    <Text style={{fontSize: 24, fontWeight: '500', marginTop: 4, color:'green'}}>₹10000</Text>
                </View>
                <View style={{flexDirection: 'column', justifyContent: 'space-between'}}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>Expenses</Text>
                    <Text style={{fontSize: 24, fontWeight: '500', marginTop: 4, color:'red'}}>₹5000</Text>
                </View>
            </View>
        </View>
    )
}

export default TotalBalanceCard