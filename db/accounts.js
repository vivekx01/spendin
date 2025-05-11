// db/accounts.js
import { getDb } from './database.js';
import * as Crypto from 'expo-crypto';
import { logError } from './errorlogs.js';

export async function addNewAccount({ accountName, accountType, accountBalance }) {
    try {
        const db = await getDb()

        // Generate UUID using expo-crypto
        const id = await Crypto.randomUUID()

        await db.runAsync(
            `INSERT INTO accounts (id, account_type, account_name, account_balance)
        VALUES (?, ?, ?, ?);`,
            id,
            accountType,
            accountName,
            accountBalance
        )

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false
    }
}

export async function getAllAccounts() {
    const db = await getDb();
    const accounts = await db.getAllAsync(
        `SELECT id, account_type, account_name, account_balance FROM accounts;`
    );
    return accounts;
}

export async function deleteAccount(accountId) {
    try {
        const db = await getDb()
        await db.runAsync(
            'DELETE FROM accounts WHERE id = ?;',
            accountId
        )
        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false
    }
}

export async function deleteAccountById(accountId) {
    try {
        const db = await getDb();

        await db.runAsync(
            `
            DELETE FROM accounts
            WHERE id = ?
            `,
            accountId
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}