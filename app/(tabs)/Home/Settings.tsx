import React, { useEffect, useState } from 'react';
import { View, Button, Text, Modal, Pressable, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { checkForUpdate, openDownloadUrlInBrowser } from '@/utilities';
import { router } from 'expo-router';
import { exportLogs } from '@/utilities/Home/exportLogs';
import { exportAllData, pickAndImportDataFromFile } from '@/db';
import SettingItem from '@/components/Home/SettingItem';
import { useGoogleAuth } from '@/utilities/Home/oauth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchEmailsFromLastDay } from '@/utilities/Home/fetchEmails';

export default function Settings() {
    const [updateInfo, setUpdateInfo] = useState<{ version: string; downloadUrl: string } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigateBack = () => {
        router.back();
    };

    const handleCheckUpdate = async () => {
        const info = await checkForUpdate();
        if (info) {
            setUpdateInfo(info);
            setModalVisible(true);
        } else {
            alert('You are already on the latest version.');
        }
    };

    const handleUpdate = () => {
        if (updateInfo) {
            openDownloadUrlInBrowser(updateInfo.downloadUrl);
        }
        setModalVisible(false);
    };

    const handleGoogleSignIn = async () => {
        const result = await useGoogleAuth();
        if (result){
            Alert.alert("Result", JSON.stringify(result))
        } else {
            Alert.alert("Operation cancelled by user")
        }
    }

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('accessToken');
            Alert.alert("Logged out", "Your session has been cleared.");
        } catch (err) {
            Alert.alert("Error", "Couldn't log you out.");
        }
    };

    const handleShowGoogleInfo = async () => {
        try {
            const email = await AsyncStorage.getItem('userEmail');
            const token = await AsyncStorage.getItem('accessToken');

            if (email && token) {
                Alert.alert("Google Account Info", `Email: ${email}\nAccess Token: ${token}`);
            } else {
                Alert.alert("Not Signed In", "No Google account info found.");
            }
        } catch (err) {
            Alert.alert("Error", "Unable to fetch saved Google info.");
        }
    };

    const fetchAndShowEmails = async () => {
        const token = await AsyncStorage.getItem('accessToken');
        const emails = await fetchEmailsFromLastDay(token || "");
        Alert.alert("Fetched Emails", JSON.stringify(emails[0], null, 2));
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={{ gap: 6, marginTop: 10 }}>
                <TouchableOpacity onPress={handleCheckUpdate}>
                    <SettingItem label={"Check for Updates"}></SettingItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={exportLogs}>
                    <SettingItem label={"Share Error Logs"}></SettingItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={exportAllData}>
                    <SettingItem label={"Create Backup"}></SettingItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickAndImportDataFromFile}>
                    <SettingItem label={"Restore From a Backup"}></SettingItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoogleSignIn}>
                    <SettingItem label={"Sign in from Google Account"}></SettingItem>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleShowGoogleInfo}>
                    <SettingItem label={"Show Google account information"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={fetchAndShowEmails}>
                    <SettingItem label={"Fetch emails"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLogout}>
                    <SettingItem label={"Logout from Google"} />
                </TouchableOpacity>

            </View>
            {/* <Button title="Back" onPress={navigateBack} color="black" />
            <Button title="Check for Updates" onPress={handleCheckUpdate} color="black" />
            <Button title="Share Error logs" onPress={exportLogs} color="black" />
            <Button title="Create backup" onPress={exportAllData} color="black" />
            <Button title="Restore from a backup" onPress={pickAndImportDataFromFile} color="black" /> */}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Available</Text>
                        {updateInfo && (
                            <Text style={styles.modalText}>
                                Version {updateInfo.version} is available.{'\n'}Do you want to download and install it?
                            </Text>
                        )}
                        <View style={styles.buttonRow}>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleUpdate}>
                                <Text style={styles.buttonText}>Update</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: 'white', height: '100%' },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', backgroundColor: 'white', paddingTop: 16 },
    modalOverlay: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%',
    },
    modalTitle: {
        fontSize: 18, fontWeight: 'bold', marginBottom: 10,
    },
    modalText: {
        fontSize: 14, marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row', justifyContent: 'space-around',
    },
    buttonText: {
        fontSize: 16, color: 'black', padding: 8,
    },
});
