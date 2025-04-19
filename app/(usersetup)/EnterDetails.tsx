import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import Button from '@/components/Button';
import * as SQLite from "expo-sqlite";
import { router } from 'expo-router';

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
        router.navigate("/Home");
    }
    return (
        <View>
            <Text>Tell about yourself</Text>
            <TextInput
                onChangeText={setUserName}
                value={username}
                placeholder="Enter your name"
            />
            <Button title="Confirm" onPress={insertUserInfo} color={'black'} />
        </View>
    )
}

export default EnterDetails