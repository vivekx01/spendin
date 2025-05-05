import { getDb } from './database';
import * as Crypto from 'expo-crypto';

/**
 * Add a new spend + update account and allocation balances
 * @param {Object} param0
 * @param {string} param0.spendSource - account id
 * @param {string} [param0.spendCategory] - allocation id (optional)
 * @param {number} param0.amount - always positive
 * @param {string} param0.transactionType - 'Income' or 'Expense'
 * @param {number} param0.datetime - timestamp
 * @param {string} param0.name - spend name
 * @param {string} [param0.notes] - optional notes
 */
export async function addNewSpend({ spendSource, spendCategory, amount, transactionType, datetime, name, notes }) {
    try {
        const db = await getDb();
        const id = await Crypto.randomUUID();

        // Insert into spends table (store amount as positive number)
        await db.runAsync(
            `
            INSERT INTO spends (id, spend_category, spend_source, spend_amount, spend_datetime, spend_name, spend_notes, transaction_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
            id,
            spendCategory || null,  // spend_category can be null
            spendSource,
            amount,                // store raw positive amount
            datetime,
            name,
            notes || null,
            transactionType
        );

        // Apply sign only for balance updates
        const signedAmount = transactionType === 'Expense' ? -amount : amount;

        // Update account balance
        await db.runAsync(
            `
            UPDATE accounts
            SET account_balance = account_balance + ?
            WHERE id = ?
            `,
            signedAmount,
            spendSource
        );

        // If allocation selected, update allocation amount too
        if (spendCategory) {
            await db.runAsync(
                `
                UPDATE allocations
                SET allocation_amount = allocation_amount + ?
                WHERE id = ?
                `,
                signedAmount,
                spendCategory
            );
        }

        return true;
    } catch (error) {
        console.error('Error adding new spend:', error);
        return false;
    }
}

/**
 * Get all spends (transaction history)
 * @returns {Promise<Array>} - List of all spends (transactions)
 */
export async function getAllSpends() {
    try {
        const db = await getDb();

        // Query to fetch all spend transactions with optional account and category details
        const result = await db.getAllAsync(
            `
        SELECT
            s.id,
            s.spend_category AS spendCategory,
            s.spend_source AS spendSource,
            s.spend_amount AS spendAmount,
            s.spend_datetime AS spendDatetime,
            s.spend_name AS spendName,
            s.spend_notes AS spendNotes,
            a.account_name AS accountName,
            al.allocation_name AS allocationName
        FROM spends s
        LEFT JOIN accounts a ON s.spend_source = a.id
        LEFT JOIN allocations al ON s.spend_category = al.id
        ORDER BY s.spend_datetime DESC
        `
        );

        return result;
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        return [];
    }
}
