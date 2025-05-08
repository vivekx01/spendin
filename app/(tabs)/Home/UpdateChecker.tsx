import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { checkForUpdate, downloadAndPromptInstallWithProgress } from '@/utilities';
import { DownloadUpdateModal } from '@/components/Home/DownloadUpdateModal';

export default function UpdateChecker() {
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleCheckUpdate = async () => {
        const updateInfo = await checkForUpdate();

        if (updateInfo) {
            Alert.alert(
                'Update Available',
                `Version ${updateInfo.version} is available.\nDo you want to download and install it?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Update', onPress: () => startDownload(updateInfo.downloadUrl) },
                ]
            );
        } else {
            Alert.alert('Up-to-date', 'You are already on the latest version.');
        }
    };

    const startDownload = async (downloadUrl: string) => {
        setDownloading(true);
        setProgress(0);

        try {
            await downloadAndPromptInstallWithProgress(downloadUrl, 'update.apk', (p) => setProgress(p));
            Alert.alert('Download complete', 'Installer is ready!');
        } catch (err) {
            Alert.alert('Error', 'Failed to download update.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <View>
            <Button title="Check for Updates" onPress={handleCheckUpdate} />
            <DownloadUpdateModal visible={downloading} progress={progress} />
        </View>
    );
}
