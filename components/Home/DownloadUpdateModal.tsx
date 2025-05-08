import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

export function DownloadUpdateModal({ visible, progress }: { visible: boolean; progress: number }) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalText}>Downloading update...</Text>
                    <Progress.Bar progress={progress} width={200} />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
    modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
    modalText: { marginBottom: 10 },
});
