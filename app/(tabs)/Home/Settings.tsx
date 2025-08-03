import React, { useState } from 'react';
import { View, Button, Text, Modal, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { checkForUpdate, openDownloadUrlInBrowser } from '@/utilities';
import { router } from 'expo-router';
import { exportLogs } from '@/utilities/Home/exportLogs';
import { exportAllData, pickAndImportDataFromFile } from '@/db';
import SettingItem from '@/components/Home/SettingItem';
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <View style={{gap:6, marginTop: 10}}>
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
