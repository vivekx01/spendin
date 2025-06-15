// db/allocations.js

import { getDb } from './database';
import * as Crypto from 'expo-crypto';
import { logError } from './errorlogs';

export async function getAllocationsByAccountId(accountId) {
    try {
        const db = await getDb();

        const results = await db.getAllAsync(
            `
            SELECT id, allocation_account, allocation_name, allocation_amount
            FROM allocations
            WHERE allocation_account = ?
            `,
            accountId
        );

        return results; // returns array of matching allocations
    } catch (error) {
        logError(error.message, error.stack);
        return []; // empty array if something fails
    }
}

export async function addNewAllocation({ allocationAccountId, allocationName, allocationAmount }) {
    try {
        const db = await getDb();

        // Generate UUID for allocation ID
        const id = await Crypto.randomUUID();
        await db.runAsync(
            `
            INSERT INTO allocations (id, allocation_account, allocation_name, allocation_amount)
            VALUES (?, ?, ?, ?)
            `,
            id,
            allocationAccountId,
            allocationName,
            allocationAmount
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}

export async function updateAllocation({
    allocationId,
    allocationAccountId,
    allocationName,
    allocationAmount,
}) {
    try {
        const db = await getDb();

        // Step 1: Get the old allocation amount
        const existing = await db.getFirstAsync(
            `SELECT allocation_amount FROM allocations WHERE id = ?`,
            allocationId
        );

        if (!existing) throw new Error('Allocation not found');

        const oldAmount = existing.allocation_amount;
        const newAmount = allocationAmount;
        const delta = newAmount - oldAmount;

        // Step 2: Update the allocation
        await db.runAsync(
            `
            UPDATE allocations
            SET allocation_account = ?, allocation_name = ?, allocation_amount = ?
            WHERE id = ?
            `,
            allocationAccountId,
            allocationName,
            newAmount,
            allocationId
        );

        // Step 3: Update the account balance
        if (delta !== 0) {
            await db.runAsync(
                `
                UPDATE accounts
                SET account_balance = account_balance + ?
                WHERE id = ?
                `,
                delta,
                allocationAccountId
            );
        }

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}

export async function deleteAllocation(allocationId) {
    try {
        const db = await getDb();

        // Step 1: Get allocation details
        const allocation = await db.getAllAsync(
            `SELECT allocation_amount, allocation_account FROM allocations WHERE id = ?`,
            allocationId
        );

        if (!allocation) {
            throw new Error(`Allocation with ID ${allocationId} not found`);
        }

        const { allocation_amount, allocation_account } = allocation;

        // Step 2: Update account balance
        await db.runAsync(
            `UPDATE accounts SET account_balance = account_balance + ? WHERE id = ?`,
            [allocation_amount, allocation_account]
        );

        // Step 3: Delete the allocation
        await db.runAsync(
            `DELETE FROM allocations WHERE id = ?`,
            allocationId
        );

        return true;
    } catch (error) {
        logError(error.message, error.stack);
        return false;
    }
}
