import * as Application from 'expo-application';

interface ReleaseInfo {
    version: string;
    downloadUrl: string;
}

export async function checkForUpdate(): Promise<ReleaseInfo | null> {
    try {
        const response = await fetch('https://api.github.com/repos/vivekx01/spendin/releases/latest');
        const data = await response.json();

        const latestVersion = data.tag_name;
        const currentVersion = Application.nativeApplicationVersion;
        const asset = data.assets.find((a: any) => a.name.endsWith('.apk'));

        if (!asset) {
            console.log('No APK found in release.');
            return null;
        }

        if (latestVersion !== currentVersion) {
            return {
                version: latestVersion,
                downloadUrl: asset.browser_download_url,
            };
        } else {
            return null;  // No update needed
        }
    } catch (error) {
        console.error('Failed to check for update', error);
        return null;
    }
}
