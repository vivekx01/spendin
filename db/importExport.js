import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
const EXPORT_FILE_URI = FileSystem.documentDirectory + `spendin_backup_${Date.now()}.json`;
const TABLES = ['accounts', 'allocations', 'spends', 'presets', 'userinfo', 'error_logs'];
import { getDb } from './database';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';

export async function exportAllData() {
    try {
        const db = await getDb();
        const backup = {};

        for (const table of TABLES) {
            const rows = await db.getAllAsync(`SELECT * FROM ${table}`);
            backup[table] = rows;
        }

        const json = JSON.stringify(backup, null, 2);
        await FileSystem.writeAsStringAsync(EXPORT_FILE_URI, json);

        console.log('Data exported to:', EXPORT_FILE_URI);
        await Sharing.shareAsync(EXPORT_FILE_URI);
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
}

export async function pickAndImportDataFromFile() {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json',
            copyToCacheDirectory: true,
        });

        if (result.canceled || !result.assets?.[0]?.uri) {
            console.log('File picking cancelled.');
            return;
        }

        const fileUri = result.assets[0].uri;
        await importAllDataFromFile(fileUri);
    } catch (error) {
        console.error('Error picking or importing file:', error);
        throw error;
    }
}

export async function importAllDataFromFile(fileUri) {
    try {
        const db = await getDb();
        const json = await FileSystem.readAsStringAsync(fileUri);
        const backup = JSON.parse(json);

        await db.execAsync('PRAGMA foreign_keys = OFF;');
        await db.execAsync('BEGIN TRANSACTION;');

        // Clear existing data
        for (const table of TABLES) {
            await db.runAsync(`DELETE FROM ${table}`);
        }

        // Insert new data
        for (const table of TABLES) {
            const rows = backup[table] || [];
            for (const row of rows) {
                const columns = Object.keys(row).join(', ');
                const placeholders = Object.keys(row).map(() => '?').join(', ');
                const values = Object.values(row);

                await db.runAsync(
                    `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`,
                    values
                );
            }
        }

        await db.execAsync('COMMIT;');
        await db.execAsync('PRAGMA foreign_keys = ON;');
        Alert.alert(
            'Import Successful',
            'Data has been successfully imported.',
            [{ text: 'OK' }]
        );
    } catch (error) {
        console.error('Error importing data:', error);
        try {
            const db = await getDb();
            await db.execAsync('ROLLBACK;');
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        throw error;
    }
}


