import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import Button from '@/components/Button';
import * as SQLite from "expo-sqlite";
import { router } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";

const EnterDetails = () => {
    const [username, setUserName] = useState('');
    const insertUserInfo = async () => {
        const db = await SQLite.openDatabaseAsync("expenses");
        await db.runAsync(
            "DELETE FROM userinfo;",
        );

        await db.runAsync(
            "INSERT INTO userinfo (id, name) VALUES (?, ?) ON CONFLICT(id) DO NOTHING;",
            "123e4567-e89b-12d3-a456-426614174000", `${username}`
        );
        await AsyncStorage.setItem('@isFirstRun', 'false');
        router.navigate("/Home");
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                width: "100%",
            }}
        >
            <Text>Tell about yourself</Text>
            <TextInput
                onChangeText={setUserName}
                value={username}
                placeholder="Enter your name"
                style={{
                    height: 50,
                    marginBottom: 12,
                    borderWidth: 1,
                    paddingHorizontal: 10,
                    borderRadius: 5,
                    borderColor: '#000',
                    backgroundColor: '#fff',
                    width: '80%',
                }}
            />
            <Button title="Confirm" onPress={insertUserInfo} color={'black'} />
        </View>
    )
}

export default EnterDetails