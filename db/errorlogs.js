import { getDb } from './database';

export async function logError(message, stack= '') {
    const db = await getDb();
    const timestamp = Date.now();
    await db.runAsync(
        'INSERT INTO error_logs (error_message, error_stack, timestamp) VALUES (?, ?, ?)',
        [message, stack ?? '', timestamp]
    );
}

export async function getErrorLogs() {
    const db = await getDb();
    const result = await db.getAllAsync('SELECT * FROM error_logs ORDER BY timestamp DESC');
    return result;
}
