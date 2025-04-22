import * as SQLite from 'expo-sqlite';

const DB_NAME = 'expenses';
let dbInstance = null;

export async function getDb() {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
        await dbInstance.execAsync('PRAGMA journal_mode = WAL;');
    }
    return dbInstance;
}
