import { getDb } from './database';
import * as Crypto from 'expo-crypto';
import { logError } from './errorlogs';

/**
 * @param {Object} params
 * @param {string} params.spendSource
 * @param {string} [params.spendCategory]
 * @param {number} params.amount
 * @param {string} params.accountType
 * @param {string} params.transactionType
 * @param {number} params.datetime
 * @param {string} params.name
 * @param {string} [params.notes]
 */

export async function addNewSpend({ spendSource, spendCategory, amount, accountType , transactionType, datetime, name, notes }) {
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

        let signedAmount;

        // Apply sign only for balance updates
        if (accountType === 'Bank') {
            signedAmount = transactionType === 'Expense' ? -amount : amount;
        } else if (accountType === 'Credit') {
            signedAmount = transactionType === 'Expense' ? amount : -amount;
        }

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
        logError(error.message, error.stack);
        return error;
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
            s.transaction_type AS transactionType,
            al.allocation_name AS allocationName,
            s.spend_source AS spendSourceId,
            al.allocation_name AS spendCategoryName
        FROM spends s
        LEFT JOIN accounts a ON s.spend_source = a.id
        LEFT JOIN allocations al ON s.spend_category = al.id
        ORDER BY s.spend_datetime DESC
        `
        );

        return result;
    } catch (error) {
        logError(error.message, error.stack);
        return [];
    }
}

export async function updateSpend({
    spendId,
    newSpendSource,
    newSpendCategory,
    newAmount,
    newTransactionType,
    newDatetime,
    newName,
    newNotes,
}) {
    try {
        const db = await getDb();

        // Get the original spend
        const original = await db.getFirstAsync(
            `SELECT * FROM spends WHERE id = ?`,
            spendId
        );

        if (!original) {
            throw new Error('Spend not found.');
        }

        const oldSignedAmount = original.transaction_type === 'Expense' ? -original.spend_amount : original.spend_amount;
        const newSignedAmount = newTransactionType === 'Expense' ? -newAmount : newAmount;

        // 1. Reverse previous account balance
        await db.runAsync(
            `UPDATE accounts SET account_balance = account_balance - ? WHERE id = ?`,
            oldSignedAmount,
            original.spend_source
        );

        // 2. Apply new account balance
        await db.runAsync(
            `UPDATE accounts SET account_balance = account_balance + ? WHERE id = ?`,
            newSignedAmount,
            newSpendSource
        );

        // 3. Reverse old allocation if any
        if (original.spend_category) {
            await db.runAsync(
                `UPDATE allocations SET allocation_amount = allocation_amount - ? WHERE id = ?`,
                oldSignedAmount,
                original.spend_category
            );
        }

        // 4. Apply new allocation if any
        if (newSpendCategory) {
            await db.runAsync(
                `UPDATE allocations SET allocation_amount = allocation_amount + ? WHERE id = ?`,
                newSignedAmount,
                newSpendCategory
            );
        }

        // 5. Update the spends row
        await db.runAsync(
            `UPDATE spends
            SET spend_source = ?, spend_category = ?, spend_amount = ?, spend_datetime = ?, spend_name = ?, spend_notes = ?, transaction_type = ?
            WHERE id = ?`,
            newSpendSource,
            newSpendCategory || null,
            newAmount,
            newDatetime,
            newName,
            newNotes || null,
            newTransactionType,
            spendId
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}

export async function deleteSpend(spendId) {
    try {
        const db = await getDb();

        // Get spend info to reverse balances before deletion
        const spend = await db.getFirstAsync(`
            SELECT spend_source, spend_category, spend_amount, transaction_type
            FROM spends
            WHERE id = ?
        `, spendId);

        if (!spend) {
            throw new Error('Spend not found');
        }

        const signedAmount = spend.transaction_type === 'Expense'
            ? spend.spend_amount
            : -spend.spend_amount;

        // Reverse account balance
        await db.runAsync(`
            UPDATE accounts
            SET account_balance = account_balance + ?
            WHERE id = ?
        `, signedAmount, spend.spend_source);

        // Reverse allocation balance if applicable
        if (spend.spend_category) {
            await db.runAsync(`
                UPDATE allocations
                SET allocation_amount = allocation_amount + ?
                WHERE id = ?
            `, signedAmount, spend.spend_category);
        }

        // Delete the spend record
        await db.runAsync(`DELETE FROM spends WHERE id = ?`, spendId);

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}
