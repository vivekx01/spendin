import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { getErrorLogs } from '@/db';
import { Alert } from 'react-native';

export async function exportLogs() {
    try {
        const result: { timestamp: number; error_message: string; error_stack: string }[] = await getErrorLogs();

        if (result.length === 0) {
            Alert.alert('No logs available', 'There are no error logs to export.');
            return;
        }

        const content = result.map(r =>
            `Time: ${new Date(r.timestamp).toLocaleString()}
            Message: ${r.error_message}
            Stack: ${r.error_stack}
            ------------------------------\n`
        ).join('');

        const fileUri = FileSystem.documentDirectory + 'error_logs.txt';
        await FileSystem.writeAsStringAsync(fileUri, content);

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
            await Sharing.shareAsync(fileUri);
        } else {
            console.log('Sharing is not available on this device.');
        }

    } catch (error) {
        console.error('Failed to export logs:', error);
    }
}
