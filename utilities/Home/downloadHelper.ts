import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export async function downloadAndPromptInstallWithProgress(downloadUrl: string, filename: string, onProgressUpdate: (progress: number) => void) {
    const fileUri = FileSystem.cacheDirectory + filename;

    const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri,
        {},
        (downloadProgress) => {
            const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
            onProgressUpdate(progress);
        }
    );

    const downloadResult = await downloadResumable.downloadAsync();

    if (!downloadResult) {
        throw new Error('Download failed or was cancelled.');
    }

    await Sharing.shareAsync(downloadResult.uri);
}
