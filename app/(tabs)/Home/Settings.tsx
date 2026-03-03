import React, { useState } from 'react';
import { View, Text, Modal, Pressable, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { checkForUpdate, openDownloadUrlInBrowser } from '@/utilities';
import { router } from 'expo-router';
import { exportLogs } from '@/utilities/Home/exportLogs';
import { exportAllData, pickAndImportDataFromFile, getUserInfo, updateUserName } from '@/db';
import SettingItem from '@/components/Home/SettingItem';
// import { useGoogleAuth } from '@/utilities/Home/oauth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchLatestEmails } from '@/utilities/Home/fetchEmails';
import { useTheme } from '@/context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

export default function Settings() {
    const [updateInfo, setUpdateInfo] = useState<{ version: string; downloadUrl: string } | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [avatarModalVisible, setAvatarModalVisible] = useState(false);
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const { theme } = useTheme();
    // const { signIn, signOut, userEmail, accessToken } = useGoogleAuth();

    const navigateBack = () => {
        router.back();
    };

    React.useEffect(() => {
        (async () => {
            try {
                const info = await getUserInfo();
                if (info?.name) {
                    setNewName(info.name);
                }
            } catch {
                // ignore
            }
        })();
    }, []);

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
        const emails = await fetchLatestEmails(token || "");
        Alert.alert("Fetched Emails", JSON.stringify(emails, null, 2));
    }

    const handleChangeAvatar = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos to set a profile picture.');
            setAvatarModalVisible(false);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (result.canceled) {
            setAvatarModalVisible(false);
            return;
        }

        const uri = result.assets[0]?.uri;
        if (uri) {
            await AsyncStorage.setItem('@userAvatarUri', uri);
            Alert.alert('Profile photo updated', 'Your avatar has been updated.');
        }
        setAvatarModalVisible(false);
    };

    const handleRemoveAvatar = async () => {
        await AsyncStorage.removeItem('@userAvatarUri');
        Alert.alert('Profile photo removed', 'Your avatar has been removed.');
        setAvatarModalVisible(false);
    };

    const handleSaveName = async () => {
        const trimmed = newName.trim();
        if (!trimmed) {
            Alert.alert('Validation', 'Name cannot be empty.');
            return;
        }
        await updateUserName(trimmed);
        Alert.alert('Name updated', 'Your name has been updated.');
        setNameModalVisible(false);
    };


    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
            <View style={{ gap: 6, marginTop: 10 }}>
                <TouchableOpacity onPress={() => setAvatarModalVisible(true)}>
                    <SettingItem label={"Change profile photo"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setNameModalVisible(true)}>
                    <SettingItem label={"Change name"} />
                </TouchableOpacity>
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
                {/* Google auth items disabled for Expo Go testing */}
                {/*
                <TouchableOpacity onPress={signIn}>
                    <SettingItem label={"Sign in from Google Account"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleShowGoogleInfo}>
                    <SettingItem label={"Show Google account information"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={fetchAndShowEmails}>
                    <SettingItem label={"Fetch emails"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={signOut}>
                    <SettingItem label={"Logout from Google"} />
                </TouchableOpacity>
                */}

            </View>
            {/* <Button title="Back" onPress={navigateBack} color="black" />
            <Button title="Check for Updates" onPress={handleCheckUpdate} color="black" />
            <Button title="Share Error logs" onPress={exportLogs} color="black" />
            <Button title="Create backup" onPress={exportAllData} color="black" />
            <Button title="Restore from a backup" onPress={pickAndImportDataFromFile} color="black" /> */}

            {/* Avatar options modal */}
            <Modal
                visible={avatarModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setAvatarModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Profile photo</Text>
                        <TouchableOpacity onPress={handleChangeAvatar} style={{ paddingVertical: 8 }}>
                            <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                                Select from gallery
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleRemoveAvatar} style={{ paddingVertical: 8 }}>
                            <Text style={[styles.buttonText, { color: theme.colors.expense }]}>
                                Remove existing photo
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setAvatarModalVisible(false)} style={{ paddingVertical: 8 }}>
                            <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Name change modal */}
            <Modal
                visible={nameModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setNameModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Change name</Text>
                        <TextInput
                            value={newName}
                            onChangeText={setNewName}
                            placeholder="Enter your name"
                            placeholderTextColor={theme.colors.textSecondary}
                            style={{
                                borderWidth: 1,
                                borderColor: theme.colors.border,
                                borderRadius: 8,
                                paddingHorizontal: 10,
                                paddingVertical: 8,
                                marginBottom: 16,
                                color: theme.colors.text,
                                fontSize: 16,
                            }}
                        />
                        <View style={styles.buttonRow}>
                            <Pressable onPress={() => setNameModalVisible(false)}>
                                <Text style={[styles.buttonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleSaveName}>
                                <Text style={[styles.buttonText, { color: theme.colors.accent }]}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Update Available</Text>
                        {updateInfo && (
                            <Text style={[styles.modalText, { color: theme.colors.textSecondary }]}>
                                Version {updateInfo.version} is available.{'\n'}Do you want to download and install it?
                            </Text>
                        )}
                        <View style={styles.buttonRow}>
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Text style={[styles.buttonText, { color: theme.colors.text }]}>Cancel</Text>
                            </Pressable>
                            <Pressable onPress={handleUpdate}>
                                <Text style={[styles.buttonText, { color: theme.colors.accent }]}>Update</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { height: '100%' },
    title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', paddingTop: 16 },
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
