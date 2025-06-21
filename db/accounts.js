// db/accounts.js
import { getDb } from './database.js';
import * as Crypto from 'expo-crypto';
import { logError } from './errorlogs.js';

/**
 * Add a new account (Bank or Credit)
 * @param {Object} params
 * @param {string} params.accountName
 * @param {string} params.accountType - 'Bank' or 'Credit'
 * @param {number} params.accountBalance
 * @param {number} [params.creditLimit] - Required for Credit accounts
 */
export async function addNewAccount({ accountName, accountType, accountBalance, creditLimit }) {
    try {
        const db = await getDb();
        const id = await Crypto.randomUUID();

        await db.runAsync(
            `INSERT INTO accounts (id, account_type, account_name, account_balance, credit_limit)
            VALUES (?, ?, ?, ?, ?);`,
            id,
            accountType,
            accountName,
            accountBalance,
            accountType === 'Credit' ? (creditLimit ?? 0) : null
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}

/**
 * Get all accounts with credit limit info
 */
export async function getAllAccounts() {
    try {
        const db = await getDb();
        const accounts = await db.getAllAsync(
            `SELECT id, account_type, account_name, account_balance, credit_limit FROM accounts;`
        );
        return accounts;
    } catch (error) {
        logError(error.message, error.stack);
        return [];
    }
}

/**
 * Delete account by ID
 */
export async function deleteAccount(accountId) {
    try {
        const db = await getDb();
        await db.runAsync(
            'DELETE FROM accounts WHERE id = ?;',
            accountId
        );
        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}

/**
 * Alias for deleteAccount
 */
export async function deleteAccountById(accountId) {
    return deleteAccount(accountId);
}
