// notification.ts

import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Call this once at app startup to register for push notifications and
 * create the Android channel if needed.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
    // Android channel
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        Alert.alert('Push Notifications', 'Failed to get permission for notifications');
        return null;
    }

    return null;
}

/**
 * Schedules a local push notification after the given delay.
 * @param title  Notification title
 * @param body   Notification body
 * @param seconds Delay in seconds before showing the notification
 */
export async function scheduleLocalNotification(
    title: string,
    body: string,
    seconds = 0
): Promise<void> {
    try {
        await Notifications.scheduleNotificationAsync({
            content: { title, body, sound: true, data: {} },
            trigger: {
                seconds:1,
                channelId: 'default'
            },
        });
    } catch (error: any) {
        Alert.alert('Push Notifications', `Error scheduling notification: ${error.message}`);
    }
}
