import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import Button from "@/components/Button";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserInfo } from "@/db";
import { useTheme } from "@/context/ThemeContext";

const EnterDetails = () => {
    const { theme } = useTheme();
    const [username, setUserName] = useState("");
    const insertUserInfo = async () => {
        let user  = await setUserInfo(username);
        if (user) {
            await AsyncStorage.setItem("user", JSON.stringify(user));
            await AsyncStorage.setItem("@isFirstRun", JSON.stringify("false"));
            router.replace("/Home");
        } else {
            alert("Error inserting user info");
        }
    }
    return (
        <View
            style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 20,
                width: "100%",
                backgroundColor: theme.colors.background,
            }}
        >
            <Text style={{ color: theme.colors.text }}>Tell about yourself</Text>
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
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                    width: "80%",
                }}
            />
            <Button title="Confirm" onPress={() => { insertUserInfo(); }} />

        </View>
    )
}

export default EnterDetails