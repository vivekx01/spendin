import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { checkForUpdate, openDownloadUrlInBrowser } from '@/utilities';

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
                    { text: 'Update', onPress: () => openDownloadUrlInBrowser(updateInfo.downloadUrl) },
                ]
            );
        } else {
            Alert.alert('Up-to-date', 'You are already on the latest version.');
        }
    };

    

    return (
        <View>
            <Button title="Check for Updates" onPress={handleCheckUpdate} />
        </View>
    );
}
