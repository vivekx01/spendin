import * as Linking from 'expo-linking';

export function openDownloadUrlInBrowser(downloadUrl: string) {
    Linking.openURL(downloadUrl);
}
